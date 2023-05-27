import express from 'express'
const router = express.Router()
const {registerValidation,loginValidation} = require('./validations/validation')
const usercontrollers = require('./controller/usercontroller')


router.post('/register',registerValidation,usercontrollers.register);
router.post('/login',loginValidation,usercontrollers.login);
router.get('/product',usercontrollers.product);
router.get('/productbyid',usercontrollers.product);
router.get('/search',usercontrollers.search);
router.get('/orders',usercontrollers.orders);
router.get('/confirmed/orders',usercontrollers.confirmedorders);
router.get('/completedorders',usercontrollers.completedorders);
router.get('/acceptedorders',usercontrollers.acceptedorders);
router.get('/uncomfirmedorders',usercontrollers.uncomfirmedorders);
router.get('rejectedorders',usercontrollers.rejectedorders);
router.get('getanalyticsdata',usercontrollers.analytics);
router.post('newanalyticsdata',usercontrollers.newAnalyticsData);
router.get('/shipment',usercontrollers.shipment);
router.get('/shipmentID',usercontrollers.shipmentID);

module.exports = router;