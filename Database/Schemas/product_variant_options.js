"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class product_variant_options extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			product_variant_options.belongsTo(models.product_variants, {
				foreignKey: "variant_id",
				targetKey: "pk_id",
				onDelete: "CASCADE",
			});
		}
	}
	product_variant_options.init(
		{
			variant_id: {
				type: DataTypes.UUID,
			},
			value_id: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "product_variant_options",
		}
	);
	return product_variant_options;
};
