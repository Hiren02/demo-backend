"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"notifications",
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
				notification_message: {
					type: Sequelize.STRING,
				},
				notification_type: {
					type: Sequelize.STRING,
				},
				is_read: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
				},
				created_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.fn("now"),
				},
				created_by: {
					type: Sequelize.INTEGER,
				},
			},
			{ logging: true }
		);

		queryInterface.addConstraint(
			"notifications",
			{
				fields: ["user_id"],
				type: "foreign key",
				name: "FK_Notifications_User_Id",
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
		await queryInterface.dropTable("notifications");
	},
};
