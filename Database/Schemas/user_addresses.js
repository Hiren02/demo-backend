"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user_addresses extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			user_addresses.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			user_addresses.hasMany(models.order_details, {
				foreignKey: "user_address_id",
				onDelete: "CASCADE",
			});
		}
	}
	user_addresses.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
			},
			address_type: {
				type: DataTypes.STRING,
			},
			address_line_1: {
				type: DataTypes.STRING,
			},
			street: {
				type: DataTypes.STRING,
			},
			house_number: {
				type: DataTypes.STRING,
			},
			city: {
				type: DataTypes.STRING,
			},
			state: {
				type: DataTypes.STRING,
			},
			country: {
				type: DataTypes.STRING,
			},
			country_label: {
				type: DataTypes.STRING,
			},
			is_default: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			zip_code: {
				type: DataTypes.STRING,
			},
			latitude: {
				type: DataTypes.STRING,
			},
			longitude: {
				type: DataTypes.STRING,
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
			modelName: "user_addresses",
		}
	);
	return user_addresses;
};
