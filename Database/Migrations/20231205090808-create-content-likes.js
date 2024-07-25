"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"content_likes",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				content_image_id: {
					type: Sequelize.INTEGER,
				},
				user_id: {
					type: Sequelize.INTEGER,
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
			"content_likes",
			{
				fields: ["content_image_id"],
				type: "foreign key",
				name: "FK_Content_Likes_Content_Image_Id",
				references: {
					table: "content_images",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);

		queryInterface.addConstraint(
			"content_likes",
			{
				fields: ["user_id"],
				type: "foreign key",
				name: "FK_Content_Likes_User_Id",
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
		await queryInterface.dropTable("content_likes");
	},
};
