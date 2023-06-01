import express from 'express'
const rouuterr = express.Router()
const {registerValidation,loginValidation} = require('../rules/rules')
const userservices = require('../services/userservice')


rouuterr.post('/register',registerValidation,userservices.register);
rouuterr.post('/login',loginValidation,userservices.login);

module.exports = rouuterr