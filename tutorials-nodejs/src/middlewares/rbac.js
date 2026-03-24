import { AuthFailureError } from "../core/error.response.js";
import rbac from "./role.middlewares.js";
import rbacService from "../services/rbac.service.js";

/**
 * 
 * @param {*} action read, delete or update
 * @param {*} resource profile, balance...
 * @returns 
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await rbacService.roleList({
                userId: 9999
            }))
            const rol_name = req.query.role;
            const permission = rbac.can(rol_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError('you dont have enougn permission...')
            }

            next()
        } catch (error) {
            next(error);
        }
    }
}

export default grantAccess;