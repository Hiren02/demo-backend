const axios = require("axios");

const METHOD = {
	GET: "get",
	POST: "post",
	PUT: "put",
	DELETE: "delete",
	PATCH: "patch",
};

const BASEURL = process.env.PRINTIFY_BASE_URL;
const TOKEN = process.env.PRINTIFY_API_TOKEN;
// CHECK BELOW FOR SAMPLE DATA TO BE PASSED
class Api {
	constructor() {
		this.baseURL = BASEURL;
		this.accessToken = TOKEN;
		this.toastMessage = "";
	}

	// URL FOR API
	// REFER SAMPLE JSON AT BOTTOM FOR DATA VALUES
	get(url, data) {
		return new Promise((resolve, reject) => {
			this.api(METHOD.GET, url, data)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	}

	post(url, data) {
		return new Promise((resolve, reject) => {
			this.api(METHOD.POST, url, data)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	}

	put(url, data) {
		return new Promise((resolve, reject) => {
			this.api(METHOD.PUT, url, data)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	}

	delete(url, data) {
		return new Promise((resolve, reject) => {
			this.api(METHOD.DELETE, url, data)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	}

	patch(url, data) {
		return new Promise((resolve, reject) => {
			this.api(METHOD.PATCH, url, data)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	}

	api(method, url, data) {
		return new Promise((resolve, reject) => {
			let axiosConfig = {};
			axiosConfig.method = method;

			axiosConfig.url = this.baseURL + url;

			axiosConfig.headers = this.setHeaders();
			if (data) {
				if (data.params) axiosConfig.params = data.params;

				if (data.data) axiosConfig.data = data.data;
			}

			axios(axiosConfig)
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				});
		});
	}

	setHeaders() {
		let headers = {};
		headers["accept-language"] = "en";
		headers["Content-Type"] = "application/json";
		headers["Authorization"] = "Bearer " + this.accessToken;
		return headers;
	}
}

module.exports = { Api };
