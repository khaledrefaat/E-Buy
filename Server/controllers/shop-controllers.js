const Product = require('../models/product');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getProducts = async (req, res, next) => {
  try {
    products = await Product.find();
    return res.status(200).json(products);
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
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }
};

// cart
// getting cart

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user.cart);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }
};

// adding to cart

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    await user.addToCart(productId);

    res.status(201).json(user.cart);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }
};

// delete product from cart

exports.deleteFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const isDelete = req.body.remove;

  try {
    const user = await User.findById(req.user.userId);
    if (isDelete) {
      user.removeProductFromCart(productId);
    } else {
      await user.removeFromCart(productId);
    }
    res.status(200).json(user.cart);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    await user.clearCart();
    res.status(200).json(user.cart);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }
};

// order
// getting order

// adding order

// delete order
