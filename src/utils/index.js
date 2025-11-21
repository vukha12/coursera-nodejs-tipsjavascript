"use strict";

import pick from "lodash/pick.js";

const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 0]));
}

export {
  getInfoData,
  getSelectData,
  unGetSelectData
}