const { body, query } = require("express-validator");

exports.queryId = [
	query("cart_id", "VALIDATION.CART.ID").notEmpty().trim(),
	query("product_id", "VALIDATION.PRODUCT.ID").notEmpty().trim(),
	query("cart_product_id", "VALIDATION.CART.CART_PRODUCT_ID").notEmpty().trim(),
];

exports.addCart = [
	body("product_id", "VALIDATION.PRODUCT.ID").notEmpty().trim(),
	body("quantity", "VALIDATION.PRODUCT.QUANTITY").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.QUANTITY"),
	body("variant_id", "VALIDATION.CART.VARIANT_ID").notEmpty().isNumeric().withMessage("VALIDATION.CART.VARIANT_ID"),
];

exports.updateCart = [...this.queryId, body("quantity", "VALIDATION.PRODUCT.QUANTITY").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.QUANTITY")];

exports.deleteCartProduct = [...this.queryId];
