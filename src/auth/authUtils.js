"use strict";

import jwt from "jsonwebtoken";

const EXPIRESIN_ACCESS_TOKEN = "2d";
const EXPIRESIN_REFRESH_TOKEN = "7d";

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: EXPIRESIN_ACCESS_TOKEN,
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: EXPIRESIN_REFRESH_TOKEN,
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};
