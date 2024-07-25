"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class cart_details extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			cart_details.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			cart_details.hasMany(models.cart_products, {
				foreignKey: "cart_id",
				onDelete: "CASCADE",
			});
		}
	}
	cart_details.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
			},
			total_items: {
				type: DataTypes.INTEGER,
			},
			total_discount: {
				type: DataTypes.DECIMAL,
			},
			total_tax: {
				type: DataTypes.DECIMAL,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
			created_by: {
				type: DataTypes.INTEGER,
			},
			update_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
			updated_by: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "cart_details",
		}
	);
	return cart_details;
};
