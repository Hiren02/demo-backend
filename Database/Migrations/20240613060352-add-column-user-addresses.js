"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("user_addresses", "is_default", {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			}),
			queryInterface.addColumn("user_addresses", "country_label", {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "US",
			}),
		]);
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([queryInterface.removeColumn("user_addresses", "is_default"), queryInterface.removeColumn("user_addresses", "country_label")]);
	},
};
