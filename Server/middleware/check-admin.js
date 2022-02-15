const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (!req.user.admin) throw new HttpError('Authorization failed.', 401);
  return next();
};
