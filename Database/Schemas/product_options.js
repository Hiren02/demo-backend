"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class product_options extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			product_options.belongsTo(models.products, {
				foreignKey: "product_id",
				targetKey: "id",
				onDelete: "CASCADE",
			});

			product_options.hasMany(models.product_options_values, {
				foreignKey: "reference_id",
				as: "values",
				targetKey: "id",
				onDelete: "CASCADE",
			});
		}
	}
	product_options.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4(),
			},
			product_id: {
				type: DataTypes.STRING,
			},
			name: {
				type: DataTypes.STRING,
			},
			type: {
				type: DataTypes.STRING,
			},
			display_in_preview: {
				type: DataTypes.BOOLEAN,
			},
		},
		{
			sequelize,
			modelName: "product_options",
		}
	);
	return product_options;
};
