const { errCodes, errNames } = require('../utils/utils');

module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = errCodes.ERR_CODE_CONFLICT;
    this.name = errNames.CONFLICT;
  }
};
