"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class product_variants extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			product_variants.belongsTo(models.products, {
				foreignKey: "product_id",
				targetKey: "id",
				onDelete: "CASCADE",
			});

			product_variants.hasMany(models.product_variant_options, {
				foreignKey: "variant_id",
				as: "options",
				targetKey: "pk_id",
				onDelete: "CASCADE",
			});
		}
	}
	product_variants.init(
		{
			pk_id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4(),
			},
			id: {
				type: DataTypes.INTEGER,
			},
			product_id: {
				type: DataTypes.STRING,
			},
			sku: {
				type: DataTypes.STRING,
			},
			cost: {
				type: DataTypes.INTEGER,
			},
			price: {
				type: DataTypes.INTEGER,
			},
			title: {
				type: DataTypes.STRING,
			},
			grams: {
				type: DataTypes.INTEGER,
			},
			is_enable: {
				type: DataTypes.BOOLEAN,
			},
			is_default: {
				type: DataTypes.BOOLEAN,
			},
			is_available: {
				type: DataTypes.BOOLEAN,
			},
			is_printify_express_eligible: {
				type: DataTypes.BOOLEAN,
			},
			quantity: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "product_variants",
		}
	);
	return product_variants;
};
