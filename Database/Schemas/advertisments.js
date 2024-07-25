"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class advertisments extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	advertisments.init(
		{
			advertisment_title: {
				type: DataTypes.STRING,
			},
			advertisment_description: {
				type: DataTypes.STRING,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
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
			modelName: "advertisments",
		}
	);
	return advertisments;
};
