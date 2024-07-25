const express = require("express");
const Authentication = require("../../Middleware/authentication");
const productsController = new (require("../../Controllers/products/Products.controller"))();
const productValidation = require("../../Middleware/Validators/Product.Validator");
const upload = require("../../Managers/File.Manager").upload;

const router = express.Router();

router
	.route("/")
	.get(Authentication.user, productsController.getAllProductsWebsite)
	.post(productValidation.createProduct, Authentication.user, productsController.createProduct)
	.delete(Authentication.user, productsController.deleteProduct);
router.route("/webhook/delete").post(Authentication.blank, productsController.deleteProductUsingWebhook);
router.route("/details/:id").get(Authentication.user, productsController.getProductById);

router.route("/upload-image").post(upload().single("image"), Authentication.user, productsController.uploadProductImage);
module.exports = router;
