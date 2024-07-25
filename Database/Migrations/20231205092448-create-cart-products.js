"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"cart_products",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				cart_id: {
					type: Sequelize.INTEGER,
				},
				product_id: {
					type: Sequelize.STRING,
				},
				price: {
					type: Sequelize.DECIMAL,
				},
				quantity: {
					type: Sequelize.INTEGER,
				},
				tax: {
					type: Sequelize.DECIMAL,
				},
				discount: {
					type: Sequelize.DECIMAL,
				},
				created_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.fn("now"),
				},
				created_by: {
					type: Sequelize.INTEGER,
				},
				update_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.fn("now"),
				},
				updated_by: {
					type: Sequelize.INTEGER,
				},
			},
			{ logging: true }
		);

		queryInterface.addConstraint(
			"cart_products",
			{
				fields: ["cart_id"],
				type: "foreign key",
				name: "FK_Cart_Products_Cart_Id",
				references: {
					table: "cart_details",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);

		queryInterface.addConstraint(
			"cart_products",
			{
				fields: ["product_id"],
				type: "foreign key",
				name: "FK_Cart_Products_Product_Id",
				references: {
					table: "products",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("cart_products");
	},
};
