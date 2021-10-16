module.exports.errMsgs = {
  ERR_MSG_BAD_DATA: 'Bad data',
  ERR_MSG_USR_NOT_FOUND: 'Requested user not found',
  ERR_MSG_USR_NOT_CREATED: 'Requested user not created',
  ERR_MSG_DEFAULT: 'A server error happened',
};

module.exports.errNames = {
  VALIDATION: 'ValidationError',
  CAST: 'CastError',
};

module.exports.errCodes = {
  ERR_CODE_BAD_DATA: 400,
  ERR_CODE_NOT_FOUND: 404,
  ERR_CODE_DEFAULT: 500,
};

module.exports.sendErrRes = (res, errCode, errMsg) => {
  res.status(errCode).send({ message: errMsg });
};
