"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("banner_images", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			image: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			order: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      update_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      updated_by: {
        type: Sequelize.INTEGER,
      },
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("banner_images");
	},
};
