var express = require('express');
var moment = require('moment');
var async = require('async');
var router = express.Router();
var moment = require('moment');


var Order = require('../models/order');
// var productOrder = require('../models/productOrder');
var Pricelist = require('../models/pricelist');
var Sales = require('../models/sales');

//Input an Order
router.post('/add', (req,res) => {
    if (req.body && req.body.buyer && req.body.address && req.body.contact && req.body.basket.length > 0 && req.body.fakelist) {
        
        async.waterfall([
            function (calculateTotal) {
                let totalPrice = req.body.ongkir;
                let totalCost = 0;
                for (let i = 0; i < req.body.basket.length; i++) {
                    let product = req.body.basket[i];
                    product.total = product.qty * product.price;
                    totalPrice += product.total;
                    totalCost += product.qty * product.cost;
                }
                calculateTotal(null, totalPrice, totalCost);
            },
            function (totalPrice, totalCost, saveOrder) {
                let fromattedSendDate = moment(req.body.sendDate).format('DD/MM/YYYY');
                let formattedOrderDate = moment(new Date()).format('DD/MM/YYYY');
                let new_order = new Order({
                    buyer: req.body.buyer,
                    address: req.body.address,
                    contact: req.body.contact,
                    sendDateString: fromattedSendDate,
                    sendDate: req.body.sendDate,
                    orderDate: formattedOrderDate,
                    paid: req.body.paid, 
                    total: totalPrice,
                    subtotal: totalPrice - req.body.ongkir,
                    basket: req.body.basket, 
                    ongkir: req.body.ongkir,
                    fakelist: req.body.fakelist,
                    totalCost
                })
                new_order.save((err) => {
                    if (err) saveOrder(err);
                    else saveOrder(null, totalPrice, totalCost);
                })
            }, 
            // function (totalPrice, totalCost, saveSalesData) {
            //     let salesData = {
            //         date: req.query.sendDate,
            //         revenue: totalPrice, 
            //         cost: totalCost, 
            //         profit: totalPrice,
            //         orders: 1
            //     }
            //     Sales.findOneAndUpdate({sendDate: {
            //         $gte: new Date(new Date(req.body.sendDate).setHours(00,00,00)),
            //         $lte: new Date(new Date(req.body.sendDate).setHours(23,59,59))
            //     }}, 
            //     {upsert: true}, (err,sales) => {
            //         if (!err) {
                        
            //         }
            //     })
            // }
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


// Return ALL of the orders
router.get('/data', (req,res) => {
    Order.find((err,orders) => {
        if (!err) {
            // let data =  [];
            res.json({status: 'ok', msg: orders});
        }
        else res.json({status: 'err', msg: 'Coba ulangi kembali'});
    })
})

// Find Orders based on Date
router.get('/find', (req,res) => {
    if (req.query.date) {
        Order.find({sendDateString: req.query.date}, (err,orders) => {
            if (!err) {
                if (orders) {
                    res.json({status: 'ok', msg: orders})
                } else res.json({status: 'err', msg: 'Data tidak ketemu, coba ulangi kembali'})
            }
            else res.json({status: 'err', msg: err})
        })
    } else res.json({status: 'err', msg: 'Coba ulangi kembali'})
    
})

// Find an Order based on ID
router.get('/findone/:id', (req,res) => {
    Order.findById(req.params.id, (err,data) => {
        if (!err) res.json({status:'ok', msg:data});
        else res.json({status: 'err', msg:err});
    })
})

// Delete an Order
router.get('/delete/:id', (req,res) => {
    Order.findOneAndDelete({_id: req.params.id}, (err) => {
        if (!err) res.json({status: 'ok', msg: 'Orderan telah dihapus'});
        else res.json({status: 'err', msg: err});
    })
})

// Update an Order
router.post('/update', (req,res) => {
    if (req.body && req.body.id) {
        let new_order = {}
        let totalPrice = req.body.ongkir;
        if (req.body.buyer) new_order.buyer = req.body.buyer;
        if (req.body.address) new_order.address = req.body.address;
        if (req.body.contact) new_order.contact = req.body.contact;
        if (req.body.paid != null) new_order.paid = req.body.paid;
        if (req.body.ongkir) {
            new_order.ongkir = req.body.ongkir;
            new_order.total = req.body.ongkir + req.body.subtotal;
        }
        // if (req.body.basket) {
        //     for (let i = 0; i < req.body.basket.length; i++) {
        //         let product = req.body.basket[i];
        //         product.total = product.qty * product.price;
        //         totalPrice += product.total;
        //     }
        //     new_order.basket = req.body.basket;
        // }

        Order.findOneAndUpdate({_id: req.body.id}, new_order, (err) => {
            if (!err) res.json({status: 'ok', msg: 'Data orderan telah diubah'});
            else res.json({status: 'err', msg: 'Coba ulangi kembali'})
        })

    } else res.json({status: 'err', msg: 'Input ID'})
})

router.get('/daterange', (req,res) => {
    if (req.query.startdate != '' && req.query.enddate != '') {
        Order.find({sendDate: {
            $gte: new Date(new Date(req.query.startdate).setHours(00,00,00)),
            $lte: new Date(new Date(req.query.enddate).setHours(23,59,59))
        }}, (err,orders) => {
            if (!err) res.json({status: 'ok', msg: orders});
            else res.json({status: 'err', msg: 'Coba ulangi kembali'});
        })
    } else {
        res.json({status: 'err', msg: 'Query tidak lengkap'})
    }
})

router.get('/test', (req,res) => {
    Order.find((err,data) => {
        if (!err) {
            if (data) res.json({status: 'ok', msg: data});
            else res.json({status: 'err', msg: 'notfound'});
        } else res.json({status: 'err', msg: err})
    })
})
module.exports = router;