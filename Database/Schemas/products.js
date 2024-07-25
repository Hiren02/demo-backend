"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class products extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			products.hasMany(models.product_tags, {
				foreignKey: "product_id",
				as: "tags",
				onDelete: "CASCADE",
			});

			products.hasMany(models.product_images, {
				foreignKey: "product_id",
				as: "images",
				onDelete: "CASCADE",
			});

			products.hasMany(models.product_options, {
				foreignKey: "product_id",
				as: "options",
				onDelete: "CASCADE",
			});

			products.hasMany(models.product_variants, {
				foreignKey: "product_id",
				as: "variants",
				onDelete: "CASCADE",
			});

			products.hasMany(models.cart_products, {
				foreignKey: "product_id",
				as: "productDetails",
				onDelete: "CASCADE",
			});

			products.hasMany(models.order_products, {
				foreignKey: "product_id",
				as: "products",
				onDelete: "CASCADE",
			});
		}
	}
	products.init(
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.TEXT("medium"),
			},
			blueprint_id: {
				type: DataTypes.INTEGER,
			},
			user_id: {
				type: DataTypes.INTEGER,
			},
			shop_id: {
				type: DataTypes.INTEGER,
			},
			print_provider_id: {
				type: DataTypes.INTEGER,
			},
			visible: {
				type: DataTypes.BOOLEAN,
			},
			is_locked: {
				type: DataTypes.BOOLEAN,
			},
			is_printify_express_eligible: {
				type: DataTypes.BOOLEAN,
			},
			is_printify_express_enabled: {
				type: DataTypes.BOOLEAN,
			},
			is_economy_shipping_eligible: {
				type: DataTypes.BOOLEAN,
			},
			is_economy_shipping_enabled: {
				type: DataTypes.BOOLEAN,
			},
			background: {
				type: DataTypes.STRING,
			},
			position: {
				type: DataTypes.STRING,
			},
			image_id: {
				type: DataTypes.STRING,
			},
			name: {
				type: DataTypes.STRING,
			},
			type: {
				type: DataTypes.STRING,
			},
			height: {
				type: DataTypes.INTEGER,
			},
			width: {
				type: DataTypes.INTEGER,
			},
			x: {
				type: DataTypes.FLOAT,
			},
			y: {
				type: DataTypes.FLOAT,
			},
			scale: {
				type: DataTypes.FLOAT,
			},
			angle: {
				type: DataTypes.FLOAT,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
			deletedAt: {
				type: DataTypes.DATE,
			},
			update_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
		},
		{
			sequelize,
			modelName: "products",
			paranoid: true,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "update_at",
		}
	);
	return products;
};
