const { Sequelize } = require("sequelize");
const { product_tags: ProductTagsSchema } = require("../Database/Schemas");

module.exports = class {
	getCategoryList() {
		return ProductTagsSchema.findAll({ attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("name")), "name"]] });
	}
};
