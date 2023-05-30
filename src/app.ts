import express,{Application, Request, Response} from 'express'
import { body, check, validationResult } from 'express-validator';
const userRoutes = require('./routes/userRoute');
const webRoutes = require('./routes/webRoute');
const productRoutes = require('./routes/productRoute')

const app:Application = express();
const port:number = 3000;

app.use('/api',userRoutes)
app.use('/',webRoutes)


app.listen(port, ()=>{
    console.log(`Connection established Successfully on port ${port}`)
});


