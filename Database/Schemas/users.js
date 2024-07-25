"use strict";
const { Model } = require("sequelize");
const EncryptionHandler = require("../../Configs/encrypt");
const FileManager = require("../../Managers/File.Manager");

module.exports = (sequelize, DataTypes) => {
	class users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			users.belongsTo(models.user_type, {
				foreignKey: "type",
				onDelete: "CASCADE",
			});

			users.hasMany(models.content_images, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			users.hasMany(models.user_addresses, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			users.hasMany(models.notifications, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			users.hasMany(models.user_login_sessions, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			users.hasMany(models.cart_details, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			users.hasMany(models.order_details, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			users.hasMany(models.transaction_logs, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});

			users.hasMany(models.pre_variation_image, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});
		}
	}
	users.init(
		{
			first_name: {
				type: DataTypes.STRING,
			},
			last_name: {
				type: DataTypes.STRING,
			},
			email: {
				type: DataTypes.STRING,
			},
			country_code: {
				type: DataTypes.STRING,
			},
			phone_number: {
				type: DataTypes.STRING,
			},
			password: {
				type: DataTypes.STRING,
			},
			user_profile_image: {
				type: DataTypes.STRING,
				get() {
					if (this.getDataValue("user_profile_image")) return FileManager.getUrl(`profile-images/${this.getDataValue("id")}`, this.getDataValue("user_profile_image"));
					return null;
				},
			},
			type: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			is_user_verified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			device_token: {
				type: DataTypes.STRING,
			},
			signup_type: {
				type: DataTypes.ENUM,
				values: ["GOOGLE", "APPLE", "NORMAL"],
				defaultValue: "NORMAL",
			},
			social_id: {
				type: DataTypes.STRING,
			},
			otp: {
				type: DataTypes.INTEGER,
			},
			otp_expire: {
				type: DataTypes.DATE,
			},
			forgot_otp: {
				type: DataTypes.INTEGER,
			},
			forgot_otp_expire: {
				type: DataTypes.DATE,
			},
			password_reset: {
				type: DataTypes.BOOLEAN,
			},
			resend_otp_attempts: {
				type: DataTypes.INTEGER,
			},
			block_duration: {
				type: DataTypes.BIGINT,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
			created_by: {
				type: DataTypes.INTEGER,
			},
			deletedAt: {
				type: DataTypes.DATE,
			},
			update_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.fn("NOW"),
			},
			updated_by: {
				type: DataTypes.INTEGER,
			},
			haveAllRequired: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},

		{
			defaultScope: {
				attributes: {
					exclude: ["password", "otp", "otp_expire"],
				},
			},
			scopes: {
				withPassword: {
					attributes: {},
				},
			},
			sequelize,
			modelName: "users",
			paranoid: true,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "update_at",
		}
	);

	users.beforeCreate((user) => {
		const encryptionHandler = new EncryptionHandler();
		const { data: encryptedPassword } = encryptionHandler.encrypt(user.password);
		user.password = encryptedPassword;
	});

	return users;
};
