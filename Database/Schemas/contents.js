"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class contents extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			contents.belongsTo(models.content_types, {
				foreignKey: "content_type_id",
				onDelete: "CASCADE",
			});

			contents.belongsTo(models.content_styles, {
				foreignKey: "content_style_id",
				onDelete: "CASCADE",
			});
		}
	}
	contents.init(
		{
			content_name: {
				type: DataTypes.STRING,
			},
			content_description: {
				type: DataTypes.STRING,
			},
			content_type_id: {
				type: DataTypes.INTEGER,
			},
			content_style_id: {
				type: DataTypes.INTEGER,
			},
			content_generation_text: {
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
			modelName: "contents",
		}
	);
	return contents;
};
