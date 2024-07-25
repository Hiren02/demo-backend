const { body } = require("express-validator");
const { SIGNUP_METHODS } = require("../../Configs/constants");

exports.signInEmail = [
	// body("deviceType", "deviceType is required").trim().notEmpty(),
	// body("appVersion", "appVersion is required").trim().notEmpty(),
	body("email", "VALIDATION.EMAIL.REQUIRED").notEmpty().trim().isLength({ max: 255 }).isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID"),
	body("password", "VALIDATION.PASSWORD.REQUIRED")
		.trim()
		.notEmpty()
		.isLength({ min: 8, max: 16 })
		.withMessage("VALIDATION.PASSWORD.LENGTH_VALIDATION")
		.isStrongPassword()
		.withMessage("VALIDATION.PASSWORD.TOO_SIMPLE"),
];

exports.validateOtp = [
	body("otp", "VALIDATION.VALIDATE_OTP.REQUIRED").notEmpty().isAlphanumeric().isLength({ min: 4, max: 4 }).withMessage("VALIDATION.VALIDATE_OTP.VALID_LENGTH"),
	body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").trim().isLength({ max: 255 }).notEmpty(),
];
exports.validateOtpAdmin = [
	body("otp", "VALIDATION.VALIDATE_OTP.REQUIRED").notEmpty().isAlphanumeric().isLength({ min: 4, max: 4 }).withMessage("VALIDATION.VALIDATE_OTP.VALID_LENGTH"),
	body("email", "VALIDATION.EMAIL.REQUIRED").trim().isLength({ max: 255 }).notEmpty(),
];

exports.resendOtp = [body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").notEmpty().trim().isLength({ max: 255 })];

exports.signInPhone = [
	// body("deviceType", "deviceType is required").trim().notEmpty(),
	// body("appVersion", "appVersion is required").trim().notEmpty(),
	body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").notEmpty().trim().isLength({ max: 255 }),
	body("password", "VALIDATION.PASSWORD.REQUIRED").trim().notEmpty().isLength({ min: 8 }).withMessage("VALIDATION.PASSWORD.LENGTH_VALIDATION"),
	// body("token", "token is required").trim().notEmpty(),
];

exports.updateUser = [
	body("first_name", "VALIDATION.FIRST_NAME.REQUIRED").trim().isLength({ max: 255 }).optional(),
	body("last_name", "VALIDATION.LAST_NAME.REQUIRED").trim().isLength({ max: 255 }).optional(),
	body("email", "VALIDATION.EMAIL.REQUIRED").optional().notEmpty().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 }),
	body("country_code", "VALIDATION.COUNTRY_CODE.REQUIRED")
		.optional()
		.trim()
		.notEmpty()
		.custom((country_code) => {
			if (!country_code.startsWith("+") || country_code.includes(" ")) {
				throw new Error("VALIDATION.COUNTRY_CODE.VALID");
			}
			return true;
		})
		.isLength({ min: 2, max: 4 }),
	body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").optional().trim().isLength({ max: 255 }),
	body("address").optional().isString().trim().isLength({ max: 255 }),
	body("street").optional().isString().trim().isLength({ max: 255 }),
	body("house_number").optional().isString().trim().isLength({ max: 255 }),
	body("city").optional().isString().trim().isLength({ max: 255 }),
	body("state").optional().isString().trim().isLength({ max: 255 }),
	body("country").optional().isString().trim().isLength({ max: 255 }),
	body("zip_code").optional().isString().trim().isLength({ max: 255 }),
	body("latitude").optional().isString().trim().isLength({ max: 255 }),
	body("longitude").optional().isString().trim().isLength({ max: 255 }),
	body("address_type").optional().isString().trim().isLength({ max: 255 }),
];

exports.signUp = [
	body("first_name", "VALIDATION.FIRST_NAME.REQUIRED").isString().trim().notEmpty().isLength({ max: 255 }),
	body("last_name", "VALIDATION.LAST_NAME.REQUIRED").isString().trim().notEmpty().isLength({ max: 255 }),

	body("email", "VALIDATION.EMAIL.REQUIRED").notEmpty().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 }),

	body("country_code", "VALIDATION.COUNTRY_CODE.REQUIRED")
		.trim()
		.isString()
		.notEmpty()
		.custom((country_code) => {
			if (!country_code.startsWith("+") || country_code.includes(" ")) {
				throw new Error("VALIDATION.COUNTRY_CODE.VALID");
			}
			return true;
		})
		.isLength({ min: 2, max: 4 }),

	body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").isString().notEmpty().trim().isLength({ max: 255 }),

	body("password", "VALIDATION.PASSWORD.REQUIRED")
		.trim()
		.isString()
		.notEmpty()
		.isLength({ min: 8, max: 16 })
		.withMessage("VALIDATION.PASSWORD.LENGTH_VALIDATION")
		.isStrongPassword()
		.withMessage("VALIDATION.PASSWORD.TOO_SIMPLE"),

	body("address").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("street").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("house_number").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("city").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("state").optional().isString().trim().isLength({ max: 255 }),
	body("country").optional().isString().trim().isLength({ max: 255 }),
	body("zip_code").optional().isString().trim().isLength({ max: 255 }),
	body("latitude").optional().isString().trim().isLength({ max: 255 }),
	body("longitude").optional().isString().trim().isLength({ max: 255 }),
	body("address_type").optional().isString().trim().isLength({ max: 255 }),
];

