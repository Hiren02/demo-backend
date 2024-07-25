const { USER_TYPE_ENUM } = require("../../Configs/constants");
const FileManager = require("../../Managers/File.Manager");

const userModel = new (require("../../Models/User.Model"))();
const userAddressModel = new (require("../../Models/UserAddress.Model"))();

module.exports = class {
	getMeDetails(req, res) {
		if (req?.user) req.user.dataValues.password = undefined;

		if (req?.admin) {
			req.admin.dataValues.isSuperAdmin = req.admin.dataValues.user_type.type === USER_TYPE_ENUM.superAdmin;
			req.admin.dataValues.password = undefined;
		}
		return res.handler.success(req.user ?? req.admin);
	}

	async updateUserDetails(req, res) {
		try {
			const updateDetails = { updated_by: req?.user?.id ?? req.admin.id, haveAllRequired: true };
			if (req.body.first_name) {
				updateDetails.first_name = req.body.first_name;
			}

			if (req.body.last_name) {
				updateDetails.last_name = req.body.last_name;
			}

			if (req.body.password) {
				delete req.body.password;
			}

			if (req.body.email) {
				const isUserEmailExists = await userModel.getUserDetailByEmailOrPhone(req.body.email);
				if (isUserEmailExists && !isUserEmailExists.deleted_at && ((req.user && isUserEmailExists.id !== req?.user?.id) || (req.admin && isUserEmailExists.id !== req?.admin?.id)))
					return res.handler.conflict(undefined);
				updateDetails.email = req.body.email;
			}

			if (req.body.phone_number) {
				delete req.body.phone_number;
			}

			if (req.file?.filename) {
				const awsOperationsPromises = [FileManager.uploadToCloud(req.file.filename, `profile-images/${req.user?.id ?? req.admin?.id}`, "original")];
				if (req.user?.user_profile_image || req.admin?.user_profile_image) {
					awsOperationsPromises.push(
						FileManager.delete(FileManager.getFileNameFromUrl(req.user?.user_profile_image ?? req.admin.user_profile_image), `profile-images/${req.user?.id ?? req.admin.id}`)
					);
				}

				await Promise.all(awsOperationsPromises);
				updateDetails.user_profile_image = req.file.filename;
			}

			if (!Object.keys(updateDetails).length) return req.handler.update();

			updateDetails.update_at = new Date();
			updateDetails.updated_by = req?.user?.id ?? req.admin.id;
			await userModel.updateUserField(updateDetails, {
				where: {
					id: req?.user?.id ?? req.admin.id,
				},
				returning: true,
				plain: true,
			});

			const updatedDetails = await userModel.findUserByPk(req?.user?.id ?? req.admin.id);

			return res.handler.update(updatedDetails, "RESPONSE.PROFILE.UPDATE_PROFILE");
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async deleteUserAccount(req, res) {
		try {
			await userModel.deleteUserById(req.user?.id ?? req.admin.id);
			return res.handler.success(undefined, "RESPONSE.USER_DELETED_SUCCESS");
		} catch (err) {
			res.handler.serverError();
		}
	}

	async getUserAllAddress(req, res) {
		try {
			const addresses = await userAddressModel.getUserAddressByUserIdAndId(req.user?.id ?? req.params.userId);
			return res.handler.success(addresses);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async createNewUserAddress(req, res) {
		try {
			if (req.body.user_id) {
				const isUserExists = userModel.findUserByPk(req.params.id);
				if (!isUserExists) {
					return res.handler.notFound("VALIDATION.NOT_FOUND.USER");
				}
			}

			const userAddress = {
				user_id: req.user?.id ?? req.params.id,
				created_by: req?.admin?.id || req?.user?.id || req.superAdmin.id,
				updated_by: req?.admin?.id || req?.user?.id || req.superAdmin.id,
				...req.body,
			};

			if (req.body?.is_default) {
				const exitsAddresses = await userAddressModel.getAllUserAddress(req.user.id);
				if (exitsAddresses && exitsAddresses.length) {
					await userAddressModel.removeDefaultUserAddress(req.user.id);
				}
			}

			const address = await userAddressModel.createUserAddress(userAddress);

			return res.handler.success(address, "SUCCESS_MESSAGES.ADDRESS_CREATED");
		} catch (err) {
			res.handler.severError();
		}
	}

	async updateUserAddress(req, res) {
		try {
			if (req.params.userId) {
				const isUserExists = userModel.findUserByPk(req.params.userId);
				if (!isUserExists) {
					return res.handler.notFound("VALIDATION.NOT_FOUND.USER");
				}
			}

			const isAddressExists = await userAddressModel.getOneAddress(req.user?.id ?? req.params.userId, req.params.id);
			if (!isAddressExists) {
				return res.handler.notFound(undefined, "RESPONSE.PROFILE.ADDRESS_NOT_FOUND");
			}

			if (req.body?.is_default) {
				const exitsAddresses = await userAddressModel.getAllUserAddress(req.user.id);
				if (exitsAddresses && exitsAddresses.length) {
					await userAddressModel.removeDefaultUserAddress(req.user.id);
				}
			}

			req.body.updated_by = req?.admin?.id || req?.user?.id || req.superAdmin.id;

			const updateUserAddress = await userAddressModel.updateAddressByUserId(
				{
					where: {
						[Op.and]: [
							{
								user_id: req.user?.id ?? req.params.userId,
							},
							{
								id: req.params.id,
							},
						],
					},
				},
				req.body
			);

			return res.handler.success(updateUserAddress);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async deleteUserAddress(req, res) {
		try {
			const isAddressExists = await userAddressModel.getOneAddress(req.user?.id ?? req.params.userId, req.params.id);
			if (!isAddressExists) {
				return res.handler.notFound(undefined, "RESPONSE.PROFILE.ADDRESS_NOT_FOUND");
			}
			await userAddressModel.deleteUserAddressById(req.params.id);
			return res.handler.success("RESPONSE.PROFILE.ADDRESS_DELETED_SUCCESS");
		} catch (err) {
			res.handler.serverError();
		}
	}
};
