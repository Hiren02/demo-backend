const { Api } = require("../../Utils/ApiHelper");
const orderDetailsModel = new (require("../../Models/OrderDetails.Model"))();
const cartDetailsModel = new (require("../../Models/CartDetails.Model"))();

module.exports = class {
	async createOrder(req, res) {
		try {
			const order = await new Api().post(`/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`, { data: req.body });

			if (!order) return res.handler.badRequest("VALIDATION.ORDER.CREATE");

			const orderDetail = await new Api().get(`/shops/${process.env.PRINTIFY_SHOP_ID}/orders/${order?.id}.json`, {});

			if (!orderDetail) return res.handler.badRequest("VALIDATION.ORDER.GET_ORDER");

			const total_price = orderDetail?.line_items?.reduce((acc, item) => {
				return acc + parseFloat(item.metadata.price) * item.quantity;
			}, 0);

			const newPayload = {
				...orderDetail,
				total_price,
				total_cost: orderDetail?.total_price,
				printify_connect_url: orderDetail.printify_connect.url,
				printify_connect_id: orderDetail.printify_connect.id,
				user_id: req.user.id,
				user_address_id: req.body?.user_address_id,
			};

			delete newPayload.printify_connect;
			delete newPayload.metadata;

			await orderDetailsModel.createOrder(newPayload);

			const orderProductPayload = orderDetail.line_items.map((item) => ({
				order_id: orderDetail.id,
				...item,
				item_id: item.id,
				...item.metadata,
			}));

			orderProductPayload.forEach((item) => {
				delete item.metadata;
				delete item.id;
			});

			await orderDetailsModel.createOrderProducts(orderProductPayload);

			await cartDetailsModel.deleteUserCartDetails(req.user.id);

			return res.handler.success(order, "SUCCESS_MESSAGES.ORDER_CREATED");
		} catch (error) {
			return res.handler.serverError(error);
		}
	}

	async getOrderListByUser(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query;
			const orderList = await orderDetailsModel.getOrderListByUser(req.user.id, page, limit);
			return res.handler.success(orderList);
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getAllOrderList(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query;
			const orderList = await orderDetailsModel.getAllOrderList(page, limit);
			return res.handler.success(orderList);
		} catch (error) {
			return res.handler.serverError(error);
		}
	}

	async getOrderDetail(req, res) {
		try {
			const { id } = req.query;
			if (!id) return res.handler.badRequest("VALIDATION.PARAMS.ID_NOT_FOUND");

			const orderDetails = await orderDetailsModel.getOrderDetail(id);

			if (orderDetails && orderDetails.length) return res.handler.success(orderDetails?.[0] || {});

			return res.handler.notFound();
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async calculateShipping(req, res) {
		try {
			const orderShipping = await new Api().post(`/shops/${process.env.PRINTIFY_SHOP_ID}/orders/shipping.json`, { data: req.body });
			return res.handler.success(orderShipping);
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async updateOrderStatus(req, res) {
		try {
			const { resource } = req.body || {};
			const { id, data } = resource || {};
			const { status } = data || {};
			await orderDetailsModel.updateOrderStatus(id, status);
			return res.handler.success("STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}
};
