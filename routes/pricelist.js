var express = require('express');
var router = express.Router();

var Pricelist = require('../models/pricelist');

// Add a product to the Pricelist
router.post('/add', (req,res) => {
    if (req.body && req.body.name && req.body.category && req.body.price){
        var new_product = new Pricelist({
            name: req.body.name, 
            category: req.body.category,
            qty: 0, 
            price: req.body.price
        });
        new_product.save((err) => {
            if (!err) res.json({status: 'ok', msg: 'Produk baru telah ditambahkan ke Price List'});
            else res.json({status: 'err', msg: 'Coba ulang kembali'})
        });
    } else res.json({status: 'err', msg: 'Data tidak lengkap'})
})

//Query Pricelist
router.get('/get', (req,res) => {
    Pricelist.find((err,list) => {
        if (!err) {
            var pricelist = list;
            res.json({status: 'ok', list: pricelist})
        }
        else res.json({status: 'err', msg: 'Coba ulang kembali'})
    })
})

//Update pricelist 
router.post('/update', (req,res) => {
    if (req.body && req.body.id) {
        let update = {};
        if (req.body.price) update.price = req.body.price;
        if (req.body.name) update.name = req.body.name;
        if (req.body.category) update.category = req.body.category;
        update.price = req.body.price;
        Pricelist.findByIdAndUpdate(req.body.id, update, (err) => {
            if (!err) res.json({status: 'ok', msg: 'Produk telah diubah'})
            else res.json({status: 'err', msg: 'Coba ulang kembali'})
        })
    } else res.json({status: 'err', msg: 'Masukkan harga produk'});
    
})

router.get('/find/:id', (req,res) => {
    Pricelist.findById(req.params.id, (err,product) => {
        if (!err) res.json({status: 'ok', product});
        else res.json({status: 'err', msg: err})
    })
})



module.exports = router;