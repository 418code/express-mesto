const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar/', updateAvatar);

module.exports = router;
