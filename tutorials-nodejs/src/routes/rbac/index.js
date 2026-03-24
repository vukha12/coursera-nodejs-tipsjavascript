import Router from "express";

const router = Router()
import rbacController from "../../controllers/rbac.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";

router.post("/role", asyncHandler(rbacController.newRole))
router.get('/roles', asyncHandler(rbacController.listRole))

router.post('/resource', asyncHandler(rbacController.newResource))
router.get('/resources', asyncHandler(rbacController.listResource))

export default router;