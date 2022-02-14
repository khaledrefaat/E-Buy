const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getProducts = async (req, res, next) => {
  try {
    products = await Product.find();
    return res.json(products);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Getting products failed, please try again later.', 500)
    );
  }
};

exports.getProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { prodId } = req.params;
  try {
    let product = await Product.findById(prodId);
    return res.json(product);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }
};
