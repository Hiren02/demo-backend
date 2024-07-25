module.exports = class {
	checkImageType(req, res, next) {
		if (req.files?.image) {
			const isAnyNotImage = req.files.image.every((images) => {
				return images.mimetype === "image/png" || images.mimetype === "image/jpg" || images.mimetype === "image/jpeg";
			});

			if (!isAnyNotImage) return res.handler.badRequest("VALIDATION.IMAGE_FORMAT.INVALID");
		}
		if (req.files?.coverImage) {
			if (req.files?.coverImage[0].mimetype !== "image/png" && req.files?.coverImage[0].mimetype !== "image/jpg" && req.files?.coverImage[0].mimetype !== "image/jpeg") {
				return res.handler.badRequest("VALIDATION.IMAGE_FORMAT.INVALID");
			}
		}

		next();
	}

	checkProfileImageType(req, res, next) {
		if (req?.file) {
			if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg") {
				return res.handler.badRequest("VALIDATION.IMAGE_FORMAT.INVALID");
			}
		}
		next();
	}

	checkImageIsPng(req, res, next) {
		if (req.file) {
			if (req.file.mimetype !== "image/png") {
				return res.handler.badRequest("VALIDATION.IMAGE_FORMAT.PNG_REQUIRED");
			}
			if (req.file.size >= 4194304) {
				return res.handler.badRequest("Image size must be less than 4mb");
			}
			next();
		} else {
			return res.handler.badRequest("VALIDATION.IMAGE_FORMAT.IMAGE_REQUIRED");
		}
	}

	checkImageSize(req, res, next) {
		if (req.file) {
			if (req.file.size >= 3145728) {
				return res.handler.badRequest("Image size must be less than 3mb");
			}
			next();
		} else {
			return res.handler.badRequest("VALIDATION.IMAGE_FORMAT.IMAGE_REQUIRED");
		}
	}
};
