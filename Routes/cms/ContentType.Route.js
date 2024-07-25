const express = require("express");
const Authentication = require("../../Middleware/authentication");
const contentType = new (require("../../Controllers/contentType/contentType.controller"))();
const contentTypeValidator = require("../../Middleware/Validators/ContentType.Validator");

const router = express.Router();

router.get("/get-all-content-category", Authentication.admin, contentType.getAllContentType);
router.post("/create-content-category", contentTypeValidator.createContentType, Authentication.admin, contentType.createContentType);
router
	.route("/:id")
	.patch(contentTypeValidator.updateContentType, Authentication.admin, contentType.updateContentType)
	.delete(contentTypeValidator.deleteContentType, Authentication.admin, contentType.deleteContentType);

module.exports = router;
