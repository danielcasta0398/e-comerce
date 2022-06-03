const express = require('express');
const {
  getAllUsers,
  createUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  meProducts,
  orderUser,
} = require('../controllers/userController');
const {
  userExists,
  protectToken,
  protectDeleteUser,
} = require('../middlewares/usersMiddlewares');
const {
  validationDateUsers,
  checkValidation,
  validationUpdateUsers,
} = require('../middlewares/validationMiddlewares');
const router = express.Router();

router.post('/', validationDateUsers, checkValidation, createUsers);

router.post('/login', login);

router.use(protectToken);

router.get('/', getAllUsers);
router.get('/me', meProducts);
router.get('/orders', orderUser);

router
  .route('/:id')
  .get(userExists, getUserById)
  .patch(userExists, validationUpdateUsers, checkValidation, updateUser)
  .delete(userExists, protectDeleteUser, deleteUser);

module.exports = { userRoutes: router };
