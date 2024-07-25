const express = require("express");
const authRoute = require("./Authorization.Route");
const profileRoute = require("./UserProfile.Router");
const productRoute = require("./Products.Route");
const commonRoute = require("./Common.Route");
const galleryRoute = require("./Gallery.Router");
const imageCreationRoute = require("./ImageCreation.Route");
const cartRoute = require("./Cart.Route");
const orderRoute = require("./Order.Route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/profile", profileRoute);
router.use("/products", productRoute);
router.use("/common", commonRoute);
router.use("/gallery", galleryRoute);
router.use("/create", imageCreationRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);

module.exports = router;
