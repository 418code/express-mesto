const rateLimit = require('express-rate-limit');
const { limiterValues } = require('../utils/utils');

const limiter = rateLimit({
  windowMs: limiterValues.windowMs,
  max: limiterValues.max, // limit each IP to max requests per windowMs
});

module.exports = limiter;
