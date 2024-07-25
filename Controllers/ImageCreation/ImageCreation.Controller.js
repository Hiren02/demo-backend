const fs = require("fs");
const path = require("path");
const ImageCreation = require("../../Managers/ImageCreation.Manager");
const FileManager = require("../../Managers/File.Manager");
const galleryModel = new (require("../../Models/Gallery.Model"))();

module.exports = class {
	async createImage(req, res) {
		try {
			const image = await ImageCreation.createImage(req.body.prompt, undefined, req.body.style, req.body.size);
			const filename = `${req.user.id}_${new Date().getTime()}.png`;

			await Promise.all([
				FileManager.uploadB64ImageToCloud(image?.data[0].b64_json, `gallery-images/${req.user.id}`, filename),
				galleryModel.uploadImageInGallery({
					image_url: filename,
					created_by: req.user.id,
					updated_by: req.user.id,
					user_id: req.user.id,
					prompt: req.body.prompt,
				}),
			]);

			res.handler.success(
				{
					image_url: FileManager.getUrl(`gallery-images/${req.user.id}`, filename),
				},
				"SUCCESS_MESSAGES.IMAGE_CREATED"
			);
		} catch (err) {
			res.handler.serverError(undefined, undefined, err);
		}
	}

	async variationOfImage(req, res) {
		try {
			const isPngImage = req.file.mimetype === "image/png";

			const editedImage = await Promise.all([
				ImageCreation.variationOfImage(req.file.filename, isPngImage),
				galleryModel.uploadImageInGallery({
					image_url: req.file.filename,
					created_by: req.user.id,
					updated_by: req.user.id,
					user_id: req.user.id,
				}),
				galleryModel.storePreVariationImage({
					image_url: req.file.filename,
					user_id: req.user.id,
					created_by: req.user.id,
					updated_by: req.user.id,
				}),
				FileManager.uploadToCloud(req.file.filename, `gallery-images/upload/${req.user.id}`, "original"),
			]);

			if (!isPngImage) {
				fs.unlink(path.join(__dirname, "./../../Assets/Images/users/profile/" + `${path.parse(req.file.filename).name}.png`), function (err) {
					if (err) console.log(err);
				});
			}

			await FileManager.uploadB64ImageToCloud(editedImage[0]?.data[0]?.b64_json, `gallery-images/${req.user.id}`, req.file.filename);

			return res.handler.success(
				{
					image_url: FileManager.getUrl(`gallery-images/${req.user.id}`, req.file.filename),
				},
				"SUCCESS_MESSAGES.IMAGE_VARIANT"
			);
		} catch (err) {
			res.handler.serverError(undefined, undefined, err);
		}
	}
};
