const express     = require('express');
const router     = express.Router();
const CartController = require('../Controller/cartController'); 

router
.post('/create',CartController.CreateCart)

router
.route('/')
.post(CartController.AddToCart)
.put(CartController.UpdateCartItemQuantity)


router
.route('/:id')
.get(CartController.ViewMyCart)
.delete(CartController.RemoveFromCart)

router
.route('/checkout')
.post(CartController.Checkout)

router
.route('/checkout/:id')
.get(CartController.getSingleOrder)

router
.route('/track/:id')
.get(CartController.getSingleOrder)


module.exports = router;