'use strict';

import { createUserCart, findUserCart, updateUserCartQuantity } from "../models/repositories/cart.repo.js";

class CartService {

    static async addTocart({ userId, product = {} }) {

        // tìm giỏ hàng đã tồn tại hay chưa
        const userCart = await findUserCart(userId);

        if (!userCart) {
            // tạo giỏ hàng cho user
            return await createUserCart({ userId, product })
        }

        // nếu có giỏ hàng rồi nhưng chưa có sản phẩm?
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        // giỏ hàng tồn tại, và có sản phầm này thì update quantity
        return await updateUserCartQuantity({ userId, product })
    }
}

export default CartService;