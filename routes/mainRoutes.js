const express = require('express');
const productCtrl = require('../controllers/product');

const router = express.Router();

router
  .route('/')
  .get(productCtrl.findProductsWithFilter)
  

router
.route('/filter')
.get(productCtrl.findProductsWithFilter)

module.exports = router;