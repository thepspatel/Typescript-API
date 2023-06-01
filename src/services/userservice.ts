import { Hash } from "crypto";
import { Application, Request, Response,} from "express";
import { Result } from "express-validator";
const { validationResult} = require('express-validator')
const bcrypt = require('bcrypt')

const db = require('../config/dbConnection');
const randomstring = require('randomstring');
const sendMail = require('../mailsender/sendMail');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;


const register = (req:Request, res:Response) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    db.query(
        `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
            req.body.email
        )}); `,
        (err:Error, result:Result) => {
            if (result && result) {
                return res.status(409).send({
                    msg: 'Email is already in use'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err:Error, hash:Hash) => {

                    if (err) {
                        return res.status(400).send({
                            msg: err,
                        });
                    }
                    else {
                        db.query(
                            `INSERT INTO users (name,email,password) VALUES ('${req.body.name}',${db.escape(
                                req.body.email
                            )},${db.escape(hash)});`,
                            (err:Error, result:Result) => {
                                if (err) {
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }

                                let mailSubject = 'Mail Verification';
                                const randomString = randomstring.generate();
                                let content = '<p>Hii ' + req.body.name + ',\
                                Please <a href="http://127.0.0.1:3000/mail-verification?token='+ randomString + '" verify</a> your mail>';
                                sendMail(req.body.email, mailSubject, content);

                                db.query('UPDATE users set token=? where email=?', [randomString, req.body.email], function (error:Error, result:Result) {
                                    if (error) {
                                        return res.send(400).send({
                                            msg: error,
                                        });
                                    }
                                });
                                return res.status(200).send({
                                    msg: 'The user registered successfully!',
                                });
                                


                            }
                        );
                    }
                })
            }
        }
    )
}

const verifyMail = (req:Request, res:Response) => {

    var token = req.body.token;

    db.query('SELECT * FROM users where token=? limit 1', token, function (error:Error, result:Result) {

        if (error) {
            console.log(error.message)
        }

        if (result) {

            db.query(`
            UPDATE users SET  token = null, is_verified = 1 where id = '${result}'
            `);

        }
        else {
            return res.render('404');
        }
    })
}

const verifyOTP = (req:Request, res:Response) => {

    var OTP = req.body.OTP;

    db.query('SELECT * FROM users where OTP=? limit 1', OTP, function (error:Error, result:Result) {

        if (error) {
            console.log(error.message)
        }

        if (result) {

            db.query(`
            UPDATE users SET  OTP = null, is_verified = 1 where id = '${result}'
            `);

        }
        else {
            return res.render('404');
        }
    })
}

