const { errCodes, errMsgs, errNames } = require('../utils/utils');

module.exports = class ForbiddenError extends Error {
  constructor() {
    super(errMsgs.ERR_MSG_FORBIDDEN);
    this.statusCode = errCodes.ERR_CODE_FORBIDDEN;
    this.name = errNames.FORBIDDEN;
  }
};
