const { user_login_sessions: userLoginSession } = require("../Database/Schemas");

module.exports = class {
	async createUserLoginSession(loginDetails) {
		return await userLoginSession.create(loginDetails);
	}

	async deleteLoginSessionByUserID(userId) {
		return await userLoginSession.destroy({
			where: {
				user_id: userId,
			},
		});
	}
};
