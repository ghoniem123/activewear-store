const express = require('express');
const router = express.Router();    
const productController = require('../Controller/productController');

router.get('/',productController.viewProducts);
router.get('/view/:id',productController.viewSingleProduct);

router.post('/filter',productController.filterProducts);

module.exports = router;