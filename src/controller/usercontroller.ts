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



module.exports = {
    register,
    verifyMail,
    verifyOTP,
    login
}