const express = require('express');
const { addProductCart, updateCart, cartProductDelete, purchase } = require('../controllers/cartController');
const { cartExists } = require('../middlewares/cartMiddlewares');
const { protectToken } = require('../middlewares/usersMiddlewares');

const router = express.Router();

router.use(protectToken)
router.post('/add-product', cartExists, addProductCart)
router.patch('/update-cart', cartExists,  updateCart)
router.delete('/:productId', cartExists, cartProductDelete)
router.post('/purchase', cartExists, purchase)

module.exports = { cartRoutes:router}