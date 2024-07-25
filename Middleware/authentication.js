const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const cache = require("../Configs/nodeCache.config");
const { USER_TYPE, USER_TYPE_ENUM } = require("../Configs/constants");
const EncryptionHandler = require("../Configs/encrypt");
const userModel = new (require("../Models/User.Model"))();

module.exports = class Authentication {
	static async all(req, res, next, userTypes = [USER_TYPE.USER, USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN]) {
		try {
			//Check error if exist then send validationError
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.handler.validationError(undefined, `${errors.errors[0].msg}`);
			}

			//If no Authentication required means userTypes = []
			if (userTypes.length == 0) return next();

			//Get & check authToken if not exist then send unauthorized
			let authToken = req.headers.authorization;
			if (!authToken) return res.handler.unauthorized();

			if (!authToken.startsWith("Bearer")) return res.handler.unauthorized();

			authToken = authToken.split(" ")[1];

			if (!authToken) return res.handler.unauthorized();

			const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET, function (err, result) {
				if (err) throw new Error(err);
				return result;
			});

			const userCacheToken = cache.getValue(decodedToken.id);
			if (userCacheToken !== authToken) return res.handler.unauthorized();

			//Get array of data for that user type
			let userData = await userModel.findUserByPk(decodedToken.id, true);

			if (!userData) return res.handler.unauthorized();

			if (userTypes.length) {
				//Set data for key name "userType" in request
				req[userTypes[0]] = userData;
			}

			if (userTypes[0] === USER_TYPE.SUPER_ADMIN && (userData.user_type.type === USER_TYPE_ENUM.user || userData.user_type.type === USER_TYPE_ENUM.admin)) {
				return res.handler.forbidden();
			}

			if (req.admin && userData.user_type.type === USER_TYPE_ENUM.user) {
				return res.handler.forbidden();
			}

			if (req.user && (userData.user_type.type === USER_TYPE_ENUM.admin || userData.user_type.type === USER_TYPE_ENUM.superAdmin)) {
				return res.handler.forbidden();
			}
			if (req.user) {
				//If user is not active then send unauthorized
				if (!req.user.is_user_verified) return res.handler.unauthorized();
			}

			//If All done
			next();
		} catch (err) {
			if (err.message.split(":")?.[0] === "JsonWebTokenError" || err.message.split(":")?.[0] === "TokenExpiredError") {
				return res.handler.unauthorized(undefined, undefined, err);
			}
			res.handler.serverError(undefined, undefined, err);
		}
	}

	//For Admin Authentication
	static async admin(...params) {
		await Authentication.all(...params, [USER_TYPE.ADMIN]);
	}

	static async superAdmin(...params) {
		await Authentication.all(...params, [USER_TYPE.SUPER_ADMIN]);
	}

	//For User Authentication
	static async user(...params) {
		await Authentication.all(...params, [USER_TYPE.USER]);
	}

	//For No Authentication
	static async blank(...params) {
		await Authentication.all(...params, []);
	}

	// for verifying
	static async resetPassword(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.handler.validationError(undefined, `${errors.errors[0].msg}`);
			}

			const user = await userModel.getUserDetailByEmailOrPhone(req.body.phone_number, true);
			if (!user) {
				return res.handler.notFound("VALIDATION.NOT_FOUND.USER", "VALIDATION.NOT_FOUND.USER");
			}

			if (new Date().getTime() > new Date(user.forgot_otp_expire).getTime()) {
				return res.handler.badRequest("RESPONSE.OTP_VERIFICATION.OTP_EXPIRES", "RESPONSE.OTP_VERIFICATION.OTP_EXPIRES");
			}
			const enteredOtp = req.body.otp;

			if (+enteredOtp != user.forgot_otp) {
				return res.handler.badRequest("RESPONSE.OTP_VERIFICATION.INVALID_OTP", "RESPONSE.OTP_VERIFICATION.INVALID_OTP");
			}

			await userModel.updateUserField(
				{
					forgot_otp: null,
					forgot_otp_expire: null,
				},
				{
					where: {
						id: user.id,
					},
				}
			);

			req.user = user;
			next();
		} catch (err) {
			res.handler.serverError(err.message);
		}
	}

	static async setPasswordAdmin(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.handler.validationError(undefined, `${errors.errors[0].msg}`);
			}
			const { token, id } = req.params;
			if (!token || !id) {
				return res.handler.badRequest("RESPONSE.RESET_TOKEN.INVALID_TOKEN_OR_ID", "RESPONSE.RESET_TOKEN.INVALID_TOKEN_OR_ID");
			}
			const user = await userModel.findUserByPk(id, true);
			if (!user) res.handler.unauthorized();

			const encryptionValidator = new EncryptionHandler();
			const { data: enteredEncryptedPassword } = encryptionValidator.encrypt(req.body.password);
			if (user.password === enteredEncryptedPassword) {
				return res.handler.badRequest("RESPONSE.LOGIN_TYPE.PASSWORD_SAME_WITH_PREVIOUS", "RESPONSE.LOGIN_TYPE.PASSWORD_SAME_WITH_PREVIOUS");
			}

			const decodedToken = await promisify(jwt.verify)(token, process.env.FORGOT_JWT_SECRET + user.password);

			if (!decodedToken) throw new Error("Cannot find user associated with this token");

			req.user = user;
			next();
		} catch (err) {
			if (
				err.message?.split(":")?.[0] === "jwt expired" ||
				err.message?.split(":")?.[0] === "invalid signature" ||
				err.message.split(":")?.[0] === "JsonWebTokenError" ||
				err.message.split(":")?.[0] === "TokenExpiredError"
			) {
				return res.handler.badRequest("RESPONSE.RESEND_OTP.ERROR");
			}
			res.handler.serverError(err);
		}
	}
};
