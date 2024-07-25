const { user_type: UserTypeSchema } = require("../Database/Schemas");

module.exports = class {
	async getUserType(userType) {
		return await UserTypeSchema.findOne({
			where: {
				type: userType,
			},
		});
	}
};
