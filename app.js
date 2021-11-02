const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { sendErrRes, errCodes, errMsgs } = require('./utils/utils');
const { handleErrors } = require('./middlewares/error');
const { createUser, login } = require('./controllers/users');

const { PORT } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

// body-parser is built-in with latest express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// temp authorization
app.use((req, res, next) => {
  req.user = {
    _id: '617f6c3de9dff5d1ecc71752',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_NOT_FOUND('page'));
});
app.use(handleErrors);

app.listen(PORT);
