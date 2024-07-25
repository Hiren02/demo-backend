const { body } = require("express-validator");

exports.createGalleryImage = [body("content_type_id", "VALIDATION.TYPE.PRODUCT_TYPE_ID_REQUIRED").notEmpty()];
