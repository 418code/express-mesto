require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const {
  limiterValues,
  corsOptions,
} = require('./utils/utils');
const { handleErrors } = require('./middlewares/error');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
const router = require('./routes/index');

const { PORT } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: limiterValues.windowMs,
  max: limiterValues.max, // limit each IP to max requests per windowMs
});

const app = express();

app.use(cors(corsOptions));
app.use(express.json()); // body-parser is built-in with latest express
app.use(requestLogger); // log incoming requests excluding body
app.use(limiter); // basic ddos prevention
app.use(router);
app.use(errorLogger); // log errors before handling it
app.use(handleErrors);

app.listen(PORT);
