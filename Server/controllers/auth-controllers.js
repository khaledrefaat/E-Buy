const User = require('../models/user');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

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

  res.json({ message: 'Logged in ^_*', user: existingUser });
};

exports.postSignUp = async (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return next(new HttpError(validationErrors.array()[0].msg, 422));
  }

  const { username, password, email, image } = req.body;

  let createdUser = new User({ username, password, email, image, cart: [] });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Signup failed, please try again later.', 500));
  }

  res.json({ user: createdUser });
};
