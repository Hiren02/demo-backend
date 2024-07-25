const userModel = new (require("../../Models/User.Model"))();
const userAddressModel = new (require("../../Models/UserAddress.Model"))();
const userTypeModel = new (require("../../Models/UserType.Model"))();
const { USER_TYPE_ENUM } = require("../../Configs/constants");
const FileManager = require("../../Managers/File.Manager");
const { sendPasswordResetMail } = require("../../Utils/email");
const jwt = require("jsonwebtoken");

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async getUserById(req, res) {
		try {
			if (!req.params.id) return req.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");
			const user = await userModel.findUserByPk(req.params.id);
			if (!user) return res.handler.badRequest();
			return res.handler.success(user);
		} catch (err) {
			res.handler.serverError(err.message);
		}
	}

	signToken(userId, userRole, tokenExpireTime = process.env.JWT_EXPIRES_IN, secret = process.env.JWT_SECRET) {
		const token = jwt.sign({ id: userId, role: userRole }, secret, {
			expiresIn: tokenExpireTime,
		});
		return token;
	}

	async getAllUser(req, res) {
		try {
			const userList = await userModel.getAllUsers(req.query.limit, req.query.page, "DESC", "created_at");

			return res.handler.success(userList);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async deleteUserById(req, res) {
		try {
			if (!req.params.id) return req.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");
			const user = await userModel.findUserByPk(req.params.id);
			if (!user) return res.handler.badRequest("VALIDATION.NOT_FOUND.USER");

			await userModel.deleteUserById(req.params.id);
			return res.handler.noContent("RESPONSE.USER_DELETED_SUCCESS");
		} catch (err) {
			res.handler.serverError(err.message);
		}
	}

	async updateUser(req, res) {
		if (!req.params.userId) return req.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");
		try {
			const isUserExists = await userModel.findUserByPk(req.params.userId);

			if (!isUserExists) return res.handler.badRequest();

			if (req.body.password) {
				delete req.body.password;
			}

			if (req.body.type) {
				delete req.body.type;
			}

			const updatedUserValue = { ...req.body, haveAllRequired: true };

			updatedUserValue.update_at = new Date();
			updatedUserValue.updated_by = req?.admin?.id || req?.superAdmin?.id;

			if (req.file) {
				const awsOperationsPromises = [FileManager.uploadToCloud(req.file.filename, `profile-images/${isUserExists.id}`, "original")];

				if (isUserExists.user_profile_image) {
					awsOperationsPromises.push(FileManager.delete(FileManager.getFileNameFromUrl(isUserExists.user_profile_image), `profile-images/${isUserExists.id}`));
				}

				await Promise.all(awsOperationsPromises);
				updatedUserValue.user_profile_image = req.file.filename;
			}

			const updatedValue = await userModel.updateUserField(updatedUserValue, {
				where: { id: isUserExists.id },
				validate: true,
			});
			res.handler.success(updatedValue, "SUCCESS_MESSAGES.USER_UPDATED");
		} catch (err) {
			res.handler.serverError(err.message);
		}
	}

	async sendPasswordChangeMail(req, res) {
		if (!req.params.userId) {
			return res.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");
		}
		try {
			const isUserExists = await userModel.findUserByPk(req.params.userId);

			if (!isUserExists) return res.handler.badRequest();

			const token = self.signToken(isUserExists.id, isUserExists.user_type.type, process.env.FORGOT_JWT_EXPIRES_IN, process.env.FORGOT_JWT_SECRET + isUserExists.password);

			sendPasswordResetMail(isUserExists.email, isUserExists.id, token);

			res.handler.success({ message: "mail send to user" });
		} catch (err) {
			res.handler.serverError(err.message);
		}
	}
};
