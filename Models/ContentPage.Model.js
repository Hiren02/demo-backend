const { content_pages: contentPagesSchema } = require("../Database/Schemas");

module.exports = class {
	async getAllPagesList() {
		return await contentPagesSchema.findAll();
	}

	async createPageList(data) {
		return await contentPagesSchema.create(data);
	}

	async getPageByName(page) {
		return await contentPagesSchema.findOne({
			where: {
				page,
			},
		});
	}

	async deletePageByName(page) {
		return await contentPagesSchema.destroy({
			where: {
				page,
			},
		});
	}

	async updatePage(updatedValue, option) {
		return await contentPagesSchema.update(updatedValue, option);
	}
};
