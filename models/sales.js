var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SalesSchema = new Schema({
    date: Date,
    revenue: Number,
    cost: Number,
    profit: Number
})

var Sales = mongoose.model('sales', SalesSchema);
module.exports = Sales;