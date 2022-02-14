const Product = require('../models/product');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

exports.getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Getting products failed, please try again later.', 500)
    );
  }
  res.json(products);
};

exports.getProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }
};

exports.postProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { title, description, price, image } = req.body;

  const createdProduct = new Product({ title, description, price, image });

  try {
    await createdProduct.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating product failed, please try again later.', 500)
    );
  }
  res.json(createdProduct);
};

exports.patchProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { prodId } = req.params;
  const { title, description, price, image } = req.body;

  let updatedProduct;
  try {
    updatedProduct = await Product.findById(prodId);
    updatedProduct.title = title;
    updatedProduct.description = description;
    updatedProduct.price = price;
    updatedProduct.image = image;
    await updatedProduct.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Updating product failed, please try again later.', 500)
    );
  }
  res.json(updatedProduct);
};

exports.deleteProduct = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { prodId } = req.params;
  try {
    await Product.findByIdAndDelete(prodId);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Updating product failed, please try again later.', 500)
    );
  }
  next();
};
