"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user_login_sessions extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			user_login_sessions.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});
		}
	}
	user_login_sessions.init(
		{
			user_id: {
				allowNull:false,
				type: DataTypes.INTEGER,
			},
			access_token: {
				type: DataTypes.STRING,
			},
			device_id: {
				type: DataTypes.STRING,
			},
			device_token: {
				type: DataTypes.STRING,
			},
			device_type: {
				type: DataTypes.STRING,
			},
			device_model: {
				type: DataTypes.STRING,
			},
			device_version: {
				type: DataTypes.STRING,
			},
			browser_type: {
				type: DataTypes.STRING,
			},
			system_type: {
				type: DataTypes.STRING,
			},
			location: {
				type: DataTypes.STRING,
			},
			last_access_date: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
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
			modelName: "user_login_sessions",
		}
	);
	return user_login_sessions;
};
