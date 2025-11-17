"use strict";

import { findById } from "../services/apiKey.service.js";

export const apiKey = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const objKey = await findById(token);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {}
};

export const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    console.log(`permission::`, req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    return next();
  };
};
