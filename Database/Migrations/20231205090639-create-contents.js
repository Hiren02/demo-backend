"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"contents",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				content_name: {
					type: Sequelize.STRING,
				},
				content_description: {
					type: Sequelize.STRING,
				},
				content_type_id: {
					type: Sequelize.INTEGER,
				},
				content_style_id: {
					type: Sequelize.INTEGER,
				},
				content_generation_text: {
					type: Sequelize.STRING,
				},
				is_active: {
					type: Sequelize.BOOLEAN,
					defaultValue: true,
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
			"contents",
			{
				fields: ["content_type_id"],
				type: "foreign key",
				name: "FK_Contents_Content_Type_Id",
				references: {
					table: "content_types",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);

		queryInterface.addConstraint(
			"contents",
			{
				fields: ["content_style_id"],
				type: "foreign key",
				name: "FK_Contents_Content_Style_Id",
				references: {
					table: "content_styles",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("contents");
	},
};
