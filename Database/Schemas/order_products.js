"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class order_products extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			order_products.belongsTo(models.order_details, {
				foreignKey: "order_id",
				onDelete: "CASCADE",
			});

			order_products.belongsTo(models.products, {
				foreignKey: "product_id",
				as: "products",
				onDelete: "CASCADE",
			});
		}
	}
	order_products.init(
		{
			order_id: {
				type: DataTypes.STRING,
			},
			item_id: {
				type: DataTypes.STRING,
			},
			product_id: {
				type: DataTypes.STRING,
			},
			quantity: {
				type: DataTypes.INTEGER,
			},
			variant_id: {
				type: DataTypes.INTEGER,
			},
			print_provider_id: {
				type: DataTypes.INTEGER,
			},
			shipping_cost: {
				type: DataTypes.DECIMAL,
			},
			cost: {
				type: DataTypes.DECIMAL,
			},
			status: {
				type: DataTypes.STRING,
			},
			title: {
				type: DataTypes.STRING,
			},
			price: {
				type: DataTypes.DECIMAL,
			},
			variant_label: {
				type: DataTypes.STRING,
			},
			sku: {
				type: DataTypes.STRING,
			},
			country: {
				type: DataTypes.STRING,
			},

			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
		},
		{
			sequelize,
			modelName: "order_products",
		}
	);
	return order_products;
};
