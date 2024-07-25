"use strict";
const { Model } = require("sequelize");
const FileManager = require("../../Managers/File.Manager");
module.exports = (sequelize, DataTypes) => {
	class banner_images extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	banner_images.init(
		{
			image: {
				type: DataTypes.STRING,
				allowNull: false,
				get() {
					if (this.getDataValue("image")) return FileManager.getUrl("banner-images", this.getDataValue("image"));
					return null;
				},
			},
			order: {
				type: DataTypes.NUMBER,
				allowNull: false,
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
			modelName: "banner_images",
		}
	);
	return banner_images;
};
