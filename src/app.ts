import express,{Application, Request, Response} from 'express'
import { body, check, validationResult } from 'express-validator';
const userRoutes = require('./routes/userRoute');

const app:Application = express();
const port:number = 3000;

app.post('/api',userRoutes)


app.listen(port, ()=>{
    console.log(`Connection established Successfully on port ${port}`)
});