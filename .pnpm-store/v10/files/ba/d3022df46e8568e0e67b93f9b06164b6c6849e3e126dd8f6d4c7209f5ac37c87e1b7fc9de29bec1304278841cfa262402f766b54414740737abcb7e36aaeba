"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ICON_CONFIGS = void 0;
exports.IconConverter = IconConverter;
exports.IconProvider = void 0;
exports.IconWrapper = IconWrapper;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _excluded = ["size", "strokeWidth", "strokeLinecap", "strokeLinejoin", "theme", "fill", "className", "spin"];

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var DEFAULT_ICON_CONFIGS = {
  size: '1em',
  strokeWidth: 4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  rtl: false,
  theme: 'outline',
  colors: {
    outline: {
      fill: '#333',
      background: 'transparent'
    },
    filled: {
      fill: '#333',
      background: '#FFF'
    },
    twoTone: {
      fill: '#333',
      twoTone: '#2F88FF'
    },
    multiColor: {
      outStrokeColor: '#333',
      outFillColor: '#2F88FF',
      innerStrokeColor: '#FFF',
      innerFillColor: '#43CCF8'
    }
  },
  prefix: 'i'
};
exports.DEFAULT_ICON_CONFIGS = DEFAULT_ICON_CONFIGS;

function guid() {
  return 'icon-' + ((1 + Math.random()) * 0x100000000 | 0).toString(16).substring(1);
}

function IconConverter(id, icon, config) {
  var fill = typeof icon.fill === 'string' ? [icon.fill] : icon.fill || [];
  var colors = [];
  var theme = icon.theme || config.theme;

  switch (theme) {
    case 'outline':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push('none');
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push('none');
      break;

    case 'filled':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push('#FFF');
      colors.push('#FFF');
      break;

    case 'two-tone':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.twoTone.twoTone);
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.twoTone.twoTone);
      break;

    case 'multi-color':
      colors.push(typeof fill[0] === 'string' ? fill[0] : 'currentColor');
      colors.push(typeof fill[1] === 'string' ? fill[1] : config.colors.multiColor.outFillColor);
      colors.push(typeof fill[2] === 'string' ? fill[2] : config.colors.multiColor.innerStrokeColor);
      colors.push(typeof fill[3] === 'string' ? fill[3] : config.colors.multiColor.innerFillColor);
      break;
  }

  return {
    size: icon.size || config.size,
    strokeWidth: icon.strokeWidth || config.strokeWidth,
    strokeLinecap: icon.strokeLinecap || config.strokeLinecap,
    strokeLinejoin: icon.strokeLinejoin || config.strokeLinejoin,
    colors: colors,
    id: id
  };
}

var IconContext = /*#__PURE__*/(0, _react.createContext)(DEFAULT_ICON_CONFIGS);
var IconProvider = IconContext.Provider;
exports.IconProvider = IconProvider;

function IconWrapper(name, rtl, render) {
  return function (props) {
    var size = props.size,
        strokeWidth = props.strokeWidth,
        strokeLinecap = props.strokeLinecap,
        strokeLinejoin = props.strokeLinejoin,
        theme = props.theme,
        fill = props.fill,
        className = props.className,
        spin = props.spin,
        extra = _objectWithoutProperties(props, _excluded);

    var ICON_CONFIGS = (0, _react.useContext)(IconContext);
    var id = (0, _react.useMemo)(guid, []);
    var svgProps = IconConverter(id, {
      size: size,
      strokeWidth: strokeWidth,
      strokeLinecap: strokeLinecap,
      strokeLinejoin: strokeLinejoin,
      theme: theme,
      fill: fill
    }, ICON_CONFIGS);
    var cls = [ICON_CONFIGS.prefix + '-icon'];
    cls.push(ICON_CONFIGS.prefix + '-icon' + '-' + name);

    if (rtl && ICON_CONFIGS.rtl) {
      cls.push(ICON_CONFIGS.prefix + '-icon-rtl');
    }

    if (spin) {
      cls.push(ICON_CONFIGS.prefix + '-icon-spin');
    }

    if (className) {
      cls.push(className);
    }

    return /*#__PURE__*/_react.default.createElement("span", _objectSpread(_objectSpread({}, extra), {}, {
      className: cls.join(' ')
    }), render(svgProps));
  };
}