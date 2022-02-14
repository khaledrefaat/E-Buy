const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const { getProducts, getProduct } = require('../controllers/shop-controllers');
const Product = require('../models/product');

router.get('/', getProducts);

router.get(
  '/product/:prodId',
  [
    param('prodId').custom(prodId => {
      return Product.findById(prodId).then(prod => {
        if (!prod) {
          return Promise.reject("Couldn't find product with a associated id.");
        }
      });
    }),
  ],
  getProduct
);

module.exports = router;
