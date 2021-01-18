var express = require('express');
var async = require('async');
var router = express.Router();

var Order = require('../models/order');
var productOrder = require('../models/productOrder');
var Pricelist = require('../models/pricelist');

//Input an Order
router.post('/input', (req,res) => {
    if (req.body && req.body.buyer && req.body.address && req.body.contact) {
        async.waterfall([
            function (calculateTotal) {
                let totalPrice = 0;
                for (let i = 0; i < req.body.basket.length; i++) {
                    let product = req.body.basket[i];
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
                    orderDate: new Date(),
                    total: totalPrice,
                    basket: req.body.basket
                })
                new_order.save((err) => {
                    if (err) saveOrder(err);
                    else saveOrder(null);
                })
            }
        ], (err) => {
            if (err) res.json({status: 'error', msg: err});
            else res.json({status: 'oki', msg: 'Check DB'})
        });
    } else {
        res.json({status: 'err', msg: 'Data yang dimasukkan kurang'})
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