const User = require('../models/user');
const {
  errCodes,
  errNames,
  errMsgs,
  sendErrRes,
} = require('../utils/utils');

// GET /users/
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message));
};

// GET /users/:userId
module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  User.findById(userId)
    .orFail(() => {
      const error = new Error(errMsgs.ERR_MSG_USR_NOT_FOUND);
      error.code = errCodes.ERR_CODE_NOT_FOUND;
      error.name = errNames.NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === errNames.CAST) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
      }
      if (err.name === errNames.NOT_FOUND) {
        return sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_USR_NOT_FOUND);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};

// POST /users/
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === errNames.VALIDATION) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_USR_NOT_CREATED);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};

// PATCH /users/me — updates profile
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  if (!name || !about || !_id) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error(errMsgs.ERR_MSG_USR_NOT_FOUND);
      error.code = errCodes.ERR_CODE_NOT_FOUND;
      error.name = errNames.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === errNames.CAST) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
      }
      if (err.name === errNames.NOT_FOUND) {
        return sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_USR_NOT_FOUND);
      }
      if (err.name === errNames.VALIDATION) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_USR_NOT_UPDATED);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};

// PATCH /users/me/avatar — updated avatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar || !_id) {
    sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
    return;
  }

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error(errMsgs.ERR_MSG_USR_NOT_FOUND);
      error.code = errCodes.ERR_CODE_NOT_FOUND;
      error.name = errNames.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === errNames.CAST) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_BAD_DATA);
      }
      if (err.name === errNames.NOT_FOUND) {
        return sendErrRes(res, errCodes.ERR_CODE_NOT_FOUND, errMsgs.ERR_MSG_USR_NOT_FOUND);
      }
      if (err.name === errNames.VALIDATION) {
        return sendErrRes(res, errCodes.ERR_CODE_BAD_DATA, errMsgs.ERR_MSG_USR_NOT_UPDATED);
      }
      return sendErrRes(res, errCodes.ERR_CODE_DEFAULT, err.message);
    });
};
