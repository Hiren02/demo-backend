"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class content_types extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			content_types.hasMany(models.content_images, {
				foreignKey: "content_type_id",
				onDelete: "CASCADE",
			});
		}
	}
	content_types.init(
		{
			content_type_name: {
				type: DataTypes.STRING,
				unique: true,
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
			modelName: "content_types",
		}
	);
	return content_types;
};
