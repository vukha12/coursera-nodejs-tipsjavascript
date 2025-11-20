"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication, authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

// signUp & login
router.post("/signup", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));

// authentication //
router.use(authenticationV2);

router.post("/logout", asyncHandler(accessController.logout));
router.post("/handlerRefreshToken", asyncHandler(accessController.handlerRefreshToken));

export default router;
