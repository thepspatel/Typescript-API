import express,{Request, Response} from 'express'
const routeer = express.Router();
const userservices = require('../services/userservice')

routeer.get('/orders', async (req: Request, res: Response) => {
    try {
      const orders = await getAllOrders();
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  }
,userservices.orders);
routeer.get('/confirmed/orders',async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('confirmed');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching confirmed orders:', error);
      return res.status(500).json({ error: 'Failed to fetch confirmed orders.' });
    }
  }
,userservices.confirmedorders);
routeer.get('/completedorders',async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('completed');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching completed orders:', error);
      return res.status(500).json({ error: 'Failed to fetch completed orders.' });
    }
  }
,userservices.completedorders);
routeer.get('/acceptedorders',async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('accepted');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching accepted orders:', error);
      return res.status(500).json({ error: 'Failed to fetch accepted orders.' });
    }
  }
,userservices.acceptedorders);
routeer.get('/uncomfirmedorders',async (req: Request, res: Response) => {
    try {
      const orders = await getOrdersByStatus('unconfirmed');
      return res.json(orders);
    } catch (error) {
      console.error('Error occurred while fetching unconfirmed orders:', error);
      return res.status(500).json({ error: 'Failed to fetch unconfirmed orders.' });
    }
  }
,userservices.uncomfirmedorders);
routeer.get('rejectedorders',userservices.rejectedorders);

module.exports = routeer;