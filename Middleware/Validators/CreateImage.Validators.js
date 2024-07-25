const { body } = require("express-validator");
const { STYLE_LIST, SIZE_LIST } = require("../../Configs/constants");

exports.createImageValidator = [
	body("prompt", "VALIDATION.CREATE_IMAGE.PROMPT_REQUIRED").notEmpty().isString().trim().isLength({ max: 1000 }).withMessage("VALIDATION.CREATE_IMAGE.INVALID_PROMPT_LENGTH"),
	body("style").optional().isString().withMessage("VALIDATION.CREATE_IMAGE.PROVIDE_VALID_STYLE").trim().isIn(STYLE_LIST).withMessage("VALIDATION.CREATE_IMAGE.PROVIDE_VALID_STYLE"),
	body("size").optional().isString().withMessage("VALIDATION.CREATE_IMAGE.SIZE").trim().isIn(SIZE_LIST).withMessage("VALIDATION.CREATE_IMAGE.SIZE_VALID"),
];
