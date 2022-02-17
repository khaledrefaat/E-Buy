const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const { postLogin, postSignUp } = require('../controllers/auth-controllers');

router.post('/login', postLogin);

router.post(
  '/signup',
  [
    body('username', 'Please enter a username with at least 3 chars.')
      .trim()
      .isLength({ min: 3 }),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email.')
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              'Email already exists, Please pick different one.'
            );
          }
        });
      }),
    body('password', 'Please enter a password with at least 6 chars.')
      .trim()
      .isLength({ min: 6 }),
    body('passwordConfirmation')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new HttpError('Password must match.', 422);
        }
        return true;
      }),
  ],
  postSignUp
);

module.exports = router;
