const Cart = require('../Models/Cart');
const CartItem = require('../Models/CartItem');
const Product = require('../Models/Product');
require('dotenv').config();
const Order = require('../Models/Order');
const shippingCost = process.env.SHIPPING_COST;
// const nodemailer = require('nodemailer');


const cartController = {

   CreateCart: async(req,res)=>{
    try{
        const cart = new Cart({
            cartITems:[],
            total:0,
        })
        const SavedCart = await cart.save(); 
        const cartId = SavedCart._id; 
        res.status(200).json({cartId}); 
    }catch(e){  
        res.status(500).json({message:e.message});
    }
  },

   ViewMyCart: async(req,res)=>{
    try{ 
                const cartId = req.params.id;
                const cart = await Cart.findById(cartId);
                const cartItems = cart.cartITems;
                const total = cart.total;
                res.status(200).json({cartItems,total});
            
     }catch(e){
        res.status(500).json({message:e.message});
    }
   },

    AddToCart: async(req,res)=>{  
     try{
    
                   const cartId = req.body.Cart;
                    const cart = await Cart.findById(cartId);

                    const productId = req.body.productId;
                    const quantity = 1;
                    const productSize = req.body.productSize;

                    const product = await Product.findById(productId);
                     const productPrice = product.price;

                     const productQuantity = product.sizes.find(size=>size.size===productSize).quantity;


                     const existingCartItem = cart.cartITems.find(item => item.productId.toString() === productId.toString() && item.productSize === productSize);

               

                     if (existingCartItem){
                     productQuantity=productQuantity -  existingCartItem.quantity;
                     
                     if(productQuantity<quantity)
                     return res.status(404).json(`${productQuantity}`);
                     }

                           if (existingCartItem) {
                             existingCartItem.quantity += quantity;
                             existingCartItem.total = existingCartItem.quantity * productPrice;
                            const updates = {quantity:existingCartItem.quantity,total:existingCartItem.total};
                             await CartItem.findByIdAndUpdate(existingCartItem._id,updates);
                           } else {
                     
                    const cartItem = new CartItem({
                        productId,
                        quantity,
                        productSize,
                        total:quantity*productPrice,
                    })
                  //   console.log(cartItem);
                    const Item = await cartItem.save();

                  //   cart.cartITems.push(Item);
                  cart.cartITems = [...cart.cartITems,Item];

                  }

                    const newTotal = CalculateCartTotal(cart.cartITems); //calculate the total of the cart
                  //   console.log(newTotal);
                    cart.total = newTotal; //save the new total to the cart
                    const updatedCart = await cart.save(); //save the cart with the new item added to it and update the new total (Update the cart)
                    res.status(200).json( updatedCart)
         
     }catch(e){
        res.status(500).json({message:e.message});
     }
    },

    RemoveFromCart: async(req,res)=>{
     try{
                    const cartId = req.query.Cart; //decoded.User.Cart; from the authentication middleware
                    const cart = await Cart.findById(cartId);
                    const cartItemId = req.params.id;

                    const Item = await CartItem.findById(cartItemId);

                    //  console.log(Item);

                    // console.log("BEFORE => ",cart.cartITems);
                    cart.cartITems=cart.cartITems.pull(Item);
                  //   cart.cartITems.filter(CartItem=>CartItem._id!==Item._id);

                    // console.log("AFTER => ",cart.cartITems);
                    
                    const newTotal = CalculateCartTotal(cart.cartITems); //calculate the total of the cart
                    cart.total = newTotal; //save the new total to the cart
                    const updatedCart = await cart.save(); //save the cart with the new item added to it and update the new total (Update the cart)
                    CartItem.findByIdAndDelete(cartItemId);  //delete the cartitem from cartitems collection in the database
                    res.status(200).json(Item);
     
     }catch(e){
        res.status(500).json({message:e.message});
     }
    },

    UpdateCartItemQuantity: async(req,res)=>{
        try{
            const cartId = req.body.Cart; 
            const cart = await Cart.findById(cartId);
            const cartItemId = req.body.id;
            const quantity = req.body.quantity;
            const Item = await CartItem.findById(cartItemId);
            const product = await Product.findById(Item.productId);
            const productPrice = product.price;
            const productQuantity = product.sizes.find(size=>size.size===Item.productSize).quantity;
            //  console.log(quantity);
            //  console.log(productQuantity);

            if(productQuantity<quantity)
                return res.status(404).json(`${productQuantity}`);

            // updates = {quantity:quantity,total:quantity*productPrice};

            Item.quantity = quantity;
            Item.total = quantity*productPrice;

            // console.log(Item);

            

            // await CartItem.findByIdAndUpdate(cartItemId,upates);
            await Item.save();


            // console.log(cart.cartITems);

            const itemIndex = cart.cartITems.findIndex(item => item._id.toString() === Item._id.toString());


            // console.log(itemIndex);

            cart.cartITems.pull(Item);

            // console.log("After", cart.cartITems);

            cart.cartITems.splice(itemIndex, 0, Item);

            // console.log("After2", cart.cartITems);

            const newTotal = CalculateCartTotal(cart.cartITems);
            cart.total = newTotal; 
            const updatedCart = await cart.save(); 
            res.status(200).json(Item);
        }catch(e){
            res.status(500).json({message:e.message});
        }
    },

    Checkout: async(req,res)=>{
      try{
        const cartId = req.body.Cart;
        const cart = await Cart.findById(cartId);

        // console.log(cart)
        // console.log(shippingCost)

        const order = new Order({
            userId:null,
            Country:req.body.Country,
            City:req.body.City,
            Street:req.body.AddressStreet1, 
            HouseNumber:req.body.AddressStreet2,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            phone:req.body.phone,
            shippingCost:shippingCost,
            orderItems:cart.cartITems,
            status:'Pending',
            total:0,
        })


        order.total = (parseFloat(CalculateCartTotal(cart.cartITems)) + parseFloat(shippingCost)).toFixed(2);


        // console.log(order.total)

        await order.save();



        for (const item of cart.cartITems) {
          const id = item.productId;
          const size = item.productSize;
                
          const p = await Product.findOneAndUpdate(
            { _id: id, 'sizes.size': size },
            { $inc: { 'sizes.$.quantity': -item.quantity } },
            { new: true }
          );
                
          await CartItem.findByIdAndDelete(item._id);
        }


        cart.cartITems = [];
        cart.total = 0;
        await cart.save();

      //   let config={
      //     service:'gmail',
      //     auth:{
      //       type:'OAuth2',
      //       user:process.env.EMAIL,
      //       pass:process.env.PASSWORD
      //     },
      //     tls:{
      //       rejectUnauthorized:false
      //     }
      //   }

      //   let transporter = nodemailer.createTransport(config);

      //   let mail={
      //     from: process.env.EMAIL,
      //     to: req.body.email,
      //     subject: 'Order Number',
      //     html:
      //     `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      //     <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
      //      <head>
      //       <meta charset="UTF-8">
      //       <meta content="width=device-width, initial-scale=1" name="viewport">
      //       <meta name="x-apple-disable-message-reformatting">
      //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
      //       <meta content="telephone=no" name="format-detection">
      //       <title>New Template</title><!--[if (mso 16)]>
      //         <style type="text/css">
      //         a {text-decoration: none;}
      //         </style>
      //         <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
      //     <xml>
      //         <o:OfficeDocumentSettings>
      //         <o:AllowPNG></o:AllowPNG>
      //         <o:PixelsPerInch>96</o:PixelsPerInch>
      //         </o:OfficeDocumentSettings>
      //     </xml>
      //     <![endif]-->
      //       <style type="text/css">
      //     .rollover:hover .rollover-first {
      //       max-height:0px!important;
      //       display:none!important;
      //       }
      //       .rollover:hover .rollover-second {
      //       max-height:none!important;
      //       display:block!important;
      //       }
      //       .rollover span {
      //       font-size:0px;
      //       }
      //       u + .body img ~ div div {
      //       display:none;
      //       }
      //       #outlook a {
      //       padding:0;
      //       }
      //       span.MsoHyperlink,
      //     span.MsoHyperlinkFollowed {
      //       color:inherit;
      //       mso-style-priority:99;
      //       }
      //       a.es-button {
      //       mso-style-priority:100!important;
      //       text-decoration:none!important;
      //       }
      //       a[x-apple-data-detectors] {
      //       color:inherit!important;
      //       text-decoration:none!important;
      //       font-size:inherit!important;
      //       font-family:inherit!important;
      //       font-weight:inherit!important;
      //       line-height:inherit!important;
      //       }
      //       .es-desk-hidden {
      //       display:none;
      //       float:left;
      //       overflow:hidden;
      //       width:0;
      //       max-height:0;
      //       line-height:0;
      //       mso-hide:all;
      //       }
      //       .es-button-border:hover > a.es-button {
      //       color:#ffffff!important;
      //       }
      //     @media only screen and (max-width:600px) {.es-m-p0r { padding-right:0px!important } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } }
      //     @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
      //     </style>
      //      </head>
      //      <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
      //       <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"><!--[if gte mso 9]>
      //           <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
      //             <v:fill type="tile" color="#fafafa"></v:fill>
      //           </v:background>
      //         <![endif]-->
      //        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
      //          <tr>
      //           <td valign="top" style="padding:0;Margin:0">
      //            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
      //              <tr>
      //               <td class="es-info-area" align="center" style="padding:0;Margin:0">
      //                <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF">
      //                  <tr>
      //                   <td align="left" style="padding:20px;Margin:0">
      //                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                      <tr>
      //                       <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
      //                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                          <tr>
      //                           <td align="center" class="es-infoblock" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">View online version</a></p></td>
      //                          </tr>
      //                        </table></td>
      //                      </tr>
      //                    </table></td>
      //                  </tr>
      //                </table></td>
      //              </tr>
      //            </table>
      //            <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
      //              <tr>
      //               <td align="center" style="padding:0;Margin:0">
      //                <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
      //                  <tr>
      //                   <td align="left" style="Margin:0;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px">
      //                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                      <tr>
      //                       <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px">
      //                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                          <tr>
      //                           <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><img src="https://ecykfvo.stripocdn.email/content/guids/CABINET_1d268166aadb070a0c3e4389bf076a92cecf1f36e23c7780764f42a6b31ce7c9/images/gymshark.png" alt="Logo" style="display:block;font-size:12px;border:0;outline:none;text-decoration:none" width="200" title="Logo" class="adapt-img"></td>
      //                          </tr>
      //                        </table></td>
      //                      </tr>
      //                    </table></td>
      //                  </tr>
      //                </table></td>
      //              </tr>
      //            </table>
      //            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
      //              <tr>
      //               <td align="center" style="padding:0;Margin:0">
      //                <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
      //                  <tr>
      //                   <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:15px">
      //                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                      <tr>
      //                       <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
      //                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                          <tr>
      //                           <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://ecykfvo.stripocdn.email/content/guids/CABINET_f3fc38cf551f5b08f70308b6252772b8/images/96671618383886503.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="100"></td>
      //                          </tr>
      //                          <tr>
      //                           <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:55px;color:#333333">Thanks for Shopping with us!</h1></td>
      //                          </tr>
      //                          <tr>
      //                           <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;letter-spacing:0;color:#333333;font-size:16px">Hello, ${req.body.firstname} ${req.body.lastname} Thanks for shopping with us! You order is now being processed. Soon you will receive a mail confirming your order.&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;letter-spacing:0;color:#333333;font-size:16px">You can keep track of your order using the below order number on your website.</p></td>
      //                          </tr>
      //                        </table></td>
      //                      </tr>
      //                    </table></td>
      //                  </tr>
      //                  <tr>
      //                   <td class="esdev-adapt-off" align="left" style="padding:20px;Margin:0">
      //                    <table cellpadding="0" cellspacing="0" class="esdev-mso-table" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
      //                      <tr>
      //                       <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
      //                        <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
      //                          <tr class="es-mobile-hidden">
      //                           <td align="left" style="padding:0;Margin:0;width:146px">
      //                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                              <tr>
      //                               <td align="center" height="40" style="padding:0;Margin:0"></td>
      //                              </tr>
      //                            </table></td>
      //                          </tr>
      //                        </table></td>
      //                       <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
      //                        <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
      //                          <tr>
      //                           <td align="left" style="padding:0;Margin:0;width:121px">
      //                            <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#e8eafb" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#e8eafb;border-radius:10px 0 0 10px">
      //                              <tr>
      //                               <td align="right" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Order number :&nbsp;</p></td>
      //                              </tr>
      //                            </table></td>
      //                          </tr>
      //                        </table></td>
      //                       <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
      //                        <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
      //                          <tr>
      //                           <td align="left" style="padding:0;Margin:0;width:155px">
      //                            <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#e8eafb" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#e8eafb;border-radius:0 10px 10px 0">
      //                              <tr>
      //                               <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-left:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>${order._id}</strong></p></td>
      //                              </tr>
      //                            </table></td>
      //                          </tr>
      //                        </table></td>
      //                       <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
      //                        <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
      //                          <tr class="es-mobile-hidden">
      //                           <td align="left" style="padding:0;Margin:0;width:138px">
      //                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                              <tr>
      //                               <td align="center" height="40" style="padding:0;Margin:0"></td>
      //                              </tr>
      //                            </table></td>
      //                          </tr>
      //                        </table></td>
      //                      </tr>
      //                    </table></td>
      //                  </tr>
      //                  <tr>
      //                   <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-bottom:10px;padding-left:20px">
      //                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                      <tr>
      //                       <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
      //                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:5px">
      //                          <tr>
      //                           <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#5C68E2;border-width:0px;display:inline-block;border-radius:6px;width:auto"><a href="" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5C68E2;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #5C68E2;border-left-width:30px;border-right-width:30px">SHOP NOW</a></span></td>
      //                          </tr>
      //                        </table></td>
      //                      </tr>
      //                    </table></td>
      //                  </tr>
      //                </table></td>
      //              </tr>
      //            </table>
      //            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
      //              <tr>
      //               <td class="es-info-area" align="center" style="padding:0;Margin:0">
      //                <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF">
      //                  <tr>
      //                   <td align="left" style="padding:20px;Margin:0">
      //                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                      <tr>
      //                       <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
      //                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
      //                          <tr>
      //                           <td align="center" class="es-infoblock" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#CCCCCC;font-size:12px"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>No longer want to receive these emails?&nbsp;<a href="" target="_blank" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px">Unsubscribe</a>.<a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a></p></td>
      //                          </tr>
      //                        </table></td>
      //                      </tr>
      //                    </table></td>
      //                  </tr>
      //                </table></td>
      //              </tr>
      //            </table></td>
      //          </tr>
      //        </table>
      //       </div>
      //      </body>
      //     </html>
          
      // `
          
          
      //   }

      //   transporter.sendMail(mail).then((result)=>{
      //     console.log(result)
      //   })
      //   .catch((err)=>{console.log(err)});

        res.status(200).json(order);
    }catch(e){
        res.status(500).json({message:e.message});
    }
},


getSingleOrder: async(req,res)=>{ //url /order/:id get
  try{
       const orderId = req.params.id;
      const order = await Order.findById(orderId);
      res.status(200).json(order);
  }catch(e){
      res.status(500).json({message:e.message});
  }
},

};
module.exports = cartController;   


CalculateCartTotal = items => {
    try{
         const Total = items.reduce((acc,item)=>acc+item.total,0);
         return Total.toFixed(2);
    }catch(e){
            throw new Error(e.message); 
    }
   }

