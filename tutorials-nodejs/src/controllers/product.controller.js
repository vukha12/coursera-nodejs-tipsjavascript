'use strict';

import ProductService from "../services/product.service.xxx.js";
import { SuccessResponse } from "../core/success.response.js";
import { newSpu, oneSpu } from "../services/spu.service.js";
import { oneSku } from "../services/sku.service.js";

class ProductController {

    // SPU, SKU
    findOneSpu = async (req, res, next) => {
        try {
            const { product_id } = req.query

            new SuccessResponse({
                message: "get one spu",
                metadata: await oneSpu({ spu_id: product_id })
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    findOneSku = async (req, res, next) => {
        try {
            const { sku_id, product_id } = req.query

            new SuccessResponse({
                message: "get sku one",
                metadata: await oneSku({ sku_id, product_id })
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc Create new SPU
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    createSpu = async (req, res, next) => {
        try {
            const spu = await newSpu({
                ...req.body,
                product_shop: req.user.userId
            })
            new SuccessResponse({
                message: "Create new SPU success!",
                metadata: spu
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    // END SPU, SKU

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    // update Product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Product success!',
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            }
            )
        }).send(res);
    }


    // PUT //
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish product success!",
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Un Publish product success!",
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res);
    }
    // END PUT //

    // QUERY //
    /**
     * @desc Get all drafts for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @returns {JSON} 
     */
    findAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list drafts for shop success!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    findAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish for shop success!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    findLishSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product for shop success!',
            metadata: await ProductService.searchProducts(req.params)
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list product success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res);
    }

    findProductById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product detail success!',
            metadata: await ProductService.findProduct({ product_id: req.params.product_id })
        }).send(res);
    }
    // ENDQUERY //

}

export default new ProductController();