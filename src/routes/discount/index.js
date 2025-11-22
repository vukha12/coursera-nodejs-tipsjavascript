"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import discountController from "../../controllers/discount.controller.js";
import { authenticationV2 } from "../../auth/authUtils.js";

const router = express.Router();

// authentication //
router.use(authenticationV2);

// create discount
router.get("", asyncHandler(discountController.createDiscount()))

export default router;