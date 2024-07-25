const { content_types: contentTypeSchema } = require("../Database/Schemas");

module.exports = class {
	async createContentCategory(contentCategory) {
		return contentTypeSchema.create(contentCategory);
	}

	async findContentCategoryByName(name) {
		return contentTypeSchema.findOne({ where: { content_type_name: name } });
	}

	async getAllContentCategory() {
		return contentTypeSchema.findAll();
	}

	async deleteContentCategory(contentId) {
		return contentTypeSchema.destroy({
			where: {
				id: contentId,
			},
		});
	}

	async updateContentCategory(updatedValue, options) {
		return contentTypeSchema.update(updatedValue, options);
	}

	async getContentCategory(categoryId) {
		return contentTypeSchema.findByPk(categoryId);
	}
};
