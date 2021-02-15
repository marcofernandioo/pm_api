var express = require('express');
var moment = require('moment');
var router = express.Router();

var Order = require('../models/order');

router.get('/dailysales', (req,res) => {
    Order.find({sendDateString: req.query.date}, (err,orders) => {
        if (!err) {
            let salesData = {};
            salesData.revenue = 0;
            salesData.profit = 0;
            salesData.cost = 0;
            salesData.order_count = orders.length;
            orders.map((order) => {
                salesData.revenue += order.total;
                salesData.cost += order.totalCost;
                // salesData.profit += 
            })
            res.json({status: "ok", msg: salesData})
        } else {
            res.json({status: 'err', msg: 'Coba ulangi kembali'})
        }
    })
})



router.get('/revenue', (req,res) => {
    let startWeek = moment().startOf('isoWeek');
    let startYear = moment().startOf('year');
    let dateNow = moment()

    //Timeframe: daily, timestamps: per day starting from the start of the week (Monday).
    let diffDaily = dateNow.diff(startWeek, 'days') + 1; 

    //Timeframe: monthly, timsetamps: per month starting from the start of the year (January).
    let diffMonthly = dateNow.diff(startYear, 'months') + 1;

    //The diff will determine how many datapoints (objects) will be sent to the client.
    //


    res.json({startWeek, dateNow, diffDaily, startYear, dateNow, diffMonthly});
})

router.get('/now', (req,res) => {
    let date = new Date();
    date = JSON.stringify(date);
    let dateNow = moment(date).format("DD/MM.YYYY");
    res.json({dateNow});
})

// $gte: Greater than Equal to
// $lte: Less than Equal to 



module.exports = router;