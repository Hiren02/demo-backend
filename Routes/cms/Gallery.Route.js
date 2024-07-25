const express = require("express");
const Authentication = require("../../Middleware/authentication");
const galleryController = new (require("../../Controllers/gallery/gallery.Controller"))();
const galleryValidator = require("../../Middleware/Validators/Gallery.Validators");
const fileValidator = new (require("../../Middleware/fileValidator"))();
const upload = require("../../Managers/File.Manager").upload;

const router = express.Router();

router.post("/upload-image", upload().single("image"), fileValidator.checkProfileImageType, galleryValidator.createGalleryImage, Authentication.admin, galleryController.addImageInGallery);
router.delete("/delete-gallery-image/:id", Authentication.admin, galleryController.removeImageFromGallery);
router.get("/get-gallery-images", Authentication.admin, galleryController.getContent);
module.exports = router;
