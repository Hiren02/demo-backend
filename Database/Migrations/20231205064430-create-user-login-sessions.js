"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"user_login_sessions",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				user_id: {
					allowNull: false,
					type: Sequelize.INTEGER,
				},
				access_token: {
					type: Sequelize.STRING,
				},
				device_id: {
					type: Sequelize.STRING,
				},
				device_token: {
					type: Sequelize.STRING,
				},
				device_type: {
					type: Sequelize.STRING,
				},
				device_model: {
					type: Sequelize.STRING,
				},
				device_version: {
					type: Sequelize.STRING,
				},
				browser_type: {
					type: Sequelize.STRING,
				},
				system_type: {
					type: Sequelize.STRING,
				},
				location: {
					type: Sequelize.STRING,
				},
				last_access_date: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.fn("NOW"),
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
			"user_login_sessions",
			{
				fields: ["user_id"],
				type: "foreign key",
				name: "FK_User_Login_Sessions_User_Id",
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
		await queryInterface.dropTable("user_login_sessions");
	},
};
