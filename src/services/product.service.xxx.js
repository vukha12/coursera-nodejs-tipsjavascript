"use strict";

import { product, clothing, electronic, furniture } from "../models/product.model.js";
import {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    searchProductByUser,
    unPublishProductByShop
} from "../models/repositories/product.repo.js";
import { BadRequestError } from "../core/error.response.js";

// define Factory class to create product
class ProductFactory {

    static productRegistry = {} // nơi chứa danh sách các loại sản phẩm 

    static registerProductType(tyle, classRef) {
        ProductFactory.productRegistry[tyle] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)

        return new productClass(payload).createProduct()
    }

    // PUT //
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    // END PUT //

    // query //
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublish: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    // end query //
}
// define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError("Create clothing product failed")

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError("Create product failed")

        return newProduct
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError("Create clothing product failed")

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError("Create product failed")

        return newProduct
    }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {

    async createProduct() {
        const newfurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newfurniture) throw new BadRequestError("Create clothing product failed")

        const newProduct = await super.createProduct(newfurniture._id)
        if (!newProduct) throw new BadRequestError("Create product failed")

        return newProduct
    }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

export default ProductFactory;