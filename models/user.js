const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { errMsgs } = require('../utils/utils');
const NotAuthError = require('../errors/NotAuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    minlength: 5,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  const loginError = new NotAuthError(errMsgs.ERR_MSG_LOGIN);
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw loginError;
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw loginError;
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
