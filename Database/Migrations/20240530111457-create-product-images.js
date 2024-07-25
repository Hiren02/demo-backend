"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("product_images", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			product_id: {
				type: Sequelize.STRING,
				references: {
					model: "products",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			src: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			position: {
				type: Sequelize.STRING,
			},
			is_default: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			is_selected_for_publishing: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			order: {
				type: Sequelize.INTEGER,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("product_images");
	},
};
