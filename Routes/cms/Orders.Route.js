const express = require("express");
const Authentication = require("../../Middleware/authentication");
const orderController = new (require("../../Controllers/order/Order.controller"))();

const router = express.Router();

router.route("/").get(Authentication.admin, orderController.getAllOrderList);
router.route("/detail").get(Authentication.admin, orderController.getOrderDetail);

module.exports = router;
