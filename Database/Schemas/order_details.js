"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class order_details extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			order_details.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			order_details.belongsTo(models.user_addresses, {
				foreignKey: "user_address_id",
				onDelete: "CASCADE",
			});

			order_details.hasMany(models.order_products, {
				foreignKey: "order_id",
				as: "line_items",
				onDelete: "CASCADE",
			});
		}
	}
	order_details.init(
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
			},
			shop_id: {
				type: DataTypes.INTEGER,
			},
			user_address_id: {
				type: DataTypes.INTEGER,
			},
			total_price: {
				type: DataTypes.DECIMAL,
			},
			total_cost: {
				type: DataTypes.DECIMAL,
			},
			total_shipping: {
				type: DataTypes.DECIMAL,
			},
			total_tax: {
				type: DataTypes.DECIMAL,
			},
			status: {
				type: DataTypes.STRING,
			},
			shipping_method: {
				type: DataTypes.INTEGER,
			},
			fulfilment_type: {
				type: DataTypes.STRING,
			},
			printify_connect_url: {
				type: DataTypes.STRING,
			},
			printify_connect_id: {
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
			modelName: "order_details",
		}
	);
	return order_details;
};
