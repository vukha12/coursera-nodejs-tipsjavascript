'use strict';

import { product, clothing, electronic, furniture } from "../product.model.js";

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product.find(
        {
            isPublish: true,
            $text: { $search: regexSearch }
        },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .lean()

    return results;
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: product_id,
    })
    if (!foundProduct) return null;

    foundProduct.isDraft = false;
    foundProduct.isPublish = true;

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);
    return modifiedCount;
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: product_id,
    })
    if (!foundProduct) return null;

    foundProduct.isDraft = true;
    foundProduct.isPublish = false;

    const { modifiedCount } = await foundProduct.updateOne(foundProduct);
    return modifiedCount;
}


const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

export {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser
}