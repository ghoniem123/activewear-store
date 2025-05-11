const mongoose = require('mongoose');
const Cart = require('./Cart')
const User = require('./User')
const cartItemSchema = require('./CartItem').schema

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
    },
    email:{
        type:String,
        required:false,
    },
    Country:{
       type:String,
       required:true,
    },
    City:{
        type:String,
        required:true,
    },
    Street:{  //Address Line 1
        type:String,
        required:true,
    },
    HouseNumber:{  //Address Line 2
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:false,
    },
    lastname:{
        type:String,
        required:false,
    },
    phone:{
        type:String,
        required:false,
    },
    shippingCost:{
        type:Number,
        required:true,
    },
    orderItems:[cartItemSchema],

    total:{
        type:Number,
        required:true,
    },
    
    shippingStatus:{
        type:String,
        required:false,
        enum:['Pending','Confirmed','Shipped','Delivered','Cancelled'],
        default:'Pending',
    }
},
{
    timestamps: true,
    strict:true,
})   
module.exports = mongoose.model('Order',orderSchema);