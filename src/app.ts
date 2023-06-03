import express,{Application, Request, Response} from  'express'
import { body, check, validationResult } from 'express-validator';
import connection from './config/dbconnection';
import {json, urlencoded} from 'body-parser';
const userRoutes = require('./routes/userRoute');
const webRoutes = require('./routes/webRoute');
const productRoutes = require('./routes/productRoute')
const orderRoutes = require('./routes/orderRoute') 

const app:Application = express();
const port:number = 3000;

app.use(json());

app.use(urlencoded({extended:true}))

connection
.sync()
.then(()=>{
    console.log("Database connected Successfully")
})
.catch((err:Error) =>{
    console.log('Error', err)
})


app.use('/api',userRoutes)
app.use('/',webRoutes)
app.use('/api',productRoutes)
app.use('/api',orderRoutes)


app.listen(port, ()=>{
    console.log(`Connection established Successfully on port ${port}`)
});