const login = (req:Request, res:Response) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    db.query(
        `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
        (error:Error, result:Result) => {
            if (error) {
                return res.status(400).send({
                    message: error
                });
            }
            if (!result) {
                return res.status(401).send({
                    message: 'Email or Password is incorrect!'
                });
            }
            bcrypt.compare(
                req.body.password,
                ['password'],
                (bErr:Error, bResult:Result) => {
                    if (bErr) {
                        return res.status(400).send({
                            msg: bErr,
                        });
                    }
                    if (bResult) {
                        const token = jwt.sign({ id: result, is_admin: ['is_admin'] }, JWT_SECRET, { expiresIn: '1h' });
                        db.query(
                            `UPDATE users SET lastlogin = now() WHERE id = '${result}'`
                        );
                        return res.status(200).send({
                            msg: 'Logged In',
                            token,
                            user: result
                        });
                    }
                    return res.status(401).send({
                        message: 'Email or Password is incorrect!'
                    });
                }
            )
        }
    )
}

const product = async (req: Request, res: Response) => {
    try {
      const products = await getAllProducts();
      return res.json(products);
    } catch (error) {
      console.error('Error occurred while fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products.' });
    }
  };
  async function getAllProducts(): Promise<Product[]> {
    const query = 'SELECT * FROM products';
    const [rows] = await connection.execute(query);
    return rows as Product[];
  }
  async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id, 10);
      const product = await getProductById(productId);
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ error: 'Product not found.' });
      }
    } catch (error) {
      console.error('Error occurred while fetching product:', error);
      return res.status(500).json({ error: 'Failed to fetch product.' });
    }
  }
  async function getProductById(id: number): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    if (rows.length > 0) {
      return rows[0] as Product;
    }
    return null;
  }
  
  const search = async (req: Request, res: Response) => {
    try {
      const query = req.query.q; // Get the search query from request query parameters
      const products = await searchProducts(query);
      return res.json(products);
    } catch (error) {
      console.error('Error occurred while searching products:', error);
      return res.status(500).json({ error: 'Failed to search products.' });
    }
  }
  async function searchProducts(query: string): Promise<Product[]> {
    const searchSQL = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?';
    const [rows] = await connection.execute(searchSQL, [searchQuery, searchQuery]);
    return rows as Product[];
  }
  
   //get all orders
  const orders =  async (req: Request, res: Response) => {
    try {
      const orders = await getAllOrders();
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  }
  async function getAllOrders(): Promise<Order[]> {
    const query = 'SELECT * FROM orders';
    const [rows] = await connection.execute(query);
    return rows as Order[];
  }

//get confirmed orders
const confirmedorders = async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('confirmed');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching confirmed orders:', error);
      return res.status(500).json({ error: 'Failed to fetch confirmed orders.' });
    }
  }
  //get accepted orders
  const acceptedorders = async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('accepted');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching accepted orders:', error);
      return res.status(500).json({ error: 'Failed to fetch accepted orders.' });
    }
  }
  async function getOrdersByStatus(status: string): Promise<Order[]> {
    const query = 'SELECT * FROM orders WHERE status = ?';
    const [rows] = await connection.execute(query, [status]);
    return rows as Order[];
  }

  //get completed orders
  const completedorders = async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('completed');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching completed orders:', error);
      return res.status(500).json({ error: 'Failed to fetch completed orders.' });
    }
  }
  //get uncomfirmed orders
  const uncomfirmedorders = async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('unconfirmed');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching unconfirmed orders:', error);
      return res.status(500).json({ error: 'Failed to fetch unconfirmed orders.' });
    }
  }
  //get rejected orders
  const rejectedorders = async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('rejected');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching rejected orders:', error);
      return res.status(500).json({ error: 'Failed to fetch rejected orders.' });
    }
  }

  const analytics = 
  //get analytics data
  async (req: Request, res: Response) => {
    try {
      const analyticsData = await getAnalyticsData();
      return res.json(analyticsData);
    } catch (error) {
      console.error('Error occurred while fetching analytics data:', error);
      return res.status(500).json({ error: 'Failed to fetch analytics data.' });
    }
  }
  async function getAnalyticsData(): Promise<Analytics[]> {
    const query = 'SELECT * FROM analytics';
    const [rows] = await connection.execute(query);
    return rows as Analytics[];
  }
  //add new analytics data
  const newAnalyticsdata = async (req: Request, res: Response) => {
    try {
      const newAnalyticsData: Analytics = req.body;
      await addAnalyticsData(newAnalyticsData);
      return res.status(201).json({ message: 'Analytics data added successfully.' });
    } catch (error) {
      console.error('Error occurred while adding analytics data:', error);
      return res.status(500).json({ error: 'Failed to add analytics data.' });
    }
  }
  async function addAnalyticsData(data: Analytics): Promise<void> {
    const insertQuery = 'INSERT INTO analytics (timestamp, category, action, value) VALUES (?, ?, ?, ?)';
    await connection.execute(insertQuery, [data.timestamp, data.category, data.action, data.value]);
  }

  const shipment = async (req: Request, res: Response) => {
    try {
      const shipments = await getAllShipments();
      return res.json(shipments);
    } catch (error) {
      console.error('Error occurred while fetching shipments:', error);
      return res.status(500).json({ error: 'Failed to fetch shipments.' });
    }
  }
  async function getAllShipments(): Promise<Shipment[]> {
    const query = 'SELECT * FROM shipments';
    const [rows] = await connection.execute(query);
    return rows as Shipment[];
  }
  const shipmentID = async (req: Request, res: Response) => {
    try {
      const shipmentId = parseInt(req.params.id, 10);
      const shipment = await getShipmentById(shipmentId);
      if (shipment) {
        return res.json(shipment);
      } else {
        return res.status(404).json({ error: 'Shipment not found.' });
      }
    } catch (error) {
      console.error('Error occurred while fetching shipment:', error);
      return res.status(500).json({ error: 'Failed to fetch shipment.' });
    }
  };
  async function getShipmentById(id: number): Promise<Shipment | null> {
    const query = 'SELECT * FROM shipments WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    if (rows.length > 0) {
      return rows[0] as Shipment;
    }
    return null;
  }

module.exports = {
    register,
    verifyMail,
    verifyOTP,
    login,
    product,
    search,
    orders,
    confirmedorders,
    completedorders,
    acceptedorders,
    rejectedorders,
    uncomfirmedorders,
    analytics,
    newAnalyticsdata,
    shipment,
    shipmentID
}