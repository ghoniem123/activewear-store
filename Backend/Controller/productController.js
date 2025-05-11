const Product = require('../Models/Product');
const jwt = require('jsonwebtoken');
const Cart = require('../Models/Cart');
require('dotenv').config();

const productController = {
    
    viewProducts: async(req,res)=>{ 
        try{
            const products = await Product.find();


        //     if(!req.cookies.token || req.cookies.token==='undefined'){ 

        //         const cart = new Cart({
        //             cartItems:[],
        //             total:0,
        //         })
        //         const SavedCart = await cart.save(); 
        //         const cartId = SavedCart._id; 

        //     const token = jwt.sign( 
        //           { User:{Cart:cartId,
        //           userType:'guest' }
        //           }, 
        //            secretKey
        //         )   
                                
        //  return res.cookie( 
        //             "token", token,
        //             {
        //                 withCredentials: true,
        //                 httpOnly:false,
        //                 SameSite : 'none',
        //             }, 
        //         ).status(200).json(products);

        //         }  
                return res.status(200).json(products);     

        }catch(e){
            res.status(500).json({message:e.message});
        }
    },

    viewSingleProduct: async(req,res)=>{ 
        try{
            const productId = req.params.id;
            const product = await Product.findById(productId);
            res.status(200).json(product);
        }catch(e){
            res.status(500).json({message:e.message});
        }
    },

    filterProducts: async(req,res)=>{ 
        try{
            const FilterSize = req.body.FilterSize;
            console.log(req.body)
            const products = await Product.find();
             console.log(FilterSize)
            const filteredProducts = products
            .filter(product => product.sizes.some(productSize => FilterSize.includes(productSize.size)));
            
            res.status(200).json(filteredProducts);
        }catch(e){
            res.status(500).json({message:e.message});
        }
    }



}
module.exports = productController;