var _excluded = ["type"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as IconMap from './map';
import React from 'react';

function getKeys(obj) {
  return Object.keys(obj);
}

export var ALL_ICON_KEYS = getKeys(IconMap);

function toPascalCase(val) {
  return val.replace(/(^\w|-\w)/g, function (c) {
    return c.slice(-1).toUpperCase();
  });
}

export default function Icon(props) {
  var type = props.type,
      extra = _objectWithoutProperties(props, _excluded);

  var realType = toPascalCase(type);

  if (!(realType in IconMap)) {
    throw new Error("".concat(type, " is not a valid icon type name"));
  }

  return /*#__PURE__*/React.createElement(IconMap[realType], extra);
}
export * from './runtime';