const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') next();

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return next(new HttpError('Authorization failed.', 401));

    const { userId, admin } = jwt.verify(
      token,
      '^rXP`D}:=?;(m&JYR3}j:fCgfp4LTe'
    );
    req.user = {
      userId,
      admin,
    };
    return next();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Authorization failed.', 401));
  }
};
