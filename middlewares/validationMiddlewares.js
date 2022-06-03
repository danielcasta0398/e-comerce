const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const { AppError } = require('../utils/appError');

const validationDateUsers = [
  body('userName').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Email not valid'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be Empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const validationUpdateUsers = [
  body('email').isEmail().withMessage('Email not valid'),
];

const validationCreateProduct = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty')
    .isInt()
    .withMessage('Enter only number in price'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isInt()
    .withMessage('Enter only number in quantity'),
];


const checkValidation = (req, res, next) => {
  const errors = validationResult(req);

  const msg = errors.array().map(({ msg }) => msg);

  const errorMsg = msg.join('. ');

  if (!errors.isEmpty()) {
    return next(new AppError(errorMsg, 400));
  }
  next();
};

module.exports = {
  validationDateUsers,
  validationUpdateUsers,
  validationCreateProduct, 
  checkValidation,
};
