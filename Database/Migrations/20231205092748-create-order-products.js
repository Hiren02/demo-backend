"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("order_products", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			order_id: {
				type: Sequelize.STRING,
				allowNull: false,
				references: {
					model: "order_details",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			item_id: {
				type: Sequelize.STRING,
				allowNull: false,
				primaryKey: true,
			},
			product_id: {
				type: Sequelize.STRING,
				allowNull: false,
				references: {
					model: "products",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			variant_id: {
				type: Sequelize.INTEGER,
			},
			print_provider_id: {
				type: Sequelize.INTEGER,
			},
			shipping_cost: {
				type: Sequelize.DECIMAL,
			},
			cost: {
				type: Sequelize.DECIMAL,
			},
			status: {
				type: Sequelize.STRING,
			},
			title: {
				type: Sequelize.STRING,
			},
			price: {
				type: Sequelize.DECIMAL,
			},
			variant_label: {
				type: Sequelize.STRING,
			},
			sku: {
				type: Sequelize.STRING,
			},
			country: {
				type: Sequelize.STRING,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW"),
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("order_products");
	},
};
