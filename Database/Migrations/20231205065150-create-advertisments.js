"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"advertisments",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				advertisment_title: {
					type: Sequelize.STRING,
				},
				advertisment_description: {
					type: Sequelize.STRING,
				},
				is_active: {
					type: Sequelize.BOOLEAN,
					defaultValue: true,
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
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("advertisments");
	},
};
