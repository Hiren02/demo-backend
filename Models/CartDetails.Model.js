const { cart_details: cartDetailsSchema, cart_products: cartProductsSchema, products: productsSchema, product_images: productImagesSchema } = require("../Database/Schemas");

module.exports = class {
	createCartDetails(data) {
		return cartDetailsSchema.create(data);
	}

	deleteUserCartDetails(id) {
		return cartDetailsSchema.destroy({ where: { user_id: id } });
	}

	getCartDetails(id) {
		return cartDetailsSchema.findAll({
			where: { user_id: id },
			include: [
				{
					model: cartProductsSchema,
					include: [
						{
							model: productsSchema,
							as: "productDetails",
							include: [
								{
									model: productImagesSchema,
									as: "images",
									limit: 1,
								},
							],
						},
					],
				},
			],
		});
	}

	findCartDetailsByUser(id) {
		return cartDetailsSchema.findOne({ where: { user_id: id } });
	}

	updateCartDetails(id, data) {
		return cartDetailsSchema.update(data, { where: { id } });
	}
};
