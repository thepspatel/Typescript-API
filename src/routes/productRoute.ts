import express from 'express'
const routeer = express.Router()
const userservices = require('../services/userservice')

routeer.get('/product',userservices.product)
routeer.post('/updateproduct',userservices.productbyid)
routeer.delete('/deleteproduct',userservices.product)
routeer.put('/addproduct',userservices.product)

module.exports = routeer;