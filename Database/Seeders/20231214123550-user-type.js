"use strict";

const { USER_TYPE_ENUM } = require("../../Configs/constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		return await queryInterface.bulkInsert("user_types", [{ type: USER_TYPE_ENUM.user }, { type: USER_TYPE_ENUM.admin }, { type: USER_TYPE_ENUM.superAdmin }]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		return await queryInterface.delete("user_types", {
			where: {
				[Op.and]: [{ type: USER_TYPE_ENUM.user }, { type: USER_TYPE_ENUM.admin }, { type: USER_TYPE_ENUM.superAdmin }],
			},
		});
	},
};
