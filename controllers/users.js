const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const {
  errMsgs,
  errNames,
  jwtKey,
  cookieMaxAge,
} = require('../utils/utils');
const NotFoundError = require('../errors/NotFoundError');
const BadDataError = require('../errors/BadDataError');
const NotAuthError = require('../errors/NotAuthError');

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

  if (!userId) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
  }

  User.findById(userId)
    .orFail((err) => {
      if (err.name === errNames.CAST) {
        return new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
      }
      return new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user'));
    })
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

  if (!email || !password) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
  }

  if (!validator.isEmail(email)) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('email'));
  }

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

  if (!name || !about || !_id) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
  }

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail((err) => {
      if (err.name === errNames.CAST) {
        return new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
      }
      if (err.name === errNames.VALIDATION) {
        return new BadDataError(errMsgs.ERR_MSG_NOT_UPDATED('user'));
      }
      return new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// PATCH /users/me/avatar — updated avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar || !_id) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
  }

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail((err) => {
      if (err.name === errNames.CAST) {
        return new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
      }
      if (err.name === errNames.VALIDATION) {
        return new BadDataError(errMsgs.ERR_MSG_NOT_UPDATED('user'));
      }
      return new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password && validator.isEmail(email))) {
    throw new NotAuthError(errMsgs.ERR_MSG_LOGIN);
  }

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
