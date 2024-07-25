"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class product_images extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			product_images.belongsTo(models.products, {
				foreignKey: "product_id",
				onDelete: "CASCADE",
				hooks: true,
			});
		}
	}
	product_images.init(
		{
			product_id: {
				type: DataTypes.INTEGER,
			},
			src: {
				type: DataTypes.STRING,
			},
			position: {
				type: DataTypes.STRING,
			},
			is_default: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			is_selected_for_publishing: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			order: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "product_images",
		}
	);
	return product_images;
};
