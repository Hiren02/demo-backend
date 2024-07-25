"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class pre_variation_image extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			pre_variation_image.belongsTo(models.users, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});
		}
	}
	pre_variation_image.init(
		{
			image_url: { type: DataTypes.STRING, allowNull: false },
			user_id: { type: DataTypes.NUMBER, allowNull: false },
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
			created_by: {
				type: DataTypes.INTEGER,
			},
			updated_at: {
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
			modelName: "pre_variation_image",
		}
	);
	return pre_variation_image;
};
