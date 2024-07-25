const { content_images: gallerySchema, content_likes: galleryLikeSchema, content_types: contentTypeSchema, pre_variation_image: preVariationImageSchema } = require("../Database/Schemas");
let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async uploadImageInGallery(galleryData) {
		return await gallerySchema.create(galleryData);
	}

	async deleteGalleryImage(imageId) {
		return await gallerySchema.destroy({
			where: {
				id: imageId,
			},
		});
	}

	async getGalleryImageId(imageId) {
		return await gallerySchema.findByPk(imageId);
	}

	async getGalleryImage(limit = 10, page = 1, order = null, filters = {}) {
		const offset = (page - 1) * limit;
		return gallerySchema.findAll({
			attributes: ["id", "image_url", [sequelize.literal(`(select count(cl.id) from content_likes cl where cl.content_image_id = content_images.id )`), "like_count"]],
			order: order ?? [[sequelize.literal(`(select count(id) from content_likes cl where cl.content_image_id = content_images.id )`), "DESC"]],
			limit,
			include: [{ model: contentTypeSchema }],
			page,
			offset,
			...filters,
		});
	}

	async getGalleryImagesWeb(limit = 10, page = 1, field = "created_at", order = "DESC", includeFilters = {}, filters = {}, userId = "") {
		const attributesList = [
			"user_id",
			"id",
			"image_url",
			"created_at",
			[sequelize.literal(`(select count(cl.id) from content_likes cl where cl.content_image_id = content_images.id)`), "like_count"],
		];

		if (userId) {
			const imageLikedByUser = [sequelize.literal(`(select 1 from content_likes where user_id = ${userId} and content_image_id = content_images.id )`), "is_liked"];

			const imageBookMarkedByUser = [sequelize.literal(`(select 1 from content_bookmarks where user_id = ${userId} and content_image_id = content_images.id )`), "is_bookmark"];

			attributesList.push(imageBookMarkedByUser, imageLikedByUser);
		}

		const offset = Math.max(0, (page - 1) * limit);
		const { count, rows: galleryImageList } = await gallerySchema.findAndCountAll({
			...filters,
			attributes: attributesList,
			order: [
				[field, order],
				["created_at", "DESC"],
			],
			include: [{ model: contentTypeSchema, ...includeFilters }],
			page,
			limit,
			offset,
			nested: true,
			distinct: true,
		});

		let hasMore = false;
		if (offset + limit < count) hasMore = true;

		return { count, galleryImageList, hasMore, currentPage: page };
	}

	async storePreVariationImage(imageInfo) {
		return await preVariationImageSchema.create(imageInfo);
	}

	async getUserGeneratedImages(limit = 10, page = 1, userId) {
		const attributesList = ["user_id", "id", "image_url", "created_at"];

		const offset = (page - 1) * limit;
		try {
			const { count, rows: galleryImageList } = await gallerySchema.findAndCountAll({
				attributes: attributesList,
				order: [["created_at", "DESC"]],
				limit,
				page,
				offset,
				distinct: true,
				where: {
					user_id: userId,
				},
			});
			let hasMore = false;
			if (offset + limit < count) hasMore = true;
			return { count, galleryImageList, hasMore, currentPage: page };
		} catch (err) {
			console.log(err.message);
			console.log(err.stack);
		}
	}
};
