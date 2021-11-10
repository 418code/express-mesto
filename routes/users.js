const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validateGetUser,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/valid');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateGetUser, getUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar/', validateUpdateAvatar, updateAvatar);

module.exports = router;
