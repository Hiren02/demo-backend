const { v4: UUIDV4 } = require("uuid");
const {
	products: productsSchema,
	product_tags: ProductTagsSchema,
	product_options: productOptionsSchema,
	product_variants: ProductVariantsSchema,
	product_images: productImagesSchema,
	product_options_values: productOptionsValuesSchema,
	product_variant_options: productVariantOptionsSchema,
} = require("../Database/Schemas");

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async createProduct(data, isNeedToFetchLocal = false) {
		try {
			let filteredProduct = data;

			if (isNeedToFetchLocal) {
				const exitProduct = await productsSchema.findAll();

				if (exitProduct && exitProduct.length) {
					filteredProduct = data.filter((item) => {
						return !exitProduct.some((product) => product.id === item.id);
					});
				}
			}

			if (filteredProduct?.length <= 0) throw new Error("Product already exists");

			let tagsList = [];
			let optionsList = [];
			let valuesList = [];
			let variantsList = [];
			let variantOptionsList = [];
			let imagesList = [];
			let productDataList = [];

			for (const product of filteredProduct) {
				const {
					id,
					title,
					description,
					tags,
					options,
					variants,
					images,
					print_areas,
					created_at,
					updated_at,
					visible,
					is_locked,
					blueprint_id,
					user_id,
					shop_id,
					print_provider_id,
					is_printify_express_eligible,
					is_printify_express_enabled,
					is_economy_shipping_eligible,
					is_economy_shipping_enabled,
				} = product;

				for (const tag of tags) {
					tagsList.push({ name: tag, product_id: id });
				}

				for (const option of options) {
					const pkId = UUIDV4();
					optionsList.push({
						id: pkId,
						name: option.name,
						type: option.type,
						display_in_preview: option.display_in_preview,
						product_id: id,
					});

					for (const value of option.values) {
						valuesList.push({
							id: value.id,
							title: value.title,
							reference_id: pkId,
						});
					}
				}

				for (const variant of variants) {
					const pkId = UUIDV4();
					if (variant.is_enabled) {
						variantsList.push({
							pk_id: pkId,
							id: variant.id,
							sku: variant.sku,
							cost: variant.cost,
							price: variant.price,
							title: variant.title,
							grams: variant.grams,
							is_enable: variant.is_enable,
							is_default: variant.is_default,
							is_available: variant.is_available,
							is_printify_express_eligible: variant.is_printify_express_eligible,
							quantity: variant.quantity,
							product_id: id,
						});

						for (const option of variant.options) {
							variantOptionsList.push({ value_id: option, variant_id: pkId });
						}
					}
				}

				for (const image of images) {
					imagesList.push({
						src: image.src,
						position: image.position,
						is_default: image.is_default,
						is_selected_for_publishing: image.is_selected_for_publishing,
						order: image.order,
						product_id: id,
					});
				}

				for (const printArea of print_areas) {
					for (const placeholder of printArea.placeholders) {
						for (const image of placeholder.images) {
							productDataList.push({
								id,
								title,
								description,
								created_at,
								updated_at,
								visible,
								is_locked,
								blueprint_id,
								user_id,
								shop_id,
								print_provider_id,
								is_printify_express_eligible,
								is_printify_express_enabled,
								is_economy_shipping_eligible,
								is_economy_shipping_enabled,
								background: printArea.background,
								position: placeholder.position,
								image_id: image.id,
								name: image.name,
								type: image.type,
								height: image.height,
								width: image.width,
								x: image.x,
								y: image.y,
								scale: image.scale,
								angle: image.angle,
							});
						}
					}
				}
			}

			await productsSchema.bulkCreate(productDataList),
				await ProductTagsSchema.bulkCreate(tagsList),
				await productImagesSchema.bulkCreate(imagesList),
				await ProductVariantsSchema.bulkCreate(variantsList),
				await productOptionsSchema.bulkCreate(optionsList),
				await productOptionsValuesSchema.bulkCreate(valuesList),
				await productVariantOptionsSchema.bulkCreate(variantOptionsList),
				console.log("Transaction completed successfully");
			return filteredProduct;
		} catch (error) {
			throw new Error(error);
		}
	}

	async getAllProducts(limit = 10, page = 1, order, field, filters = {}, categoryFilter = {}) {
		const offset = Math.max(0, (page - 1) * limit);

		const include = [
			{
				model: ProductTagsSchema,
				as: "tags",
				...categoryFilter,
			},
			{
				model: ProductVariantsSchema,
				as: "variants",
				attributes: ["pk_id", "id", "product_id", "price", "title"],
				limit: 1,
			},
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
		];

		const queryOptions = {
			attributes: ["id", "title", "description", "blueprint_id", "print_provider_id", "is_locked", "created_at"],
			offset,
			limit: +limit,
			include,
			distinct: true,
			nest: true,
			...filters,
		};

		if (order && field) {
			queryOptions.order = [[field, order]];
		}

		const { count, rows: productsList } = await productsSchema.findAndCountAll(queryOptions);

		const hasMore = offset + limit < count;

		return {
			productsList,
			hasMore,
			totalCount: count,
		};
	}

	async productsFilter(limit = 10, page = 1, order, field, category, searchKeyWord = "", isPublished = false) {
		const filters = {};

		if (isPublished) {
			filters.where = {
				...filters.where,
				is_locked: true,
			};
		}

		if (searchKeyWord) {
			filters.where = {
				...filters.where,
				title: {
					[Op.like]: `%${searchKeyWord}%`,
				},
			};
		}

		let categoryFilter = {};

		if (category) {
			categoryFilter = {
				where: {
					name: {
						[Op.like]: `%${category}%`,
					},
				},
			};
		}
		try {
			const filterProducts = await this.getAllProducts(limit, page, order, field, filters, categoryFilter);
			return { ...filterProducts, currentPage: +page };
		} catch (err) {
			console.log(err.message);
			console.log(err.stack);
		}
	}

	async getProductById(productId) {
		const productDetails = await productsSchema.findByPk(productId, {
			attributes: ["id", "title", "description", "blueprint_id", "print_provider_id"],
			include: [
				{
					model: productOptionsSchema,
					as: "options",

					include: [
						{
							model: productOptionsValuesSchema,
							as: "values",
							attributes: ["id", "title"],
						},
					],
				},
				{
					model: ProductVariantsSchema,
					as: "variants",
					attributes: ["pk_id", "id", "product_id", "price", "title"],
					include: [
						{
							model: productVariantOptionsSchema,
							as: "options",
							attributes: ["id", "value_id"],
						},
					],
				},
				{
					model: productImagesSchema,
					as: "images",
					attributes: ["id", "src", "is_default"],
				},
			],
			distinct: true,
			nest: true,
		});

		const product = productDetails.get({ plain: true });

		if (!product) return {};

		const variantValueIds = new Set();

		product.variants.forEach((variant) => {
			variant.options.forEach((option) => {
				variantValueIds.add(option.value_id);
			});
		});

		const filteredOptions = product.options.map((option) => {
			const filteredValues = option.values.filter((value) => variantValueIds.has(value.id));
			return {
				...option,
				values: filteredValues,
			};
		});

		return { ...product, options: filteredOptions };
	}

	async deleteProductById(id, hardDelete = false) {
		return await productsSchema.destroy({
			where: {
				id,
			},
			force: true,
		});
	}

	getVariantDetail(condition) {
		return ProductVariantsSchema.findOne({ where: condition });
	}
};
