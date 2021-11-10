const { isCelebrateError } = require('celebrate');
const {
  sendErrRes,
  errCodes,
  errMsgs,
  errNames,
  errors,
} = require('../utils/utils');

// eslint-disable-next-line
module.exports.handleErrors = (err, req, res, next) => {
  const errorNames = Object.keys(errors);

  // catch celebrate validation errors
  if (isCelebrateError(err)) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA('entered'));
  } else if (errorNames.includes(err.name)) {
    sendErrRes(res, errors[err.name], err.message);
  } else if (err.name === errNames.MONGO && err.code === errCodes.ERR_CODE_MDB_DUPLICATE) {
    sendErrRes(res, errCodes.ERR_CODE_CONFLICT, errMsgs.ERR_MSG_NOT_CREATED('user'));
  } else {
    sendErrRes(res, errCodes.ERR_CODE_DEFAULT, errMsgs.ERR_MSG_DEFAULT);
  }
};
