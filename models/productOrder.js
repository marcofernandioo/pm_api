var mongoose = require('mongoose');
var Schema = mongoose.Schema

var productOrderSchema = new Schema({
    name: String,
    description: String,
    quantity: Number, 
    price: Number, 
    total: Number
})

var productOrder = mongoose.model('product order', productOrderSchema);
module.exports = productOrder;