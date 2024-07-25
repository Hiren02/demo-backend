"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"transaction_logs",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				transaction_number: {
					type: Sequelize.STRING,
				},
				user_id: {
					type: Sequelize.INTEGER,
				},
				order_id: {
					type: Sequelize.STRING,
				},
				is_success: {
					type: Sequelize.BOOLEAN,
				},
				transaction_amount: {
					type: Sequelize.DECIMAL,
				},
				is_refund: {
					type: Sequelize.BOOLEAN,
				},
				refund_date: {
					type: Sequelize.DATE,
				},
				refund_amount: {
					type: Sequelize.DECIMAL,
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
			"transaction_logs",
			{
				fields: ["user_id"],
				type: "foreign key",
				name: "FK_Transaction_Logs_User_Id",
				references: {
					table: "users",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);

		queryInterface.addConstraint(
			"transaction_logs",
			{
				fields: ["order_id"],
				type: "foreign key",
				name: "FK_Transaction_Logs_Order_Id",
				references: {
					table: "order_details",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("transaction_logs");
	},
};
