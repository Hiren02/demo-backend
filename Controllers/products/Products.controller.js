const fs = require("fs");
const path = require("path");

const { Api } = require("../../Utils/ApiHelper");
const productsModel = new (require("../../Models/Product.Model"))();

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async getAllProducts(req, res) {
		try {
			const products = await productsModel.productsFilter(req.query.limit, req.query.page, "DESC", "created_at", req.query.category, req.query.search);
			return res.handler.success(products);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async getAllProductsWebsite(req, res) {
		try {
			const products = await productsModel.productsFilter(req.query.limit, req.query.page, "DESC", "created_at", req.query.category, req.query.search, true);
			return res.handler.success(products);
		} catch (err) {
			res.serverError(err);
		}
	}

	async createProduct(req, res) {
		try {
			const product = await new Api().post(`/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`, { data: req.body });
			if (!product) return res.handler.badRequest("STATUS.NOT_VALID_DATA");

			const recreatedProduct = await productsModel.createProduct([product]);
			if (!recreatedProduct) return res.handler.badRequest("STATUS.NOT_VALID_DATA");

			return res.handler.success(recreatedProduct?.[0] || {}, "SUCCESS_MESSAGES.PRODUCT_CREATED");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getProductById(req, res) {
		if (!req.params.id) return res.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");
		try {
			const product = await productsModel.getProductById(req.params.id);

			if (!product) return res.handler.notFound(undefined, "RESPONSE.PRODUCTS.PRODUCT_NOT_FOUND");

			return res.handler.success(product);
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async deleteProduct(req, res) {
		if (!req.query?.id) return res.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");
		try {
			await new Api().delete(`/shops/${process.env.PRINTIFY_SHOP_ID}/products/${req.query.id}.json`);
			await productsModel.deleteProductById(req.query.id);
			return res.handler.success();
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async deleteProductUsingWebhook(req, res) {
		try {
			const { resource } = req.body || {};
			const { id } = resource || {};
			await productsModel.deleteProductById(id);
			return res.handler.success();
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async uploadProductImage(req, res) {
		try {
			const payload = {
				file_name: req.file.filename,
				url: `${process.env.BASE_URL}Images/users/profile/${req.file.filename}`,
			};

			const image = await new Api().post("/uploads/images.json", { data: payload });

			if (!image) return res.handler.badRequest("STATUS.NOT_VALID_DATA");

			res.handler.success(image);

			fs.unlink(path.join(__dirname, "./../../Assets/Images/users/profile/" + req.file.filename), function (err) {
				if (err) console.log(err);
			});
		} catch (error) {
			res.handler.serverError(error);
			fs.unlink(path.join(__dirname, "./../../Assets/Images/users/profile/" + req.file.filename), function (err) {
				if (err) console.log(err);
			});
		}
	}
};
