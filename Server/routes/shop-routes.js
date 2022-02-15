const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const {
  getProducts,
  getProduct,
  getCart,
} = require('../controllers/shop-controllers');
const checkAuth = require('../middleware/check-auth');
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

router.use(checkAuth);

router.get('/cart', getCart);

module.exports = router;
