const FileManager = require("../../Managers/File.Manager");
const bannerImageModel = new (require("../../Models/BannerImage.Model"))();

module.exports = class {
	async createBannerImage(req, res) {
		try {
			const bannerImage = {
				image: req.file.filename,
				created_by: req?.admin?.id ?? req.superAdmin.id,
				updated_by: req?.admin?.id ?? req.superAdmin.id,
			};
			if (req.body.order) {
				const isOrderExists = await bannerImageModel.getBannerImageByOrder(req.body.order);
				if (isOrderExists) {
					return res.handler.conflict(undefined, "RESPONSE.BANNER.INVALID_ORDER");
				}
				bannerImage.order = req.body.order;
			}

			const newBannerImage = await bannerImageModel.createBannerImage(bannerImage);
			await FileManager.uploadToCloud(req.file.filename, "banner-images", "original");
			return res.handler.success(newBannerImage);
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async getAllBannerImage(req, res) {
		try {
			let bannerImages;
			if (req.admin) {
				bannerImages = await bannerImageModel.getAllBannerImages();
			} else {
				bannerImages = await bannerImageModel.getAllBannerImages({
					where: { is_active: true },
				});
			}
			return res.handler.success(bannerImages);
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async getBannerById(req, res) {
		try {
			const bannerImage = await bannerImageModel.getBannerImageById(req.params.id);

			if (!bannerImage) return res.handler.notFound(undefined, "RESPONSE.BANNER.BANNER_IMAGE_NOT_FOUND");
			return res.handler.success(bannerImage);
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async deleteBannerById(req, res) {
		try {
			const bannerImage = await bannerImageModel.getBannerImageById(req.params.id);

			if (!bannerImage) return res.handler.notFound(undefined, "RESPONSE.BANNER.BANNER_IMAGE_NOT_FOUND");

			await Promise.all([bannerImageModel.deleteBannerImage(req.params.id), FileManager.delete(FileManager.getFileNameFromUrl(bannerImage.image), "banner-images")]);

			return res.handler.success("RESPONSE.BANNER.DELETE_SUCCESS");
		} catch (err) {
			res.handler.serverError(err);
		}
	}

	async updateBannerImage(req, res) {
		try {
			const bannerImage = await bannerImageModel.getBannerImageById(req.params.id);
			if (!bannerImage) return res.handler.notFound(undefined, "RESPONSE.BANNER.BANNER_IMAGE_NOT_FOUND");
			const updateBanner = { updated_by: req?.admin?.id ?? req.superAdmin.id};
			if (req.file?.filename) {
				await Promise.all([FileManager.delete(FileManager.getFileNameFromUrl(bannerImage.image), "banner-images"), FileManager.uploadToCloud(req.file.filename, "banner-images", "original")]);
				updateBanner.image = req.file.filename;
			}
			if (req.body.order) {
				const isOrderExists = await bannerImageModel.getBannerImageByOrder(req.body.order);
				if (isOrderExists) {
					return res.handler.conflict(undefined, "RESPONSE.BANNER.INVALID_ORDER");
				}
				updateBanner.order = req.body.order;
			}
			const updatedBannerImage = await bannerImageModel.updateBannerImage(updateBanner, { where: { id: req.params.id } });

			return res.handler.success(updatedBannerImage);
		} catch (err) {
			res.handler.serverError(err);
		}
	}
};
