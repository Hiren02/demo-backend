"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class product_options_values extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			product_options_values.belongsTo(models.product_options, {
				foreignKey: "reference_id",
				targetKey: "id",
				onDelete: "CASCADE",
			});
		}
	}
	product_options_values.init(
		{
			pk_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			id: {
				type: DataTypes.INTEGER,
			},
			reference_id: {
				type: DataTypes.UUID,
			},
			title: {
				type: DataTypes.TEXT,
			},
		},
		{
			sequelize,
			modelName: "product_options_values",
		}
	);
	return product_options_values;
};
