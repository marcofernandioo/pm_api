var mongoose = require('mongoose');
var Schema = mongoose.Schema

var OrderSchema = new Schema({
    buyer: String, 
    address: String, 
    contact: String, 
    sendDate: Date, 
    orderDate: Date, 
    total: Number, 
    ongkir: Number,
    basket: [{
        name: String, 
        desc: String,
        qty: Number, 
        total: Number
    }],
    paid: Boolean,
    
})

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;