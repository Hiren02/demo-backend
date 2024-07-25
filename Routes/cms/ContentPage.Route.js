const express = require("express");
const Authentication = require("../../Middleware/authentication");
const contentPage = new (require("../../Controllers/contentPage/contentPage.controller"))();

const router = express.Router();

router.route("/get-all-pages").get(Authentication.admin, contentPage.getAllPages);

router.route("/create-page").post(
	Authentication.admin,
	contentPage.createPages
);

router.route("/:page").get(Authentication.admin, contentPage.getPagesByName).delete(Authentication.admin, contentPage.deletePage)
router.route("/:id").patch(Authentication.admin, contentPage.updatePage);

module.exports = router;
