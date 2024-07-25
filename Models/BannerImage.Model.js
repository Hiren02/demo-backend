const { banner_images: bannerImageSchema } = require("../Database/Schemas");

module.exports = class {
	createBannerImage(bannerImage) {
		return bannerImageSchema.create(bannerImage);
	}

	getAllBannerImages(filters={}) {
		return bannerImageSchema.findAll({
			order: [["order", "ASC"]],
			...filters
		});
	}

	getBannerImageById(id) {
		return bannerImageSchema.findByPk(id);
	}

	updateBannerImage(updatedValue, option) {
		return bannerImageSchema.update(updatedValue, option);
	}

	getBannerImageByOrder(order) {
		return bannerImageSchema.findOne({
			where: {
				order: order,
			},
		});
	}

	deleteBannerImage(id) {
		return bannerImageSchema.destroy({
			where: {
				id,
			},
		});
	}
};
