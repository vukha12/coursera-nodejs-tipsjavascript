"use strict"

import { findCartById, findUserCart } from "../models/repositories/cart.repo.js"
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { checkProductByServer } from "../models/repositories/product.repo.js";
import { getDiscountAmount } from "./discount.service.js";

class CheckoutService {
    // login and without login
    /*
        {
            cartId,
            userId,
            shop_order_ids:[
                {
                    shopId,
                    shop_discounts: [],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {

        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError("Cart does not exists!");

        const checkout_order = {
            totalPrice: 0, // tổng tiền hàng
            feeShip: 0, // phí vận chuyển
            totalDiscount: 0, // tổng tiền discount giảm giá
            totalCheckout: 0, // tổng thanh toán
        };
        const shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];

            const checkProductServer = await checkProductByServer(item_products)
            console.log(`[checkProductServer]::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('order wrong!!')

            // tính tổng tiền đơn hàng
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tiền trước khi giảm giá
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // tổng cộng discount giảm giá 
                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = Math.max(checkoutPrice - discount, 0);
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        checkout_order.totalCheckout = Math.max(checkout_order.totalCheckout, 0);

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

}

export default CheckoutService