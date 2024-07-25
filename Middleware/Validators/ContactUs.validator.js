const { body } = require("express-validator");

exports.contactUsValidator = [
	body("email", "VALIDATION.EMAIL.REQUIRED").notEmpty().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 }),
	body("subject", "VALIDATION.CONTACT_US.SUBJECT").notEmpty().isString().trim().isLength({ max: 255 }),
	body("message", "VALIDATION.CONTACT_US.MESSAGE").notEmpty().isString().trim().isLength({ max: 100000 }),
];
