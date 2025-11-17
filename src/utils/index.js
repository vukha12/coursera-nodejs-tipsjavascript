"use strict";

import pick from "lodash/pick.js";

export const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};
