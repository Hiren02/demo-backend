const FileManager = require("../../Managers/File.Manager");
const userModel = new (require("../../Models/User.Model"))();

const galleryModel = new (require("../../Models/Gallery.Model"))();
const galleryLikeImageModel = new (require("../../Models/ContentLike.Model"))();
const contentCategoryModel = new (require("../../Models/ContentType.Model"))();
const galleryBookmarkModel = new (require("../../Models/ContentBookmark.Model"))();

module.exports = class {
	async addImageInGallery(req, res) {
		try {
			const galleryImageType = await contentCategoryModel.getContentCategory(req.body.content_type_id);

			if (!galleryImageType) {
				return res.handler.badRequest("VALIDATION.CONTENT_TYPE.PROVIDE_VALID_IMAGE_TYPE");
			}

			const createGalleryImage = {
				image_url: req.file.filename,
				content_type_id: galleryImageType.id,
				created_by: req?.admin?.id ?? req.superAdmin.id,
				updated_by: req?.admin?.id ?? req.superAdmin.id,
				user_id: req?.admin?.id ?? req.superAdmin.id,
			};
			const promiseList = await Promise.all([
				galleryModel.uploadImageInGallery(createGalleryImage),
				FileManager.uploadToCloud(req.file.filename, `gallery-images/${req?.admin?.id ?? req.superAdmin.id}`, "original"),
			]);
			res.handler.success(promiseList[0]);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async removeImageFromGallery(req, res) {
		try {
			if (!req.params.id) return res.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");

			const galleryImage = await galleryModel.getGalleryImageId(req.params.id);

			if (!galleryImage) {
				return res.handler.notFound(undefined, "RESPONSE.GALLERY.IMAGE_NOT_EXISTS");
			}

			await Promise.all([galleryModel.deleteGalleryImage(req.params.id), FileManager.delete(FileManager.getFileNameFromUrl(galleryImage.image_url), "gallery-images")]);
			return res.handler.success(undefined, "RESPONSE.GALLERY.IMAGE_DELETE_SUCCESS");
		} catch (err) {
			res.handler.serverError();
		}
	}

	async toggleLike(req, res) {
		try {
			const isUserLiked = await galleryLikeImageModel.isUserLiked(req.params.id, req.user.id);
			if (isUserLiked) {
				await galleryLikeImageModel.deleteLike(req.params.id, req.user.id);
				return res.handler.success();
			}

			await galleryLikeImageModel.createLike({
				content_image_id: req.params.id,
				user_id: req.user.id,
				created_by: req.user.id,
				updated_by: req.user.id,
			});
			return res.handler.success();
		} catch (err) {
			res.handler.serverError();
		}
	}

	async toggleBookmark(req, res) {
		try {
			const isBookMarkExists = await galleryBookmarkModel.getBookMarkByImageAndUser(req.user.id, req.params.id);

			if (isBookMarkExists) {
				await galleryBookmarkModel.deleteBookMark(isBookMarkExists.id);
			} else {
				await galleryBookmarkModel.createBookMark({ user_id: req.user.id, content_image_id: req.params.id, created_by: req.user.id, updated_by: req.user.id });
			}

			return res.handler.success();
		} catch (err) {
			res.handler.serverError();
		}
	}

	async getUserBookMarkImage(req, res) {
		try {
			if (req.query.limit) req.query.limit = parseInt(req.query.limit);
			if (req.query.page) req.query.page = parseInt(req.query.page);
			const userBookMark = await galleryBookmarkModel.getBookMarksByUser(req.user.id, req.query.limit, req.query.page);
			return res.handler.success(userBookMark);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async getUserLikeImage(req, res) {
		try {
			if (req.query.limit) req.query.limit = parseInt(req.query.limit);
			if (req.query.page) req.query.page = parseInt(req.query.page);
			const userLike = await galleryLikeImageModel.getLikesByUser(req.user.id, req.query.limit, req.query.page);
			return res.handler.success(userLike);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async getContent(req, res) {
		try {
			const includeFilters = {};
			const { adminUserList: admins } = await userModel.getAdminUser(["id", "type"], undefined, undefined, true, true);
			const adminIdList = admins.map((admin) => admin.id);

			const filters = {
				where: {
					created_by: {
						[Op.in]: adminIdList,
					},
				},
			};
			const userId = req.user?.id ?? "";
			if (req.query.category) {
				includeFilters.where = {
					id: req.query.category,
				};
			}

			if (req.query.newArrival) {
				filters.where = {
					...filters.where,
					created_at: {
						[Op.gte]: sequelize.literal(`(select max(created_at) - interval 5 day from content_images  order by created_at desc)`),
					},
				};
			}
			let field = "created_at";
			let order = "DESC";

			if (req.query.topSelected) {
				field = "like_count";
			}

			if (req.query.limit) req.query.limit = parseInt(req.query.limit);
			if (req.query.page) req.query.page = parseInt(req.query.page);

			const galleryImages = await galleryModel.getGalleryImagesWeb(req.query.limit, req.query.page, field, order, includeFilters, filters, userId);

			return res.handler.success(galleryImages);
		} catch (err) {
			res.handler.serverError();
		}
	}

	async getUserGeneratedImage(req, res) {
		try {
			if (req.query.limit) req.query.limit = parseInt(req.query.limit);
			if (req.query.page) req.query.page = parseInt(req.query.page);

			const galleryImages = await galleryModel.getUserGeneratedImages(req.query.limit, req.query.page, req.user.id);

			return res.handler.success(galleryImages);
		} catch (err) {
			res.handler.serverError();
		}
	}
};
