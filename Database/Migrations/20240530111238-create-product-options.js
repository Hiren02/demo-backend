"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("product_options", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4(),
			},
			product_id: {
				type: Sequelize.STRING,
				references: {
					model: "products",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			display_in_preview: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("product_options");
	},
};
