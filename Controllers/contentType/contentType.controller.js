const contentCategory = new (require("../../Models/ContentType.Model"))();

module.exports = class {
	async createContentType(req, res) {
		try {
			req.body.created_by = req?.admin?.id ?? req.superAdmin.id;
			req.body.updated_by = req?.admin?.id ?? req.superAdmin.id;

			const isCategoryExits = await contentCategory.findContentCategoryByName(req.body.content_type_name);

			if (isCategoryExits) return res.handler.badRequest("VALIDATION.EXISTS.IMAGE_CATEGORY");

			const contentType = await contentCategory.createContentCategory(req.body);
			return res.handler.success(contentType);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async getAllContentType(req, res) {
		try {
			const contentType = await contentCategory.getAllContentCategory();
			return res.handler.success(contentType);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async deleteContentType(req, res) {
		try {
			await contentCategory.deleteContentCategory(req.params.id);
			return res.handler.success();
		} catch (err) {
			res.handler.serverError();
		}
	}

	async updateContentType(req, res) {
		try {
			req.body.updated_by = req?.admin?.id ?? req.superAdmin.id;
			const updatedValue = await contentCategory.updateContentCategory(req.body, {
				where: {
					id: req.params.id,
				},
			});

			return res.handler.success(updatedValue);
		} catch (err) {
			res.handler.serverError();
		}
	}
};
