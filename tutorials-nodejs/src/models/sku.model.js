import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "SKU";
const COLLECTION_NAME = "skus";

const skuSchema = new Schema({
    sku_id: { type: String, require: true, unique: true },
    sku_tier_idx: { type: Array, default: [0] },
    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: '' },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: String, require: true },
    sku_stock: { type: Number, default: 0 },
    product_id: { type: String, require: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

export default model(DOCUMENT_NAME, skuSchema);