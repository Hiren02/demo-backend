const express = require("express");
const authController = new (require("../../Controllers/auth/Authorization.Controller"))();
const authValidators = require("../../Middleware/Validators/Auth.Validator");
const decryptRequest = new (require("../../Middleware/decryptRequest"))();
const upload = require("../../Managers/File.Manager").upload;
const Authentication = require("../../Middleware/authentication");
const fileValidator = new (require("../../Middleware/fileValidator"))();

const router = express.Router();

router.route("/sign-up").post(upload().single("image"), fileValidator.checkProfileImageType, authValidators.signUp, Authentication.blank, authController.signUp);

router.route("/sign-in-email").post(decryptRequest.decrypt, authValidators.signInEmail, Authentication.blank, authController.signIn);

router.route("/sign-in-phone-number").post(decryptRequest.decrypt, authValidators.signInPhone, Authentication.blank, authController.signIn);

router.route("/forgot-password").post(decryptRequest.decrypt, authValidators.verifyForgotPassword, Authentication.blank, authController.forgotPassword);
router.route("/forgot-password-otp-verification").post(Authentication.blank, authValidators.validateOtp, Authentication.resetPassword, authController.verifyForgotOtp);
router.route("/reset-password/:token/:id").patch(authValidators.resetPassword, Authentication.setPasswordAdmin, authController.resetPassword);
router.route("/change-password").post(authValidators.changePassword, Authentication.user, authController.changePassword);

router.route("/logout").get(Authentication.user, authController.logout);

router.route("/verify-otp").post(authValidators.validateOtp, Authentication.blank, authController.verifyOtp);

router.route("/resend-otp").post(authValidators.resendOtp, Authentication.blank, authController.resendOtp);
router.route("/resend-forgot-password-otp/:id").post(authValidators.resendOtp, Authentication.blank, authController.resendForgotOtp);

// router.route("/check-user-exists").post(authValidators.userCheck, Authentication.blank, authController.isUserExists);
router.route("/social-signup").post(authValidators.socialSignup, Authentication.blank, authController.socialSignUp);

module.exports = router;
