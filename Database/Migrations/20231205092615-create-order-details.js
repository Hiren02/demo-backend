"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("order_details", {
			id: {
				type: Sequelize.STRING,
				primaryKey: true,
			},
			user_id: {
				type: Sequelize.INTEGER,
				references: {
					model: "users",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			shop_id: {
				type: Sequelize.INTEGER,
			},
			user_address_id: {
				type: Sequelize.INTEGER,
				references: {
					model: "user_addresses",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			total_price: {
				type: Sequelize.DECIMAL,
			},
			total_shipping: {
				type: Sequelize.DECIMAL,
			},
			total_tax: {
				type: Sequelize.DECIMAL,
			},
			status: {
				type: Sequelize.STRING,
			},
			shipping_method: {
				type: Sequelize.INTEGER,
			},
			fulfilment_type: {
				type: Sequelize.STRING,
			},
			printify_connect_url: {
				type: Sequelize.STRING,
			},
			printify_connect_id: {
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
		await queryInterface.dropTable("order_details");
	},
};
