const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { sendErrRes, errCodes, errMsgs } = require('./utils/utils');

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
    _id: '616a5d4bd444ac5c8caae508',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_PAGE_NOT_FOUND);
});

app.listen(PORT);
