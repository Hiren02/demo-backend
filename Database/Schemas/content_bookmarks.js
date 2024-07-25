"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class content_bookmarks extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			content_bookmarks.belongsTo(models.content_images, {
				foreignKey: "content_image_id",
				onDelete: "CASCADE",
			});

			content_bookmarks.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});
		}
	}
	content_bookmarks.init(
		{
			content_image_id: {
				type: DataTypes.INTEGER,
			},
			user_id: {
				type: DataTypes.INTEGER,
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
			modelName: "content_bookmarks",
		}
	);
	return content_bookmarks;
};
