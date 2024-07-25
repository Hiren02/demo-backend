const {
	order_details: orderDetailsSchema,
	order_products: orderProductsSchema,
	products: productsSchema,
	product_images: productImagesSchema,
	user_addresses: userAddressSchema,
} = require("../Database/Schemas");

module.exports = class {
	createOrder(data) {
		return orderDetailsSchema.create(data);
	}

	createOrderProducts(data) {
		return orderProductsSchema.bulkCreate(data);
	}

	async getAllOrderList(page = 1, limit = 10) {
		const offset = Math.max(0, (page - 1) * limit);
		const { count, rows: ordersList } = await orderDetailsSchema.findAndCountAll({
			include: [
				{
					model: orderProductsSchema,
					as: "line_items",
					order: [["created_at", "DESC"]],
					include: [
						{
							model: productsSchema,
							as: "products",
							attributes: ["id"],
							include: [
								{
									model: productImagesSchema,
									as: "images",
									attributes: ["id", "src", "is_default"],
									where: {
										is_default: true,
									},
									limit: 1,
									required: false,
								},
							],
						},
					],
				},
			],
			offset: +offset,
			limit: +limit,
			distinct: true,
			nest: true,
			order: [["created_at", "DESC"]],
		});

		const hasMore = offset + limit < count;

		return {
			ordersList,
			hasMore,
			totalCount: count,
			currentPage: +page,
		};
	}

	async getOrderListByUser(id, page = 1, limit = 10) {
		const offset = Math.max(0, (page - 1) * limit);
		const { count, rows: ordersList } = await orderDetailsSchema.findAndCountAll({
			where: { user_id: id },
			include: [
				{
					model: orderProductsSchema,
					as: "line_items",
					order: [["created_at", "DESC"]],
					include: [
						{
							model: productsSchema,
							as: "products",
							attributes: ["id"],
							include: [
								{
									model: productImagesSchema,
									as: "images",
									attributes: ["id", "src", "is_default"],
									where: {
										is_default: true,
									},
									limit: 1,
									required: false,
								},
							],
						},
					],
				},
			],
			order: [["created_at", "DESC"]],
			offset: +offset,
			limit: +limit,
			distinct: true,
			nest: true,
		});

		const hasMore = offset + limit < count;

		return {
			ordersList,
			hasMore,
			totalCount: count,
			currentPage: +page,
		};
	}

	getOrderDetail(id) {
		return orderDetailsSchema.findAll({
			where: { id },
			include: [
				{
					model: orderProductsSchema,
					as: "line_items",
					order: [["created_at", "DESC"]],
					include: [
						{
							model: productsSchema,
							as: "products",
							attributes: ["id"],
							include: [
								{
									model: productImagesSchema,
									as: "images",
									attributes: ["id", "src", "is_default"],
									where: {
										is_default: true,
									},
									limit: 1,
									required: false,
								},
							],
						},
					],
				},
				{
					model: userAddressSchema,
				},
			],
			order: [["created_at", "DESC"]],
		});
	}

	updateOrderStatus(id, status) {
		return orderDetailsSchema.update({ status }, { where: { id } });
	}
};
