const { Api } = require("../../Utils/ApiHelper");
const commonModel = new (require("../../Models/Common.Model"))();

module.exports = class {
	async getProductPrintArea(req, res) {
		try {
			const { blueprint_id, print_provider_id } = req.query;

			if (!blueprint_id) return res.handler.badRequest("VALIDATION.PARAMS.BLUE_PRINT_ID");
			if (!print_provider_id) return res.handler.badRequest("VALIDATION.PARAMS.PRINT_PROVIDER_ID");

			const response = await new Api().get(`/catalog/blueprints/${blueprint_id}/print_providers/${print_provider_id}/variants.json`, {});

			return res.handler.success(response);
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async getCategoryList(req, res) {
		try {
			const category = await commonModel.getCategoryList();

			if (!category) return res.handler.notFound();

			return res.handler.success(category);
		} catch (err) {
			res.handler.serverError(err);
		}
	}
};
