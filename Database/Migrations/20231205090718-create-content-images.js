"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"content_images",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				content_type_id: {
					type: Sequelize.INTEGER,
				},
				prompt: {
					type: Sequelize.TEXT("medium"),
				},
				user_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				image_url: {
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
			"content_images",
			{
				fields: ["content_type_id"],
				type: "foreign key",
				name: "FK_Content_Images_Type_Id",
				references: {
					table: "content_types",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);
		queryInterface.addConstraint(
			"content_images",
			{
				fields: ["user_id"],
				type: "foreign key",
				name: "FK_Content_Images_User_Id",
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
		await queryInterface.dropTable("content_images");
	},
};
