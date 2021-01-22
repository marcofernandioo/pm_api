var express = require('express');
var moment = require('moment');
var async = require('async');
var router = express.Router();


var Order = require('../models/order');
var productOrder = require('../models/productOrder');
var Pricelist = require('../models/pricelist');

//Input an Order
router.post('/add', (req,res) => {
    if (req.body && req.body.buyer && req.body.address && req.body.contact && req.body.basket.length > 0) {
        
        async.waterfall([
            function (calculateTotal) {
                let totalPrice = req.body.ongkir;
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
                    paid: req.body.paid, 
                    total: totalPrice,
                    basket: req.body.basket, 
                    ongkir: req.body.ongkir
                })
                new_order.save((err) => {
                    if (err) saveOrder(err);
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
router.get('/all', (req,res) => {
    Order.find((err,orders) => {
        if (!err) res.json({status: 'ok', msg: orders})
        else res.json({status: 'err', msg: 'Coba ulang kembali'})
    })
})

// Return all baskets in a particular day
router.get('/baskets', (req,res) => {
    Order.find( (err,orders) => {
        if (!err) {
            let baskets = [];
            for (let i = 0; i< orders.length; i++) {
                baskets.push(orders[i].basket);
            }
            res.json({status: 'ok', msg: baskets})
        } else res.json({status: 'err', msg: 'Coba ulangi kembali'})
    })
})

router.get('/data', (req,res) => {
    Order.find((err,orders) => {
        if (!err) {
            // let data =  [];
            res.json({status: 'ok', msg: orders});
        }
        else res.json({status: 'err', msg: 'Coba ulangi kembali'});
    })
})
module.exports = router;