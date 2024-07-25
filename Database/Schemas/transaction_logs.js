"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class transaction_logs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

            transaction_logs.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

            transaction_logs.belongsTo(models.order_details, {
				foreignKey: "order_id",
				onDelete: "CASCADE",
			});
		}
	}
	transaction_logs.init(
		{
			transaction_number: {
				type: DataTypes.STRING,
			},
			user_id: {
				type: DataTypes.INTEGER,
			},
			order_id: {
				type: DataTypes.INTEGER,
			},
			is_success: {
				type: DataTypes.BOOLEAN,
			},
			transaction_amount: {
				type: DataTypes.DECIMAL,
			},
			is_refund: {
				type: DataTypes.BOOLEAN,
			},
			refund_date: {
				type: DataTypes.DATE,
			},
			refund_amount: {
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
			modelName: "transaction_logs",
		}
	);
	return transaction_logs;
};
