"use strict";
const { Model } = require("sequelize");
const FileManager = require("../../Managers/File.Manager");
module.exports = (sequelize, DataTypes) => {
	class content_images extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			content_images.hasMany(models.content_bookmarks, {
				foreignKey: "content_image_id",
				onDelete: "CASCADE",
			});

			content_images.belongsTo(models.content_types, {
				foreignKey: "content_type_id",
				onDelete: "CASCADE",
			});

			content_images.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			content_images.hasMany(models.content_likes, {
				foreignKey: "content_image_id",
				onDelete: "CASCADE",
			});
		}
	}
	content_images.init(
		{
			image_url: {
				type: DataTypes.STRING,
				allowNull: false,
				get() {
					return FileManager.getUrl(`gallery-images/${this.getDataValue("user_id")}`, this.getDataValue("image_url"));
				},
			},
			content_type_id: {
				type: DataTypes.INTEGER,
			},
			user_id: {
				type: DataTypes.INTEGER,
			},
			prompt: {
				type: DataTypes.TEXT("medium"),
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
			modelName: "content_images",
		}
	);
	return content_images;
};
