const NodeCache = require("node-cache");
const fs = require("fs");
const path = require("path");

class Cache {
	constructor(stdTTL = 0, checkPeriod = 120) {
		this.cache = new NodeCache({ stdTTL, checkPeriod });
	}

	setKey(key, value, ttl) {
		return this.cache.set(key, value, ttl);
	}

	getValue(key) {
		return this.cache.get(key);
	}

	isKeyExists(key) {
		return this.cache.has(key);
	}

	deleteKey(key) {
		return this.cache.del(key);
	}

	getTtl(key) {
		return this.cache.getTtl(key);
	}

	readCacheFromDisk() {
		const cacheData = fs.readFileSync(path.join(__dirname, "../", ".cache", "cache.json"), "utf-8");
		const parsedData = JSON.parse(cacheData);

		this.cache.mset(parsedData);

	}

	writeCacheOnDisk() {
		try {
			
			const cacheData = Object.entries(this.cache.data).map((data) => {
				return {
					ttl: this.getTtl(data[0]),
					val: data[1].v,
					key: data[0],
				};
			});

			fs.writeFileSync(path.join(__dirname, "../", ".cache", "cache.json"), JSON.stringify(cacheData), "utf-8");
		} catch (err) {
			console.log(err.message);
		}
	}
}

module.exports = new Cache();
