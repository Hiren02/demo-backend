const { user_addresses: userAddressSchema } = require("../Database/Schemas");

module.exports = class {
	async createUserAddress(userAddress) {
		return await userAddressSchema.create(userAddress);
	}

	async updateAddressByUserId(options, updateValue) {
		return await userAddressSchema.update(updateValue, options);
	}

	removeDefaultUserAddress(id) {
		return userAddressSchema.update(
			{ is_default: false },
			{
				where: {
					user_id: id,
				},
			}
		);
	}

	getAllUserAddress(id) {
		return userAddressSchema.findAll({
			where: {
				user_id: id,
			},
		});
	}

	async getUserAddressByUserIdAndId(userId, addressId) {
		if (addressId) {
			return await userAddressSchema.findAll({
				where: { [Op.and]: [{ id: addressId }, { user_id: userId }] },
			});
		}
		return await userAddressSchema.findAll({
			where: {
				user_id: userId,
			},
		});
	}

	async getOneAddress(userId, addressId) {
		return await userAddressSchema.findOne({
			where: {
				[Op.and]: [
					{
						user_id: userId,
					},
					{ id: addressId },
				],
			},
		});
	}

	async deleteUserAddressById(addressId) {
		return userAddressSchema.destroy({ where: { id: addressId } });
	}
};
