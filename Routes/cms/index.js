const express = require("express");
const authRoute = require("./CmsAuth.Route");
const userManagementRoute = require("./UserManagement.Route");
const productRoute = require("./Products.Route");
const contentPageRoute = require("./ContentPage.Route");
const settingPageRoute = require("./Setting.Route");
const bannerImageRouter = require("./BannerImages.Route");
const galleryRouter = require("./Gallery.Route");
const contentTypeRouter = require("./ContentType.Route");
const orderRouter = require("./Orders.Route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user-management", userManagementRoute);
router.use("/products", productRoute);
router.use("/content-pages", contentPageRoute);
router.use("/settings", settingPageRoute);
router.use("/banner-images", bannerImageRouter);
router.use("/gallery", galleryRouter);
router.use("/content-type", contentTypeRouter);
router.use("/order", orderRouter);

module.exports = router;
