const express = require("express");
const bannerImageController = new (require("../../Controllers/bannerImages/BannerImage.Controller"))();
const Authentication = require("../../Middleware/authentication");
const upload = require("../../Managers/File.Manager").upload;
const bannerImageValidator = require("../../Middleware/Validators/BannerImages.Validator");
const fileValidator = new (require("../../Middleware/fileValidator"))();

const router = express.Router();

router
	.route("/create-banner-image")
	.post(Authentication.admin, bannerImageValidator.createBannerImage, upload().single("image"), fileValidator.checkProfileImageType, bannerImageController.createBannerImage);

router.route("/get-all-banner-image").get(Authentication.admin, bannerImageController.getAllBannerImage);

router
	.route("/:id")
	.get(Authentication.admin, bannerImageValidator.paramsRequired, bannerImageController.getBannerById)
	.delete(Authentication.admin, bannerImageValidator.paramsRequired, bannerImageController.deleteBannerById)
	.patch(Authentication.admin, bannerImageValidator.updateBannerImage, upload().single("image"), fileValidator.checkProfileImageType, bannerImageController.updateBannerImage);

module.exports = router;
