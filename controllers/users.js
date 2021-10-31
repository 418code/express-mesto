const User = require('../models/user');
const {
  errMsgs,
  errNames,
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

// POST /users/
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    throw new BadDataError(errMsgs.ERR_MSG_BAD_DATA('user'));
  }

  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        Promise.reject(new BadDataError(errMsgs.ERR_MSG_NOT_CREATED('user')));
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
