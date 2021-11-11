const { errCodes, errNames } = require('../utils/utils');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errCodes.ERR_CODE_NOT_FOUND;
    this.name = errNames.NOT_FOUND;
  }
};
