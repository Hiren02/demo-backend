const { contact_us: contactUsSchema } = require("../Database/Schemas");

module.exports = class {
	async createContactUs(contactUs) {
		return contactUsSchema.create(contactUs);
	}

	async getAllContactUs(limit = 10, page = 1) {

		try {
			const offset = (page - 1) * limit;
			const { count, rows: contactUsList } = await contactUsSchema.findAndCountAll({
				offset,
				limit,
			});

			let hasMore = false;
			if (offset + limit < count) hasMore = true;

			return { hasMore, contactUsList, count };
		} catch (err) {
			console.log(err.message);
		}
	}
};
