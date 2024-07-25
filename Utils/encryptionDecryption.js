const crypto = require("crypto");

exports.encryptionResponse = function (data) {
	try {
		const stringifyData = JSON.stringify(data);

		const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGO, Buffer.from(process.env.ENCRYPTION_KEY, "hex"), Buffer.from(process.env.ENCRYPTION_IV, "hex"));

		let encryptedData = cipher.update(stringifyData, "utf-8", "hex");
		encryptedData += cipher.final("hex");

		return encryptedData;
	} catch (err) {
		return data;
	}
};

exports.decryptRequest = function (data) {
	try {
		const decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGO, Buffer.from(process.env.ENCRYPTION_KEY, "hex"), Buffer.from(process.env.ENCRYPTION_IV, "hex"));

		let decryptedData = decipher.update(data, "hex", "utf-8");

		decryptedData += decipher.final("utf8");

		decryptedData = JSON.parse(decryptedData);
		return decryptedData;
	} catch (err) {
		return data;
	}
};
