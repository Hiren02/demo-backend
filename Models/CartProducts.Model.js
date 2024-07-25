const { cart_products: cartProductsSchema } = require("../Database/Schemas");

module.exports = class {
	createCartProduct(data) {
		return cartProductsSchema.create(data);
	}

	updateCartProduct(condition, data) {
		return cartProductsSchema.update(data, { where: condition });
	}

	deleteCartProduct(cart_id, id, product_id) {
		return cartProductsSchema.destroy({ where: { cart_id, id, product_id } });
	}
};
