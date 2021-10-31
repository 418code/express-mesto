const {
  sendErrRes,
  errCodes,
  errMsgs,
  errors,
} = require('../utils/utils');

// eslint-disable-next-line
module.exports.handleErrors = (err, req, res, next) => {
  const errorNames = Object.keys(errors);

  if (errorNames.includes(err.name)) {
    sendErrRes(res, errors[err.name], err.message);
  } else {
    sendErrRes(res, errCodes.ERR_CODE_DEFAULT, errMsgs.ERR_MSG_DEFAULT);
  }
};
