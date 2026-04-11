import _ from "lodash";
import { findShopById } from "../models/repositories/shop.repo.js";
import SPU_MODEL from "../models/spu.model.js";
import { NotFoundError } from "../core/error.response.js";
import { randomProductId } from "../utils/index.js";
import { allSkuBySpuId, newSku } from "./sku.service.js";

const oneSpu = async ({ spu_id }) => {
    try {
        const spu = await SPU_MODEL.findOne({
            product_id: spu_id,
            isPublish: false
        })
        if (!spu) throw new NotFoundError("SPU not found");

        const skus = await allSkuBySpuId({ product_id: spu_id })

        return {
            spu_info: _.omit(spu, ["__v", "updatedAt"]),
            sku_list: skus.map(sku => _.omit(sku, ["__v", "updatedAt"]))
        }
    } catch (error) {
        return {}
    }
}

const newSpu = async ({
    product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_quantity,
    product_shop,
    product_attributes,
    product_variations,
    sku_list = []
}) => {
    try {
        // 1. check if Shop exist
        const foundShop = await findShopById({ shop_id: product_shop });
        if (!foundShop) throw new NotFoundError("Shop not found");

        // 2. create a new SPU
        const spu = await SPU_MODEL.create({
            product_id: randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_quantity,
            product_shop,
            product_attributes,
            product_variations
        })

        // 3. get spu_id add to sku.service
        if (spu && sku_list.length) {
            newSku({ sku_list, spu_id: spu.product_id }).then()
        }

        // 4. sycn data via elasticsearch (search.service)

        // 5. respond result object
        return !!spu

    } catch (error) {

    }
}

export {
    newSpu,
    oneSpu
}