exports.createUserByAdmin = [
	body("first_name", "VALIDATION.FIRST_NAME.REQUIRED").trim().notEmpty().isLength({ max: 255 }),
	body("last_name", "VALIDATION.LAST_NAME.REQUIRED").trim().notEmpty().isLength({ max: 255 }),

	body("email", "VALIDATION.EMAIL.REQUIRED").notEmpty().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 }),

	body("country_code", "VALIDATION.COUNTRY_CODE.REQUIRED")
		.trim()
		.notEmpty()
		.custom((country_code) => {
			if (!country_code.startsWith("+") || country_code.includes(" ")) {
				throw new Error("VALIDATION.COUNTRY_CODE.VALID");
			}
			return true;
		})
		.isLength({ min: 2, max: 4 }),

	body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").trim().notEmpty().isLength({ max: 255 }),

	body("address").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("street").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("house_number").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("city").optional().notEmpty().isString().trim().isLength({ max: 255 }),
	body("state").optional().isString().trim().isLength({ max: 255 }),
	body("country").optional().isString().trim().isLength({ max: 255 }),
	body("zip_code").optional().isString().trim().isLength({ max: 255 }),
	body("latitude").optional().isString().trim().isLength({ max: 255 }),
	body("longitude").optional().isString().trim().isLength({ max: 255 }),
	body("address_type").optional().isString().trim().isLength({ max: 255 }),
];

exports.createAdminByAdmin = [
	body("first_name", "VALIDATION.FIRST_NAME.REQUIRED").trim().notEmpty().isLength({ max: 255 }),
	body("last_name", "VALIDATION.LAST_NAME.REQUIRED").trim().notEmpty().isLength({ max: 255 }),

	body("email", "VALIDATION.EMAIL.REQUIRED").notEmpty().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 }),
];

exports.emailRequired = [body("email", "VALIDATION.EMAIL.REQUIRED").notEmpty().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 })];

exports.resetPassword = [
	body("password", "VALIDATION.PASSWORD.REQUIRED")
		.trim()
		.notEmpty()
		.isLength({ min: 8, max: 16 })
		.withMessage("VALIDATION.PASSWORD.LENGTH_VALIDATION")
		.isStrongPassword()
		.withMessage("VALIDATION.PASSWORD.TOO_SIMPLE"),
	// body("otp", "otp required").trim().notEmpty().isLength({ min: 6, max: 6 }).withMessage("otp must have 4 characters"),
];

exports.changePassword = [
	body("currentPassword", "VALIDATION.CHANGE_PASSWORD.CURRENT_PASSWORD_REQUIRED").trim().notEmpty().isLength({ min: 8 }).withMessage("VALIDATION.CHANGE_PASSWORD.CURRENT_PASSWORD_LENGTH_VALIDATION"),

	body("password", "VALIDATION.CHANGE_PASSWORD.RESET_PASSWORD_REQUIRED")
		.trim()
		.notEmpty()
		.isLength({ min: 8, max: 16 })
		.withMessage("VALIDATION.CHANGE_PASSWORD.NEW_PASSWORD_LENGTH_VALIDATION")
		.isStrongPassword()
		.withMessage("VALIDATION.CHANGE_PASSWORD.TOO_SIMPLE"),
];

exports.verifyForgotPassword = [
	body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").trim().notEmpty(),
	body("country_code", "VALIDATION.COUNTRY_CODE.REQUIRED")
		.trim()
		.notEmpty()
		.custom((country_code) => {
			if (!country_code.startsWith("+") || country_code.includes(" ")) {
				throw new Error("VALIDATION.COUNTRY_CODE.VALID");
			}
			return true;
		})
		.isLength({ min: 2, max: 4 }),
];
exports.verifyForgotPasswordAdmin = [body("email", "VALIDATION.EMAIL.REQUIRED").trim().notEmpty()];

exports.verifyPhoneNumber = [body("phone_number", "VALIDATION.PHONE_NUMBER.REQUIRED").trim().notEmpty(), body("token", "VALIDATION.VERIFY_PHONE_NUMBER.TOKEN_REQUIRED").trim().notEmpty()];

exports.socialSignup = [
	body("first_name", "VALIDATION.FIRST_NAME.REQUIRED").trim().optional().isLength({ max: 255 }),
	body("last_name", "VALIDATION.LAST_NAME.REQUIRED").trim().optional().isLength({ max: 255 }),
	body("email", "VALIDATION.EMAIL.REQUIRED").optional().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 }),
	body("signup_type", "VALIDATION.CHECK_USER_EXISTS.SIGN_UP_TYPE_REQUIRED").notEmpty().trim().toUpperCase().isIn(Object.values(SIGNUP_METHODS)).withMessage("RESPONSE.LOGIN_TYPE.INVALID"),
	body("social_id", "VALIDATION.CHECK_USER_EXISTS.SOCIAL_ID").notEmpty().trim().isLength({ max: 255 }),
];

exports.userCheck = [
	body("email", "VALIDATION.EMAIL.REQUIRED").notEmpty().trim().isEmail().withMessage("VALIDATION.EMAIL.NOT_VALID").isLength({ max: 255 }),
	body("signup_type", "VALIDATION.CHECK_USER_EXISTS.SIGN_UP_TYPE_REQUIRED").notEmpty().trim().toUpperCase().isIn(Object.values(SIGNUP_METHODS)).withMessage("RESPONSE.LOGIN_TYPE.INVALID").isLength({ max: 255 }),
	body("social_id", "VALIDATION.CHECK_USER_EXISTS.SOCIAL_ID").notEmpty().trim().isLength({ max: 255 }),
];
