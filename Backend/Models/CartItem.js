const mongoose = require('mongoose');
const Product = require('./Product')

const cartItemSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    quantity:{
        type:Number,
        required:false,
        default:1,
    },
    productSize:{
        type:String,
        required:true,
        enum:['S','M','L','XL','XXL'],
    },
    total:{
        type:Number,
        required:false,
    },
},
{
    strict:true,
    timestamps: true
})

module.exports=mongoose.model('CartItem',cartItemSchema);
module.exports.schema = cartItemSchema;