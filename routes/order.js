var express = require('express');
var moment = require('moment');
var async = require('async');
var router = express.Router();


var Order = require('../models/order');
var productOrder = require('../models/productOrder');
var Pricelist = require('../models/pricelist');

//Input an Order
router.post('/add', (req,res) => {
    if (req.body && req.body.buyer && req.body.address && req.body.contact && req.body.basket) {
        async.waterfall([
            function (calculateTotal) {
                let totalPrice = 0;
                for (let i = 0; i < req.body.basket.length; i++) {
                    let product = req.body.basket[i];
                    product.total = product.qty * product.price;
                    totalPrice += product.total;
                }
                calculateTotal(null, totalPrice);
            },
            function (totalPrice, saveOrder) {
                let new_order = new Order({
                    buyer: req.body.buyer,
                    address: req.body.address,
                    contact: req.body.contact,
                    sendDate: new Date(),
                    orderDate: moment().utcOffset(7),
                    total: totalPrice,
                    basket: req.body.basket
                })
                new_order.save((err) => {
                    if (err) saveOrder('Coba ulangi kembali');
                    else saveOrder(null);
                })
            }
        ], (err) => {
            if (err) res.json({status: 'error', msg: err});
            else res.json({status: 'ok', msg: 'Orderan telah tercatat'})
        });
    } else {
        res.json({status: 'err', msg: 'Data yang dimasukkan tidak lengkap'})
    }
});

//Display all Orders
router.all('/all', (req,res) => {
    Order.find((err,orders) => {
        if (!err) res.json({status: 'ok', msg: orders})
        else res.json({status: 'err', msg: 'Coba ulang kembali'})
    })
})

module.exports = router;