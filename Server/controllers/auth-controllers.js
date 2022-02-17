const User = require('../models/user');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Logging in failed, please try again later.', 500)
    );
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('Email or Password incorrect'));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
        admin: existingUser.admin,
      },
      '^rXP`D}:=?;(m&JYR3}j:fCgfp4LTe',
      { expiresIn: '7d' }
    );
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  res.json({ userId: existingUser._id, token });
};

exports.postSignUp = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { username, password, email, image, cart } = req.body;

  let createdUser = new User({
    username,
    password,
    email,
    image,
    cart: cart || { items: [] },
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signup failed, please try again later.', 500));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser._id,
        admin: createdUser.admin,
      },
      '^rXP`D}:=?;(m&JYR3}j:fCgfp4LTe',
      { expiresIn: '7d' }
    );
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Something went wrong, please try again later.', 500)
    );
  }

  res.json({ userId: createdUser._id, token });
};
