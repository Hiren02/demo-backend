const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const smsService = new (require("../../Configs/smsConfiguration"))();
const EncryptionHandler = require("../../Configs/encrypt");
const userModel = new (require("../../Models/User.Model"))();
const cache = require("../../Configs/nodeCache.config");
const userSessionLoginModel = new (require("../../Models/UserLoginSessions.Model"))();
const userTypeModel = new (require("../../Models/UserType.Model"))();
const userAddressModel = new (require("../../Models/UserAddress.Model"))();
const { sendResetPasswordMailHelper, phoneVerificationOtpSendMail } = require("../../Utils/email");
const { sendPasswordResetMail } = require("../../Utils/email");
const { SIGNUP_METHODS, USER_TYPE_ENUM } = require("../../Configs/constants");
const FileManager = require("../../Managers/File.Manager");

let self;
module.exports = class {
	constructor() {
		self = this;
	}
	signToken(userId, userRole, tokenExpireTime = process.env.JWT_EXPIRES_IN, secret = process.env.JWT_SECRET) {
		const token = jwt.sign({ id: userId, role: userRole }, secret, {
			expiresIn: tokenExpireTime,
		});
		return token;
	}

	createOtp() {
		return otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
	}

	verifyPassword(enteredPassword, password) {
		const encryptionValidator = new EncryptionHandler();
		const { data: enteredEncryptedPassword } = encryptionValidator.encrypt(enteredPassword);

		return enteredEncryptedPassword === password;
	}

	createAndSignToken(user) {
		const token = self.signToken(user.id, user.user_type.dataValues.type);
		const ttl = new Date().getTime() + process.env.CACHE_KEY_TTL * 60 * 60 * 1000;

		if (cache.isKeyExists(user.id)) {
			cache.deleteKey(user.id);
			cache.setKey(user.id, token, ttl);
		} else {
			cache.setKey(user.id, token, ttl);
		}
		return token;
	}

	async login(req, res) {
		try {
			const userExist = await userModel.getUserDetailByEmailOrPhone(req.body.email ?? req.body.phone_number, true);
			if (!userExist) {
				return res.handler.notFound(undefined, "VALIDATION.NOT_FOUND.USER");
			}

			if (userExist.signup_type !== SIGNUP_METHODS["normal"]) {
				return res.handler.conflict(undefined, "RESPONSE.LOGIN_TYPE.INVALID");
			}

			const isPasswordValid = self.verifyPassword(req.body.password, userExist.password);

			if (!isPasswordValid) {
				return res.handler.unauthorized(undefined, "VALIDATION.PASSWORD.INCORRECT");
			}

			if (!userExist.is_user_verified) {
				const generatedOtp = self.createOtp();
				smsService.sendSms(
					`${userExist.country_code}${userExist.phone_number}`,
					`Dear user, here is your 4 digit OTP for verifying your OnePic Account:-${generatedOtp} otp is only valid for ${process.env.OTP_VALIDATION_MINUTE} minutes`
				);
				return res.handler.badRequest("VALIDATION.USER_VERIFIED.NOT_VERIFIED");
			}

			if (
				(req.body.type === "admin" && userExist.user_type.dataValues.type === USER_TYPE_ENUM.user) ||
				(req.body.type !== "admin" && (userExist.user_type.dataValues.type === USER_TYPE_ENUM.admin || userExist.user_type.dataValues.type === USER_TYPE_ENUM.superAdmin))
			) {
				return res.handler.notFound(undefined, "VALIDATION.NOT_FOUND.USER");
			}

			const token = self.createAndSignToken(userExist);
			userExist.otp = undefined;
			userExist.social_id = undefined;
			userExist.otp_expire = undefined;
			userExist.forgot_otp = undefined;
			userExist.forgot_otp_expire = undefined;
			userExist.password = undefined;

			userExist.dataValues.isSuperAdmin = userExist.dataValues.user_type.type === USER_TYPE_ENUM.superAdmin;

			const userLoginDetails = {
				user_id: userExist.id,
				access_token: token,
				...req.body,
			};

			await userSessionLoginModel.createUserLoginSession(userLoginDetails);

			return res.handler.custom(STATUS_CODES.SUCCESS, "SUCCESS_MESSAGES.LOGIN", {
				token,
				user: userExist,
			});
		} catch (error) {
			res.handler.serverError();
		}
	}

	async signUp(req, res) {
		try {
			const userExist = await userModel.getUserDetailByEmailOrPhone(req.body.email);
			const isPhoneNumberExists = await userModel.getUserDetailByEmailOrPhone(req.body.phone_number);

			if ((userExist && userExist.deletedAt === null) || (isPhoneNumberExists && isPhoneNumberExists.deletedAt === null)) {
				return res.handler.conflict(undefined, "VALIDATION.CONFLICT.USER");
			}

			const userType = await userTypeModel.getUserType(USER_TYPE_ENUM.user);
			const generatedOtp = self.createOtp();
			if (req.admin) {
				req.body.password = "@PGUBmbl45";
			}

			const userInfo = {
				...req.body,
				user_profile_image: req?.file?.filename,
				type: userType.id,
				created_by: req.admin ? 1 : null,
				updated_by: req.admin ? 1 : null,
				is_user_verified: false,
				signup_type: SIGNUP_METHODS["normal"],
				otp: generatedOtp,
				otp_expire: new Date(new Date().getTime() + process.env.OTP_VALIDATION_MINUTE * 60 * 1000).toISOString(),
			};

			const userAddress = {};

			const userDetails = await userModel.createUser(userInfo);
			if (req.body.address) {
				userAddress.address_line_1 = req.body.address;
			}
			if (req.body.street) userAddress.street = req.body.street;
			if (req.body.house_number) userAddress.house_number = req.body.house_number;
			if (req.body.city) userAddress.city = req.body.city;
			if (req.body.state) userAddress.state = req.body.state;
			if (req.body.country) userAddress.country = req.body.country;
			if (req.body.zip_code) userAddress.zip_code = req.body.zip_code;
			if (req.body.latitude) userAddress.latitude = req.body.latitude;
			if (req.body.longitude) userAddress.longitude = req.body.longitude;
			if (req.body.address_type) userAddress.address_type = req.body.address_type;
			if (req.body.country_label) userAddress.country_label = req.body.country_label;

			if (Object.keys(userAddress).length) {
				userAddress.user_id = userDetails.id;
				userAddress.created_by = req.admin ? 1 : 0;
				userAddress.updated_by = req.admin ? 1 : 0;
				await userAddressModel.createUserAddress(userAddress);
			}

			if (!req.admin) {
				smsService.sendSms(
					`${userDetails.country_code}${userDetails.phone_number}`,
					`Dear user, here is your 4 digit OTP for verifying your OnePic Account:-${generatedOtp} otp is only valid for ${process.env.OTP_VALIDATION_MINUTE} minutes`
				);
			}
			userDetails.otp = undefined;
			userDetails.social_id = undefined;
			userDetails.otp_expire = undefined;
			userDetails.forgot_otp = undefined;
			userDetails.forgot_otp_expire = undefined;

			if (req.admin) {
				userDetails.is_user_verified = 1;
				const passToken = self.signToken(userDetails.id, userDetails.type, process.env.FORGOT_JWT_EXPIRES_IN, process.env.FORGOT_JWT_SECRET + userDetails.password);
				sendPasswordResetMail(userDetails.email, userDetails.id, passToken, "Welcome to OnePic", "welcomeEmail.ejs");
			}
			userDetails.password = undefined;
			if (req?.file?.filename) {
				await FileManager.uploadToCloud([req.file.filename], `profile-images/${userDetails.id}`, "original");
			}
			if (userDetails) res.handler.created(userDetails, "SUCCESS_MESSAGES.SIGN_UP");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async resendOtp(req, res) {
		try {
			const user = await userModel.getUserDetailByEmailOrPhone(req.body.phone_number);
			if (!user) {
				return res.handler.notFound(undefined, "VALIDATION.NOT_FOUND.USER");
			}
			if (user.is_user_verified) {
				return res.handler.badRequest("VALIDATION.USER_VERIFIED.VERIFIED");
			}

			const otp = self.createOtp();
			user.otp = otp;
			user.otp_expire = new Date(new Date().getTime() + process.env.OTP_VALIDATION_MINUTE * 60 * 1000).toISOString();
			smsService.sendSms(
				`${user.country_code}${user.phone_number}`,
				`Dear user, here is your 4 digit OTP for verifying your OnePic Account:-${otp} otp is only valid for ${process.env.OTP_VALIDATION_MINUTE} minutes`
			);
			user.resend_otp_attempts = user.resend_otp_attempts ? user.resend_otp_attempts + 1 : 1;

			await user.save();

			return res.handler.success({}, "RESPONSE.RESEND_OTP.SUCCESS");
		} catch (err) {
			return res.handle.serverError(err.message);
		}
	}

	async verifyOtp(req, res) {
		try {
			const user = await userModel.getUserDetailByEmailOrPhone(req.body.phone_number, true);
			if (!user) {
				return res.handler.notFound(undefined, "VALIDATION.NOT_FOUND.USER");
			}
			if (user.is_user_verified) {
				return res.handler.badRequest("VALIDATION.USER_VERIFIED.VERIFIED");
			}

			if (new Date().getTime() > new Date(user.otp_expire).getTime()) {
				return res.handler.badRequest("VALIDATION.USER_VERIFIED.OTP_EXPIRED");
			}

			if (user.otp === +req.body.otp) {
				await userModel.updateUserField(
					{
						is_user_verified: 1,
						otp: null,
						otp_expire: null,
						resend_otp_attempts: null,
						block_duration: null,
					},
					{
						where: {
							id: user.id,
						},
						validate: false,
					}
				);
			} else {
				return res.handler.badRequest("VALIDATION.USER_VERIFIED.FAILED_ATTEMPTED");
			}
			await user.save();

			const token = self.createAndSignToken(user);

			user.otp = undefined;
			user.social_id = undefined;
			user.otp_expire = undefined;
			user.forgot_otp = undefined;
			user.forgot_otp_expire = undefined;
			user.password = undefined;

			return res.handler.success({ message: "RESPONSE.OTP_VERIFICATION_SUCCESS", token, user }, "RESPONSE.OTP_VERIFICATION_SUCCESS");
		} catch (err) {
			return res.handle.serverError(err.message);
		}
	}

	async logout(req, res) {
		try {
			cache.deleteKey(req?.user?.id ?? req?.admin?.id ?? req.superAdmin.id);
			await userSessionLoginModel.deleteLoginSessionByUserID(req?.user?.id ?? req?.admin?.id ?? req.superAdmin.id);
			res.handler.success({ status: "success" }, "RESPONSE.LOGGED_OUT_SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async signIn(req, res) {
		if (req.body.type !== "admin") return await self.login(req, res);
		return res.handler.unauthorized();
	}

	async adminSignIn(req, res) {
		if (req.body.type === "admin") return await self.login(req, res);
		return res.handler.unauthorized();
	}

	async forgotPassword(req, res) {
		try {
			const userExist = await userModel.getUserDetailByEmailOrPhone(req.body?.phone_number ?? req.body?.email, true);

			if (!userExist || (req.body?.user_type && userExist.user_type.dataValues.type === USER_TYPE_ENUM.user)) {
				return res.handler.notFound(undefined, "VALIDATION.NOT_FOUND.USER");
			}

			if (!userExist.is_user_verified) {
				return res.handler.badRequest("VALIDATION.USER_VERIFIED.NOT_VERIFIED");
			}

			if (userExist.signup_type !== SIGNUP_METHODS["normal"]) {
				return res.handler.conflict(undefined, "RESPONSE.LOGIN_TYPE.INVALID");
			}

			const otp = self.createOtp();

			userExist.forgot_otp = otp;
			userExist.forgot_otp_expire = new Date(new Date().getTime() + process.env.OTP_VALIDATION_MINUTE * 60 * 1000).toISOString();
			await userExist.save();
			if (!req.body?.user_type) {
				sendResetPasswordMailHelper(userExist.email, otp);
				smsService.sendSms(
					`${userExist.country_code}${userExist.phone_number}`,
					`Dear user, here is you 4 digit otp for resetting your password for OnePic account:-${otp} otp is only valid for ${process.env.OTP_VALIDATION_MINUTE} minutes`
				);
			} else {
				const passToken = self.signToken(userExist.id, userExist.type, process.env.FORGOT_JWT_EXPIRES_IN, process.env.FORGOT_JWT_SECRET + userExist.password);
				sendPasswordResetMail(userExist.email, userExist.id, passToken, undefined, undefined, true);
			}

			return res.handler.success({ message: "RESPONSE.RESEND_OTP.SUCCESS", id: userExist.id }, req.body?.user_type ? "RESPONSE.RESEND_OTP.ADMIN_SUCCESS" : "RESPONSE.RESEND_OTP.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async resetPassword(req, res) {
		const encryptionValidator = new EncryptionHandler();
		try {
			await userModel.updateUserField(
				{
					password: encryptionValidator.encrypt(req.body.password).data,
				},
				{
					where: {
						id: req.user.id,
					},
					validate: false,
				}
			);

			return res.handler.success({ status: "success" }, "RESPONSE.PASSWORD_RESET_SUCCESS");
		} catch (err) {
			res.handler.serverError(err.message);
		}
	}

	async verifyForgotOtp(req, res) {
		try {
			const token = self.signToken(req.user.id, req.user.type, process.env.FORGOT_JWT_EXPIRES_IN, process.env.FORGOT_JWT_SECRET + req.user.password);
			res.handler.success({ token }, "RESPONSE.VERIFY_OTP_SUCCESS");
		} catch (err) {
			res.handler.serverError(err.message);
		}
	}

	async changePassword(req, res) {
		if ((req.user && req.user?.signup_type !== SIGNUP_METHODS.normal) || (req.admin && req.admin?.signup_type !== SIGNUP_METHODS.normal)) {
			return res.handler.conflict(undefined, "RESPONSE.LOGIN_TYPE.INVALID");
		}

		if (!self.verifyPassword(req.body.currentPassword, req.user?.password ?? req.admin.password)) {
			return res.handler.forbidden(undefined, "VALIDATION.CHANGE_PASSWORD.INVALID_CURRENT_PASSWORD");
		}

		const newEncryptedPassword = new EncryptionHandler().encrypt(req.body.password).data;

		try {
			userModel.updateUserField(
				{
					password: newEncryptedPassword,
				},
				{
					where: {
						id: req?.user?.id ?? req.admin.id,
					},
					validate: false,
				}
			);
			return res.handler.success(
				{
					data: "RESPONSE.PASSWORD_CHANGED_SUCCESS",
				},
				"RESPONSE.PASSWORD_CHANGED_SUCCESS"
			);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async resendForgotOtp(req, res) {
		try {
			const user = await userModel.findUserByPk(req.params.id);
			if (!user) {
				return res.handler.notFound(undefined, "VALIDATION.NOT_FOUND.USER");
			}
			if (!user.forgot_otp) {
				return res.handler.badRequest(undefined, "VALIDATION.FORGOT_PASSWORD.NOT_REQUESTED");
			}
			const otp = self.createOtp();
			user.forgot_otp = otp;
			user.forgot_otp_expire = new Date(new Date().getTime() + process.env.OTP_VALIDATION_MINUTE * 60 * 1000).toISOString();
			sendResetPasswordMailHelper(user.email, otp);
			smsService.sendSms(
				`${user.country_code}${user.phone_number}`,
				`Dear user, here is you 4 digit otp for resetting your password for OnePic account:-${otp} otp is only valid for ${process.env.OTP_VALIDATION_MINUTE} minutes`
			);
			await user.save();
			return res.handler.success({}, "RESPONSE.RESEND_OTP.SUCCESS");
		} catch (err) {
			return res.handler.serverError(err.message);
		}
	}

	async isUserExists(req, res) {
		try {
			const userExist = await userModel.getUserDetailByEmailOrPhone(req.body.email, true);

			if (!userExist || userExist.deletedAt !== null) {
				return res.handler.notFound({ isSignUpPending: true }, "VALIDATION.NOT_FOUND.MISSING_DETAILS");
			}

			if (userExist.signup_type !== req.body.signup_type || userExist.social_id !== req.body.social_id) {
				return res.handler.conflict(undefined, "RESPONSE.LOGIN_TYPE.INVALID");
			}
			if (!userExist.is_user_verified) {
				return res.handler.badRequest("VALIDATION.USER_VERIFIED.NOT_VERIFIED", { phone_number: userExist.phone_number, country_code: userExist.country_code });
			}

			userExist.otp = undefined;
			userExist.social_id = undefined;
			userExist.otp_expire = undefined;
			userExist.forgot_otp = undefined;
			userExist.forgot_otp_expire = undefined;
			userExist.password = undefined;

			return res.handler.success({ token, user: userExist });
		} catch (err) {
			return res.handler.serverError(err.message);
		}
	}

	async socialSignUp(req, res) {
		try {
			const userExist = await userModel.getUserDetailByEmailOrPhone(req.body.email);

			if (userExist && userExist.signup_type === SIGNUP_METHODS["normal"]) {
				return res.handler.conflict(undefined, "RESPONSE.LOGIN_TYPE.INVALID");
			}

			if (userExist && userExist.deletedAt === null && req.body.social_id === userExist.social_id) {
				return res.handler.success({ user: userExist, haveAllRequired: userExist.haveAllRequired, token: self.createAndSignToken(userExist) });
			} else if (userExist && userExist.deletedAt === null && req.body.social_id !== userExist.social_id) {
				return res.handler.unauthorized();
			}

			const userType = await userTypeModel.getUserType(USER_TYPE_ENUM.user);
			const checkSocialIdExist = await userModel.getUserBySocialId(req.body.social_id);

			// checking is social id exists or not with all required value
			if (checkSocialIdExist && !checkSocialIdExist.dataValues.haveAllRequired) {
				if (req.body.first_name || req.body.last_name || req.body.email) {
					const haveAllRequired = req.body.first_name && req.body.last_name && req.body.email;
					const userInfo = {
						...req.body,
						user_profile_image: req?.file?.filename,
						type: userType.id,
						updated_by: checkSocialIdExist.id,
						is_user_verified: true,
						haveAllRequired: haveAllRequired,
					};
					await userModel.updateUserField(userInfo, {
						where: {
							id: checkSocialIdExist.id,
						},
					});
					const user = await userModel.findUserByPk(checkSocialIdExist.id);
					return res.handler.success({ user, haveAllRequired: user.haveAllRequired, token: self.createAndSignToken(user) }, "SUCCESS_MESSAGES.LOGIN");
				} else {
					return res.handler.success(
						{ haveAllRequired: checkSocialIdExist.dataValues.haveAllRequired, user: checkSocialIdExist, token: self.createAndSignToken(checkSocialIdExist) },
						"SUCCESS_MESSAGES.LOGIN"
					);
				}
			} else {
				if (req.body.first_name || req.body.last_name || req.body.email) {
					const haveAllRequired = req.body.first_name && req.body.last_name && req.body.email;
					const userInfo = {
						...req.body,
						user_profile_image: req?.file?.filename,
						type: userType.id,
						is_user_verified: true,
						haveAllRequired: haveAllRequired,
					};
					const createdUser = await userModel.createUser(userInfo);
					const user = await userModel.findUserByPk(createdUser.id);
					return res.handler.success({ user, haveAllRequired: user.dataValues.haveAllRequired, token: self.createAndSignToken(user) }, "SUCCESS_MESSAGES.LOGIN");
				} else if (checkSocialIdExist && checkSocialIdExist.dataValues.haveAllRequired) {
					return res.handler.success(
						{ user: checkSocialIdExist, haveAllRequired: checkSocialIdExist.haveAllRequired, token: self.createAndSignToken(checkSocialIdExist) },
						"SUCCESS_MESSAGES.LOGIN"
					);
				} else {
					const newUser = await userModel.createUser({
						social_id: req.body.social_id,
						haveAllRequired: false,
						is_user_verified: true,
						type: userType.id,
						signup_type: req.body.signup_type,
					});

					const user = await userModel.findUserByPk(newUser.id);

					return res.handler.success({ haveAllRequired: user.dataValues.haveAllRequired, user, token: self.createAndSignToken(user) }, "SUCCESS_MESSAGES.LOGIN");
				}
			}
		} catch (err) {
			res.handler.serverError();
		}
	}
};
