import { SuccessResponse } from '../core/success.response.js'
import RBAC from '../services/rbac.service.js'

/**
 * @desc Create a new role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create new role success',
        metadata: await RBAC.createRole(req.body)
    }).send(res)
}

const listRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get list role success',
        metadata: await RBAC.roleList(req.query)
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'created role',
        metadata: await RBAC.createResource(req.body)
    }).send(res);
}

const listResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get list resource success',
        metadata: await RBAC.resourceList(req.query)
    }).send(res)
}

export default {
    newRole,
    newResource,
    listResource,
    listRole
}