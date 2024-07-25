"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"content_styles",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				content_style_name: {
					type: Sequelize.STRING,
				},
				content_style: {
					type: Sequelize.STRING,
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
		await queryInterface.dropTable("content_styles");
	},
};
