"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class content_styles extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			content_styles.hasMany(models.contents, {
				foreignKey: "content_style_id",
				onDelete: "CASCADE",
			});
		}
	}
	content_styles.init(
		{
			content_style_name: {
				type: DataTypes.STRING,
			},
			content_style: {
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
			modelName: "content_styles",
		}
	);
	return content_styles;
};
