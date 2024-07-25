const { content_likes: contentLikesSchema, content_images: contentImagesSchema } = require("../Database/Schemas");

module.exports = class {
	async createLike(likeDetails) {
		return contentLikesSchema.create(likeDetails);
	}

	async deleteLike(contentId, userId) {
		return contentLikesSchema.destroy({
			where: {
				[Op.and]: [{ content_image_id: contentId }, { user_id: userId }],
			},
		});
	}

	async isUserLiked(contentId, userId) {
		return contentLikesSchema.findOne({
			where: {
				[Op.and]: [{ content_image_id: contentId }, { user_id: userId }],
			},
		});
	}

	async getLikesByUser(userId, limit = 10, page = 1) {
		const offset = (page - 1) * limit;

		const { count, rows: userImageList } = await contentLikesSchema.findAndCountAll({
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

		return { count, userImageList, hasMore };
	}

};
