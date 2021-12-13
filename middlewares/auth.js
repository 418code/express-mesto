const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');
const { errMsgs, jwtKey } = require('../utils/utils');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  let payload;

  try {
    token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, jwtKey);
  } catch (error) {
    throw new NotAuthError(errMsgs.ERR_MSG_AUTH_REQ);
  }

  req.user = payload;
  next();
};
