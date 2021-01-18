var mongoose = require('mongoose');
var Schema = mongoose.Schema

var OrderSchema = new Schema({
    buyer: String, 
    address: String, 
    contact: String, 
    sendDate: Date, 
    orderDate: Date, 
    total: Number, 
    basket: [{
        name: String, 
        desc: String,
        quantity: Number, 
        total: Number
    }]
})

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;