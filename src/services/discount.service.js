'use strict';
import { createDiscount, findDiscount } from "../models/repositories/discount.repo.js";

const createDiscountCodes = async ({ payload }) => {
    const { code, start_date, end_date, is_active, shopId,
        min_order_value, product_ids, applies_to, name,
        description, type, value, max_uses,
        uses_count, max_uses_per_user, users_used } = payload;
    const now = new Date();
    if (now < new Date(start_date) || now > new Date(end_date)) {
        throw new BadRequestError('Discount code has expried!')
    }

    if (new Date(start_date) >= new Date(end_date)) {
        throw new BadRequestError('Invalid discount time range!')
    }

    // Check discount code tồn tại
    const discount = await findDiscount({ code, shopId })
    if (discount) {
        throw new BadRequestError('Discount code already exists!');
    }

    // Create Discount code
    const newDiscount = await createDiscount({
        discount_name: name,
        discount_description: description,
        discount_type: type,
        discount_value: value,
        discount_code: code,
        discount_start_date: start_date,
        discount_end_date: end_date,
        discount_max_uses: max_uses,
        discount_uses_count: uses_count,
        discount_users_used: users_used,
        discount_max_uses_per_user: max_uses_per_user,
        discount_min_order_value: min_order_value,
        discount_shopId: shopId,
        discount_is_active: is_active,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === 'all' ? [] : product_ids
    })
    return newDiscount;
}

export {
    createDiscountCodes
}