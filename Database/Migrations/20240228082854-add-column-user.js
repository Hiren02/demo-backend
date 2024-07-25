"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("users", "haveAllRequired", {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: true,
			}),
			queryInterface.changeColumn("users", "first_name", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
			queryInterface.changeColumn("users", "last_name", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
			queryInterface.changeColumn("users", "email", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
		]);
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("users", "haveAllRequired", ),
			queryInterface.changeColumn("users", "first_name", {
				type: Sequelize.STRING,
				allowNull: false,
			}),
			queryInterface.changeColumn("users", "last_name", {
				type: Sequelize.STRING,
				allowNull: false,
			}),
			queryInterface.changeColumn("users", "email", {
				type: Sequelize.STRING,
				allowNull: false,
			}),
		]);
	},
};
