const express = require("express");
const decryptRequest = new (require("../../Middleware/decryptRequest"))();
const Authentication = require("../../Middleware/authentication");
const userProfileController = new (require("../../Controllers/userProfile/UserProfile.Controller"))();
const userProfileValidator = require("../../Middleware/Validators/UserProfile.Validator");
const upload = require("../../Managers/File.Manager").upload;
const fileValidator = new (require("../../Middleware/fileValidator"))();
const router = express.Router();

router.route("/me").get(Authentication.user, userProfileController.getMeDetails);
router
	.route("/update-user-details")
	.patch(upload().single("image"), fileValidator.checkProfileImageType, userProfileValidator.updateDetails, Authentication.user, userProfileController.updateUserDetails);
router.route("/delete-account").delete(Authentication.user, userProfileController.deleteUserAccount);
router.route("/get-user-address").get(Authentication.user, userProfileController.getUserAllAddress);
router.route("/create-user-address").post(userProfileValidator.createAndUpdateUserAddress, Authentication.user, userProfileController.createNewUserAddress);
router.route("/update-user-address/:id").patch(userProfileValidator.createAndUpdateUserAddress, Authentication.user, userProfileController.updateUserAddress);
router.route("/delete-user-address/:id").delete(Authentication.user, userProfileController.deleteUserAddress);

module.exports = router;
