const { errCodes } = require('../utils/utils');

module.exports = class BadDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errCodes.ERR_CODE_BAD_DATA;
  }
};
