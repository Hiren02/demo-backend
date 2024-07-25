"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class cart_products extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			cart_products.belongsTo(models.cart_details, {
				foreignKey: "cart_id",
				onDelete: "CASCADE",
			});

			cart_products.belongsTo(models.products, {
				foreignKey: "product_id",
				targetKey: "id",
				as: "productDetails",
				onDelete: "CASCADE",
			});
		}
	}

	const updateTotalItems = async (cart_id, sequelize) => {
		const cartDetailsModel = sequelize.models.cart_details;

		const totalItems = await cart_products.sum("quantity", {
			where: { cart_id },
		});

		await cartDetailsModel.update({ total_items: totalItems }, { where: { id: cart_id } });
	};

	cart_products.init(
		{
			cart_id: {
				type: DataTypes.INTEGER,
			},
			product_id: {
				type: DataTypes.STRING,
			},
			variant_id: {
				type: DataTypes.INTEGER,
			},
			price: {
				type: DataTypes.DECIMAL,
			},
			quantity: {
				type: DataTypes.INTEGER,
			},
			tax: {
				type: DataTypes.DECIMAL,
			},
			discount: {
				type: DataTypes.DECIMAL,
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
			modelName: "cart_products",
			hooks: {
				afterCreate: async (product, options) => {
					const { cart_id } = product;
					await updateTotalItems(cart_id, sequelize);
				},
				afterBulkUpdate: async (value, options) => {
					const {
						where: { cart_id },
					} = value;
					await updateTotalItems(cart_id, sequelize);
				},
				afterBulkDestroy: async (value, options) => {
					const {
						where: { cart_id },
					} = value;
					await updateTotalItems(cart_id, sequelize);
				},
			},
		}
	);
	return cart_products;
};
