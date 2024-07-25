"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"user_addresses",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				user_id: {
					type: Sequelize.INTEGER,
				},
				address_type: {
					type: Sequelize.STRING,
				},
				address_line_1: {
					type: Sequelize.STRING,
				},
				street: {
					type: Sequelize.STRING,
				},
				house_number: {
					type: Sequelize.STRING,
				},
				city: {
					type: Sequelize.STRING,
				},
				state: {
					type: Sequelize.STRING,
				},
				country: {
					type: Sequelize.STRING,
				},
				zip_code: {
					type: Sequelize.STRING,
				},
				latitude: {
					type: Sequelize.STRING,
				},
				longitude: {
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

		queryInterface.addConstraint(
			"user_addresses",
			{
				fields: ["user_id"],
				type: "foreign key",
				name: "FK_User_Address_User_Id",
				references: {
					table: "users",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("user_addresses");
	},
};
