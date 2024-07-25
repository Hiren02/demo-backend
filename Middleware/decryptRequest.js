const { decryptRequest } = require("../Utils/encryptionDecryption");

module.exports = class {
	decrypt(req, res, next) {
		if (req.headers["content-type"] === "application/encrypted-json") {
			req.body = decryptRequest(req.body.data);
		}
		next();
	}
};
