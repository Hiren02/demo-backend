"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class product_tags extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			product_tags.belongsTo(models.products, {
				foreignKey: "product_id",
				targetKey: "id",
				onDelete: "CASCADE",
			});
		}
	}
	product_tags.init(
		{
			product_id: {
				type: DataTypes.STRING,
			},
			name: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: "product_tags",
		}
	);
	return product_tags;
};
