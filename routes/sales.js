var express = require('express');
var moment = require('moment');

var router = express.Router();

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

// $gte: Greater than Equal to
// $lte: Less than Equal to 



module.exports = router;