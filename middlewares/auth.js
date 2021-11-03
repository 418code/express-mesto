const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');
const { errMsgs, jwtKey } = require('../utils/utils');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError(errMsgs.ERR_MSG_AUTH_REQ);
  }

  const token = authorization.replace('Bearer ', '');

  const payload = jwt.verify(token, jwtKey);

  if (!payload) {
    throw new NotAuthError(errMsgs.ERR_MSG_AUTH_REQ);
  }

  req.user = payload;
  next();
};
