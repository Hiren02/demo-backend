const express = require("express");
const Authentication = require("../../Middleware/authentication");
const productsController = new (require("../../Controllers/products/Products.controller"))();
const CommonController = new (require("../../Controllers/common/Common.controller"))();

const router = express.Router();

router.route("/").get(Authentication.admin, productsController.getAllProducts).delete(Authentication.admin, productsController.deleteProduct);
router.route("/details/:id").get(Authentication.admin, productsController.getProductById);
router.route("/category").get(Authentication.admin, CommonController.getCategoryList);

module.exports = router;
