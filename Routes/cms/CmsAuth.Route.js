const express = require("express");
const authController = new (require("../../Controllers/auth/Authorization.Controller"))();
const authValidators = require("../../Middleware/Validators/Auth.Validator");
const decryptRequest = new (require("../../Middleware/decryptRequest"))();
const Authentication = require("../../Middleware/authentication");

const router = express.Router();

router.route("/sign-in-email").post(decryptRequest.decrypt, authValidators.signInEmail, Authentication.blank, authController.adminSignIn);
router.route("/logout").get(Authentication.admin, authController.logout)
module.exports = router;
