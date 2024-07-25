const { USER_TYPE_ENUM } = require("../Configs/constants");
const { users: userSchema } = require("../Database/Schemas");
const { user_type: UserTypeSchema } = require("../Database/Schemas");
const { user_addresses: userAddressSchema } = require("../Database/Schemas");

module.exports = class {
	async getUserDetailByEmailOrPhone(emailOrPhone, isPasswordRequired = false) {
		try {
			let fields = [];
			if (emailOrPhone) fields.push({ email: emailOrPhone }, { phone_number: emailOrPhone });

			if (isPasswordRequired) {
				return await userSchema.scope("withPassword").findOne({
					where: {
						[Op.or]: fields,
					},
					include: [
						{
							model: UserTypeSchema,
							require: true,
						},
					],
				});
			}

			return await userSchema.findOne({
				where: {
					[Op.or]: fields,
				},
				include: [
					{
						model: UserTypeSchema,
						require: true,
					},
				],
			});
		} catch (err) {
			console.log(err);
		}
	}

	async getUserBySocialId(socialId){
		return await userSchema.findOne({
			where: {
				social_id:socialId
			},
			include: [
				{
					model: UserTypeSchema,
					require: true,
				},
			],
		});
	}

	async findUserByPk(id, isPasswordRequired = false) {
		if (isPasswordRequired) {
			return await userSchema.scope("withPassword").findByPk(id, {
				include: [
					{
						model: UserTypeSchema,
						require: true,
					},
				],
			});
		}
		return await userSchema.findByPk(id, {
			include: [
				{
					model: UserTypeSchema,
					require: true,
				},
			],
		});
	}

	async updateUserField(updatedValue, options) {
		try {
			return await userSchema.update(updatedValue, options);
		} catch (err) {
			console.log(err);
		}
	}

	async getAllUsers(limit = 10, page = 1, order, field) {
		const offset = (page - 1) * limit;

		const { count, rows: userList } = await userSchema.findAndCountAll({
			order: [[field, order]],
			offset,
			nested: true,
			limit: +limit,
			attributes: ["id", "first_name", "last_name", "email", "phone_number", "country_code", "type", "created_at", "user_profile_image"],
			include: [
				{
					model: UserTypeSchema,
					required: true,
					where: {
						type: USER_TYPE_ENUM.user,
					},
				},
				{
					model: userAddressSchema,
					require: true,
				},
			],
		});

		let hasMore = false;
		if (offset + limit < count) hasMore = true;

		return { userList, hasMore, totalCount: count };
	}

	async createUser(data) {
		return userSchema.create(data);
	}

	async deleteUserById(id, hardDelete = false) {
		return await userSchema.destroy({
			where: {
				id,
			},
			force: hardDelete,
		});
	}

	async getAdminUser(attributes = ["id", "type"], limit = undefined, page = undefined, raw = true, isSuperAdminReq = false) {
		const queryOptions = {
			distinct: true,
			raw: raw,
			nested: true,
			include: [
				{
					required: true,
					model: UserTypeSchema,
					attributes: [],
					...(isSuperAdminReq && {
						where: {
							[Op.or]: [
								{
									type: USER_TYPE_ENUM.admin,
								},
								{
									type: USER_TYPE_ENUM.superAdmin,
								},
							],
						},
					}),
					...(!isSuperAdminReq && {
						where: {
							type: USER_TYPE_ENUM.admin,
						},
					}),
				},
			],
			order: [["created_at", "DESC"]],
		};

		if (limit) queryOptions.limit = limit;

		if (limit & page) queryOptions.offset = (page - 1) * limit;

		if (attributes.length) {
			queryOptions.attributes = attributes;
		}

		const { count, rows: adminUserList } = await userSchema.findAndCountAll(queryOptions);

		let hasMore = false;
		if (queryOptions.offset + limit < count) hasMore = true;

		return { hasMore, count, adminUserList };
	}
};
