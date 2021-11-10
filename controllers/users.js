const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  errMsgs,
  jwtKey,
  cookieMaxAge,
} = require('../utils/utils');
const NotFoundError = require('../errors/NotFoundError');
const BadDataError = require('../errors/BadDataError');

// GET /users/
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('users')))
    .then((users) => res.send(users))
    .catch(next);
};

// GET /users/:userId
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user')))
    .then((user) => res.send(user))
    .catch(next);
};

// GET /users/me
module.exports.getUserInfo = (req, res, next) => {
  req.params.userId = req.user._id;
  this.getUser(req, res, next);
};

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new BadDataError(errMsgs.ERR_MSG_NOT_CREATED('user'));
      }
      res.send(user);
    })
    .catch(next);
};

// PATCH /users/me — updates profile
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail(() => NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user')))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// PATCH /users/me/avatar — updated avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail(() => NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user')))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtKey, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: cookieMaxAge,
        httpOnly: true,
      })
        .end();
    })
    .catch(next);
};
