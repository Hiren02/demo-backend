const contentPageModel = new (require("../../Models/ContentPage.Model"))();
const slugify = require("slugify");

module.exports = class {
	async createPages(req, res) {
		try {
			const page = {
				page: slugify(req.body.name),
				content: req.body.content,
				title: req.body.title,
				created_by: req?.admin?.id ?? req.superAdmin.id,
				updated_by: req?.admin?.id ?? req.superAdmin.id,
			};
			const createPage = await contentPageModel.createPageList(page);
			return res.handler.success(createPage);
		} catch (err) {
			return res.handler.serverError(err);
		}
	}

	async getAllPages(req, res) {
		try {
			const pages = await contentPageModel.getAllPagesList();
			return res.handler.success(pages);
		} catch (err) {
			return res.handler.serverError(err);
		}
	}

	async getPagesByName(req, res) {
		try {
			const page = await contentPageModel.getPageByName(req.params.page);
			if (!page) {
				return res.handler.notFound(undefined, "RESPONSE.CONTENT_PAGE_NOT_FOUND");
			}
			return res.handler.success(page);
		} catch (err) {
			return res.handler.serverError(err);
		}
	}

	async updatePage(req, res) {
		try {
			req.body.updated_by = req?.admin?.id ?? req.superAdmin.id;
			if (req.body.page) delete req.body.page;
			const updatePage = await contentPageModel.updatePage(req.body, {
				where: {
					id: req.params.id,
				},
			});
			res.handler.success(updatePage);
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async deletePage(req, res) {
		try {
			const deletePage = await contentPageModel.deletePageByName(req.params.page);
			res.handler.success(deletePage);
		} catch (err) {
			res.handler.serverError(err);
		}
	}
};
