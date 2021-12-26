const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/NotAuthError');
const { errMsgs, jwtDevKey } = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt || '';

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtDevKey);
  } catch (error) {
    throw new NotAuthError(errMsgs.ERR_MSG_AUTH_REQ);
  }

  req.user = payload;
  next();
};
