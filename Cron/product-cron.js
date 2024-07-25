const cron = require("node-cron");
const { Api } = require("../Utils/ApiHelper");
const productsModel = new (require("../Models/Product.Model"))();

cron.schedule("0 * * * *", async function () {
	console.log("running a task every hour");
	try {
		let productList = await new Api().get(`/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`, {});

		if (!productList && !productList?.data) return;

		await productsModel.createProduct(productList?.data, true);
	} catch (error) {
		console.log(error);
	}
});
