import express from 'express'
const router = express.Router()
const {registerValidation,loginValidation} = require('../rules/rules')
const userservices = require('../services/userservice')


router.post('/register',registerValidation,userservices.register);
router.post('/login',loginValidation,userservices.login);
router.get('/search',userservices.search);
router.get('getanalyticsdata',userservices.analytics);
router.post('newanalyticsdata',userservices.newAnalyticsData);
router.get('/shipment',userservices.shipment);
router.get('/shipmentID',userservices.shipmentID);

module.exports = router;