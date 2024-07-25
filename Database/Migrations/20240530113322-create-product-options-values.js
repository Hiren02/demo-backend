"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("product_options_values", {
			pk_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			reference_id: {
				type: Sequelize.UUID,
			},
			title: {
				type: Sequelize.TEXT,
			},
		});

		await queryInterface.addConstraint("product_options_values", {
			fields: ["reference_id"],
			type: "foreign key",
			name: "fk_product_options_values_reference_id_to_product_options",
			references: {
				table: "product_options",
				field: "id",
			},
			onDelete: "CASCADE",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint("product_options_values", "fk_product_options_values_reference_id_to_product_options");

		await queryInterface.dropTable("product_options_values");
	},
};
