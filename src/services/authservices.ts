import express,{Request, Response} from 'express'
const { validationResult } = require('express-validator');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const createtoken = async (email) => {
    try {

        const token = await jwt.sign({ email: email }, config.secret_jwt);
        return token;
    } catch (error:Error) {
        res.status(400).send(error.message);
    }
}


const register = (req:Request, res:Response) => {

    const errors = validationResult(req);

    if (!errors.isEmpty) {
        res.status(400).send({ errors: errors.array() });

    }
}

const login = async (req:Request, res:Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        res.status(400).send({ errors: errors.array() });

    }
}

module.exports = {
    createtoken,
    register,
    login
}