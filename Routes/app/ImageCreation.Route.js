const express = require("express");
const Authentication = require("../../Middleware/authentication");
const imageCreationController = new (require("../../Controllers/ImageCreation/ImageCreation.Controller"))();
const fileValidator = new (require("../../Middleware/fileValidator"))();
const upload = require("../../Managers/File.Manager").upload;
const imageCreationValidation = require("../../Middleware/Validators/CreateImage.Validators");

const router = express.Router();

router.post("/create-image", imageCreationValidation.createImageValidator, Authentication.user, imageCreationController.createImage);
router.post("/edit-image", upload().single("image"), fileValidator.checkImageSize, Authentication.user, imageCreationController.variationOfImage);

module.exports = router;
