"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("products", {
			id: {
				type: Sequelize.STRING,
				primaryKey: true,
			},
			title: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.TEXT("medium"),
			},
			blueprint_id: {
				type: Sequelize.INTEGER,
			},
			user_id: {
				type: Sequelize.INTEGER,
			},
			shop_id: {
				type: Sequelize.INTEGER,
			},
			print_provider_id: {
				type: Sequelize.INTEGER,
			},
			visible: {
				type: Sequelize.BOOLEAN,
			},
			is_locked: {
				type: Sequelize.BOOLEAN,
			},
			is_printify_express_eligible: {
				type: Sequelize.BOOLEAN,
			},
			is_printify_express_enabled: {
				type: Sequelize.BOOLEAN,
			},
			is_economy_shipping_eligible: {
				type: Sequelize.BOOLEAN,
			},
			is_economy_shipping_enabled: {
				type: Sequelize.BOOLEAN,
			},
			background: {
				type: Sequelize.STRING,
			},
			position: {
				type: Sequelize.STRING,
			},
			image_id: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			type: {
				type: Sequelize.STRING,
			},
			height: {
				type: Sequelize.INTEGER,
			},
			width: {
				type: Sequelize.INTEGER,
			},
			x: {
				type: Sequelize.FLOAT,
			},
			y: {
				type: Sequelize.FLOAT,
			},
			scale: {
				type: Sequelize.FLOAT,
			},
			angle: {
				type: Sequelize.FLOAT,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW"),
			},
			deletedAt: {
				type: Sequelize.DATE,
			},
			update_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW"),
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("products");
	},
};
