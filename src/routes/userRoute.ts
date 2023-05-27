import express from 'express'
const router = express.Router()
const {registerValidation,loginValidation} = require('./validations/validation')
const usercontrollers = require('./controller/usercontroller')


router.post('/register',registerValidation,usercontrollers.register);
router.post('/login',loginValidation,usercontrollers.login);


module.exports = router;