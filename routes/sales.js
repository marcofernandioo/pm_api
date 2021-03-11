var express = require('express');
var moment = require('moment');
var router = express.Router();

var Order = require('../models/order');
var Sales = require('../models/sales');

router.get('/rangesales', (req,res) => {
    if (req.query.startdate != '' && req.query.enddate != '') {
        Order.find({sendDate: {
            $gte: new Date(new Date(req.query.startdate).setHours(00,00,00)),
            $lte: new Date(new Date(req.query.enddate).setHours(23,59,59))
        }}, (err,orders) => {
            if (!err) {
                let salesData = {};
                salesData.revenue = 0;
                salesData.cost = 0;
                salesData.profit = 0;
                for (let i = 0; i < orders.length; i++) {
                    let order = orders[i];
                    salesData.revenue += order.total;
                    salesData.cost += order.totalCost;
                    salesData.profit += order.subtotal - order.totalCost + order.ongkir;
                }
                res.json({status: "ok", msg: salesData})
            } else {
                res.json({status: 'err', msg: 'Coba ulangi kembali'})
            }
        })
    } else {
        res.json({status: 'err', msg: 'Query string missing'});
    }
    
})

const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'IDR'});
function formatCurrency(num) {
    let res = formatter.format(num).split('IDR');
    res = res.slice(1);
    return `Rp.${res}`
}

router.get('/statistics', (req,res) => {
    if (req.query.startdate != '' && req.query.enddate != '') {
        Order.find({sendDate: {
            $gte: new Date(new Date(req.query.startdate).setHours(00,00,00)),
            $lte: new Date(new Date(req.query.enddate).setHours(23,59,59))
        }}, (err,orders) => {
            if (!err) {
                let statistics = {};
                // let netRevenue = 0, netCost = 0, netProfit = 0;
                for (let i = 0; i < orders.length; i++) {
                    let date = orders[i].sendDateString;
                    if (!statistics[date]) {
                        statistics[date] = {
                            revenue: orders[i].total, 
                            cost: orders[i].totalCost,
                            profit: orders[i].total - orders[i].totalCost,
                        };
                    } else {
                        statistics[date].total += orders[i].total,
                        statistics[date].cost += orders[i].cost,
                        statistics[date].profit += orders[i].total - orders[i].totalCost
                    }
                }
                salesData = {};
                date = [];
                revenue = [];
                profit = [];
                for (let i = 0; i < Object.keys(statistics).length; i++) {
                    let currentDate = Object.keys(statistics)[i];
                    date.push(currentDate);
                    revenue.push(statistics[currentDate].revenue);
                    profit.push(statistics[currentDate].profit);  
                }
                salesData.date = date;
                salesData.revenue = revenue;
                salesData.profit = profit;
                res.json({status: 'ok', salesData})
            } else {
                res.json({status: 'err', msg: err});
            }
        })
    } else {
        res.json({status: 'err', msg: 'Query string missing'});
    }
})

// $gte: Greater than Equal to
// $lte: Less than Equal to 

module.exports = router;