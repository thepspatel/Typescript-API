"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbconnection_1 = __importDefault(require("./config/dbconnection"));
const body_parser_1 = require("body-parser");
const userRoutes = require('./routes/userRoute');
const webRoutes = require('./routes/webRoute');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoute');
const app = (0, express_1.default)();
const port = 3000;
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
dbconnection_1.default
    .sync()
    .then(() => {
    console.log("Database connected Successfully");
})
    .catch((err) => {
    console.log('Error', err);
});
app.use('/api', userRoutes);
app.use('/', webRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.listen(port, () => {
    console.log(`Connection established Successfully on port ${port}`);
});
