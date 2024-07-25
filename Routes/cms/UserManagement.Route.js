const express = require("express");
const authController = new (require("../../Controllers/auth/Authorization.Controller"))();
const userManagementController = new (require("../../Controllers/userManagement/UserManagement.Controller"))();
const adminManagementController = new (require("../../Controllers/adminManagement/admin.controller"))();
const authValidators = require("../../Middleware/Validators/Auth.Validator");
const userProfileValidator = require("../../Middleware/Validators/UserProfile.Validator");
const userProfileController = new (require("../../Controllers/userProfile/UserProfile.Controller"))();
const decryptRequest = new (require("../../Middleware/decryptRequest"))();
const fileValidator = new (require("../../Middleware/fileValidator"))();

const upload = require("../../Managers/File.Manager").upload;
const Authentication = require("../../Middleware/authentication");
const router = express.Router();

router.route("/create-user").post(upload().single("image"), fileValidator.checkProfileImageType, authValidators.createUserByAdmin, Authentication.admin, authController.signUp);
router
	.route("/create-new-admin")
	.post(upload().single("image"), fileValidator.checkProfileImageType, authValidators.createAdminByAdmin, Authentication.superAdmin, adminManagementController.createAdmin);

router.route("/get-all-users").get(Authentication.admin, userManagementController.getAllUser);
router.route("/get-all-admin-users").get(Authentication.superAdmin, adminManagementController.getAllAdminUser);

router
	.route("/update-admin-details/:userId")
	.patch(upload().single("image"), fileValidator.checkProfileImageType, authValidators.updateUser, Authentication.superAdmin, userManagementController.updateUser);

router.route("/:userId/send-reset-password").get(Authentication.admin, userManagementController.sendPasswordChangeMail);
router.route("/delete-admin/:id").delete(Authentication.superAdmin, userManagementController.deleteUserById);

router
	.route("/update-admin-details")
	.patch(upload().single("image"), fileValidator.checkProfileImageType, userProfileValidator.updateDetails, Authentication.admin, userProfileController.updateUserDetails);

router.route("/admin-change-password").post(authValidators.changePassword, Authentication.admin, authController.changePassword);

router.route("/me").get(Authentication.admin, userProfileController.getMeDetails);

router.route("/admin-forgot-password").post(authValidators.verifyForgotPasswordAdmin, Authentication.blank, authController.forgotPassword);
router.route("/reset-password-admin/:token/:id").patch(authValidators.resetPassword, Authentication.setPasswordAdmin, authController.resetPassword);
router.route("/get-user-address/:userId").get(Authentication.admin, userProfileController.getUserAllAddress);
router.route("/create-user-address/:id").post(userProfileValidator.createAndUpdateUserAddress, Authentication.admin, userProfileController.createNewUserAddress);
router.route("/update-user-address/:id/:userId").patch(userProfileValidator.createAndUpdateUserAddress, Authentication.admin, userProfileController.updateUserAddress);
router.route("/delete-user-address/:id/:userId").delete(Authentication.admin, userProfileController.deleteUserAddress);

router.route("/:id").delete(Authentication.admin, userManagementController.deleteUserById).get(Authentication.admin, userManagementController.getUserById);
router.route("/:userId").patch(upload().single("image"), fileValidator.checkProfileImageType, authValidators.updateUser, Authentication.admin, userManagementController.updateUser);

module.exports = router;
