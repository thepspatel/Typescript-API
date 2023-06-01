import express from 'express';
const routerr = express();
const userservices = require('../services/userservice');

routerr.get('/Mail-verifcation',userservices.verifyMail);
routerr.get('OTP-Verification',userservices.verifyOTP);

module.exports = routerr;