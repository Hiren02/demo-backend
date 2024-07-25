const { content_bookmarks: contentBookmarkSchema, content_images: contentImagesSchema } = require("../Database/Schemas");

module.exports = class {
	async createBookMark(bookMarkDetails) {
		return contentBookmarkSchema.create(bookMarkDetails);
	}

	async deleteBookMark(id) {
		return contentBookmarkSchema.destroy({
			where: {
				id: id,
			},
		});
	}

	async getBookMarksByUser(userId, limit = 10, page = 1) {
		const offset = (page - 1) * limit;

		const { count, rows: bookmarkImageList } = await contentBookmarkSchema.findAndCountAll({
			attributes: [
				"id",
				"created_at",
				"user_id",
				"content_image_id",
				[sequelize.literal(`(select count(cl.id) from content_likes cl where cl.content_image_id = content_bookmarks.content_image_id)`), "like_count"],
				[sequelize.literal(`(select 1 from content_likes where user_id = content_bookmarks.user_id and content_image_id = content_bookmarks.content_image_id )`), "is_liked"],
			],
			limit,
			page,
			offset,
			order: [["created_at", "DESC"]],
			where: {
				user_id: userId,
			},
			include: [{ model: contentImagesSchema }],
		});

		let hasMore = false;
		if (offset + limit < count) hasMore = true;

		return { count, bookmarkImageList, hasMore, currentPage: +page };
	}

	async getBookMarkByImageAndUser(userId, imageId) {
		return contentBookmarkSchema.findOne({
			where: {
				[Op.and]: [{ user_id: userId }, { content_image_id: imageId }],
			},
		});
	}
};
