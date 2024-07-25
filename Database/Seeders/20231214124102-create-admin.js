"use strict";
const { USER_TYPE_ENUM } = require("../../Configs/constants");
const EncryptionHandler = require("../../Configs/encrypt");

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

		const [adminType] = await queryInterface.sequelize.query(`SELECT * FROM user_types WHERE type = ${USER_TYPE_ENUM.superAdmin} LIMIT 1`, { type: Sequelize.QueryTypes.SELECT });

		const { data: hashedPassword } = new EncryptionHandler().encrypt("Test@123");

		return await queryInterface.bulkInsert("users", [
			{
				first_name: "admin",
				last_name: "admin",
				is_user_verified: 1,
				is_active: 1,
				email: "admin@openxcell.com",
				password: hashedPassword,
				country_code: "+91",
				phone_number: "1234567890",
				created_by: 1,
				type: adminType.id,
			},
			{
				first_name: "user",
				last_name: "user",
				is_user_verified: 1,
				is_active: 1,
				email: "user@openxcell.com",
				password: hashedPassword,
				country_code: "+91",
				phone_number: "9876543210",
				created_by: 1,
				type: 1,
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
