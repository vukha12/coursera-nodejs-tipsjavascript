'use strict';
import discountModel from "../discount.model.js";
import { BadRequestError, NotFoundError } from "../../core/error.response.js";
import { findAllProducts } from "./product.repo.js";
import { getSelectData, unGetSelectData } from "../../utils/index.js";
/*
    Discount Service
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount code [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
 */

// Create discount code
const createDiscount = async ({
    code, start_date, end_date, is_active, shopId, type, min_order_value, users_used,
    product_ids, max_uses_per_user, max_uses, name, description, value, uses_count, applies_to
}) => {
    return await discountModel.create({
        discount_name: name,
        discount_description: description,
        discount_type: type,
        description_value: value,
        discount_code: code,
        discount_start_date: new Date(start_date),
        discount_end_date: new Date(end_date),
        discount_max_uses: max_uses,
        discount_uses_count: uses_count,
        discount_users_used: users_used,
        discount_max_uses_per_user: max_uses_per_user,
        discount_min_order_value: min_order_value || 0,
        discount_shopId: shopId,
        discount_is_active: is_active,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === 'all' ? [] : product_ids,
    })
}

// Lấy tất cả các vouchoure 
const getAllDiscountCodeWithProduct = async ({ code, shopId, limit, page }) => {
    // create index for discount_code
    const discount = findDiscount({ code, shopId });

    if (!discount && !discount.discount_is_active) {
        throw new NotFoundError('Discount not exists!');
    }

    const { discount_applies_to, discount_product_ids } = discount
    let products
    if (discount_applies_to === 'all') {
        // get all product
        products = await findAllProducts({
            filter: {
                product_shop: shopId,
                isPublish: true
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name']
        })
    }

    if (discount_applies_to === 'specific') {
        // get specific product
        products = await findAllProducts({
            filter: {
                _id: { $in: discount_product_ids },
                isPublish: true
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name']
        })
    }

    return products
}

// Lấy tất cả các vouchoure của shop
const getAllDiscountCodesByShop = async ({ limit, page, shopId }) => {
    const discounts = await findAllDiscountCodesUnSelect({
        limit: +limit,
        page: +page,
        filter: {
            discount_shopId: shopId,
            discount_is_active: true
        },
        unSelect: ['__v', 'discount_shopId']
    })
    return discounts
}

// Find all discount code Un Select
const findAllDiscountCodesUnSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const result = discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()

    return result
}

// // Find all discount code Select
const findAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const result = discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return result
}


// Find discount code
const findDiscount = async ({ code, shopId }) => {
    return await discountModel.findOne({
        discount_code: code,
        discount_shopId: shopId,
    }).lean();
}

export {
    findDiscount,
    createDiscount,
    getAllDiscountCodeWithProduct,
    getAllDiscountCodesByShop
}