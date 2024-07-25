const userModel = new (require("../../Models/User.Model"))();
const userAddressModel = new (require("../../Models/UserAddress.Model"))();
const userTypeModel = new (require("../../Models/UserType.Model"))();
const { USER_TYPE_ENUM } = require("../../Configs/constants");
const FileManager = require("../../Managers/File.Manager");
const { adminPasswordSenderMail } = require("../../Utils/email");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

let self;

module.exports = class {
	signToken(userId, userRole, tokenExpireTime = process.env.JWT_EXPIRES_IN, secret = process.env.JWT_SECRET) {
		const token = jwt.sign({ id: userId, role: userRole }, secret, {
			expiresIn: tokenExpireTime,
		});
		return token;
	}

	constructor() {
		self = this;
	}

	async createAdmin(req, res) {
		try {
			const isUserExists = await userModel.getUserDetailByEmailOrPhone(req.body.email);
			if (isUserExists) return res.handler.conflict(undefined, "VALIDATION.CONFLICT.USER");
			const password = generator.generate({
				length: 10,
				numbers: true,
				symbols: true,
				strict: true,
			});
			const userType = await userTypeModel.getUserType(USER_TYPE_ENUM.admin);
			req.body.phone_number = "1234567890";
			req.body.country_code = "+23";
			req.body.password = password;
			req.body.created_by = req.superAdmin.id;
			req.body.updated_by = req.superAdmin.id;
			req.body.type = userType.id;
			req.body.is_user_verified = 1;

			if (req.file?.filename) {
				req.body.user_profile_image = req.file.filename;
			}

			const newAdmin = await userModel.createUser(req.body);

			if (req?.file?.filename) {
				await FileManager.uploadToCloud([req.file.filename], `profile-images/${newAdmin.id}`, "original");
			}
			adminPasswordSenderMail(newAdmin.email, password);
			res.handler.success(newAdmin, "SUCCESS_MESSAGES.ADMIN_ADDED");
		} catch (err) {
			res.handler.serverError(undefined, undefined, err);
		}
	}

	async getAllAdminUser(req, res) {
		try {
			if (req.query.limit) req.query.limit = parseInt(req.query.limit);
			if (req.query.page) req.query.page = parseInt(req.query.page);
			const getAllAdmin = await userModel.getAdminUser([], req.query.limit, req.query.page, false);
			return res.handler.success(getAllAdmin);
		} catch (err) {
			res.handler.serverError();
		}
	}
};
