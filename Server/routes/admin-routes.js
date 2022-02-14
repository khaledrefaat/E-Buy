const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const { body, param } = require('express-validator');

const {
  getProducts,
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
} = require('../controllers/admin-controllers');
const Product = require('../models/product');
const HttpError = require('../models/http-error');

const checkProduct = async prodId => {
  try {
    let product = await Product.findById(prodId);
    if (!product) {
      Promise.reject("Couldn't find product with a associated id.");
    }
  } catch (err) {
    console.log(err);
    throw new HttpError("Couldn't find product with a associated id.");
  }
};

router.use(checkAuth);
router.use(checkAdmin);

router.get('/products', getProducts);

router.get(
  'products/:prodId',
  [param('prodId').custom(prodId => checkProduct(prodId))],
  getProduct
);

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
    param('prodId').custom(prodId => checkProduct(prodId)),
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
  [param('prodId').custom(prodId => checkProduct(prodId))],
  deleteProduct
);

module.exports = router;
