const express = require("express");
const countryCodeController = new (require("../../Controllers/setting/Setting.controller"))();
const bannerImageController = new (require("../../Controllers/bannerImages/BannerImage.Controller"))();
const contentPage = new (require("../../Controllers/contentPage/contentPage.controller"))();
const contactUs = new (require("../../Controllers/contactUs/contactUs.controller"))();
const commonController = new (require("../../Controllers/common/Common.controller"))();
const Authentication = require("../../Middleware/authentication");
const router = express.Router();

router.route("/country-code/get-all-country-code").get(Authentication.blank, countryCodeController.getAllCountryCode);
router.route("/banner-images/get-all-banner-images").get(Authentication.blank, bannerImageController.getAllBannerImage);
router.route("/content-pages/:page").get(contentPage.getPagesByName);
router.route("/contact-us").post(contactUs.createContactUs);
router.route("/get-print-area").get(Authentication.user, commonController.getProductPrintArea);
router.route("/get-product-category").get(Authentication.user, commonController.getCategoryList);
module.exports = router;
