'use strict';

import { CREATED } from "../core/success.response.js";
import { createDiscountCodes } from "../services/discount.services.js";

class DiscountController {
    createDiscount = async (req, res, next) => {
        new CREATED({
            message: 'Create discount success',
            metadata: await createDiscountCodes({ ...req.body })
        }).send(res)
    }
}

export default new DiscountController();