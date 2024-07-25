const express = require("express");
const Authentication = require("../../Middleware/authentication");
const galleryController = new (require("../../Controllers/gallery/gallery.Controller"))();
const contentTypeController = new (require("../../Controllers/contentType/contentType.controller"))();

const router = express.Router();

router.get("/toggle-like-image/:id", Authentication.user, galleryController.toggleLike);
router.get("/get-all-images", galleryController.getContent);
router.get("/get-all-images-with-likes-bookmark", Authentication.user, galleryController.getContent);

router.get("/toggle-bookmark-image/:id", Authentication.user, galleryController.toggleBookmark);
router.get("/user-bookmark-images", Authentication.user, galleryController.getUserBookMarkImage);
router.get("/user-like-image", Authentication.user, galleryController.getUserLikeImage);
router.get("/get-user-generate", Authentication.user, galleryController.getUserGeneratedImage);
router.get("/get-images-category", Authentication.blank, contentTypeController.getAllContentType);
module.exports = router;
