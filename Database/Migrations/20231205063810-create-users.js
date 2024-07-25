"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"users",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				first_name: {
					allowNull: false,
					type: Sequelize.STRING,
				},
				last_name: {
					allowNull: false,
					type: Sequelize.STRING,
				},
				email: {
					allowNull: false,
					type: Sequelize.STRING,
				},
				country_code: {
					allowNull: false,
					type: Sequelize.STRING,
				},
				type: {
					allowNull: false,
					type: Sequelize.INTEGER,
				},
				phone_number: {
					allowNull: false,
					type: Sequelize.STRING,
				},
				password: {
					type: Sequelize.STRING,
				},
				user_profile_image: {
					type: Sequelize.STRING,
				},
				is_user_verified: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
				},
				device_token: {
					type: Sequelize.STRING,
				},
				signup_type: {
					type: Sequelize.ENUM,
					values: ["GOOGLE", "APPLE", "NORMAL"],
					defaultValue: "NORMAL",
				},
				social_id: {
					type: Sequelize.STRING,
				},
				otp: {
					type: Sequelize.INTEGER,
				},
				otp_expire: {
					type: Sequelize.DATE,
				},
				forgot_otp: {
					type: Sequelize.INTEGER,
				},
				forgot_otp_expire: {
					type: Sequelize.DATE,
				},
				password_reset: {
					type: Sequelize.BOOLEAN,
				},
				resend_otp_attempts: {
					type: Sequelize.INTEGER,
				},
				block_duration: {
					type: Sequelize.BIGINT,
				},
				is_active: {
					type: Sequelize.BOOLEAN,
					defaultValue: true,
				},
				deletedAt: {
					allowNull: true,
					type: Sequelize.DATE,
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
			"users",
			{
				fields: ["type"],
				type: "foreign key",
				name: "FK_user_types",
				references: {
					table: "user_types",
					field: "id",
				},
				onDelete: "cascade",
			},
			{ logging: true }
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("users");
	},
};
