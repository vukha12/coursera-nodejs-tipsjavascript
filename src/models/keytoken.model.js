"use strict";

import { Schema, model } from "mongoose";

const DOCUMET_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Shop",
    },
    privateKey: {
      type: String,
      require: true,
    },
    publicKey: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

export default model(DOCUMET_NAME, keyTokenSchema);
