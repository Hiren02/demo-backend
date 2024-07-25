"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("product_variants", {
			pk_id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4(),
			},
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			product_id: {
				type: Sequelize.STRING,
				references: {
					model: "products",
					key: "id",
				},
				onDelete: "CASCADE",
			},

			sku: {
				type: Sequelize.STRING,
			},
			cost: {
				type: Sequelize.INTEGER,
			},
			price: {
				type: Sequelize.INTEGER,
			},
			title: {
				type: Sequelize.STRING,
			},
			grams: {
				type: Sequelize.INTEGER,
			},
			is_enable: {
				type: Sequelize.BOOLEAN,
			},
			is_default: {
				type: Sequelize.BOOLEAN,
			},
			is_available: {
				type: Sequelize.BOOLEAN,
			},
			is_printify_express_eligible: {
				type: Sequelize.BOOLEAN,
			},
			quantity: {
				type: Sequelize.INTEGER,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("product_variants");
	},
};
