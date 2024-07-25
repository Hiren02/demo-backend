const { body } = require("express-validator");

exports.createProduct = [
	body("title", "VALIDATION.PRODUCT.TITLE").notEmpty().trim(),
	body("description", "VALIDATION.PRODUCT.DESCRIPTION").notEmpty().trim(),
	body("blueprint_id", "VALIDATION.PRODUCT.BLUE_PRINT_ID").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.VALID_BLUE_PRINT_ID"),
	body("print_provider_id", "VALIDATION.PRODUCT.PRINT_PROVIDER_ID").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.VALID_PRINT_PROVIDER_ID"),
	body("variants.*.id", "VALIDATION.PRODUCT.VARIANT_ID").notEmpty().isNumeric(),
	body("variants.*.price", "VALIDATION.PRODUCT.VARIANT_PRICE").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.VALID_PRICE"),
	body("variants.*.is_enabled", "VALIDATION.PRODUCT.VARIANT_ENABLE").notEmpty().isBoolean(),
	body("print_areas.*.variant_ids", "VALIDATION.PRODUCT.VARIANTS_IDS").notEmpty().isArray(),
	body("print_areas.*.placeholders.*.position", "VALIDATION.PRODUCT.POSITION").notEmpty().trim(),
	body("print_areas.*.placeholders.*.images.*.id", "VALIDATION.PRODUCT.IMAGE_ID").notEmpty().trim(),
	body("print_areas.*.placeholders.*.images.*.height", "VALIDATION.PRODUCT.IMAGE_HEIGHT").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.IMAGE_WIDTH"),
	body("print_areas.*.placeholders.*.images.*.width", "VALIDATION.PRODUCT.IMAGE_WIDTH").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.IMAGE_WIDTH"),
	body("print_areas.*.placeholders.*.images.*.x", "VALIDATION.PRODUCT.IMAGE_X").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.IMAGE_X"),
	body("print_areas.*.placeholders.*.images.*.y", "VALIDATION.PRODUCT.IMAGE_Y").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.IMAGE_Y"),
	body("print_areas.*.placeholders.*.images.*.scale", "VALIDATION.PRODUCT.IMAGE_SCALE").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.IMAGE_SCALE"),
	body("print_areas.*.placeholders.*.images.*.angle", "VALIDATION.PRODUCT.IMAGE_ANGLE").notEmpty().isNumeric().withMessage("VALIDATION.PRODUCT.IMAGE_ANGLE"),
];

exports.updateProducts = [
	body("product_name").optional().isString().withMessage("VALIDATION.TYPE.INVALID_STRING").trim().isLength({ max: 255 }),
	body("product_description").optional().isString().withMessage("VALIDATION.TYPE.INVALID_STRING").trim(),
	body("price").optional().isNumeric().withMessage("VALIDATION.TYPE.INVALID_NUMBER"),
	body("product_type").optional().isNumeric().withMessage("VALIDATION.TYPE.INVALID_NUMBER"),
	body("is_active").optional().isBoolean().withMessage("VALIDATION.TYPE.INVALID_BOOLEAN"),
];
