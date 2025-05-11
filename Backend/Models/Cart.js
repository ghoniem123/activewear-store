const mongoose = require ('mongoose')
const cartitem = require('./CartItem')
const cartItemSchema = require('./CartItem').schema

const cartSchema = new mongoose.Schema({
    cartITems:[cartItemSchema], //array of cart items, just create an cart item and push it to the array and save the cart
    //easier than creating a cart item and then creating a cart and then linking them together
    total:{
        type:Number,
        required:false,
        default:0,
    },
},
{
    strict:true,
    timestamps: true
})

module.exports=mongoose.model('Cart',cartSchema);