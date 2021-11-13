const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  sendErrRes,
  errCodes,
  errMsgs,
  limiterValues,
} = require('./utils/utils');
const { handleErrors } = require('./middlewares/error');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const {
  validateLogin,
  validateCreateUser,
} = require('./middlewares/valid');

const { PORT } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: limiterValues.windowMs,
  max: limiterValues.max, // limit each IP to max requests per windowMs
});

const app = express();

app.use(limiter); // basic ddos prevention

// body-parser is built-in with latest express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth); // enable authentication for next routes

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_NOT_FOUND('page'));
});
app.use(handleErrors);

app.listen(PORT);
