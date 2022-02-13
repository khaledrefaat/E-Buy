const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { body, param } = require('express-validator');

const {
  getProducts,
  postProduct,
  patchProduct,
  deleteProduct,
} = require('../controllers/admin-controllers');
const Product = require('../models/product');

router.use(checkAuth);

router.get('/products', getProducts);

router.post(
  '/products',
  [
    body('title', 'Please enter a valid title, with at least 4 chars.')
      .trim()
      .isLength({ min: 4 }),
    body(
      'price',
      'Please enter a valid price, only numbers allowed.'
    ).isNumeric(),
    body(
      'description',
      'Please enter a valid description, with at least 10 chars.'
    )
      .trim()
      .isLength({ min: 10 }),
  ],
  postProduct
);

router.patch(
  '/products/:prodId',
  [
    param('prodId').custom(value => {
      return Product.findById(value).then(prod => {
        if (!prod) {
          return Promise.reject(
            "Something went wrong, we couldn't find that product.",
            500
          );
        }
      });
    }),
    body('title', 'Please enter a valid title, with at least 4 chars.')
      .trim()
      .isLength({ min: 4 }),
    body(
      'price',
      'Please enter a valid price, only numbers allowed.'
    ).isNumeric(),
    body(
      'description',
      'Please enter a valid description, with at least 10 chars.'
    )
      .trim()
      .isLength({ min: 10 }),
  ],
  patchProduct
);

router.delete(
  '/products/:prodId',
  [
    param('prodId').custom(value => {
      return Product.findById(value).then(prod => {
        if (!prod) {
          return Promise.reject(
            "Something went wrong, we couldn't find that product.",
            500
          );
        }
      });
    }),
  ],
  deleteProduct
);

module.exports = router;
