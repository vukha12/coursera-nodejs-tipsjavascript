import SHOP from "../shop.model.js";

const findShopById = async ({
    shop_id,
    select = { email: 1, name: 1, status: 1, roles: 1 }
}) => {
    return await SHOP.findById(shop_id).select(select);
};

export {
    findShopById
}
