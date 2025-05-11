const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Cart = require('./Models/Cart');
// const secretKey = process.env.SECRET_KEY;

const app = express();

app.use(express.json());    
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


//The backend routers : 
// const authenication = require('./Middleware/authenticationMiddleware');
// app.use(authenication)
const ProductRouter = require('./Routes/ProductRouter');
app.use('/api/products', ProductRouter);
const CartRouter = require('./Routes/CartRouter');
app.use('/api/cart', CartRouter);

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`,
{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log(`Connected to ${process.env.DB_NAME} database`))
.catch((err)=>console.log(err));

app.use(function(req, res, next) {
    return res.status(404).send({res });
});

app.listen(process.env.PORT, ()=>console.log(`Server is running on port ${process.env.PORT}`));





