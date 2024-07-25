"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class notifications extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			notifications.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});
		}
	}
	notifications.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
			},
			notification_message: {
				type: DataTypes.STRING,
			},
			notification_type: {
				type: DataTypes.STRING,
			},
			is_read: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
			created_by: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "notifications",
		}
	);
	return notifications;
};
