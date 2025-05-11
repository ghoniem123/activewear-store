const mongoose = require('mongoose');
const Cart = require('./Cart')

const userSchema = new mongoose.Schema({

    firstName :{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        unique: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    cartId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart',
        required:true,
    },
    
},
{
    strict:false,
    timestamps: true
})

module.exports=mongoose.model('User',userSchema);
