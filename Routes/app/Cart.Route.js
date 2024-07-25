const express = require("express");
const Authentication = require("../../Middleware/authentication");
const cartController = new (require("../../Controllers/cart/cart.controller"))();
const cartValidation = require("../../Middleware/Validators/Cart.Validator");

const router = express.Router();

router
	.route("/")
	.get(Authentication.user, cartController.getCart)
	.post(cartValidation.addCart, Authentication.user, cartController.addCart)
	.put(cartValidation.updateCart, Authentication.user, cartController.updateCart)
	.delete(cartValidation.deleteCartProduct, Authentication.user, cartController.deleteCartProduct);

module.exports = router;
