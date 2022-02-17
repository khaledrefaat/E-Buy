const Product = require('../models/product');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Order = require('../models/order');

const internalError = (next, error) => {
  console.log(error);
  return next('Something went wrong, please try again later.', 500);
};

exports.getProducts = async (req, res, next) => {
  try {
    products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    return internalError(next, err);
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
    return internalError(next, err);
  }
};

// cart
// getting cart

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user.cart);
  } catch (err) {
    return internalError(next, err);
  }
};

// adding to cart

exports.postCart = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { productId } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    await user.addToCart(productId);

    res.status(201).json(user.cart);
  } catch (err) {
    return internalError(next, err);
  }
};

// delete product from cart

exports.deleteFromCart = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

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
    return internalError(next, err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    await user.clearCart();
    res.status(200).json(user.cart);
  } catch (err) {
    return internalError(next, err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.userId });

    res.status(200).json(orders);
  } catch (err) {
    return internalError(next, err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findById(req.user.userId).populate(
      'cart.items.productId'
    );

    const products = user.cart.items.map(prod => {
      return {
        quantity: prod.quantity,
        product: { ...prod.productId._doc },
      };
    });

    const order = new Order({
      products,
      user: req.user.userId,
    });

    await order.save({ session });
    await user.clearCart({ session });
    await session.commitTransaction();
    return res.status(201).json(order);
  } catch (err) {
    return internalError(next, err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { orderId } = req.params;

  try {
    await Order.findByIdAndDelete(orderId);
  } catch (err) {
    return internalError(next, err);
  }
  res.status(200).json({ message: 'Order has been deleted.' });
};
