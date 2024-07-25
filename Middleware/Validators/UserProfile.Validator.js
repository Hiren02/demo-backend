const { body } = require("express-validator");

exports.updateDetails = [body("first_name").optional().notEmpty().trim().isLength({ max: 255 }), body("last_name").optional().notEmpty().trim().isLength({ max: 255 })];

exports.createAndUpdateUserAddress = [
	body("address_line_1", "VALIDATION.USER_ADDRESS.ADDRESS_LINE_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("street", "VALIDATION.USER_ADDRESS.STREET_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("house_number", "VALIDATION.USER_ADDRESS.HOUSE_NUMBER_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("city", "VALIDATION.USER_ADDRESS.CITY_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("state", "VALIDATION.USER_ADDRESS.STATE_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("country", "VALIDATION.USER_ADDRESS.COUNTRY_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("country_label", "VALIDATION.USER_ADDRESS.COUNTRY_LABEL_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("zip_code", "VALIDATION.USER_ADDRESS.ZIP_CODE_REQUIRED").notEmpty().isString().trim().isLength({ max: 255 }),
	body("latitude", "VALIDATION.USER_ADDRESS.LATITUDE_REQUIRED").optional().isString().trim().isLength({ max: 255 }),
	body("longitude", "VALIDATION.USER_ADDRESS.LONGITUDE_REQUIRED").optional().isString().trim().isLength({ max: 255 }),
	body("address_type", "VALIDATION.USER_ADDRESS.ADDRESS_TYPE_REQUIRED").notEmpty().isString().trim().toLowerCase().isLength({ max: 255 }),
];
