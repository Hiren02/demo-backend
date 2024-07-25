const contentCategory = new (require("../../Models/ContactUs.model"))();

module.exports = class {
	async createContactUs(req, res) {
		try {
			const contactUs = await contentCategory.createContactUs(req.body);
			return res.handler.success(contactUs);
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async getAllContactUs(req, res) {
		
		try {
			
			if (req.query?.limit) req.query.limit = parseInt(req.query.limit);
			if (req.query?.page) req.query.page = parseInt(req.query.page);
			const getAllContactUsList = await contentCategory.getAllContactUs(req.query?.limit ?? 10, req.query?.page ?? 1);
			return res.handler.success(getAllContactUsList);
		} catch (err) {
			res.handler.serverError(err);
		}
	}
};
