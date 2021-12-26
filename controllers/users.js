const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  errMsgs,
  errNames,
  errCodes,
  jwtDevKey,
} = require('../utils/utils');
const NotFoundError = require('../errors/NotFoundError');
const BadDataError = require('../errors/BadDataError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

// GET /users/
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('users')))
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// GET /users/:userId
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user')))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// GET /users/me
module.exports.getUserInfo = (req, res, next) => {
  req.params.userId = req.user._id;
  this.getUser(req, res, next);
};

// POST /signup
module.exports.createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  const hash = await bcrypt.hash(password, 10);
  // eslint-disable-next-line
  const user = User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  }, (err, usr) => {
    try {
      if (err && err.name === errNames.MONGO && err.code === errCodes.ERR_CODE_MDB_DUPLICATE) {
        throw new ConflictError(errMsgs.ERR_MSG_NOT_CREATED('user'));
      } else if (!usr) {
        throw new BadDataError(errMsgs.ERR_MSG_NOT_CREATED('user'));
      } else {
        res.send({ data: { email } });
      }
    } catch (error) {
      next(error);
    }
  });
};

// PATCH /users/me — updates profile
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail(() => NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('user')))
    .then((user) => {
      res.send({ data: user });
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
      res.send({ data: user });
    })
    .catch(next);
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : jwtDevKey, { expiresIn: '7d' });
      res.send({ token })
        .end();
    })
    .catch(next);
};
