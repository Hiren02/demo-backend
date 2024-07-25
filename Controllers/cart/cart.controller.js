const { Api } = require("../../Utils/ApiHelper");
const cartDetailsModel = new (require("../../Models/CartDetails.Model"))();
const cartProductsModel = new (require("../../Models/CartProducts.Model"))();
const productsModel = new (require("../../Models/Product.Model"))();

module.exports = class {
	async addCart(req, res) {
		try {
			let cartDetails = await cartDetailsModel.findCartDetailsByUser(req.user.id);

			if (!cartDetails) {
				cartDetails = await cartDetailsModel.createCartDetails({ user_id: req.user.id, created_by: req.user.id });
			}

			const variantDetail = await productsModel.getVariantDetail({ id: req.body.variant_id, product_id: req.body.product_id });

			if (!variantDetail) return res.handler.badRequest("VALIDATION.NOT_FOUND.VARIANT");

			const addedCart = await cartProductsModel.createCartProduct({
				product_id: req.body.product_id,
				cart_id: cartDetails.id,
				price: variantDetail?.price,
				quantity: req.body.quantity,
				variant_id: req.body.variant_id,
				created_by: req.user.id,
			});

			return res.handler.success(addedCart, "SUCCESS_MESSAGES.ADD_CART");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async updateCart(req, res) {
		try {
			const updatedCart = await cartProductsModel.updateCartProduct(
				{ cart_id: req.query.cart_id, id: req.query.cart_product_id, product_id: req.query.product_id },
				{ ...req.body, updated_by: req.user.id, update_at: new Date() }
			);
			res.handler.success(updatedCart);
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async deleteCartProduct(req, res) {
		try {
			const deletedCart = await cartProductsModel.deleteCartProduct(req.query.cart_id, req.query.cart_product_id, req.query.product_id);

			if (!deletedCart) return res.handler.badRequest("STATUS.NOT_VALID_DATA");

			res.handler.success(deletedCart, "SUCCESS_MESSAGES.DELETE_CART_PRODUCT");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getCart(req, res) {
		try {
			const cartDetail = await cartDetailsModel.getCartDetails(req.user.id);

			if (!cartDetail) return res.handler.badRequest("STATUS.NOT_VALID_DATA");

			return res.handler.success(cartDetail?.[0] || []);
		} catch (error) {
			res.handler.serverError(error);
		}
	}
};
