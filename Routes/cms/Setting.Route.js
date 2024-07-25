const express = require("express");
const countryCodeController = new (require("../../Controllers/setting/Setting.controller"))();
const contactUs = new (require("../../Controllers/contactUs/contactUs.controller"))();
const Authentication = require("../../Middleware/authentication");
const router = express.Router();

router.route("/country-code/get-all-country-code").get(Authentication.blank, countryCodeController.getAllCountryCode);

router
	.route("/country-code/:id")
	.get(Authentication.admin, countryCodeController.getCountryCodeById)
	.patch(Authentication.admin, countryCodeController.updateCountryCode)
	.delete(Authentication.admin, countryCodeController.deleteCountryCode);

router.post("/country-code", Authentication.admin, countryCodeController.addCountryCode);

router.get("/country-code/toggle-active-status/:id", Authentication.admin, countryCodeController.toggleActiveStatus);

router.get("/list-all-contact-us", Authentication.admin, contactUs.getAllContactUs);

module.exports = router;
