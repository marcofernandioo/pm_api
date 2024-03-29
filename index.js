const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();

const orderRouter = require('./routes/order');
const pricelistRouter = require('./routes/pricelist');
const salesRouter = require('./routes/sales');

const PORT = process.env.PORT || 8000;
var app = express();

app.use(cors({credentials: true, origin: process.env.CLIENT}));
app.use(cookieParser());
app.use(express.json());

app.use('/order', orderRouter);
app.use('/pricelist', pricelistRouter);
app.use('/sales', salesRouter);
app.use('/', (req,res) => res.send('Hello There...'))


mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, () => console.log(`Listenin' to port ${PORT}, database connected`)))
.catch((err) => console.log('ERROR: ' + err))