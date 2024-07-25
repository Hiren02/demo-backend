"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return await Promise.all([
			queryInterface.changeColumn("users", "country_code", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
			queryInterface.changeColumn("users", "phone_number", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
		]);
	},
	async down(queryInterface, Sequelize) {
		return await Promise.all([
			queryInterface.changeColumn("users", "country_code", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
			queryInterface.changeColumn("users", "phone_number", {
				type: Sequelize.STRING,
				allowNull: true,
			}),
		]);
	},
};
