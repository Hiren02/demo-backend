const express = require("express");
const Authentication = require("../../Middleware/authentication");
const orderController = new (require("../../Controllers/order/Order.controller"))();
const orderValidation = require("../../Middleware/Validators/Order.Validator");

const router = express.Router();

router.route("/").get(Authentication.user, orderController.getOrderListByUser).post(orderValidation.createOrder, Authentication.user, orderController.createOrder);
router.route("/detail").get(Authentication.user, orderController.getOrderDetail);
router.route("/shipping").post(orderValidation.orderDetails, Authentication.user, orderController.calculateShipping);
router.route("/webhook/update").post(Authentication.blank, orderController.updateOrderStatus);
module.exports = router;
