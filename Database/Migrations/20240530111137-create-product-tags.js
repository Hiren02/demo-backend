"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("product_tags", {
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
			name: {
				type: Sequelize.STRING,
			},
		});

		await queryInterface.addIndex("product_tags", ["name"]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("product_tags");
	},
};
