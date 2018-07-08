var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i=0; i<docs.length; i+=chunkSize) {
            productChunks.push(docs.slice(i,i+chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
    });
});

router.get('/addNewProduct', function(req,res) {
    res.render('shop/addProduct');
});

router.post('/addNewProduct', function(req,res) {
    var product = new Product(req.body);

    product.save(function(err){
        if(err){
            console.log(err);
            res.render('shop/addProduct');
        }else{
            console.log("Successfully created a new product");
            res.redirect('/');
        }
    });
});

router.get('/listproduct', function(req,res) {
    Product.find(function(err, prods){
        res.render('shop/listProduct', {title: 'All Products', products: prods});
    });
});

module.exports = router;
