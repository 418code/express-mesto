require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  errMsgs,
  limiterValues,
  corsOptions,
} = require('./utils/utils');
const { handleErrors } = require('./middlewares/error');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const {
  validateLogin,
  validateCreateUser,
} = require('./middlewares/valid');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

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

// body-parser is built-in with latest express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// log incoming requests excluding body
app.use(requestLogger);

app.use(limiter); // basic ddos prevention

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth); // enable authentication for next routes

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('page')));
});

// error processing logic
// log errors before handling it
app.use(errorLogger);
app.use(handleErrors);

app.listen(PORT);
