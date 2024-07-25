const { country_code: countryCodesSchema } = require("../Database/Schemas");

module.exports = class {
	async addCountryCode(countryCode) {
		return await countryCodesSchema.create(countryCode);
	}

	async removeCountryCodeById(countryCodeId) {
		return await countryCodesSchema.destroy({
			where: {
				id: countryCodeId,
			},
		});
	}

	async getCountryCodeById(countryCodeId) {
		return await countryCodesSchema.findByPk(countryCodeId);
	}

	async getCountryCode(countryCode) {
		return await countryCodesSchema.findOne({
			where: {
				country_code: countryCode,
			},
		});
	}

	async getAllCountryCode() {
		return await countryCodesSchema.findAll();
	}

	async updateCountryCode(updatedValue, options) {
		return await countryCodesSchema.update(updatedValue, options);
	}
};
