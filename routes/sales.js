var express = require('express');
var moment = require('moment');
var router = express.Router();

var Order = require('../models/order');
var Sales = require('../models/sales');

router.get('/dailysales', (req,res) => {
    Order.find({sendDate: {
        $gte: new Date(new Date(req.query.startdate).setHours(00,00,00)),
        $lte: new Date(new Date(req.query.enddate).setHours(23,59,59))
    }}, (err,baskets) => {
        if (!err) {
            for (let i = 0; i < baskets.length; i++) {
                var basket = baskets[i];
            }
            
            let salesData = {};
            salesData.revenue = 0;
            salesData.cost = 0;
            salesData.profit = 0;
            salesData.order_count = orders.length;

            orders.map((order) => {
                salesData.revenue += order.total;
                salesData.cost += order.totalCost;
                salesData.profit += order.total - order.totalCost;
            })
            
            res.json({status: "ok", msg: salesData})
        } else {
            res.json({status: 'err', msg: 'Coba ulangi kembali'})
        }
    })
})

// $gte: Greater than Equal to
// $lte: Less than Equal to 



module.exports = router;