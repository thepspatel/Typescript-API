import express from 'express'
const routeer = express.Router()
const usercontrollers = require('../controller/usercontroller')

routeer.get('/product',usercontrollers.product)
routeer.post('/updateproduct',usercontrollers.productbyid)
routeer.delete('/deleteproduct',usercontrollers.product)
routeer.put('/addproduct',usercontrollers.product)

module.exports = routeer;