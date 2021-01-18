var express = require('express');
var router = express.Router();

var Pricelist = require('../models/pricelist');

router.post('/add', (req,res) => {
    if (req.body && req.body.name && req.body.category && req.body.price){
        var new_product = new Pricelist({
            name: req.body.name, 
            category: req.body.category,
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
            res.json({pricelist})
        }
        else res.json({status: 'err', msg: 'Coba ulang kembali'})
    })
})

//Update pricelist 
router.all('/update/:id', (req,res) => {
    if (req.body && req.body.price) {
        let update = {};
        update.price = req.body.price;
        Pricelist.findByIdAndUpdate(req.params.id, update,(err,prod) => {
            if (!err){
                res.json({status: 'ok', msg: 'Produk telah di update'})
            } else res.json({status: 'err', msg: 'Coba ulang kembali'})
        })
    } else res.json({status: 'err', msg: 'Masukkan harga produk'});
    
})

module.exports = router;