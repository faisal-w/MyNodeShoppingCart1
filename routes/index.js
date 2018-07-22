var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var formidable = require('formidable');
const util = require('util');

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
    var form = new formidable.IncomingForm();
    var fullFilename;
    var product = new Product();

    form.parse(req,function(err, fields){
        product = new Product(fields);
        console.log('Product: '+ product)
        console.log('fullfilename: '+fullFilename);
        product.imagePath = fullFilename;
        product.save(function (err) {
            if (err) {
                console.log(err);
                res.render("shop/addProduct");
            } else {
                console.log("Successfully created an product.");
                res.redirect("/listProduct");
            }
        });
    });

    form.on('file', function(name,file,fields){
        product = new Product(fields);
        console.log('Product : '+product);
        console.log('Uploaded ' + file.name);
        fullFilename =  './photo_uploads/' + file.name;
    });

    form.on('fileBegin', function(name,file){
        file.path = process.cwd() + '/public/photo_uploads/' + file.name;
    });

});

router.get('/listproduct', function(req,res) {
    Product.find(function(err, prods){
        res.render('shop/listProduct', {title: 'All Products', products: prods});
    });
});

router.post('/delete/:id', function (req, res) {
    Product.remove({ _id: req.params.id }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Product deleted!");
            res.redirect("/listProduct");
        }
    });
});

router.get('/edit/:id', function (req, res) {
    Product.findOne({ _id: req.params.id }).exec(function (err, prods) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render('shop/edit', { title: 'All Products', products: prods });
        }
    })
})

router.post('/updateProduct/:id', function (req, res) {
    //console.log("REQUEST : "+util.inspect(req.body,{showHidden:true}));
    var form = new formidable.IncomingForm();
    var id = req.params.id;
    var fullfilename;

    form.parse(req,function(err, fields){
        console.log(fields);
        Product.findById(id, function (err, doc) {
            if (err) {
                console.log("Find by id: "+err);
                res.redirect('/edit/'+id);
            }
            console.log("Full filename: "+fullfilename);
            //if ( typeof fullfilename !== 'undefined' && fullfilename ){
            if(!fullfilename){
                doc.imagePath = fields.imagePath;
            }else{
                doc.imagePath = fullfilename;
            }
            doc.title = fields.title;
            doc.description = fields.description;
            doc.price = fields.price;
            doc.save(function(err){
                if(err){
                    console.log("error save: "+err);
                    res.redirect('/edit/'+id);
                }else{
                    console.log("Successfully saved edited product");
                    res.redirect("/listProduct");
                }
            });
          });
    });
    form.on('file', function(name,file,fields){
        //console.log('Fields on file : '+fields);
        //console.log('File prop : '+util.inspect(file));
        console.log('Filename ' + file.name);
        if(file.name){
            fullfilename = './photo_uploads/' + file.name;
        }
    });

    form.on('fileBegin', function(name,file){
        console.log("Masuk upload, filename : "+file.name);
        if(file.name){
            file.path = process.cwd() + '/public/photo_uploads/' + file.name;
        }
    });    

});

router.get('/like/:id', function(req,res) {
    Product.findByIdAndUpdate(req.params.id,
        {
            $inc:
            { likes : 1 }
        },
        function(err, products) {
            if(err){
                console.log(err);
                res.redirect("/");
            }
            res.redirect("/");
        });
});

module.exports = router;
