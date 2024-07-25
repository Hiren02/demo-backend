const countryCodeModel = new (require("../../Models/CountryCode.Model"))();

module.exports = class {
	async addCountryCode(req, res) {
		try {
			const countryCodeExists = await countryCodeModel.getCountryCode(req.body.country_code);
			if (countryCodeExists) {
				return res.handler.conflict(undefined, "VALIDATION.COUNTRY_CODE.ALREADY_EXISTS");
			}

			const countryCode = await countryCodeModel.addCountryCode(req.body);
			return res.handler.success(countryCode);
		} catch (err) {
			return res.handler.serverError(err.message);
		}
	}

	async getAllCountryCode(req, res) {
		try {
			const allCountryCode = await countryCodeModel.getAllCountryCode();
			return res.handler.success(allCountryCode);
		} catch (err) {
			return res.handler.serverError(err.message);
		}
	}

	async getCountryCodeById(req, res) {
		try {
			const countryCode = await countryCodeModel.getCountryCodeById(req.params.id);
			if (!countryCode) {
				return res.handler.notFound(undefined, "RESPONSE.COUNTRY_CODE_NOT_FOUND");
			}
			return res.handler.success(countryCode);
		} catch (err) {
			return res.handler.serverError(err.message);
		}
	}

	async deleteCountryCode(req, res) {
		try {
			const isCountryCodeExists = await countryCodeModel.removeCountryCodeById(req.params.id);

			if (!isCountryCodeExists) {
				return res.handler.notFound(undefined, "RESPONSE.COUNTRY_CODE_NOT_FOUND");
			}

			return res.handler.success(isCountryCodeExists);
		} catch (err) {
			return res.handler.serverError(err.message);
		}
	}

	async updateCountryCode(req, res) {
		try {
			const countryCodeExists = await countryCodeModel.getCountryCode(req.body.country_code);
			if (countryCodeExists) {
				return res.handler.conflict(undefined, "VALIDATION.COUNTRY_CODE.ALREADY_EXISTS");
			}

			const updatedCountryCode = await countryCodeModel.updateCountryCode(req.body, {
				where: {
					id: req.params.id,
				},
			});

			return res.handler.success(updatedCountryCode);
		} catch (err) {
			return res.handler.serverError(err.message);
		}
	}

	async toggleActiveStatus(req, res) {
		try {
			const isCountryCodeExists = await countryCodeModel.getCountryCodeById(req.params.id);

			if (!isCountryCodeExists) {
				return res.handler.notFound(undefined, "RESPONSE.COUNTRY_CODE_NOT_FOUND");
			}
			isCountryCodeExists.is_active = !isCountryCodeExists.is_active;

			await isCountryCodeExists.save();
			return res.handler.success(isCountryCodeExists);
		} catch (err) {
			return res.handler.serverError();
		}
	}
};
