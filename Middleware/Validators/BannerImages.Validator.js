const { body, param } = require("express-validator");

exports.createBannerImage = [body("order", "VALIDATION.BANNER.ORDER").isNumeric().notEmpty()];
exports.updateBannerImage = [body("order", "VALIDATION.BANNER.ORDER").isNumeric().optional(), param("id", "VALIDATION.PARAMS.ID_NOT_FOUND").notEmpty().isNumeric()];

exports.paramsRequired = [param("id", "VALIDATION.PARAMS.ID_NOT_FOUND").notEmpty().isNumeric()];
