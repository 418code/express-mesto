const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/valid');
const NotFoundError = require('../errors/NotFoundError');
const { errMsgs } = require('../utils/utils');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);
router.use(auth); // enable authentication for next routes
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => next(new NotFoundError(errMsgs.ERR_MSG_NOT_FOUND('page'))));

module.exports = router;
