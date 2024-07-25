"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("product_variant_options", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			variant_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "product_variants",
					key: "pk_id",
				},
				onDelete: "CASCADE",
			},
			value_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("product_variant_options");
	},
};
