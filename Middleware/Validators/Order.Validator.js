const { body, query } = require("express-validator");

exports.queryId = [query("id", "VALIDATION.PARAMS.ID_NOT_FOUND").notEmpty().trim()];

exports.orderDetails = [
	body("address_to.*.first_name", "VALIDATION.ORDER.FIRST_NAME").notEmpty().trim(),
	body("address_to.*.last_name", "VALIDATION.ORDER.LAST_NAME").notEmpty().trim(),
	body("address_to.*.email", "VALIDATION.ORDER.EMAIL").notEmpty().trim(),
	body("address_to.*.phone", "VALIDATION.ORDER.PHONE").notEmpty().trim(),
	body("address_to.*.country", "VALIDATION.ORDER.COUNTRY").notEmpty().trim(),
	body("address_to.*.region", "VALIDATION.ORDER.REGION").trim(),
	body("address_to.*.address1", "VALIDATION.ORDER.ADDRESS1").notEmpty().trim(),
	body("address_to.*.address2", "VALIDATION.ORDER.ADDRESS2").notEmpty().trim(),
	body("address_to.*.city", "VALIDATION.ORDER.CITY").notEmpty().trim(),
	body("address_to.*.zip", "VALIDATION.ORDER.ZIP").notEmpty().trim(),

	body("line_items.*.product_id", "VALIDATION.ORDER.PRODUCT_ID").notEmpty().trim(),
	body("line_items.*.variant_id", "VALIDATION.ORDER.VARIANT_ID").notEmpty().isNumeric().withMessage("VALIDATION.ORDER.VARIANT_ID"),
	body("line_items.*.quantity", "VALIDATION.ORDER.QUANTITY").notEmpty().isNumeric().withMessage("VALIDATION.ORDER.QUANTITY"),
];

exports.createOrder = [
	...this.orderDetails,
	body("external_id", "VALIDATION.ORDER.EXTERNAL_ID").notEmpty().trim(),
	body("label", "VALIDATION.ORDER.LABEL").notEmpty().trim(),
	body("shipping_method", "VALIDATION.ORDER.SHIPPING_METHOD").notEmpty().isNumeric(),
	body("is_printify_express", "VALIDATION.ORDER.IS_PRINTIFY_EXPRESS").notEmpty().isBoolean(),
	body("is_economy_shipping", "VALIDATION.ORDER.IS_ECONOMY_SHIPPING").notEmpty().isBoolean(),
	body("send_shipping_notification", "VALIDATION.ORDER.NOTIFICATION").notEmpty().isBoolean(),
	body("user_address_id", "VALIDATION.ORDER.USER_ADDRESS_ID").notEmpty().isNumeric(),
];
