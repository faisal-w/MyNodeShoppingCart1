var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required:true},
    price: {type: Number, required: true},
    likes: {type: Number, default:0,required: true}
});

module.exports = mongoose.model('Product', schema);
