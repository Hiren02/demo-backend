const { body, param } = require("express-validator");

exports.createContentType = [body("content_type_name", "VALIDATION.CONTENT_TYPE.NAME").isString().notEmpty().trim().isLength({ max: 255 })];

exports.updateContentType = [body("content_type_name", "VALIDATION.CONTENT_TYPE.NAME").isString().notEmpty().trim(), param("id", "VALIDATION.PARAMS.ID_NOT_FOUND").notEmpty().isLength({ max: 255 })];

exports.deleteContentType = [param("id", "VALIDATION.PARAMS.ID_NOT_FOUND").notEmpty()];
