const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        description:{ 
           type:String,
           required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        sizes:[{
            _id:{type: mongoose.Schema.ObjectId, auto:false},
            size:{type:String,required:true, enum:['S','M','L','XL','XXL']},
            quantity:{type:Number,required:true,default:0},
    },{_id:false}],
    image:{
        type:String,
        required:true,
    },
    
    }
    ,{
    strict:true,
    timestamps: true
    }
)

module.exports = mongoose.model("Product",productSchema);
