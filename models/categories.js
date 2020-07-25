var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categories = new Schema({
    category:{
        type:String,
    },
    image:{
        type:String,
    },
},{
    timestamps:true,
})
const Categories = mongoose.model('categories',categories);
module.exports = Categories;