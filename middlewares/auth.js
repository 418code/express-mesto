const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');
const { errMsgs, jwtKey } = require('../utils/utils');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt || '';

  let payload;

  try {
    payload = jwt.verify(token, jwtKey);
  } catch (error) {
    throw new NotAuthError(errMsgs.ERR_MSG_AUTH_REQ);
  }

  req.user = payload;
  next();
};
