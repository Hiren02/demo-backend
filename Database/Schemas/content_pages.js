"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class content_pages extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	content_pages.init(
		{
			page: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			title:{
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			content: {
				type: DataTypes.TEXT("medium"),
				allowNull: false,
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
			modelName: "content_pages",
		}
	);
	return content_pages;
};
