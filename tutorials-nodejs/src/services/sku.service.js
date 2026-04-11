import _ from "lodash";
import { randomProductId } from "../utils/index.js"
import SKU_MODEL from "../models/sku.model.js";

const newSku = async ({ spu_id, sku_list }) => {
    try {
        const convert_sku_list = sku_list.map(sku => {
            return { ...sku, product_id: spu_id, sku_id: `${spu_id}.${randomProductId()}` }
        })
        const skus = await SKU_MODEL.create(convert_sku_list);
        return skus;
    } catch (error) {
        return []
    }
}

const oneSku = async ({ sku_id, product_id }) => {
    try {
        // read cache
        const sku = await SKU_MODEL.findOne({ sku_id, product_id }).lean();

        if (sku) {
            // set cached
        }
        return _.omit(sku, ["__v", "updatedAt"])
    } catch (error) {
        return null
    }
}

const allSkuBySpuId = async ({ product_id }) => {
    try {
        // 1. spu_id..
        const skus = await SKU_MODEL.find({ product_id }).lean();

        return skus;
    } catch (error) {
        return null
    }
}

export {
    newSku,
    oneSku,
    allSkuBySpuId
}