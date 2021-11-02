module.exports.errMsgs = {
  ERR_MSG_DEFAULT: 'A server error happened',
  ERR_MSG_LOGIN: 'Wrong email or password',
  ERR_MSG_BAD_DATA: (name) => `Bad ${name} data`,
  ERR_MSG_NOT_FOUND: (name) => `Requested ${name} not found`,
  ERR_MSG_NOT_CREATED: (name) => `Requested ${name} not created`,
  ERR_MSG_NOT_UPDATED: (name) => `Requested ${name} not updated`,
};

module.exports.resMsgs = {
  RES_MSG_CARD_DELETED: 'Post successfully deleted',
};

module.exports.errNames = {
  VALIDATION: 'ValidationError',
  CAST: 'CastError',
  NOT_FOUND: 'DocumentNotFoundError',
};

module.exports.errCodes = {
  ERR_CODE_BAD_DATA: 400,
  ERR_CODE_NOT_AUTH: 401,
  ERR_CODE_NOT_FOUND: 404,
  ERR_CODE_DEFAULT: 500,
};

module.exports.errors = {
  [this.errNames.VALIDATION]: this.errCodes.ERR_CODE_BAD_DATA,
  [this.errNames.CAST]: this.errCodes.ERR_CODE_BAD_DATA,
  [this.errNames.NOT_FOUND]: this.errCodes.ERR_CODE_NOT_FOUND,
};

module.exports.sendErrRes = (res, errCode, errMsg) => {
  res.status(errCode).send({ message: errMsg });
};

module.exports.jwtKey = '7Bfp29Lifm!fnpw6ZqP6290nat';
