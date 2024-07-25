"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class country_code extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	country_code.init(
		{
			country_code: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			is_active: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: true,
			},
		},
		{
			sequelize,
			modelName: "country_code",
		}
	);
	return country_code;
};
