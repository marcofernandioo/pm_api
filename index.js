const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();

const orderRouter = require('./routes/order');
const pricelistRouter = require('./routes/pricelist');

const PORT = process.env.PORT;
var app = express();

app.use(cors({credentials: true, origin: process.env.CLIENT}));
app.use(cookieParser());
app.use(express.json());

app.use('/order', orderRouter);
app.use('/pricelist', pricelistRouter);

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection err'));
db.once('open', () => console.log('DB Connected'));


app.listen(PORT, () => console.log(`listenin' to post ${PORT}`))