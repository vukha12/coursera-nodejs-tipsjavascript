import express from "express";
import ProfileController from "../../controllers/profile.controller.js";
import grantAccess from "../../middlewares/rbac.js";

const router = express.Router();

// admin
router.get('/viewAny', grantAccess('readAny', 'profile'), ProfileController.profiles);

// shop
router.get('/viewOnw', grantAccess('readOwn', 'profile'), ProfileController.profile);

export default router;