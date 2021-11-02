const { errCodes } = require('../utils/utils');

module.exports = class NotAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errCodes.ERR_CODE_NOT_AUTH;
  }
};
