import express from 'express';
const routerr = express();
const usercontrollers = require('../controller/usercontroller');

routerr.get('/Mail-verifcation',usercontrollers.verifyMail);
routerr.get('OTP-Verification',usercontrollers.verifyOTP);

module.exports = routerr;