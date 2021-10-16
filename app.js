const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');

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
    _id: '6167972cd2b8bcda36846f3a',
  };

  next();
});

app.use('/users', userRouter);

app.listen(PORT);
