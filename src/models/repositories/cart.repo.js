'use strict';

import { use } from "react";
import cartModel from "../cart.model";

// tìm giỏ hàng
const findUserCart = async (userId) => {
    return cartModel.findOne({ cart_userId: userId })
}

// tạo giỏ hàng 
const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    };
    const option = { upsert: true, new: true };

    return cartModel.findOneAndUpdate(query, updateOrInsert, option)
}

// cập nhật lại giỏ hàng
const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    };
    const updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }
    const option = { upsert: true, new: true };

    return cartModel.findOneAndUpdate(query, updateSet, option)
}

export {
    findUserCart,
    createUserCart,
    updateUserCartQuantity
}