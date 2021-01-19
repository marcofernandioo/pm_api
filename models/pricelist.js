var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pricelistSchema = new Schema({
    category: String,
    name: String,
    qty: Number,
    price: Number
})

var priceList = mongoose.model('pricelist', pricelistSchema);
module.exports = priceList;