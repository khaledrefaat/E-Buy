const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const Product = require('../models/product');
const HttpError = require('../models/http-error');

const {
  getProducts,
  getProduct,
  getCart,
  postCart,
  deleteFromCart,
  clearCart,
} = require('../controllers/shop-controllers');

const checkProduct = async prodId => {
  try {
    let product = await Product.findById(prodId);
    if (!product) {
      return Promise.reject("Couldn't find product with a associated id.");
    }
  } catch (err) {
    console.log(err);
    throw new HttpError("Couldn't find product with a associated id.");
  }
};

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

router.post(
  '/cart',
  [body('productId').custom(value => checkProduct(value))],
  postCart
);

router.delete(
  '/cart/:productId',
  [param('productId').custom(value => checkProduct(value))],
  deleteFromCart
);

router.delete('/cart', clearCart);

module.exports = router;
