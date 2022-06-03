const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Cart } = require('../models/cartsModel');
const { Order } = require('../models/ordersModel');
const { ProductInCart } = require('../models/productsInCartModel');
const { Product } = require('../models/productsModel');

const { User } = require('../models/userModel');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });

  res.status(200).json({
    users,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({ user });
});

const createUsers = catchAsync(async (req, res, next) => {
  const { userName, email, password, role, status } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    userName,
    email,
    password: hashPassword,
    role,
    status,
  });

  //Remove password from response

  newUser.password = undefined;

  res.status(200).json({ newUser });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { userName, email } = req.body;
  const { id } = req.session;

  if (user.id !== id) {
    return next(new AppError('You can only update your own data', 403));
  }

  if (!userName && !email) {
    return next(new AppError('I do not enter any data', 400));
  }

  await user.update({ userName, email });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'sucess',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate that user exists with given email

  const user = await User.findOne({ where: { email, status: 'active' } });

  //Compare password with db

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Credentials invalid', 400));
  }

  //Generate JWT

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const meProducts = catchAsync(async (req, res, next) => {
  const { id: userId } = req.session;
  const products = await Product.findAll({ where: { userId } });

  if (products.length === 0) {
    return next(new AppError('No exists product', 404));
  }
  
  res.status(200).json({ products });
});

const orderUser = catchAsync(async (req, res, next) => {
  const { id: userId } = req.session;

  const orders = await Order.findAll({
    where: { userId },
    include: [{ model: Cart, include: [{ model: ProductInCart }] }],
  });

  /*if (orders.length === 0) {
    return next(new AppError('You have no orders', 404));
  }*/
  console.log(orders);
  console.log(userId);
  res.status(200).json({ orders });
});

module.exports = {
  getAllUsers,
  createUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  meProducts,
  orderUser,
};
