/*!
* ertc-web v2.1.3-alpha.21
* (c) Fri May 15 2026 11:44:35 GMT+0800 (中国标准时间)
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('webrtc-adapter'), require('lodash-es'), require('dingrtc'), require('uuid')) :
	typeof define === 'function' && define.amd ? define(['exports', 'webrtc-adapter', 'lodash-es', 'dingrtc', 'uuid'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ERTCWeb = {}, global.adapter, global.lodashEs, global.DingRTC, global.uuid));
})(this, (function (exports, adapter, lodashEs, DingRTC, uuid) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var globalThis_1 =
	// eslint-disable-next-line es/no-global-this -- safe
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) ||
	// eslint-disable-next-line no-restricted-globals -- safe
	check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	// eslint-disable-next-line no-new-func -- fallback
	function () {
	  return this;
	}() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$w = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$v = fails$w;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$v(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] !== 7;
	});

	var fails$u = fails$w;
	var functionBindNative = !fails$u(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = function () {/* empty */}.bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var NATIVE_BIND$3 = functionBindNative;
	var call$u = Function.prototype.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var functionCall = NATIVE_BIND$3 ? call$u.bind(call$u) : function () {
	  return call$u.apply(call$u, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$4 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$4 && !$propertyIsEnumerable.call({
	  1: 2
	}, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$4(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$6 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var NATIVE_BIND$2 = functionBindNative;
	var FunctionPrototype$2 = Function.prototype;
	var call$t = FunctionPrototype$2.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var uncurryThisWithBind = NATIVE_BIND$2 && FunctionPrototype$2.bind.bind(call$t, call$t);
	var functionUncurryThis = NATIVE_BIND$2 ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call$t.apply(fn, arguments);
	  };
	};

	var uncurryThis$v = functionUncurryThis;
	var toString$d = uncurryThis$v({}.toString);
	var stringSlice$8 = uncurryThis$v(''.slice);
	var classofRaw$2 = function (it) {
	  return stringSlice$8(toString$d(it), 8, -1);
	};

	var uncurryThis$u = functionUncurryThis;
	var fails$t = fails$w;
	var classof$b = classofRaw$2;
	var $Object$4 = Object;
	var split$3 = uncurryThis$u(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$t(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object$4('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$b(it) === 'String' ? split$3(it, '') : $Object$4(it);
	} : $Object$4;

	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	var isNullOrUndefined$4 = function (it) {
	  return it === null || it === undefined;
	};

	var isNullOrUndefined$3 = isNullOrUndefined$4;
	var $TypeError$j = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$6 = function (it) {
	  if (isNullOrUndefined$3(it)) throw new $TypeError$j("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject$3 = indexedObject;
	var requireObjectCoercible$5 = requireObjectCoercible$6;
	var toIndexedObject$5 = function (it) {
	  return IndexedObject$3(requireObjectCoercible$5(it));
	};

	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var documentAll = typeof document == 'object' && document.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	var isCallable$r = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll;
	} : function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$q = isCallable$r;
	var isObject$h = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$q(it);
	};

	var globalThis$v = globalThis_1;
	var isCallable$p = isCallable$r;
	var aFunction = function (argument) {
	  return isCallable$p(argument) ? argument : undefined;
	};
	var getBuiltIn$c = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(globalThis$v[namespace]) : globalThis$v[namespace] && globalThis$v[namespace][method];
	};

	var uncurryThis$t = functionUncurryThis;
	var objectIsPrototypeOf = uncurryThis$t({}.isPrototypeOf);

	var globalThis$u = globalThis_1;
	var navigator$1 = globalThis$u.navigator;
	var userAgent$5 = navigator$1 && navigator$1.userAgent;
	var environmentUserAgent = userAgent$5 ? String(userAgent$5) : '';

	var globalThis$t = globalThis_1;
	var userAgent$4 = environmentUserAgent;
	var process$3 = globalThis$t.process;
	var Deno$1 = globalThis$t.Deno;
	var versions = process$3 && process$3.versions || Deno$1 && Deno$1.version;
	var v8 = versions && versions.v8;
	var match, version$1;
	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version$1 = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version$1 && userAgent$4) {
	  match = userAgent$4.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent$4.match(/Chrome\/(\d+)/);
	    if (match) version$1 = +match[1];
	  }
	}
	var environmentV8Version = version$1;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION$1 = environmentV8Version;
	var fails$s = fails$w;
	var globalThis$s = globalThis_1;
	var $String$6 = globalThis$s.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$s(function () {
	  var symbol = Symbol('symbol detection');
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	  // of course, fail.
	  return !$String$6(symbol) || !(Object(symbol) instanceof Symbol) ||
	  // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	  !Symbol.sham && V8_VERSION$1 && V8_VERSION$1 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$3 = symbolConstructorDetection;
	var useSymbolAsUid = NATIVE_SYMBOL$3 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

	var getBuiltIn$b = getBuiltIn$c;
	var isCallable$o = isCallable$r;
	var isPrototypeOf$5 = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
	var $Object$3 = Object;
	var isSymbol$3 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$b('Symbol');
	  return isCallable$o($Symbol) && isPrototypeOf$5($Symbol.prototype, $Object$3(it));
	};

	var $String$5 = String;
	var tryToString$4 = function (argument) {
	  try {
	    return $String$5(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var isCallable$n = isCallable$r;
	var tryToString$3 = tryToString$4;
	var $TypeError$i = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable$g = function (argument) {
	  if (isCallable$n(argument)) return argument;
	  throw new $TypeError$i(tryToString$3(argument) + ' is not a function');
	};

	var aCallable$f = aCallable$g;
	var isNullOrUndefined$2 = isNullOrUndefined$4;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$5 = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined$2(func) ? undefined : aCallable$f(func);
	};

	var call$s = functionCall;
	var isCallable$m = isCallable$r;
	var isObject$g = isObject$h;
	var $TypeError$h = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$m(fn = input.toString) && !isObject$g(val = call$s(fn, input))) return val;
	  if (isCallable$m(fn = input.valueOf) && !isObject$g(val = call$s(fn, input))) return val;
	  if (pref !== 'string' && isCallable$m(fn = input.toString) && !isObject$g(val = call$s(fn, input))) return val;
	  throw new $TypeError$h("Can't convert object to primitive value");
	};

	var sharedStore = {exports: {}};

	var isPure = false;

	var globalThis$r = globalThis_1;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$7 = Object.defineProperty;
	var defineGlobalProperty$3 = function (key, value) {
	  try {
	    defineProperty$7(globalThis$r, key, {
	      value: value,
	      configurable: true,
	      writable: true
	    });
	  } catch (error) {
	    globalThis$r[key] = value;
	  }
	  return value;
	};

	var globalThis$q = globalThis_1;
	var defineGlobalProperty$2 = defineGlobalProperty$3;
	var SHARED = '__core-js_shared__';
	var store$3 = sharedStore.exports = globalThis$q[SHARED] || defineGlobalProperty$2(SHARED, {});
	(store$3.versions || (store$3.versions = [])).push({
	  version: '3.49.0',
	  mode: 'global',
	  copyright: '© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.',
	  license: 'https://github.com/zloirock/core-js/blob/v3.49.0/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	var sharedStoreExports = sharedStore.exports;

	var store$2 = sharedStoreExports;
	var shared$4 = function (key, value) {
	  return store$2[key] || (store$2[key] = value || {});
	};

	var requireObjectCoercible$4 = requireObjectCoercible$6;
	var $Object$2 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$9 = function (argument) {
	  return $Object$2(requireObjectCoercible$4(argument));
	};

	var uncurryThis$s = functionUncurryThis;
	var toObject$8 = toObject$9;
	var hasOwnProperty = uncurryThis$s({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$8(it), key);
	};

	var uncurryThis$r = functionUncurryThis;
	var id = 0;
	var postfix = Math.random();
	var toString$c = uncurryThis$r(1.1.toString);
	var uid$3 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$c(++id + postfix, 36);
	};

	var globalThis$p = globalThis_1;
	var shared$3 = shared$4;
	var hasOwn$h = hasOwnProperty_1;
	var uid$2 = uid$3;
	var NATIVE_SYMBOL$2 = symbolConstructorDetection;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;
	var Symbol$1 = globalThis$p.Symbol;
	var WellKnownSymbolsStore = shared$3('wks');
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$2;
	var wellKnownSymbol$m = function (name) {
	  if (!hasOwn$h(WellKnownSymbolsStore, name)) {
	    WellKnownSymbolsStore[name] = NATIVE_SYMBOL$2 && hasOwn$h(Symbol$1, name) ? Symbol$1[name] : createWellKnownSymbol('Symbol.' + name);
	  }
	  return WellKnownSymbolsStore[name];
	};

	var call$r = functionCall;
	var isObject$f = isObject$h;
	var isSymbol$2 = isSymbol$3;
	var getMethod$4 = getMethod$5;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$l = wellKnownSymbol$m;
	var $TypeError$g = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$l('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$1 = function (input, pref) {
	  if (!isObject$f(input) || isSymbol$2(input)) return input;
	  var exoticToPrim = getMethod$4(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$r(exoticToPrim, input, pref);
	    if (!isObject$f(result) || isSymbol$2(result)) return result;
	    throw new $TypeError$g("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive = toPrimitive$1;
	var isSymbol$1 = isSymbol$3;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$2 = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol$1(key) ? key : key + '';
	};

	var globalThis$o = globalThis_1;
	var isObject$e = isObject$h;
	var document$3 = globalThis$o.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject$e(document$3) && isObject$e(document$3.createElement);
	var documentCreateElement$2 = function (it) {
	  return EXISTS$1 ? document$3.createElement(it) : {};
	};

	var DESCRIPTORS$m = descriptors;
	var fails$r = fails$w;
	var createElement$1 = documentCreateElement$2;

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$m && !fails$r(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement$1('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a !== 7;
	});

	var DESCRIPTORS$l = descriptors;
	var call$q = functionCall;
	var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
	var createPropertyDescriptor$5 = createPropertyDescriptor$6;
	var toIndexedObject$4 = toIndexedObject$5;
	var toPropertyKey$1 = toPropertyKey$2;
	var hasOwn$g = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$l ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$4(O);
	  P = toPropertyKey$1(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) {/* empty */}
	  if (hasOwn$g(O, P)) return createPropertyDescriptor$5(!call$q(propertyIsEnumerableModule$1.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var DESCRIPTORS$k = descriptors;
	var fails$q = fails$w;

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = DESCRIPTORS$k && fails$q(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () {/* empty */}, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype !== 42;
	});

	var isObject$d = isObject$h;
	var $String$4 = String;
	var $TypeError$f = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject$l = function (argument) {
	  if (isObject$d(argument)) return argument;
	  throw new $TypeError$f($String$4(argument) + ' is not an object');
	};

	var DESCRIPTORS$j = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
	var anObject$k = anObject$l;
	var toPropertyKey = toPropertyKey$2;
	var $TypeError$e = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$j ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
	  anObject$k(O);
	  P = toPropertyKey(P);
	  anObject$k(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  }
	  return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$k(O);
	  P = toPropertyKey(P);
	  anObject$k(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) {/* empty */}
	  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError$e('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$i = descriptors;
	var definePropertyModule$4 = objectDefineProperty;
	var createPropertyDescriptor$4 = createPropertyDescriptor$6;
	var createNonEnumerableProperty$a = DESCRIPTORS$i ? function (object, key, value) {
	  return definePropertyModule$4.f(object, key, createPropertyDescriptor$4(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var makeBuiltIn$3 = {exports: {}};

	var DESCRIPTORS$h = descriptors;
	var hasOwn$f = hasOwnProperty_1;
	var FunctionPrototype$1 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS$h && Object.getOwnPropertyDescriptor;
	var EXISTS = hasOwn$f(FunctionPrototype$1, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && function something() {/* empty */}.name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$h || DESCRIPTORS$h && getDescriptor(FunctionPrototype$1, 'name').configurable);
	var functionName = {
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var uncurryThis$q = functionUncurryThis;
	var isCallable$l = isCallable$r;
	var store$1 = sharedStoreExports;
	var functionToString = uncurryThis$q(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable$l(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}
	var inspectSource$3 = store$1.inspectSource;

	var globalThis$n = globalThis_1;
	var isCallable$k = isCallable$r;
	var WeakMap$2 = globalThis$n.WeakMap;
	var weakMapBasicDetection = isCallable$k(WeakMap$2) && /native code/.test(String(WeakMap$2));

	var shared$2 = shared$4;
	var uid$1 = uid$3;
	var keys$1 = shared$2('keys');
	var sharedKey$3 = function (key) {
	  return keys$1[key] || (keys$1[key] = uid$1(key));
	};

	var hiddenKeys$4 = {};

	var NATIVE_WEAK_MAP = weakMapBasicDetection;
	var globalThis$m = globalThis_1;
	var isObject$c = isObject$h;
	var createNonEnumerableProperty$9 = createNonEnumerableProperty$a;
	var hasOwn$e = hasOwnProperty_1;
	var shared$1 = sharedStoreExports;
	var sharedKey$2 = sharedKey$3;
	var hiddenKeys$3 = hiddenKeys$4;
	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$4 = globalThis$m.TypeError;
	var WeakMap$1 = globalThis$m.WeakMap;
	var set$1, get, has;
	var enforce = function (it) {
	  return has(it) ? get(it) : set$1(it, {});
	};
	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject$c(it) || (state = get(it)).type !== TYPE) {
	      throw new TypeError$4('Incompatible receiver, ' + TYPE + ' required');
	    }
	    return state;
	  };
	};
	if (NATIVE_WEAK_MAP || shared$1.state) {
	  var store = shared$1.state || (shared$1.state = new WeakMap$1());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store.get = store.get;
	  store.has = store.has;
	  store.set = store.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set$1 = function (it, metadata) {
	    if (store.has(it)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store.set(it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return store.get(it) || {};
	  };
	  has = function (it) {
	    return store.has(it);
	  };
	} else {
	  var STATE = sharedKey$2('state');
	  hiddenKeys$3[STATE] = true;
	  set$1 = function (it, metadata) {
	    if (hasOwn$e(it, STATE)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$9(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwn$e(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwn$e(it, STATE);
	  };
	}
	var internalState = {
	  set: set$1,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var uncurryThis$p = functionUncurryThis;
	var fails$p = fails$w;
	var isCallable$j = isCallable$r;
	var hasOwn$d = hasOwnProperty_1;
	var DESCRIPTORS$g = descriptors;
	var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
	var inspectSource$2 = inspectSource$3;
	var InternalStateModule$6 = internalState;
	var enforceInternalState$1 = InternalStateModule$6.enforce;
	var getInternalState$5 = InternalStateModule$6.get;
	var $String$3 = String;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$6 = Object.defineProperty;
	var stringSlice$7 = uncurryThis$p(''.slice);
	var replace$8 = uncurryThis$p(''.replace);
	var join$4 = uncurryThis$p([].join);
	var CONFIGURABLE_LENGTH = DESCRIPTORS$g && !fails$p(function () {
	  return defineProperty$6(function () {/* empty */}, 'length', {
	    value: 8
	  }).length !== 8;
	});
	var TEMPLATE = String(String).split('String');
	var makeBuiltIn$2 = makeBuiltIn$3.exports = function (value, name, options) {
	  if (stringSlice$7($String$3(name), 0, 7) === 'Symbol(') {
	    name = '[' + replace$8($String$3(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
	  }
	  if (options && options.getter) name = 'get ' + name;
	  if (options && options.setter) name = 'set ' + name;
	  if (!hasOwn$d(value, 'name') || CONFIGURABLE_FUNCTION_NAME$1 && value.name !== name) {
	    if (DESCRIPTORS$g) defineProperty$6(value, 'name', {
	      value: name,
	      configurable: true
	    });else value.name = name;
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwn$d(options, 'arity') && value.length !== options.arity) {
	    defineProperty$6(value, 'length', {
	      value: options.arity
	    });
	  }
	  try {
	    if (options && hasOwn$d(options, 'constructor') && options.constructor) {
	      if (DESCRIPTORS$g) defineProperty$6(value, 'prototype', {
	        writable: false
	      });
	      // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) value.prototype = undefined;
	  } catch (error) {/* empty */}
	  var state = enforceInternalState$1(value);
	  if (!hasOwn$d(state, 'source')) {
	    state.source = join$4(TEMPLATE, typeof name == 'string' ? name : '');
	  }
	  return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn$2(function toString() {
	  return isCallable$j(this) && getInternalState$5(this).source || inspectSource$2(this);
	}, 'toString');
	var makeBuiltInExports = makeBuiltIn$3.exports;

	var isCallable$i = isCallable$r;
	var definePropertyModule$3 = objectDefineProperty;
	var makeBuiltIn$1 = makeBuiltInExports;
	var defineGlobalProperty$1 = defineGlobalProperty$3;
	var defineBuiltIn$d = function (O, key, value, options) {
	  if (!options) options = {};
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable$i(value)) makeBuiltIn$1(value, name, options);
	  if (options.global) {
	    if (simple) O[key] = value;else defineGlobalProperty$1(key, value);
	  } else {
	    try {
	      if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
	    } catch (error) {/* empty */}
	    if (simple) O[key] = value;else definePropertyModule$3.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    });
	  }
	  return O;
	};

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor$4 = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	var mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor$4 : ceil)(n);
	};

	var trunc = mathTrunc;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity$6 = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : trunc(number);
	};

	var toIntegerOrInfinity$5 = toIntegerOrInfinity$6;
	var max$1 = Math.max;
	var min$2 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$2 = function (index, length) {
	  var integer = toIntegerOrInfinity$5(index);
	  return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
	};

	var toIntegerOrInfinity$4 = toIntegerOrInfinity$6;
	var min$1 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength$2 = function (argument) {
	  var len = toIntegerOrInfinity$4(argument);
	  return len > 0 ? min$1(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$1 = toLength$2;

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike$8 = function (obj) {
	  return toLength$1(obj.length);
	};

	var toIndexedObject$3 = toIndexedObject$5;
	var toAbsoluteIndex$1 = toAbsoluteIndex$2;
	var lengthOfArrayLike$7 = lengthOfArrayLike$8;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$3 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$3($this);
	    var length = lengthOfArrayLike$7(O);
	    if (length === 0) return !IS_INCLUDES && -1;
	    var index = toAbsoluteIndex$1(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el !== el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value !== value) return true;
	      // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};
	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$3(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$3(false)
	};

	var uncurryThis$o = functionUncurryThis;
	var hasOwn$c = hasOwnProperty_1;
	var toIndexedObject$2 = toIndexedObject$5;
	var indexOf$1 = arrayIncludes.indexOf;
	var hiddenKeys$2 = hiddenKeys$4;
	var push$7 = uncurryThis$o([].push);
	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$2(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn$c(hiddenKeys$2, key) && hasOwn$c(O, key) && push$7(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn$c(O, key = names[i++])) {
	    ~indexOf$1(result, key) || push$7(result, key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$3 = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;
	var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$1);
	};

	var objectGetOwnPropertySymbols = {};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$a = getBuiltIn$c;
	var uncurryThis$n = functionUncurryThis;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
	var anObject$j = anObject$l;
	var concat$2 = uncurryThis$n([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys$1 = getBuiltIn$a('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$j(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
	  return getOwnPropertySymbols ? concat$2(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$b = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$2 = objectDefineProperty;
	var copyConstructorProperties$2 = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$2.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn$b(target, key) && !(exceptions && hasOwn$b(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var fails$o = fails$w;
	var isCallable$h = isCallable$r;
	var replacement = /#|\.prototype\./;
	var isForced$3 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value === POLYFILL ? true : value === NATIVE ? false : isCallable$h(detection) ? fails$o(detection) : !!detection;
	};
	var normalize = isForced$3.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};
	var data = isForced$3.data = {};
	var NATIVE = isForced$3.NATIVE = 'N';
	var POLYFILL = isForced$3.POLYFILL = 'P';
	var isForced_1 = isForced$3;

	var globalThis$l = globalThis_1;
	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$8 = createNonEnumerableProperty$a;
	var defineBuiltIn$c = defineBuiltIn$d;
	var defineGlobalProperty = defineGlobalProperty$3;
	var copyConstructorProperties$1 = copyConstructorProperties$2;
	var isForced$2 = isForced_1;

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = globalThis$l;
	  } else if (STATIC) {
	    target = globalThis$l[TARGET] || defineGlobalProperty(TARGET, {});
	  } else {
	    target = globalThis$l[TARGET] && globalThis$l[TARGET].prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor$3(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced$2(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties$1(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty$8(sourceProperty, 'sham', true);
	    }
	    defineBuiltIn$c(target, key, sourceProperty, options);
	  }
	};

	var NATIVE_BIND$1 = functionBindNative;
	var FunctionPrototype = Function.prototype;
	var apply$5 = FunctionPrototype.apply;
	var call$p = FunctionPrototype.call;

	// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND$1 ? call$p.bind(apply$5) : function () {
	  return call$p.apply(apply$5, arguments);
	});

	var uncurryThis$m = functionUncurryThis;
	var aCallable$e = aCallable$g;
	var functionUncurryThisAccessor = function (object, key, method) {
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    return uncurryThis$m(aCallable$e(Object.getOwnPropertyDescriptor(object, key)[method]));
	  } catch (error) {/* empty */}
	};

	var isObject$b = isObject$h;
	var isPossiblePrototype$1 = function (argument) {
	  return isObject$b(argument) || argument === null;
	};

	var isPossiblePrototype = isPossiblePrototype$1;
	var $String$2 = String;
	var $TypeError$d = TypeError;
	var aPossiblePrototype$1 = function (argument) {
	  if (isPossiblePrototype(argument)) return argument;
	  throw new $TypeError$d("Can't set " + $String$2(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */
	var uncurryThisAccessor = functionUncurryThisAccessor;
	var isObject$a = isObject$h;
	var requireObjectCoercible$3 = requireObjectCoercible$6;
	var aPossiblePrototype = aPossiblePrototype$1;

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {/* empty */}
	  return function setPrototypeOf(O, proto) {
	    requireObjectCoercible$3(O);
	    aPossiblePrototype(proto);
	    if (!isObject$a(O)) return O;
	    if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var defineProperty$5 = objectDefineProperty.f;
	var proxyAccessor$2 = function (Target, Source, key) {
	  key in Target || defineProperty$5(Target, key, {
	    configurable: true,
	    get: function () {
	      return Source[key];
	    },
	    set: function (it) {
	      Source[key] = it;
	    }
	  });
	};

	var isCallable$g = isCallable$r;
	var isObject$9 = isObject$h;
	var setPrototypeOf$3 = objectSetPrototypeOf;

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired$2 = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	  // it can work only with native `setPrototypeOf`
	  setPrototypeOf$3 &&
	  // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	  isCallable$g(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject$9(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) setPrototypeOf$3($this, NewTargetPrototype);
	  return $this;
	};

	var wellKnownSymbol$k = wellKnownSymbol$m;
	var TO_STRING_TAG$4 = wellKnownSymbol$k('toStringTag');
	var test = {};
	// eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	test[TO_STRING_TAG$4] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var isCallable$f = isCallable$r;
	var classofRaw$1 = classofRaw$2;
	var wellKnownSymbol$j = wellKnownSymbol$m;
	var TO_STRING_TAG$3 = wellKnownSymbol$j('toStringTag');
	var $Object$1 = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw$1(function () {
	  return arguments;
	}()) === 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {/* empty */}
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$a = TO_STRING_TAG_SUPPORT ? classofRaw$1 : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	  // @@toStringTag case
	  : typeof (tag = tryGet(O = $Object$1(it), TO_STRING_TAG$3)) == 'string' ? tag
	  // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw$1(O)
	  // ES3 arguments fallback
	  : (result = classofRaw$1(O)) === 'Object' && isCallable$f(O.callee) ? 'Arguments' : result;
	};

	var classof$9 = classof$a;
	var $String$1 = String;
	var toString$b = function (argument) {
	  if (classof$9(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
	  return $String$1(argument);
	};

	var toString$a = toString$b;
	var normalizeStringArgument$1 = function (argument, $default) {
	  return argument === undefined ? arguments.length < 2 ? '' : $default : toString$a(argument);
	};

	var isObject$8 = isObject$h;
	var createNonEnumerableProperty$7 = createNonEnumerableProperty$a;

	// `InstallErrorCause` abstract operation
	// https://tc39.es/ecma262/#sec-installerrorcause
	var installErrorCause$1 = function (O, options) {
	  if (isObject$8(options) && 'cause' in options) {
	    createNonEnumerableProperty$7(O, 'cause', options.cause);
	  }
	};

	var uncurryThis$l = functionUncurryThis;
	var $Error = Error;
	var replace$7 = uncurryThis$l(''.replace);
	var TEST = function (arg) {
	  return String(new $Error(arg).stack);
	}('zxcasd');
	// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
	var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
	var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);
	var errorStackClear = function (stack, dropEntries) {
	  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
	    while (dropEntries--) stack = replace$7(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
	  }
	  return stack;
	};

	var fails$n = fails$w;
	var createPropertyDescriptor$3 = createPropertyDescriptor$6;
	var errorStackInstallable = !fails$n(function () {
	  var error = new Error('a');
	  if (!('stack' in error)) return true;
	  // eslint-disable-next-line es/no-object-defineproperty -- safe
	  Object.defineProperty(error, 'stack', createPropertyDescriptor$3(1, 7));
	  return error.stack !== 7;
	});

	var createNonEnumerableProperty$6 = createNonEnumerableProperty$a;
	var clearErrorStack = errorStackClear;
	var ERROR_STACK_INSTALLABLE = errorStackInstallable;

	// non-standard V8
	// eslint-disable-next-line es/no-nonstandard-error-properties -- safe
	var captureStackTrace = Error.captureStackTrace;
	var errorStackInstall = function (error, C, stack, dropEntries) {
	  if (ERROR_STACK_INSTALLABLE) {
	    if (captureStackTrace) captureStackTrace(error, C);else createNonEnumerableProperty$6(error, 'stack', clearErrorStack(stack, dropEntries));
	  }
	};

	var getBuiltIn$9 = getBuiltIn$c;
	var hasOwn$a = hasOwnProperty_1;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$a;
	var isPrototypeOf$4 = objectIsPrototypeOf;
	var setPrototypeOf$2 = objectSetPrototypeOf;
	var copyConstructorProperties = copyConstructorProperties$2;
	var proxyAccessor$1 = proxyAccessor$2;
	var inheritIfRequired$1 = inheritIfRequired$2;
	var normalizeStringArgument = normalizeStringArgument$1;
	var installErrorCause = installErrorCause$1;
	var installErrorStack = errorStackInstall;
	var DESCRIPTORS$f = descriptors;
	var wrapErrorConstructorWithCause$1 = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
	  var STACK_TRACE_LIMIT = 'stackTraceLimit';
	  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
	  var path = FULL_NAME.split('.');
	  var ERROR_NAME = path[path.length - 1];
	  var OriginalError = getBuiltIn$9.apply(null, path);
	  if (!OriginalError) return;
	  var OriginalErrorPrototype = OriginalError.prototype;

	  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
	  if (hasOwn$a(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;
	  if (!FORCED) return OriginalError;
	  var BaseError = getBuiltIn$9('Error');
	  var WrappedError = wrapper(function (a, b) {
	    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
	    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
	    if (message !== undefined) createNonEnumerableProperty$5(result, 'message', message);
	    installErrorStack(result, WrappedError, result.stack, 2);
	    if (this && isPrototypeOf$4(OriginalErrorPrototype, this)) inheritIfRequired$1(result, this, WrappedError);
	    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
	    return result;
	  });
	  WrappedError.prototype = OriginalErrorPrototype;
	  if (ERROR_NAME !== 'Error') {
	    if (setPrototypeOf$2) setPrototypeOf$2(WrappedError, BaseError);else copyConstructorProperties(WrappedError, BaseError, {
	      name: true
	    });
	  } else if (DESCRIPTORS$f && STACK_TRACE_LIMIT in OriginalError) {
	    proxyAccessor$1(WrappedError, OriginalError, STACK_TRACE_LIMIT);
	    proxyAccessor$1(WrappedError, OriginalError, 'prepareStackTrace');
	  }
	  copyConstructorProperties(WrappedError, OriginalError);
	  try {
	    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
	    if (OriginalErrorPrototype.name !== ERROR_NAME) {
	      createNonEnumerableProperty$5(OriginalErrorPrototype, 'name', ERROR_NAME);
	    }
	    OriginalErrorPrototype.constructor = WrappedError;
	  } catch (error) {/* empty */}
	  return WrappedError;
	};

	/* eslint-disable no-unused-vars -- required for functions `.length` */
	var $$t = _export;
	var globalThis$k = globalThis_1;
	var apply$4 = functionApply;
	var wrapErrorConstructorWithCause = wrapErrorConstructorWithCause$1;
	var WEB_ASSEMBLY = 'WebAssembly';
	var WebAssembly = globalThis$k[WEB_ASSEMBLY];

	// eslint-disable-next-line es/no-error-cause -- feature detection
	var FORCED$6 = new Error('e', {
	  cause: 7
	}).cause !== 7;
	var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
	  var O = {};
	  // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED$6);
	  $$t({
	    global: true,
	    constructor: true,
	    arity: 1,
	    forced: FORCED$6
	  }, O);
	};
	var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
	  if (WebAssembly && WebAssembly[ERROR_NAME]) {
	    var O = {};
	    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED$6);
	    $$t({
	      target: WEB_ASSEMBLY,
	      stat: true,
	      constructor: true,
	      arity: 1,
	      forced: FORCED$6
	    }, O);
	  }
	};

	// https://tc39.es/ecma262/#sec-nativeerror
	exportGlobalErrorCauseWrapper('Error', function (init) {
	  return function Error(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportGlobalErrorCauseWrapper('EvalError', function (init) {
	  return function EvalError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportGlobalErrorCauseWrapper('RangeError', function (init) {
	  return function RangeError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
	  return function ReferenceError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
	  return function SyntaxError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportGlobalErrorCauseWrapper('TypeError', function (init) {
	  return function TypeError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportGlobalErrorCauseWrapper('URIError', function (init) {
	  return function URIError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
	  return function CompileError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
	  return function LinkError(message) {
	    return apply$4(init, this, arguments);
	  };
	});
	exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
	  return function RuntimeError(message) {
	    return apply$4(init, this, arguments);
	  };
	});

	var objectDefineProperties = {};

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3;

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys$2 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$e = descriptors;
	var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
	var definePropertyModule$1 = objectDefineProperty;
	var anObject$i = anObject$l;
	var toIndexedObject$1 = toIndexedObject$5;
	var objectKeys$1 = objectKeys$2;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	objectDefineProperties.f = DESCRIPTORS$e && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$i(O);
	  var props = toIndexedObject$1(Properties);
	  var keys = objectKeys$1(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule$1.f(O, key = keys[index++], props[key]);
	  return O;
	};

	var getBuiltIn$8 = getBuiltIn$c;
	var html$2 = getBuiltIn$8('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */
	var anObject$h = anObject$l;
	var definePropertiesModule = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys = hiddenKeys$4;
	var html$1 = html$2;
	var documentCreateElement$1 = documentCreateElement$2;
	var sharedKey$1 = sharedKey$3;
	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$1('IE_PROTO');
	var EmptyConstructor = function () {/* empty */};
	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
	  activeXDocument = null;
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement$1('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html$1.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) {/* ignore */}
	  NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	  : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};
	hiddenKeys[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$h(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
	};

	var wellKnownSymbol$i = wellKnownSymbol$m;
	var create$5 = objectCreate;
	var defineProperty$4 = objectDefineProperty.f;
	var UNSCOPABLES = wellKnownSymbol$i('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] === undefined) {
	  defineProperty$4(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: create$5(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables$4 = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var $$s = _export;
	var $includes = arrayIncludes.includes;
	var fails$m = fails$w;
	var addToUnscopables$3 = addToUnscopables$4;

	// FF99+ bug
	var BROKEN_ON_SPARSE = fails$m(function () {
	  // eslint-disable-next-line es/no-array-prototype-includes -- detection
	  return !Array(1).includes();
	});

	// Safari 26.4- bug
	var BROKEN_ON_SPARSE_WITH_FROM_INDEX = fails$m(function () {
	  // eslint-disable-next-line no-sparse-arrays, es/no-array-prototype-includes -- detection
	  return [, 1].includes(undefined, 1);
	});

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	$$s({
	  target: 'Array',
	  proto: true,
	  forced: BROKEN_ON_SPARSE || BROKEN_ON_SPARSE_WITH_FROM_INDEX
	}, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$3('includes');

	var classof$8 = classofRaw$2;

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray$3 = Array.isArray || function isArray(argument) {
	  return classof$8(argument) === 'Array';
	};

	var DESCRIPTORS$d = descriptors;
	var isArray$2 = isArray$3;
	var $TypeError$c = TypeError;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	// Safari < 13 does not throw an error in this case
	var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS$d && !function () {
	  // makes no sense without proper strict mode support
	  if (this !== undefined) return true;
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', {
	      writable: false
	    }).length = 1;
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();
	var arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
	  if (isArray$2(O) && !getOwnPropertyDescriptor$2(O, 'length').writable) {
	    throw new $TypeError$c('Cannot set read only .length');
	  }
	  return O.length = length;
	} : function (O, length) {
	  return O.length = length;
	};

	var $TypeError$b = TypeError;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

	var doesNotExceedSafeInteger$1 = function (it) {
	  if (it > MAX_SAFE_INTEGER) throw new $TypeError$b('Maximum allowed index exceeded');
	  return it;
	};

	var $$r = _export;
	var toObject$7 = toObject$9;
	var lengthOfArrayLike$6 = lengthOfArrayLike$8;
	var setArrayLength$1 = arraySetLength;
	var doesNotExceedSafeInteger = doesNotExceedSafeInteger$1;
	var fails$l = fails$w;
	var INCORRECT_TO_LENGTH = fails$l(function () {
	  return [].push.call({
	    length: 0x100000000
	  }, 1) !== 4294967297;
	});

	// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
	// https://bugs.chromium.org/p/v8/issues/detail?id=12681
	var properErrorOnNonWritableLength = function () {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', {
	      writable: false
	    }).push();
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	};
	var FORCED$5 = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

	// `Array.prototype.push` method
	// https://tc39.es/ecma262/#sec-array.prototype.push
	$$r({
	  target: 'Array',
	  proto: true,
	  arity: 1,
	  forced: FORCED$5
	}, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  push: function push(item) {
	    var O = toObject$7(this);
	    var len = lengthOfArrayLike$6(O);
	    var argCount = arguments.length;
	    doesNotExceedSafeInteger(len + argCount);
	    for (var i = 0; i < argCount; i++) {
	      O[len] = arguments[i];
	      len++;
	    }
	    setArrayLength$1(O, len);
	    return len;
	  }
	});

	var isObject$7 = isObject$h;
	var getInternalState$4 = internalState.get;
	var isRawJson = function isRawJSON(O) {
	  if (!isObject$7(O)) return false;
	  var state = getInternalState$4(O);
	  return !!state && state.type === 'RawJSON';
	};

	var uncurryThis$k = functionUncurryThis;
	var arraySlice$4 = uncurryThis$k([].slice);

	var uncurryThis$j = functionUncurryThis;
	var hasOwn$9 = hasOwnProperty_1;
	var $SyntaxError = SyntaxError;
	var $parseInt$1 = parseInt;
	var fromCharCode$3 = String.fromCharCode;
	var at$1 = uncurryThis$j(''.charAt);
	var slice$2 = uncurryThis$j(''.slice);
	var exec$8 = uncurryThis$j(/./.exec);
	var codePoints = {
	  '\\"': '"',
	  '\\\\': '\\',
	  '\\/': '/',
	  '\\b': '\b',
	  '\\f': '\f',
	  '\\n': '\n',
	  '\\r': '\r',
	  '\\t': '\t'
	};
	var IS_4_HEX_DIGITS = /^[\da-f]{4}$/i;
	// eslint-disable-next-line regexp/no-control-character -- safe
	var IS_C0_CONTROL_CODE = /^[\u0000-\u001F]$/;
	var parseJsonString = function (source, i) {
	  var unterminated = true;
	  var value = '';
	  while (i < source.length) {
	    var chr = at$1(source, i);
	    if (chr === '\\') {
	      var twoChars = slice$2(source, i, i + 2);
	      if (hasOwn$9(codePoints, twoChars)) {
	        value += codePoints[twoChars];
	        i += 2;
	      } else if (twoChars === '\\u') {
	        i += 2;
	        var fourHexDigits = slice$2(source, i, i + 4);
	        if (!exec$8(IS_4_HEX_DIGITS, fourHexDigits)) throw new $SyntaxError('Bad Unicode escape at: ' + i);
	        value += fromCharCode$3($parseInt$1(fourHexDigits, 16));
	        i += 4;
	      } else throw new $SyntaxError('Unknown escape sequence: "' + twoChars + '"');
	    } else if (chr === '"') {
	      unterminated = false;
	      i++;
	      break;
	    } else {
	      if (exec$8(IS_C0_CONTROL_CODE, chr)) throw new $SyntaxError('Bad control character in string literal at: ' + i);
	      value += chr;
	      i++;
	    }
	  }
	  if (unterminated) throw new $SyntaxError('Unterminated string at: ' + i);
	  return {
	    value: value,
	    end: i
	  };
	};

	/* eslint-disable es/no-json -- safe */
	var fails$k = fails$w;
	var nativeRawJson = !fails$k(function () {
	  var unsafeInt = '9007199254740993';
	  // eslint-disable-next-line es/no-json-rawjson -- feature detection
	  var raw = JSON.rawJSON(unsafeInt);
	  // eslint-disable-next-line es/no-json-israwjson -- feature detection
	  return !JSON.isRawJSON(raw) || JSON.stringify(raw) !== unsafeInt;
	});

	var $$q = _export;
	var getBuiltIn$7 = getBuiltIn$c;
	var apply$3 = functionApply;
	var call$o = functionCall;
	var uncurryThis$i = functionUncurryThis;
	var fails$j = fails$w;
	var isArray$1 = isArray$3;
	var isCallable$e = isCallable$r;
	var isRawJSON = isRawJson;
	var isSymbol = isSymbol$3;
	var classof$7 = classofRaw$2;
	var toString$9 = toString$b;
	var arraySlice$3 = arraySlice$4;
	var parseJSONString$1 = parseJsonString;
	var uid = uid$3;
	var NATIVE_SYMBOL$1 = symbolConstructorDetection;
	var NATIVE_RAW_JSON = nativeRawJson;
	var $String = String;
	var $stringify = getBuiltIn$7('JSON', 'stringify');
	var exec$7 = uncurryThis$i(/./.exec);
	var charAt$9 = uncurryThis$i(''.charAt);
	var charCodeAt$2 = uncurryThis$i(''.charCodeAt);
	var replace$6 = uncurryThis$i(''.replace);
	var slice$1 = uncurryThis$i(''.slice);
	var push$6 = uncurryThis$i([].push);
	var numberToString$1 = uncurryThis$i(1.1.toString);
	var surrogates = /[\uD800-\uDFFF]/g;
	var leadingSurrogates = /^[\uD800-\uDBFF]$/;
	var trailingSurrogates = /^[\uDC00-\uDFFF]$/;
	var MARK = uid();
	var MARK_LENGTH = MARK.length;
	var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL$1 || fails$j(function () {
	  var symbol = getBuiltIn$7('Symbol')('stringify detection');
	  // MS Edge converts symbol values to JSON as {}
	  return $stringify([symbol]) !== '[null]'
	  // WebKit converts symbol values to JSON as null
	  || $stringify({
	    a: symbol
	  }) !== '{}'
	  // V8 throws on boxed symbols
	  || $stringify(Object(symbol)) !== '{}';
	});

	// https://github.com/tc39/proposal-well-formed-stringify
	var ILL_FORMED_UNICODE = fails$j(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"' || $stringify('\uDEAD') !== '"\\udead"';
	});
	var stringifyWithProperSymbolsConversion = WRONG_SYMBOLS_CONVERSION ? function (it, replacer) {
	  var args = arraySlice$3(arguments);
	  var $replacer = getReplacerFunction(replacer);
	  if (!isCallable$e($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
	  args[1] = function (key, value) {
	    // some old implementations (like WebKit) could pass numbers as keys
	    if (isCallable$e($replacer)) value = call$o($replacer, this, $String(key), value);
	    if (!isSymbol(value)) return value;
	  };
	  return apply$3($stringify, null, args);
	} : $stringify;
	var fixIllFormedJSON = function (match, offset, string) {
	  var prev = charAt$9(string, offset - 1);
	  var next = charAt$9(string, offset + 1);
	  if (exec$7(leadingSurrogates, match) && !exec$7(trailingSurrogates, next) || exec$7(trailingSurrogates, match) && !exec$7(leadingSurrogates, prev)) {
	    return '\\u' + numberToString$1(charCodeAt$2(match, 0), 16);
	  }
	  return match;
	};
	var getReplacerFunction = function (replacer) {
	  if (isCallable$e(replacer)) return replacer;
	  if (!isArray$1(replacer)) return;
	  var rawLength = replacer.length;
	  var keys = [];
	  for (var i = 0; i < rawLength; i++) {
	    var element = replacer[i];
	    if (typeof element == 'string') push$6(keys, element);else if (typeof element == 'number' || classof$7(element) === 'Number' || classof$7(element) === 'String') push$6(keys, toString$9(element));
	  }
	  var keysLength = keys.length;
	  var root = true;
	  return function (key, value) {
	    if (root) {
	      root = false;
	      return value;
	    }
	    if (isArray$1(this)) return value;
	    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
	  };
	};

	// `JSON.stringify` method
	// https://tc39.es/ecma262/#sec-json.stringify
	// https://github.com/tc39/proposal-json-parse-with-source
	if ($stringify) $$q({
	  target: 'JSON',
	  stat: true,
	  arity: 3,
	  forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE || !NATIVE_RAW_JSON
	}, {
	  stringify: function stringify(text, replacer, space) {
	    var replacerFunction = getReplacerFunction(replacer);
	    var rawStrings = [];
	    var json = stringifyWithProperSymbolsConversion(text, function (key, value) {
	      // some old implementations (like WebKit) could pass numbers as keys
	      var v = isCallable$e(replacerFunction) ? call$o(replacerFunction, this, $String(key), value) : value;
	      return !NATIVE_RAW_JSON && isRawJSON(v) ? MARK + (push$6(rawStrings, v.rawJSON) - 1) : v;
	    }, space);
	    if (typeof json != 'string') return json;
	    if (ILL_FORMED_UNICODE) json = replace$6(json, surrogates, fixIllFormedJSON);
	    if (NATIVE_RAW_JSON) return json;
	    var result = '';
	    var length = json.length;
	    for (var i = 0; i < length; i++) {
	      var chr = charAt$9(json, i);
	      if (chr === '"') {
	        var end = parseJSONString$1(json, ++i).end - 1;
	        var string = slice$1(json, i, end);
	        result += slice$1(string, 0, MARK_LENGTH) === MARK ? rawStrings[slice$1(string, MARK_LENGTH)] : '"' + string + '"';
	        i = end;
	      } else result += chr;
	    }
	    return result;
	  }
	});

	/* global Bun, Deno -- detection */
	var globalThis$j = globalThis_1;
	var userAgent$3 = environmentUserAgent;
	var classof$6 = classofRaw$2;
	var userAgentStartsWith = function (string) {
	  return userAgent$3.slice(0, string.length) === string;
	};
	var environment = function () {
	  if (userAgentStartsWith('Bun/')) return 'BUN';
	  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
	  if (userAgentStartsWith('Deno/')) return 'DENO';
	  if (userAgentStartsWith('Node.js/')) return 'NODE';
	  if (globalThis$j.Bun && typeof Bun.version == 'string') return 'BUN';
	  if (globalThis$j.Deno && typeof Deno.version == 'object') return 'DENO';
	  if (classof$6(globalThis$j.process) === 'process') return 'NODE';
	  if (globalThis$j.window && globalThis$j.document) return 'BROWSER';
	  return 'REST';
	}();

	var ENVIRONMENT$1 = environment;
	var environmentIsNode = ENVIRONMENT$1 === 'NODE';

	var globalThis$i = globalThis_1;
	var path$1 = globalThis$i;

	var defineProperty$3 = objectDefineProperty.f;
	var hasOwn$8 = hasOwnProperty_1;
	var wellKnownSymbol$h = wellKnownSymbol$m;
	var TO_STRING_TAG$2 = wellKnownSymbol$h('toStringTag');
	var setToStringTag$6 = function (target, TAG, STATIC) {
	  if (target && !STATIC) target = target.prototype;
	  if (target && !hasOwn$8(target, TO_STRING_TAG$2)) {
	    defineProperty$3(target, TO_STRING_TAG$2, {
	      configurable: true,
	      value: TAG
	    });
	  }
	};

	var makeBuiltIn = makeBuiltInExports;
	var defineProperty$2 = objectDefineProperty;
	var defineBuiltInAccessor$6 = function (target, name, descriptor) {
	  if (descriptor.get) makeBuiltIn(descriptor.get, name, {
	    getter: true
	  });
	  if (descriptor.set) makeBuiltIn(descriptor.set, name, {
	    setter: true
	  });
	  return defineProperty$2.f(target, name, descriptor);
	};

	var getBuiltIn$6 = getBuiltIn$c;
	var defineBuiltInAccessor$5 = defineBuiltInAccessor$6;
	var wellKnownSymbol$g = wellKnownSymbol$m;
	var DESCRIPTORS$c = descriptors;
	var SPECIES$3 = wellKnownSymbol$g('species');
	var setSpecies$2 = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn$6(CONSTRUCTOR_NAME);
	  if (DESCRIPTORS$c && Constructor && !Constructor[SPECIES$3]) {
	    defineBuiltInAccessor$5(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () {
	        return this;
	      }
	    });
	  }
	};

	var isPrototypeOf$3 = objectIsPrototypeOf;
	var $TypeError$a = TypeError;
	var anInstance$4 = function (it, Prototype) {
	  if (isPrototypeOf$3(Prototype, it)) return it;
	  throw new $TypeError$a('Incorrect invocation');
	};

	var uncurryThis$h = functionUncurryThis;
	var fails$i = fails$w;
	var isCallable$d = isCallable$r;
	var classof$5 = classof$a;
	var getBuiltIn$5 = getBuiltIn$c;
	var inspectSource$1 = inspectSource$3;
	var noop = function () {/* empty */};
	var construct = getBuiltIn$5('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$6 = uncurryThis$h(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.test(noop);
	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable$d(argument)) return false;
	  try {
	    construct(noop, [], argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};
	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable$d(argument)) return false;
	  switch (classof$5(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction':
	      return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec$6(constructorRegExp, inspectSource$1(argument));
	  } catch (error) {
	    return true;
	  }
	};
	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor$2 = !construct || fails$i(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
	    called = true;
	  }) || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var isConstructor$1 = isConstructor$2;
	var tryToString$2 = tryToString$4;
	var $TypeError$9 = TypeError;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor$1 = function (argument) {
	  if (isConstructor$1(argument)) return argument;
	  throw new $TypeError$9(tryToString$2(argument) + ' is not a constructor');
	};

	var anObject$g = anObject$l;
	var aConstructor = aConstructor$1;
	var isNullOrUndefined$1 = isNullOrUndefined$4;
	var wellKnownSymbol$f = wellKnownSymbol$m;
	var SPECIES$2 = wellKnownSymbol$f('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor$2 = function (O, defaultConstructor) {
	  var C = anObject$g(O).constructor;
	  var S;
	  return C === undefined || isNullOrUndefined$1(S = anObject$g(C)[SPECIES$2]) ? defaultConstructor : aConstructor(S);
	};

	var classofRaw = classofRaw$2;
	var uncurryThis$g = functionUncurryThis;
	var functionUncurryThisClause = function (fn) {
	  // Nashorn bug:
	  //   https://github.com/zloirock/core-js/issues/1128
	  //   https://github.com/zloirock/core-js/issues/1130
	  if (classofRaw(fn) === 'Function') return uncurryThis$g(fn);
	};

	var uncurryThis$f = functionUncurryThisClause;
	var aCallable$d = aCallable$g;
	var NATIVE_BIND = functionBindNative;
	var bind$8 = uncurryThis$f(uncurryThis$f.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable$d(fn);
	  return that === undefined ? fn : NATIVE_BIND ? bind$8(fn, that) : function /* ...args */
	  () {
	    return fn.apply(that, arguments);
	  };
	};

	var $TypeError$8 = TypeError;
	var validateArgumentsLength$5 = function (passed, required) {
	  if (passed < required) throw new $TypeError$8('Not enough arguments');
	  return passed;
	};

	var userAgent$2 = environmentUserAgent;
	var environmentIsIos = /ipad|iphone|ipod/i.test(userAgent$2) && /applewebkit/i.test(userAgent$2);

	var globalThis$h = globalThis_1;
	var apply$2 = functionApply;
	var bind$7 = functionBindContext;
	var isCallable$c = isCallable$r;
	var hasOwn$7 = hasOwnProperty_1;
	var fails$h = fails$w;
	var html = html$2;
	var arraySlice$2 = arraySlice$4;
	var createElement = documentCreateElement$2;
	var validateArgumentsLength$4 = validateArgumentsLength$5;
	var IS_IOS$1 = environmentIsIos;
	var IS_NODE$3 = environmentIsNode;
	var set = globalThis$h.setImmediate;
	var clear = globalThis$h.clearImmediate;
	var process$2 = globalThis$h.process;
	var Dispatch = globalThis$h.Dispatch;
	var Function$1 = globalThis$h.Function;
	var MessageChannel = globalThis$h.MessageChannel;
	var String$1 = globalThis$h.String;
	var counter = 0;
	var queue$2 = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var $location, defer, channel, port;
	fails$h(function () {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  $location = globalThis$h.location;
	});
	var run = function (id) {
	  if (hasOwn$7(queue$2, id)) {
	    var fn = queue$2[id];
	    delete queue$2[id];
	    fn();
	  }
	};
	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};
	var eventListener = function (event) {
	  run(event.data);
	};
	var globalPostMessageDefer = function (id) {
	  // old engines have not location.origin
	  globalThis$h.postMessage(String$1(id), $location.protocol + '//' + $location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set || !clear) {
	  set = function setImmediate(handler) {
	    validateArgumentsLength$4(arguments.length, 1);
	    var fn = isCallable$c(handler) ? handler : Function$1(handler);
	    var args = arraySlice$2(arguments, 1);
	    queue$2[++counter] = function () {
	      apply$2(fn, undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue$2[id];
	  };
	  // Node.js 0.8-
	  if (IS_NODE$3) {
	    defer = function (id) {
	      process$2.nextTick(runner(id));
	    };
	    // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	    // Browsers with MessageChannel, includes WebWorkers
	    // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !IS_IOS$1) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = eventListener;
	    defer = bind$7(port.postMessage, port);
	    // Browsers with postMessage, skip WebWorkers
	    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (globalThis$h.addEventListener && isCallable$c(globalThis$h.postMessage) && !globalThis$h.importScripts && $location && $location.protocol !== 'file:' && !fails$h(globalPostMessageDefer)) {
	    defer = globalPostMessageDefer;
	    globalThis$h.addEventListener('message', eventListener, false);
	    // IE8-
	  } else if (ONREADYSTATECHANGE in createElement('script')) {
	    defer = function (id) {
	      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	    // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}
	var task$1 = {
	  set: set};

	var globalThis$g = globalThis_1;
	var DESCRIPTORS$b = descriptors;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// Avoid NodeJS experimental warning
	var safeGetBuiltIn$2 = function (name) {
	  if (!DESCRIPTORS$b) return globalThis$g[name];
	  var descriptor = getOwnPropertyDescriptor$1(globalThis$g, name);
	  return descriptor && descriptor.value;
	};

	var Queue$2 = function () {
	  this.head = null;
	  this.tail = null;
	};
	Queue$2.prototype = {
	  add: function (item) {
	    var entry = {
	      item: item,
	      next: null
	    };
	    var tail = this.tail;
	    if (tail) tail.next = entry;else this.head = entry;
	    this.tail = entry;
	  },
	  get: function () {
	    var entry = this.head;
	    if (entry) {
	      var next = this.head = entry.next;
	      if (next === null) this.tail = null;
	      return entry.item;
	    }
	  }
	};
	var queue$1 = Queue$2;

	var userAgent$1 = environmentUserAgent;
	var environmentIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$1) && typeof Pebble != 'undefined';

	var userAgent = environmentUserAgent;
	var environmentIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);

	var globalThis$f = globalThis_1;
	var safeGetBuiltIn$1 = safeGetBuiltIn$2;
	var bind$6 = functionBindContext;
	var macrotask = task$1.set;
	var Queue$1 = queue$1;
	var IS_IOS = environmentIsIos;
	var IS_IOS_PEBBLE = environmentIsIosPebble;
	var IS_WEBOS_WEBKIT = environmentIsWebosWebkit;
	var IS_NODE$2 = environmentIsNode;
	var MutationObserver = globalThis$f.MutationObserver || globalThis$f.WebKitMutationObserver;
	var document$2 = globalThis$f.document;
	var process$1 = globalThis$f.process;
	var Promise$1 = globalThis$f.Promise;
	var microtask$1 = safeGetBuiltIn$1('queueMicrotask');
	var notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!microtask$1) {
	  var queue = new Queue$1();
	  var flush = function () {
	    var parent, fn;
	    if (IS_NODE$2 && (parent = process$1.domain)) parent.exit();
	    while (fn = queue.get()) try {
	      fn();
	    } catch (error) {
	      if (queue.head) notify$1();
	      throw error;
	    }
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!IS_IOS && !IS_NODE$2 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, {
	      characterData: true
	    });
	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    };
	    // environments with maybe non-completely correct, but existent Promise
	  } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise$1;
	    then = bind$6(promise.then, promise);
	    notify$1 = function () {
	      then(flush);
	    };
	    // Node.js without promises
	  } else if (IS_NODE$2) {
	    notify$1 = function () {
	      process$1.nextTick(flush);
	    };
	    // for other environments - macrotask based on:
	    // - setImmediate
	    // - MessageChannel
	    // - window.postMessage
	    // - onreadystatechange
	    // - setTimeout
	  } else {
	    // `webpack` dev server bug on IE global methods - use bind(fn, global)
	    macrotask = bind$6(macrotask, globalThis$f);
	    notify$1 = function () {
	      macrotask(flush);
	    };
	  }
	  microtask$1 = function (fn) {
	    if (!queue.head) notify$1();
	    queue.add(fn);
	  };
	}
	var microtask_1 = microtask$1;

	var hostReportErrors$1 = function (a, b) {
	  try {
	    // eslint-disable-next-line no-console -- safe
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  } catch (error) {/* empty */}
	};

	var perform$4 = function (exec) {
	  try {
	    return {
	      error: false,
	      value: exec()
	    };
	  } catch (error) {
	    return {
	      error: true,
	      value: error
	    };
	  }
	};

	var globalThis$e = globalThis_1;
	var promiseNativeConstructor = globalThis$e.Promise;

	var globalThis$d = globalThis_1;
	var NativePromiseConstructor$4 = promiseNativeConstructor;
	var isCallable$b = isCallable$r;
	var isForced$1 = isForced_1;
	var inspectSource = inspectSource$3;
	var wellKnownSymbol$e = wellKnownSymbol$m;
	var ENVIRONMENT = environment;
	var V8_VERSION = environmentV8Version;
	NativePromiseConstructor$4 && NativePromiseConstructor$4.prototype;
	var SPECIES$1 = wellKnownSymbol$e('species');
	var SUBCLASSING = false;
	var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$b(globalThis$d.PromiseRejectionEvent);
	var FORCED_PROMISE_CONSTRUCTOR$5 = isForced$1('Promise', function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor$4);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$4);
	  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions
	  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
	    // Detect correctness of subclassing with @@species support
	    var promise = new NativePromiseConstructor$4(function (resolve) {
	      resolve(1);
	    });
	    var FakePromise = function (exec) {
	      exec(function () {/* empty */}, function () {/* empty */});
	    };
	    var constructor = promise.constructor = {};
	    constructor[SPECIES$1] = FakePromise;
	    SUBCLASSING = promise.then(function () {/* empty */}) instanceof FakePromise;
	    if (!SUBCLASSING) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  }
	  return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === 'BROWSER' || ENVIRONMENT === 'DENO') && !NATIVE_PROMISE_REJECTION_EVENT$1;
	});
	var promiseConstructorDetection = {
	  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
	  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
	  SUBCLASSING: SUBCLASSING
	};

	var newPromiseCapability$2 = {};

	var aCallable$c = aCallable$g;
	var $TypeError$7 = TypeError;
	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw new $TypeError$7('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable$c(resolve);
	  this.reject = aCallable$c(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	newPromiseCapability$2.f = function (C) {
	  return new PromiseCapability(C);
	};

	var $$p = _export;
	var IS_NODE$1 = environmentIsNode;
	var globalThis$c = globalThis_1;
	var path = path$1;
	var call$n = functionCall;
	var defineBuiltIn$b = defineBuiltIn$d;
	var setPrototypeOf$1 = objectSetPrototypeOf;
	var setToStringTag$5 = setToStringTag$6;
	var setSpecies$1 = setSpecies$2;
	var aCallable$b = aCallable$g;
	var isCallable$a = isCallable$r;
	var isObject$6 = isObject$h;
	var anInstance$3 = anInstance$4;
	var speciesConstructor$1 = speciesConstructor$2;
	var task = task$1.set;
	var microtask = microtask_1;
	var hostReportErrors = hostReportErrors$1;
	var perform$3 = perform$4;
	var Queue = queue$1;
	var InternalStateModule$5 = internalState;
	var NativePromiseConstructor$3 = promiseNativeConstructor;
	var PromiseConstructorDetection = promiseConstructorDetection;
	var newPromiseCapabilityModule$4 = newPromiseCapability$2;
	var PROMISE = 'Promise';
	var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
	var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
	var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
	var getInternalPromiseState = InternalStateModule$5.getterFor(PROMISE);
	var setInternalState$5 = InternalStateModule$5.set;
	var NativePromisePrototype$2 = NativePromiseConstructor$3 && NativePromiseConstructor$3.prototype;
	var PromiseConstructor = NativePromiseConstructor$3;
	var PromisePrototype = NativePromisePrototype$2;
	var TypeError$3 = globalThis$c.TypeError;
	var document$1 = globalThis$c.document;
	var process = globalThis$c.process;
	var newPromiseCapability$1 = newPromiseCapabilityModule$4.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && globalThis$c.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject$6(it) && isCallable$a(then = it.then) ? then : false;
	};
	var callReaction = function (reaction, state) {
	  var value = state.value;
	  var ok = state.state === FULFILLED;
	  var handler = ok ? reaction.ok : reaction.fail;
	  var resolve = reaction.resolve;
	  var reject = reaction.reject;
	  var domain = reaction.domain;
	  var result, then, exited;
	  try {
	    if (handler) {
	      if (!ok) {
	        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
	        state.rejection = HANDLED;
	      }
	      if (handler === true) result = value;else {
	        if (domain) domain.enter();
	        result = handler(value); // can throw
	        if (domain) {
	          domain.exit();
	          exited = true;
	        }
	      }
	      if (result === reaction.promise) {
	        reject(new TypeError$3('Promise-chain cycle'));
	      } else if (then = isThenable(result)) {
	        call$n(then, result, resolve, reject);
	      } else resolve(result);
	    } else reject(value);
	  } catch (error) {
	    if (domain && !exited) domain.exit();
	    reject(error);
	  }
	};
	var notify = function (state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  microtask(function () {
	    var reactions = state.reactions;
	    var reaction;
	    while (reaction = reactions.get()) {
	      callReaction(reaction, state);
	    }
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(state);
	  });
	};
	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    globalThis$c.dispatchEvent(event);
	  } else event = {
	    promise: promise,
	    reason: reason
	  };
	  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis$c['on' + name])) handler(event);else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};
	var onUnhandled = function (state) {
	  call$n(task, globalThis$c, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform$3(function () {
	        if (IS_NODE$1) {
	          process.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};
	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};
	var onHandleUnhandled = function (state) {
	  call$n(task, globalThis$c, function () {
	    var promise = state.facade;
	    if (IS_NODE$1) {
	      process.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};
	var bind$5 = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};
	var internalReject = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify(state, true);
	};
	var internalResolve = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (state.facade === value) throw new TypeError$3("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = {
	          done: false
	        };
	        try {
	          call$n(then, value, bind$5(internalResolve, wrapper, state), bind$5(internalReject, wrapper, state));
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(state, false);
	    }
	  } catch (error) {
	    internalReject({
	      done: false
	    }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED_PROMISE_CONSTRUCTOR$4) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance$3(this, PromisePrototype);
	    aCallable$b(executor);
	    call$n(Internal, this);
	    var state = getInternalPromiseState(this);
	    try {
	      executor(bind$5(internalResolve, state), bind$5(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };
	  PromisePrototype = PromiseConstructor.prototype;

	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState$5(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: new Queue(),
	      rejection: false,
	      state: PENDING,
	      value: null
	    });
	  };

	  // `Promise.prototype.then` method
	  // https://tc39.es/ecma262/#sec-promise.prototype.then
	  Internal.prototype = defineBuiltIn$b(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
	    var state = getInternalPromiseState(this);
	    var reaction = newPromiseCapability$1(speciesConstructor$1(this, PromiseConstructor));
	    state.parent = true;
	    reaction.ok = isCallable$a(onFulfilled) ? onFulfilled : true;
	    reaction.fail = isCallable$a(onRejected) && onRejected;
	    reaction.domain = IS_NODE$1 ? process.domain : undefined;
	    if (state.state === PENDING) state.reactions.add(reaction);else microtask(function () {
	      callReaction(reaction, state);
	    });
	    return reaction.promise;
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalPromiseState(promise);
	    this.promise = promise;
	    this.resolve = bind$5(internalResolve, state);
	    this.reject = bind$5(internalReject, state);
	  };
	  newPromiseCapabilityModule$4.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
	  };
	  if (isCallable$a(NativePromiseConstructor$3) && NativePromisePrototype$2 !== Object.prototype) {
	    nativeThen = NativePromisePrototype$2.then;
	    if (!NATIVE_PROMISE_SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      defineBuiltIn$b(NativePromisePrototype$2, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          call$n(nativeThen, that, resolve, reject);
	        }).then(onFulfilled, onRejected);
	        // https://github.com/zloirock/core-js/issues/640
	      }, {
	        unsafe: true
	      });
	    }

	    // make `.constructor === Promise` work for native promise-based APIs
	    try {
	      delete NativePromisePrototype$2.constructor;
	    } catch (error) {/* empty */}

	    // make `instanceof Promise` work for native promise-based APIs
	    if (setPrototypeOf$1) {
	      setPrototypeOf$1(NativePromisePrototype$2, PromisePrototype);
	    }
	  }
	}

	// `Promise` constructor
	// https://tc39.es/ecma262/#sec-promise-executor
	$$p({
	  global: true,
	  constructor: true,
	  wrap: true,
	  forced: FORCED_PROMISE_CONSTRUCTOR$4
	}, {
	  Promise: PromiseConstructor
	});
	PromiseWrapper = path.Promise;
	setToStringTag$5(PromiseConstructor, PROMISE, false);
	setSpecies$1(PROMISE);

	var iterators = {};

	var wellKnownSymbol$d = wellKnownSymbol$m;
	var Iterators$4 = iterators;
	var ITERATOR$8 = wellKnownSymbol$d('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$2 = function (it) {
	  return it !== undefined && (Iterators$4.Array === it || ArrayPrototype[ITERATOR$8] === it);
	};

	var classof$4 = classof$a;
	var getMethod$3 = getMethod$5;
	var isNullOrUndefined = isNullOrUndefined$4;
	var Iterators$3 = iterators;
	var wellKnownSymbol$c = wellKnownSymbol$m;
	var ITERATOR$7 = wellKnownSymbol$c('iterator');
	var getIteratorMethod$4 = function (it) {
	  if (!isNullOrUndefined(it)) return getMethod$3(it, ITERATOR$7) || getMethod$3(it, '@@iterator') || Iterators$3[classof$4(it)];
	};

	var call$m = functionCall;
	var aCallable$a = aCallable$g;
	var anObject$f = anObject$l;
	var tryToString$1 = tryToString$4;
	var getIteratorMethod$3 = getIteratorMethod$4;
	var $TypeError$6 = TypeError;
	var getIterator$3 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$3(argument) : usingIterator;
	  if (aCallable$a(iteratorMethod)) return anObject$f(call$m(iteratorMethod, argument));
	  throw new $TypeError$6(tryToString$1(argument) + ' is not iterable');
	};

	var call$l = functionCall;
	var anObject$e = anObject$l;
	var getMethod$2 = getMethod$5;
	var iteratorClose$b = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$e(iterator);
	  try {
	    innerResult = getMethod$2(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = call$l(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$e(innerResult);
	  return value;
	};

	var bind$4 = functionBindContext;
	var call$k = functionCall;
	var anObject$d = anObject$l;
	var tryToString = tryToString$4;
	var isArrayIteratorMethod$1 = isArrayIteratorMethod$2;
	var lengthOfArrayLike$5 = lengthOfArrayLike$8;
	var isPrototypeOf$2 = objectIsPrototypeOf;
	var getIterator$2 = getIterator$3;
	var getIteratorMethod$2 = getIteratorMethod$4;
	var iteratorClose$a = iteratorClose$b;
	var $TypeError$5 = TypeError;
	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};
	var ResultPrototype = Result.prototype;
	var iterate$7 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_RECORD = !!(options && options.IS_RECORD);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind$4(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;
	  var stop = function (condition) {
	    var $iterator = iterator;
	    iterator = undefined;
	    if ($iterator) iteratorClose$a($iterator, 'normal');
	    return new Result(true, condition);
	  };
	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$d(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    }
	    return INTERRUPTED ? fn(value, stop) : fn(value);
	  };
	  if (IS_RECORD) {
	    iterator = iterable.iterator;
	  } else if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod$2(iterable);
	    if (!iterFn) throw new $TypeError$5(tryToString(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod$1(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike$5(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && isPrototypeOf$2(ResultPrototype, result)) return result;
	      }
	      return new Result(false);
	    }
	    iterator = getIterator$2(iterable, iterFn);
	  }
	  next = IS_RECORD ? iterable.next : iterator.next;
	  while (!(step = call$k(next, iterator)).done) {
	    // `IteratorValue` errors should propagate without closing the iterator
	    var value = step.value;
	    try {
	      result = callFn(value);
	    } catch (error) {
	      if (iterator) iteratorClose$a(iterator, 'throw', error);else throw error;
	    }
	    if (typeof result == 'object' && result && isPrototypeOf$2(ResultPrototype, result)) return result;
	  }
	  return new Result(false);
	};

	var wellKnownSymbol$b = wellKnownSymbol$m;
	var ITERATOR$6 = wellKnownSymbol$b('iterator');
	var SAFE_CLOSING = false;
	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return {
	        done: !!called++
	      };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	  iteratorWithReturn[ITERATOR$6] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () {
	    throw 2;
	  });
	} catch (error) {/* empty */}
	var checkCorrectnessOfIteration$1 = function (exec, SKIP_CLOSING) {
	  try {
	    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  } catch (error) {
	    return false;
	  } // workaround of old WebKit + `eval` bug
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	    object[ITERATOR$6] = function () {
	      return {
	        next: function () {
	          return {
	            done: ITERATION_SUPPORT = true
	          };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) {/* empty */}
	  return ITERATION_SUPPORT;
	};

	var NativePromiseConstructor$2 = promiseNativeConstructor;
	var checkCorrectnessOfIteration = checkCorrectnessOfIteration$1;
	var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;
	var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
	  NativePromiseConstructor$2.all(iterable).then(undefined, function () {/* empty */});
	});

	var $$o = _export;
	var call$j = functionCall;
	var aCallable$9 = aCallable$g;
	var newPromiseCapabilityModule$3 = newPromiseCapability$2;
	var perform$2 = perform$4;
	var iterate$6 = iterate$7;
	var PROMISE_STATICS_INCORRECT_ITERATION$2 = promiseStaticsIncorrectIteration;

	// `Promise.all` method
	// https://tc39.es/ecma262/#sec-promise.all
	$$o({
	  target: 'Promise',
	  stat: true,
	  forced: PROMISE_STATICS_INCORRECT_ITERATION$2
	}, {
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule$3.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$2(function () {
	      var $promiseResolve = aCallable$9(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$6(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        call$j($promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$n = _export;
	var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
	var NativePromiseConstructor$1 = promiseNativeConstructor;
	var getBuiltIn$4 = getBuiltIn$c;
	var isCallable$9 = isCallable$r;
	var defineBuiltIn$a = defineBuiltIn$d;
	var NativePromisePrototype$1 = NativePromiseConstructor$1 && NativePromiseConstructor$1.prototype;

	// `Promise.prototype.catch` method
	// https://tc39.es/ecma262/#sec-promise.prototype.catch
	$$n({
	  target: 'Promise',
	  proto: true,
	  forced: FORCED_PROMISE_CONSTRUCTOR$2,
	  real: true
	}, {
	  'catch': function (onRejected) {
	    return this.then(undefined, onRejected);
	  }
	});

	// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	if (isCallable$9(NativePromiseConstructor$1)) {
	  var method$1 = getBuiltIn$4('Promise').prototype['catch'];
	  if (NativePromisePrototype$1['catch'] !== method$1) {
	    defineBuiltIn$a(NativePromisePrototype$1, 'catch', method$1, {
	      unsafe: true
	    });
	  }
	}

	var $$m = _export;
	var call$i = functionCall;
	var aCallable$8 = aCallable$g;
	var newPromiseCapabilityModule$2 = newPromiseCapability$2;
	var perform$1 = perform$4;
	var iterate$5 = iterate$7;
	var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

	// `Promise.race` method
	// https://tc39.es/ecma262/#sec-promise.race
	$$m({
	  target: 'Promise',
	  stat: true,
	  forced: PROMISE_STATICS_INCORRECT_ITERATION$1
	}, {
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule$2.f(C);
	    var reject = capability.reject;
	    var result = perform$1(function () {
	      var $promiseResolve = aCallable$8(C.resolve);
	      iterate$5(iterable, function (promise) {
	        call$i($promiseResolve, C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$l = _export;
	var newPromiseCapabilityModule$1 = newPromiseCapability$2;
	var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

	// `Promise.reject` method
	// https://tc39.es/ecma262/#sec-promise.reject
	$$l({
	  target: 'Promise',
	  stat: true,
	  forced: FORCED_PROMISE_CONSTRUCTOR$1
	}, {
	  reject: function reject(r) {
	    var capability = newPromiseCapabilityModule$1.f(this);
	    var capabilityReject = capability.reject;
	    capabilityReject(r);
	    return capability.promise;
	  }
	});

	var anObject$c = anObject$l;
	var isObject$5 = isObject$h;
	var newPromiseCapability = newPromiseCapability$2;
	var promiseResolve$2 = function (C, x) {
	  anObject$c(C);
	  if (isObject$5(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var $$k = _export;
	var getBuiltIn$3 = getBuiltIn$c;
	var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
	var promiseResolve$1 = promiseResolve$2;
	getBuiltIn$3('Promise');

	// `Promise.resolve` method
	// https://tc39.es/ecma262/#sec-promise.resolve
	$$k({
	  target: 'Promise',
	  stat: true,
	  forced: FORCED_PROMISE_CONSTRUCTOR
	}, {
	  resolve: function resolve(x) {
	    return promiseResolve$1(this, x);
	  }
	});

	var $$j = _export;
	var NativePromiseConstructor = promiseNativeConstructor;
	var fails$g = fails$w;
	var getBuiltIn$2 = getBuiltIn$c;
	var isCallable$8 = isCallable$r;
	var speciesConstructor = speciesConstructor$2;
	var promiseResolve = promiseResolve$2;
	var defineBuiltIn$9 = defineBuiltIn$d;
	var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

	// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
	var NON_GENERIC = !!NativePromiseConstructor && fails$g(function () {
	  // eslint-disable-next-line unicorn/no-thenable -- required for testing
	  NativePromisePrototype['finally'].call({
	    then: function () {/* empty */}
	  }, function () {/* empty */});
	});

	// `Promise.prototype.finally` method
	// https://tc39.es/ecma262/#sec-promise.prototype.finally
	$$j({
	  target: 'Promise',
	  proto: true,
	  real: true,
	  forced: NON_GENERIC
	}, {
	  'finally': function (onFinally) {
	    var C = speciesConstructor(this, getBuiltIn$2('Promise'));
	    var isFunction = isCallable$8(onFinally);
	    return this.then(isFunction ? function (x) {
	      return promiseResolve(C, onFinally()).then(function () {
	        return x;
	      });
	    } : onFinally, isFunction ? function (e) {
	      return promiseResolve(C, onFinally()).then(function () {
	        throw e;
	      });
	    } : onFinally);
	  }
	});

	// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
	if (isCallable$8(NativePromiseConstructor)) {
	  var method = getBuiltIn$2('Promise').prototype['finally'];
	  if (NativePromisePrototype['finally'] !== method) {
	    defineBuiltIn$9(NativePromisePrototype, 'finally', method, {
	      unsafe: true
	    });
	  }
	}

	var anObject$b = anObject$l;

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags$1 = function () {
	  var that = anObject$b(this);
	  var result = '';
	  if (that.hasIndices) result += 'd';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.unicodeSets) result += 'v';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var fails$f = fails$w;
	var globalThis$b = globalThis_1;

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp$2 = globalThis$b.RegExp;
	var UNSUPPORTED_Y$2 = fails$f(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') !== null;
	});

	// UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008
	var MISSED_STICKY$1 = UNSUPPORTED_Y$2 || fails$f(function () {
	  return !$RegExp$2('a', 'y').sticky;
	});
	var BROKEN_CARET = UNSUPPORTED_Y$2 || fails$f(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') !== null;
	});
	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY$1,
	  UNSUPPORTED_Y: UNSUPPORTED_Y$2
	};

	var fails$e = fails$w;
	var globalThis$a = globalThis_1;

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = globalThis$a.RegExp;
	var regexpUnsupportedDotAll = fails$e(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.test('\n') && re.flags === 's');
	});

	var fails$d = fails$w;
	var globalThis$9 = globalThis_1;

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = globalThis$9.RegExp;
	var regexpUnsupportedNcg = fails$d(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' || 'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */
	var call$h = functionCall;
	var uncurryThis$e = functionUncurryThis;
	var toString$8 = toString$b;
	var regexpFlags = regexpFlags$1;
	var stickyHelpers$1 = regexpStickyHelpers;
	var shared = shared$4;
	var create$4 = objectCreate;
	var getInternalState$3 = internalState.get;
	var UNSUPPORTED_DOT_ALL$2 = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG$1 = regexpUnsupportedNcg;
	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$8 = uncurryThis$e(''.charAt);
	var indexOf = uncurryThis$e(''.indexOf);
	var replace$5 = uncurryThis$e(''.replace);
	var stringSlice$6 = uncurryThis$e(''.slice);
	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  call$h(nativeExec, re1, 'a');
	  call$h(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();
	var UNSUPPORTED_Y$1 = stickyHelpers$1.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || UNSUPPORTED_DOT_ALL$2 || UNSUPPORTED_NCG$1;
	var setGroups = function (re, groups) {
	  var object = re.groups = create$4(null);
	  for (var i = 0; i < groups.length; i++) {
	    var group = groups[i];
	    object[group[0]] = re[group[1]];
	  }
	};
	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState$3(re);
	    var str = toString$8(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex;
	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = call$h(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      if (result && state.groups) setGroups(result, state.groups);
	      return result;
	    }
	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = call$h(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;
	    if (sticky) {
	      flags = replace$5(flags, 'y', '');
	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }
	      strCopy = stringSlice$6(str, re.lastIndex);
	      // Support anchored sticky behavior.
	      var prevChar = re.lastIndex > 0 && charAt$8(str, re.lastIndex - 1);
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && prevChar !== '\n' && prevChar !== '\r' && prevChar !== '\u2028' && prevChar !== '\u2029')) {
	        source = '(?: (?:' + source + '))';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }
	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    var match = call$h(nativeExec, sticky ? reCopy : re, strCopy);
	    if (sticky) {
	      if (match) {
	        match.input = str;
	        match[0] = stringSlice$6(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
	      call$h(nativeReplace, match[0], reCopy, function () {
	        for (var i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }
	    if (match && groups) setGroups(match, groups);
	    return match;
	  };
	}
	var regexpExec$2 = patchedExec;

	var $$i = _export;
	var exec$5 = regexpExec$2;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	$$i({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== exec$5
	}, {
	  exec: exec$5
	});

	var fails$c = fails$w;
	var correctPrototypeGetter = !fails$c(function () {
	  function F() {/* empty */}
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var hasOwn$6 = hasOwnProperty_1;
	var isCallable$7 = isCallable$r;
	var toObject$6 = toObject$9;
	var sharedKey = sharedKey$3;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;
	var IE_PROTO = sharedKey('IE_PROTO');
	var $Object = Object;
	var ObjectPrototype = $Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
	  var object = toObject$6(O);
	  if (hasOwn$6(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable$7(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  }
	  return object instanceof $Object ? ObjectPrototype : null;
	};

	var DESCRIPTORS$a = descriptors;
	var definePropertyModule = objectDefineProperty;
	var createPropertyDescriptor$2 = createPropertyDescriptor$6;
	var createProperty$3 = function (object, key, value) {
	  if (DESCRIPTORS$a) definePropertyModule.f(object, key, createPropertyDescriptor$2(0, value));else object[key] = value;
	};

	var fails$b = fails$w;
	var isCallable$6 = isCallable$r;
	var isObject$4 = isObject$h;
	var getPrototypeOf$2 = objectGetPrototypeOf;
	var defineBuiltIn$8 = defineBuiltIn$d;
	var wellKnownSymbol$a = wellKnownSymbol$m;
	var ITERATOR$5 = wellKnownSymbol$a('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$4, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$2(getPrototypeOf$2(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$4 = PrototypeOfArrayIteratorPrototype;
	  }
	}
	var NEW_ITERATOR_PROTOTYPE = !isObject$4(IteratorPrototype$4) || fails$b(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$4[ITERATOR$5].call(test) !== test;
	});
	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$4 = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable$6(IteratorPrototype$4[ITERATOR$5])) {
	  defineBuiltIn$8(IteratorPrototype$4, ITERATOR$5, function () {
	    return this;
	  });
	}
	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$4,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var $$h = _export;
	var globalThis$8 = globalThis_1;
	var anInstance$2 = anInstance$4;
	var anObject$a = anObject$l;
	var isCallable$5 = isCallable$r;
	var getPrototypeOf$1 = objectGetPrototypeOf;
	var defineBuiltInAccessor$4 = defineBuiltInAccessor$6;
	var createProperty$2 = createProperty$3;
	var fails$a = fails$w;
	var hasOwn$5 = hasOwnProperty_1;
	var wellKnownSymbol$9 = wellKnownSymbol$m;
	var IteratorPrototype$3 = iteratorsCore.IteratorPrototype;
	var DESCRIPTORS$9 = descriptors;
	var CONSTRUCTOR = 'constructor';
	var ITERATOR$4 = 'Iterator';
	var TO_STRING_TAG$1 = wellKnownSymbol$9('toStringTag');
	var $TypeError$4 = TypeError;
	var NativeIterator = globalThis$8[ITERATOR$4];

	// FF56- have non-standard global helper `Iterator`
	var FORCED$4 = !isCallable$5(NativeIterator) || NativeIterator.prototype !== IteratorPrototype$3
	// FF44- non-standard `Iterator` passes previous tests
	|| !fails$a(function () {
	  NativeIterator({});
	});
	var IteratorConstructor = function Iterator() {
	  anInstance$2(this, IteratorPrototype$3);
	  if (getPrototypeOf$1(this) === IteratorPrototype$3) throw new $TypeError$4('Abstract class Iterator not directly constructable');
	};
	var defineIteratorPrototypeAccessor = function (key, value) {
	  if (DESCRIPTORS$9) {
	    defineBuiltInAccessor$4(IteratorPrototype$3, key, {
	      configurable: true,
	      get: function () {
	        return value;
	      },
	      set: function (replacement) {
	        anObject$a(this);
	        if (this === IteratorPrototype$3) throw new $TypeError$4("You can't redefine this property");
	        if (hasOwn$5(this, key)) this[key] = replacement;else createProperty$2(this, key, replacement);
	      }
	    });
	  } else IteratorPrototype$3[key] = value;
	};
	if (!hasOwn$5(IteratorPrototype$3, TO_STRING_TAG$1)) defineIteratorPrototypeAccessor(TO_STRING_TAG$1, ITERATOR$4);
	if (FORCED$4 || !hasOwn$5(IteratorPrototype$3, CONSTRUCTOR) || IteratorPrototype$3[CONSTRUCTOR] === Object) {
	  defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
	}
	IteratorConstructor.prototype = IteratorPrototype$3;

	// `Iterator` constructor
	// https://tc39.es/ecma262/#sec-iterator
	$$h({
	  global: true,
	  constructor: true,
	  forced: FORCED$4
	}, {
	  Iterator: IteratorConstructor
	});

	// `GetIteratorDirect(obj)` abstract operation
	// https://tc39.es/ecma262/#sec-getiteratordirect
	var getIteratorDirect$6 = function (obj) {
	  return {
	    iterator: obj,
	    next: obj.next,
	    done: false
	  };
	};

	var globalThis$7 = globalThis_1;

	// https://github.com/tc39/ecma262/pull/3467
	var iteratorHelperWithoutClosingOnEarlyError$6 = function (METHOD_NAME, ExpectedError) {
	  var Iterator = globalThis$7.Iterator;
	  var IteratorPrototype = Iterator && Iterator.prototype;
	  var method = IteratorPrototype && IteratorPrototype[METHOD_NAME];
	  var CLOSED = false;
	  if (method) try {
	    method.call({
	      next: function () {
	        return {
	          done: true
	        };
	      },
	      'return': function () {
	        CLOSED = true;
	      }
	    }, -1);
	  } catch (error) {
	    // https://bugs.webkit.org/show_bug.cgi?id=291195
	    if (!(error instanceof ExpectedError)) CLOSED = false;
	  }
	  if (!CLOSED) return method;
	};

	var $$g = _export;
	var call$g = functionCall;
	var iterate$4 = iterate$7;
	var aCallable$7 = aCallable$g;
	var anObject$9 = anObject$l;
	var getIteratorDirect$5 = getIteratorDirect$6;
	var iteratorClose$9 = iteratorClose$b;
	var iteratorHelperWithoutClosingOnEarlyError$5 = iteratorHelperWithoutClosingOnEarlyError$6;
	var findWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$5('find', TypeError);

	// `Iterator.prototype.find` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.find
	$$g({
	  target: 'Iterator',
	  proto: true,
	  real: true,
	  forced: findWithoutClosingOnEarlyError
	}, {
	  find: function find(predicate) {
	    anObject$9(this);
	    try {
	      aCallable$7(predicate);
	    } catch (error) {
	      iteratorClose$9(this, 'throw', error);
	    }
	    if (findWithoutClosingOnEarlyError) return call$g(findWithoutClosingOnEarlyError, this, predicate);
	    var record = getIteratorDirect$5(this);
	    var counter = 0;
	    return iterate$4(record, function (value, stop) {
	      if (predicate(value, counter++)) return stop(value);
	    }, {
	      IS_RECORD: true,
	      INTERRUPTED: true
	    }).result;
	  }
	});

	var $$f = _export;
	var call$f = functionCall;
	var iterate$3 = iterate$7;
	var aCallable$6 = aCallable$g;
	var anObject$8 = anObject$l;
	var getIteratorDirect$4 = getIteratorDirect$6;
	var iteratorClose$8 = iteratorClose$b;
	var iteratorHelperWithoutClosingOnEarlyError$4 = iteratorHelperWithoutClosingOnEarlyError$6;
	var forEachWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$4('forEach', TypeError);

	// `Iterator.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.foreach
	$$f({
	  target: 'Iterator',
	  proto: true,
	  real: true,
	  forced: forEachWithoutClosingOnEarlyError
	}, {
	  forEach: function forEach(fn) {
	    anObject$8(this);
	    try {
	      aCallable$6(fn);
	    } catch (error) {
	      iteratorClose$8(this, 'throw', error);
	    }
	    if (forEachWithoutClosingOnEarlyError) return call$f(forEachWithoutClosingOnEarlyError, this, fn);
	    var record = getIteratorDirect$4(this);
	    var counter = 0;
	    iterate$3(record, function (value) {
	      fn(value, counter++);
	    }, {
	      IS_RECORD: true
	    });
	  }
	});

	var $$e = _export;
	var call$e = functionCall;
	var iterate$2 = iterate$7;
	var aCallable$5 = aCallable$g;
	var anObject$7 = anObject$l;
	var getIteratorDirect$3 = getIteratorDirect$6;
	var iteratorClose$7 = iteratorClose$b;
	var iteratorHelperWithoutClosingOnEarlyError$3 = iteratorHelperWithoutClosingOnEarlyError$6;
	var someWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$3('some', TypeError);

	// `Iterator.prototype.some` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.some
	$$e({
	  target: 'Iterator',
	  proto: true,
	  real: true,
	  forced: someWithoutClosingOnEarlyError
	}, {
	  some: function some(predicate) {
	    anObject$7(this);
	    try {
	      aCallable$5(predicate);
	    } catch (error) {
	      iteratorClose$7(this, 'throw', error);
	    }
	    if (someWithoutClosingOnEarlyError) return call$e(someWithoutClosingOnEarlyError, this, predicate);
	    var record = getIteratorDirect$3(this);
	    var counter = 0;
	    return iterate$2(record, function (value, stop) {
	      if (predicate(value, counter++)) return stop();
	    }, {
	      IS_RECORD: true,
	      INTERRUPTED: true
	    }).stopped;
	  }
	});

	var $$d = _export;
	var DESCRIPTORS$8 = descriptors;
	var globalThis$6 = globalThis_1;
	var getBuiltIn$1 = getBuiltIn$c;
	var uncurryThis$d = functionUncurryThis;
	var call$d = functionCall;
	var isCallable$4 = isCallable$r;
	var isObject$3 = isObject$h;
	var isArray = isArray$3;
	var hasOwn$4 = hasOwnProperty_1;
	var toString$7 = toString$b;
	var lengthOfArrayLike$4 = lengthOfArrayLike$8;
	var createProperty$1 = createProperty$3;
	var fails$9 = fails$w;
	var parseJSONString = parseJsonString;
	var NATIVE_SYMBOL = symbolConstructorDetection;
	var JSON$1 = globalThis$6.JSON;
	var Number$1 = globalThis$6.Number;
	var SyntaxError$2 = globalThis$6.SyntaxError;
	var nativeParse = JSON$1 && JSON$1.parse;
	var enumerableOwnProperties = getBuiltIn$1('Object', 'keys');
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var at = uncurryThis$d(''.charAt);
	var slice = uncurryThis$d(''.slice);
	var exec$4 = uncurryThis$d(/./.exec);
	var push$5 = uncurryThis$d([].push);
	var IS_DIGIT = /^\d$/;
	var IS_NON_ZERO_DIGIT = /^[1-9]$/;
	var IS_NUMBER_START = /^[\d-]$/;
	var IS_WHITESPACE = /^[\t\n\r ]$/;
	var PRIMITIVE = 0;
	var OBJECT = 1;
	var $parse = function (source, reviver) {
	  source = toString$7(source);
	  var context = new Context(source, 0);
	  var root = context.parse();
	  var value = root.value;
	  var endIndex = context.skip(IS_WHITESPACE, root.end);
	  if (endIndex < source.length) {
	    throw new SyntaxError$2('Unexpected extra character: "' + at(source, endIndex) + '" after the parsed data at: ' + endIndex);
	  }
	  return isCallable$4(reviver) ? internalize({
	    '': value
	  }, '', reviver, root) : value;
	};
	var internalize = function (holder, name, reviver, node) {
	  var val = holder[name];
	  var unmodified = node && val === node.value;
	  var context = unmodified && typeof node.source == 'string' ? {
	    source: node.source
	  } : {};
	  var elementRecordsLen, keys, len, i, P;
	  if (isObject$3(val)) {
	    var nodeIsArray = isArray(val);
	    var nodes = unmodified ? node.nodes : nodeIsArray ? [] : {};
	    if (nodeIsArray) {
	      elementRecordsLen = nodes.length;
	      len = lengthOfArrayLike$4(val);
	      for (i = 0; i < len; i++) {
	        internalizeProperty(val, i, internalize(val, '' + i, reviver, i < elementRecordsLen ? nodes[i] : undefined));
	      }
	    } else {
	      keys = enumerableOwnProperties(val);
	      len = lengthOfArrayLike$4(keys);
	      for (i = 0; i < len; i++) {
	        P = keys[i];
	        internalizeProperty(val, P, internalize(val, P, reviver, hasOwn$4(nodes, P) ? nodes[P] : undefined));
	      }
	    }
	  }
	  return call$d(reviver, holder, name, val, context);
	};
	var internalizeProperty = function (object, key, value) {
	  if (DESCRIPTORS$8) {
	    var descriptor = getOwnPropertyDescriptor(object, key);
	    if (descriptor && !descriptor.configurable) return;
	  }
	  if (value === undefined) delete object[key];else createProperty$1(object, key, value);
	};
	var Node = function (value, end, source, nodes) {
	  this.value = value;
	  this.end = end;
	  this.source = source;
	  this.nodes = nodes;
	};
	var Context = function (source, index) {
	  this.source = source;
	  this.index = index;
	};

	// https://www.json.org/json-en.html
	Context.prototype = {
	  fork: function (nextIndex) {
	    return new Context(this.source, nextIndex);
	  },
	  parse: function () {
	    var source = this.source;
	    var i = this.skip(IS_WHITESPACE, this.index);
	    var fork = this.fork(i);
	    var chr = at(source, i);
	    if (exec$4(IS_NUMBER_START, chr)) return fork.number();
	    switch (chr) {
	      case '{':
	        return fork.object();
	      case '[':
	        return fork.array();
	      case '"':
	        return fork.string();
	      case 't':
	        return fork.keyword(true);
	      case 'f':
	        return fork.keyword(false);
	      case 'n':
	        return fork.keyword(null);
	    }
	    throw new SyntaxError$2('Unexpected character: "' + chr + '" at: ' + i);
	  },
	  node: function (type, value, start, end, nodes) {
	    return new Node(value, end, type ? null : slice(this.source, start, end), nodes);
	  },
	  object: function () {
	    var source = this.source;
	    var i = this.index + 1;
	    var expectKeypair = false;
	    var object = {};
	    var nodes = {};
	    var closed = false;
	    while (i < source.length) {
	      i = this.until(['"', '}'], i);
	      if (at(source, i) === '}' && !expectKeypair) {
	        i++;
	        closed = true;
	        break;
	      }
	      // Parsing the key
	      var result = this.fork(i).string();
	      var key = result.value;
	      i = result.end;
	      i = this.until([':'], i) + 1;
	      // Parsing value
	      i = this.skip(IS_WHITESPACE, i);
	      result = this.fork(i).parse();
	      createProperty$1(nodes, key, result);
	      createProperty$1(object, key, result.value);
	      i = this.until([',', '}'], result.end);
	      var chr = at(source, i);
	      if (chr === ',') {
	        expectKeypair = true;
	        i++;
	      } else if (chr === '}') {
	        i++;
	        closed = true;
	        break;
	      }
	    }
	    if (!closed) throw new SyntaxError$2('Unterminated object at: ' + i);
	    return this.node(OBJECT, object, this.index, i, nodes);
	  },
	  array: function () {
	    var source = this.source;
	    var i = this.index + 1;
	    var expectElement = false;
	    var array = [];
	    var nodes = [];
	    var closed = false;
	    while (i < source.length) {
	      i = this.skip(IS_WHITESPACE, i);
	      if (at(source, i) === ']' && !expectElement) {
	        i++;
	        closed = true;
	        break;
	      }
	      var result = this.fork(i).parse();
	      push$5(nodes, result);
	      push$5(array, result.value);
	      i = this.until([',', ']'], result.end);
	      if (at(source, i) === ',') {
	        expectElement = true;
	        i++;
	      } else if (at(source, i) === ']') {
	        i++;
	        closed = true;
	        break;
	      }
	    }
	    if (!closed) throw new SyntaxError$2('Unterminated array at: ' + i);
	    return this.node(OBJECT, array, this.index, i, nodes);
	  },
	  string: function () {
	    var index = this.index;
	    var parsed = parseJSONString(this.source, this.index + 1);
	    return this.node(PRIMITIVE, parsed.value, index, parsed.end);
	  },
	  number: function () {
	    var source = this.source;
	    var startIndex = this.index;
	    var i = startIndex;
	    if (at(source, i) === '-') i++;
	    if (at(source, i) === '0') i++;else if (exec$4(IS_NON_ZERO_DIGIT, at(source, i))) i = this.skip(IS_DIGIT, i + 1);else throw new SyntaxError$2('Failed to parse number at: ' + i);
	    if (at(source, i) === '.') {
	      var fractionStartIndex = i + 1;
	      i = this.skip(IS_DIGIT, fractionStartIndex);
	      if (fractionStartIndex === i) throw new SyntaxError$2("Failed to parse number's fraction at: " + i);
	    }
	    if (at(source, i) === 'e' || at(source, i) === 'E') {
	      i++;
	      if (at(source, i) === '+' || at(source, i) === '-') i++;
	      var exponentStartIndex = i;
	      i = this.skip(IS_DIGIT, i);
	      if (exponentStartIndex === i) throw new SyntaxError$2("Failed to parse number's exponent value at: " + i);
	    }
	    return this.node(PRIMITIVE, Number$1(slice(source, startIndex, i)), startIndex, i);
	  },
	  keyword: function (value) {
	    var keyword = '' + value;
	    var index = this.index;
	    var endIndex = index + keyword.length;
	    if (slice(this.source, index, endIndex) !== keyword) throw new SyntaxError$2('Failed to parse value at: ' + index);
	    return this.node(PRIMITIVE, value, index, endIndex);
	  },
	  skip: function (regex, i) {
	    var source = this.source;
	    for (; i < source.length; i++) if (!exec$4(regex, at(source, i))) break;
	    return i;
	  },
	  until: function (array, i) {
	    i = this.skip(IS_WHITESPACE, i);
	    var chr = at(this.source, i);
	    for (var j = 0; j < array.length; j++) if (array[j] === chr) return i;
	    throw new SyntaxError$2('Unexpected character: "' + chr + '" at: ' + i);
	  }
	};
	var NO_SOURCE_SUPPORT = fails$9(function () {
	  var unsafeInt = '9007199254740993';
	  var source;
	  nativeParse(unsafeInt, function (key, value, context) {
	    source = context.source;
	  });
	  return source !== unsafeInt;
	});
	var PROPER_BASE_PARSE = NATIVE_SYMBOL && !fails$9(function () {
	  // Safari 9 bug
	  return 1 / nativeParse('-0 \t') !== -Infinity;
	});

	// `JSON.parse` method
	// https://tc39.es/ecma262/#sec-json.parse
	// https://github.com/tc39/proposal-json-parse-with-source
	$$d({
	  target: 'JSON',
	  stat: true,
	  forced: NO_SOURCE_SUPPORT
	}, {
	  parse: function parse(text, reviver) {
	    return PROPER_BASE_PARSE && !isCallable$4(reviver) ? nativeParse(text) : $parse(text, reviver);
	  }
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
	var documentCreateElement = documentCreateElement$2;
	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;
	var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? undefined : DOMTokenListPrototype$1;

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var create$3 = objectCreate;
	var createPropertyDescriptor$1 = createPropertyDescriptor$6;
	var setToStringTag$4 = setToStringTag$6;
	var Iterators$2 = iterators;
	var returnThis$1 = function () {
	  return this;
	};
	var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = create$3(IteratorPrototype$2, {
	    next: createPropertyDescriptor$1(+!ENUMERABLE_NEXT, next)
	  });
	  setToStringTag$4(IteratorConstructor, TO_STRING_TAG, false);
	  Iterators$2[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var $$c = _export;
	var call$c = functionCall;
	var FunctionName = functionName;
	var isCallable$3 = isCallable$r;
	var createIteratorConstructor$1 = iteratorCreateConstructor;
	var getPrototypeOf = objectGetPrototypeOf;
	var setPrototypeOf = objectSetPrototypeOf;
	var setToStringTag$3 = setToStringTag$6;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$a;
	var defineBuiltIn$7 = defineBuiltIn$d;
	var wellKnownSymbol$8 = wellKnownSymbol$m;
	var Iterators$1 = iterators;
	var IteratorsCore = iteratorsCore;
	var PROPER_FUNCTION_NAME = FunctionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
	var IteratorPrototype$1 = IteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$3 = wellKnownSymbol$8('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';
	var returnThis = function () {
	  return this;
	};
	var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor$1(IteratorConstructor, NAME, next);
	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS:
	        return function keys() {
	          return new IteratorConstructor(this, KIND);
	        };
	      case VALUES:
	        return function values() {
	          return new IteratorConstructor(this, KIND);
	        };
	      case ENTRIES:
	        return function entries() {
	          return new IteratorConstructor(this, KIND);
	        };
	    }
	    return function () {
	      return new IteratorConstructor(this);
	    };
	  };
	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$3] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$1) {
	        if (setPrototypeOf) {
	          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$1);
	        } else if (!isCallable$3(CurrentIteratorPrototype[ITERATOR$3])) {
	          defineBuiltIn$7(CurrentIteratorPrototype, ITERATOR$3, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag$3(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME) {
	      createNonEnumerableProperty$4(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() {
	        return call$c(nativeIterator, this);
	      };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        defineBuiltIn$7(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else $$c({
	      target: NAME,
	      proto: true,
	      forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
	    }, methods);
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$3] !== defaultIterator) {
	    defineBuiltIn$7(IterablePrototype, ITERATOR$3, defaultIterator, {
	      name: DEFAULT
	    });
	  }
	  Iterators$1[NAME] = defaultIterator;
	  return methods;
	};

	// `CreateIterResultObject` abstract operation
	// https://tc39.es/ecma262/#sec-createiterresultobject
	var createIterResultObject$4 = function (value, done) {
	  return {
	    value: value,
	    done: done
	  };
	};

	var toIndexedObject = toIndexedObject$5;
	var addToUnscopables$2 = addToUnscopables$4;
	var Iterators = iterators;
	var InternalStateModule$4 = internalState;
	var defineProperty$1 = objectDefineProperty.f;
	var defineIterator$1 = iteratorDefine;
	var createIterResultObject$3 = createIterResultObject$4;
	var DESCRIPTORS$7 = descriptors;
	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$4 = InternalStateModule$4.set;
	var getInternalState$2 = InternalStateModule$4.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator$1(Array, 'Array', function (iterated, kind) {
	  setInternalState$4(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated),
	    // target
	    index: 0,
	    // next index
	    kind: kind // kind
	  });
	  // `%ArrayIteratorPrototype%.next` method
	  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$2(this);
	  var target = state.target;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = null;
	    return createIterResultObject$3(undefined, true);
	  }
	  switch (state.kind) {
	    case 'keys':
	      return createIterResultObject$3(index, false);
	    case 'values':
	      return createIterResultObject$3(target[index], false);
	  }
	  return createIterResultObject$3([index, target[index]], false);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	var values = Iterators.Arguments = Iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$2('keys');
	addToUnscopables$2('values');
	addToUnscopables$2('entries');

	// V8 ~ Chrome 45- bug
	if (DESCRIPTORS$7 && values.name !== 'values') try {
	  defineProperty$1(values, 'name', {
	    value: 'values'
	  });
	} catch (error) {/* empty */}

	var globalThis$5 = globalThis_1;
	var DOMIterables = domIterables;
	var DOMTokenListPrototype = domTokenListPrototype;
	var ArrayIteratorMethods = es_array_iterator;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$a;
	var setToStringTag$2 = setToStringTag$6;
	var wellKnownSymbol$7 = wellKnownSymbol$m;
	var ITERATOR$2 = wellKnownSymbol$7('iterator');
	var ArrayValues = ArrayIteratorMethods.values;
	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
	      createNonEnumerableProperty$3(CollectionPrototype, ITERATOR$2, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$2] = ArrayValues;
	    }
	    setToStringTag$2(CollectionPrototype, COLLECTION_NAME, true);
	    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
	        createNonEnumerableProperty$3(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
	      }
	    }
	  }
	};
	for (var COLLECTION_NAME in DOMIterables) {
	  handlePrototype(globalThis$5[COLLECTION_NAME] && globalThis$5[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}
	handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

	var uncurryThis$c = functionUncurryThis;
	var toIntegerOrInfinity$3 = toIntegerOrInfinity$6;
	var toString$6 = toString$b;
	var requireObjectCoercible$2 = requireObjectCoercible$6;
	var charAt$7 = uncurryThis$c(''.charAt);
	var charCodeAt$1 = uncurryThis$c(''.charCodeAt);
	var stringSlice$5 = uncurryThis$c(''.slice);
	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$6(requireObjectCoercible$2($this));
	    var position = toIntegerOrInfinity$3(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt$1(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt$1(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt$7(S, position) : first : CONVERT_TO_STRING ? stringSlice$5(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};
	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var charAt$6 = stringMultibyte.charAt;
	var toString$5 = toString$b;
	var InternalStateModule$3 = internalState;
	var defineIterator = iteratorDefine;
	var createIterResultObject$2 = createIterResultObject$4;
	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$3 = InternalStateModule$3.set;
	var getInternalState$1 = InternalStateModule$3.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$3(this, {
	    type: STRING_ITERATOR,
	    string: toString$5(iterated),
	    index: 0
	  });
	  // `%StringIteratorPrototype%.next` method
	  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$1(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return createIterResultObject$2(undefined, true);
	  point = charAt$6(string, index);
	  state.index += point.length;
	  return createIterResultObject$2(point, false);
	});

	var fails$8 = fails$w;
	var wellKnownSymbol$6 = wellKnownSymbol$m;
	var DESCRIPTORS$6 = descriptors;
	var IS_PURE = isPure;
	var ITERATOR$1 = wellKnownSymbol$6('iterator');
	var urlConstructorDetection = !fails$8(function () {
	  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
	  var url = new URL('b?a=1&b=2&c=3', 'https://a');
	  var params = url.searchParams;
	  var params2 = new URLSearchParams('a=1&a=2&b=3');
	  var result = '';
	  url.pathname = 'c%20d';
	  params.forEach(function (value, key) {
	    params['delete']('b');
	    result += key + value;
	  });
	  params2['delete']('a', 2);
	  // `undefined` case is a Chromium 117 bug
	  // https://bugs.chromium.org/p/v8/issues/detail?id=14222
	  params2['delete']('b', undefined);
	  return IS_PURE && (!url.toJSON || !params2.has('a', 1) || params2.has('a', 2) || !params2.has('a', undefined) || params2.has('b')) || !params.size && (IS_PURE || !DESCRIPTORS$6) || !params.sort || url.href !== 'https://a/c%20d?a=1&c=3' || params.get('c') !== '3' || String(new URLSearchParams('?a=1')) !== 'a=1' || !params[ITERATOR$1]
	  // throws in Edge
	  || new URL('https://a@b').username !== 'a' || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	  // not punycoded in Edge
	  || new URL('https://тест').host !== 'xn--e1aybc'
	  // not escaped in Chrome 62-
	  || new URL('https://a#б').hash !== '#%D0%B1'
	  // fails in Chrome 66-
	  || result !== 'a1c3'
	  // throws in Safari
	  || new URL('https://x', undefined).host !== 'x';
	});

	var DESCRIPTORS$5 = descriptors;
	var uncurryThis$b = functionUncurryThis;
	var call$b = functionCall;
	var fails$7 = fails$w;
	var objectKeys = objectKeys$2;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var toObject$5 = toObject$9;
	var IndexedObject$2 = indexedObject;

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty = Object.defineProperty;
	var concat$1 = uncurryThis$b([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails$7(function () {
	  // should have correct order of operations (Edge bug)
	  if (DESCRIPTORS$5 && $assign({
	    b: 1
	  }, $assign(defineProperty({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), {
	    b: 2
	  })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es/no-symbol -- safe
	  var symbol = Symbol('assign detection');
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
	  alphabet.split('').forEach(function (chr) {
	    B[chr] = chr;
	  });
	  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject$5(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  var propertyIsEnumerable = propertyIsEnumerableModule.f;
	  while (argumentsLength > index) {
	    var S = IndexedObject$2(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat$1(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS$5 || call$b(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  }
	  return T;
	} : $assign;

	var anObject$6 = anObject$l;
	var iteratorClose$6 = iteratorClose$b;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing$3 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$6(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose$6(iterator, 'throw', error);
	  }
	};

	var bind$3 = functionBindContext;
	var call$a = functionCall;
	var toObject$4 = toObject$9;
	var callWithSafeIterationClosing$2 = callWithSafeIterationClosing$3;
	var isArrayIteratorMethod = isArrayIteratorMethod$2;
	var isConstructor = isConstructor$2;
	var lengthOfArrayLike$3 = lengthOfArrayLike$8;
	var createProperty = createProperty$3;
	var setArrayLength = arraySetLength;
	var getIterator$1 = getIterator$3;
	var getIteratorMethod$1 = getIteratorMethod$4;
	var iteratorClose$5 = iteratorClose$b;
	var $Array = Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom$1 = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = bind$3(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
	  var O = toObject$4(arrayLike);
	  var iteratorMethod = getIteratorMethod$1(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
	    result = IS_CONSTRUCTOR ? new this() : [];
	    iterator = getIterator$1(O, iteratorMethod);
	    next = iterator.next;
	    for (; !(step = call$a(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing$2(iterator, mapfn, [step.value, index], true) : step.value;
	      try {
	        createProperty(result, index, value);
	      } catch (error) {
	        iteratorClose$5(iterator, 'throw', error);
	      }
	    }
	  } else {
	    length = lengthOfArrayLike$3(O);
	    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
	    for (; length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  setArrayLength(result, index);
	  return result;
	};

	// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
	var uncurryThis$a = functionUncurryThis;
	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'
	var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
	var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
	var baseMinusTMin = base - tMin;
	var $RangeError$1 = RangeError;
	var exec$3 = uncurryThis$a(regexSeparators.exec);
	var floor$3 = Math.floor;
	var fromCharCode$2 = String.fromCharCode;
	var charCodeAt = uncurryThis$a(''.charCodeAt);
	var join$3 = uncurryThis$a([].join);
	var push$4 = uncurryThis$a([].push);
	var replace$4 = uncurryThis$a(''.replace);
	var split$2 = uncurryThis$a(''.split);
	var toLowerCase$1 = uncurryThis$a(''.toLowerCase);

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 */
	var ucs2decode = function (string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = charCodeAt(string, counter++);
	    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = charCodeAt(string, counter++);
	      if ((extra & 0xFC00) === 0xDC00) {
	        // Low surrogate.
	        push$4(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        push$4(output, value);
	        counter--;
	      }
	    } else {
	      push$4(output, value);
	    }
	  }
	  return output;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 */
	var digitToBasic = function (digit) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor$3(delta / damp) : delta >> 1;
	  delta += floor$3(delta / numPoints);
	  while (delta > baseMinusTMin * tMax >> 1) {
	    delta = floor$3(delta / baseMinusTMin);
	    k += base;
	  }
	  return floor$3(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	var encode = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;
	  var i, currentValue;

	  // Handle the basic code points.
	  for (i = 0; i < input.length; i++) {
	    currentValue = input[i];
	    if (currentValue < 0x80) {
	      push$4(output, fromCharCode$2(currentValue));
	    }
	  }
	  var basicLength = output.length; // number of basic code points.
	  var handledCPCount = basicLength; // number of code points that have been handled;

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    push$4(output, delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next larger one:
	    var m = maxInt;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor$3((maxInt - delta) / handledCPCountPlusOne)) {
	      throw new $RangeError$1(OVERFLOW_ERROR);
	    }
	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue < n && ++delta > maxInt) {
	        throw new $RangeError$1(OVERFLOW_ERROR);
	      }
	      if (currentValue === n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        var k = base;
	        while (true) {
	          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
	          if (q < t) break;
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          push$4(output, fromCharCode$2(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor$3(qMinusT / baseMinusT);
	          k += base;
	        }
	        push$4(output, fromCharCode$2(digitToBasic(q)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
	        delta = 0;
	        handledCPCount++;
	      }
	    }
	    delta++;
	    n++;
	  }
	  return join$3(output, '');
	};
	var stringPunycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = split$2(replace$4(toLowerCase$1(input), regexSeparators, '\u002E'), '.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    push$4(encoded, exec$3(regexNonASCII, label) ? 'xn--' + encode(label) : label);
	  }
	  return join$3(encoded, '.');
	};

	var $$b = _export;
	var uncurryThis$9 = functionUncurryThis;
	var toAbsoluteIndex = toAbsoluteIndex$2;
	var $RangeError = RangeError;
	var fromCharCode$1 = String.fromCharCode;
	// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
	var $fromCodePoint = String.fromCodePoint;
	var join$2 = uncurryThis$9([].join);

	// length should be 1, old FF problem
	var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length !== 1;

	// `String.fromCodePoint` method
	// https://tc39.es/ecma262/#sec-string.fromcodepoint
	$$b({
	  target: 'String',
	  stat: true,
	  arity: 1,
	  forced: INCORRECT_LENGTH
	}, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  fromCodePoint: function fromCodePoint(x) {
	    var elements = [];
	    var length = arguments.length;
	    var i = 0;
	    var code;
	    while (length > i) {
	      code = +arguments[i];
	      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw new $RangeError(code + ' is not a valid code point');
	      elements[i++] = code < 0x10000 ? fromCharCode$1(code) : fromCharCode$1(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
	    }
	    return join$2(elements, '');
	  }
	});

	var defineBuiltIn$6 = defineBuiltIn$d;
	var defineBuiltIns$2 = function (target, src, options) {
	  for (var key in src) defineBuiltIn$6(target, key, src[key], options);
	  return target;
	};

	var arraySlice$1 = arraySlice$4;
	var floor$2 = Math.floor;
	var sort = function (array, comparefn) {
	  var length = array.length;
	  if (length < 8) {
	    // insertion sort
	    var i = 1;
	    var element, j;
	    while (i < length) {
	      j = i;
	      element = array[i];
	      while (j && comparefn(array[j - 1], element) > 0) {
	        array[j] = array[--j];
	      }
	      if (j !== i++) array[j] = element;
	    }
	  } else {
	    // merge sort
	    var middle = floor$2(length / 2);
	    var left = sort(arraySlice$1(array, 0, middle), comparefn);
	    var right = sort(arraySlice$1(array, middle), comparefn);
	    var llength = left.length;
	    var rlength = right.length;
	    var lindex = 0;
	    var rindex = 0;
	    while (lindex < llength || rindex < rlength) {
	      array[lindex + rindex] = lindex < llength && rindex < rlength ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++] : lindex < llength ? left[lindex++] : right[rindex++];
	    }
	  }
	  return array;
	};
	var arraySort$1 = sort;

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

	var $$a = _export;
	var globalThis$4 = globalThis_1;
	var safeGetBuiltIn = safeGetBuiltIn$2;
	var getBuiltIn = getBuiltIn$c;
	var call$9 = functionCall;
	var uncurryThis$8 = functionUncurryThis;
	var DESCRIPTORS$4 = descriptors;
	var USE_NATIVE_URL$1 = urlConstructorDetection;
	var defineBuiltIn$5 = defineBuiltIn$d;
	var defineBuiltInAccessor$3 = defineBuiltInAccessor$6;
	var defineBuiltIns$1 = defineBuiltIns$2;
	var setToStringTag$1 = setToStringTag$6;
	var createIteratorConstructor = iteratorCreateConstructor;
	var InternalStateModule$2 = internalState;
	var anInstance$1 = anInstance$4;
	var isCallable$2 = isCallable$r;
	var hasOwn$3 = hasOwnProperty_1;
	var bind$2 = functionBindContext;
	var classof$3 = classof$a;
	var anObject$5 = anObject$l;
	var isObject$2 = isObject$h;
	var $toString$1 = toString$b;
	var create$2 = objectCreate;
	var createPropertyDescriptor = createPropertyDescriptor$6;
	var getIterator = getIterator$3;
	var getIteratorMethod = getIteratorMethod$4;
	var createIterResultObject$1 = createIterResultObject$4;
	var validateArgumentsLength$3 = validateArgumentsLength$5;
	var wellKnownSymbol$5 = wellKnownSymbol$m;
	var arraySort = arraySort$1;
	var ITERATOR = wellKnownSymbol$5('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$2 = InternalStateModule$2.set;
	var getInternalParamsState = InternalStateModule$2.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = InternalStateModule$2.getterFor(URL_SEARCH_PARAMS_ITERATOR);
	var nativeFetch = safeGetBuiltIn('fetch');
	var NativeRequest = safeGetBuiltIn('Request');
	var Headers$1 = safeGetBuiltIn('Headers');
	var RequestPrototype = NativeRequest && NativeRequest.prototype;
	var HeadersPrototype = Headers$1 && Headers$1.prototype;
	var TypeError$2 = globalThis$4.TypeError;
	var encodeURIComponent$2 = globalThis$4.encodeURIComponent;
	var fromCharCode = String.fromCharCode;
	var fromCodePoint = getBuiltIn('String', 'fromCodePoint');
	var $parseInt = parseInt;
	var charAt$5 = uncurryThis$8(''.charAt);
	var join$1 = uncurryThis$8([].join);
	var push$3 = uncurryThis$8([].push);
	var replace$3 = uncurryThis$8(''.replace);
	var shift$1 = uncurryThis$8([].shift);
	var splice = uncurryThis$8([].splice);
	var split$1 = uncurryThis$8(''.split);
	var stringSlice$4 = uncurryThis$8(''.slice);
	var exec$2 = uncurryThis$8(/./.exec);
	var plus = /\+/g;
	var FALLBACK_REPLACER = '\uFFFD';
	var VALID_HEX = /^[0-9a-f]+$/i;
	var parseHexOctet = function (string, start) {
	  var substr = stringSlice$4(string, start, start + 2);
	  if (!exec$2(VALID_HEX, substr)) return NaN;
	  return $parseInt(substr, 16);
	};
	var getLeadingOnes = function (octet) {
	  var count = 0;
	  for (var mask = 0x80; mask > 0 && (octet & mask) !== 0; mask >>= 1) {
	    count++;
	  }
	  return count;
	};
	var utf8Decode = function (octets) {
	  var codePoint = null;
	  var length = octets.length;
	  switch (length) {
	    case 1:
	      codePoint = octets[0];
	      break;
	    case 2:
	      codePoint = (octets[0] & 0x1F) << 6 | octets[1] & 0x3F;
	      break;
	    case 3:
	      codePoint = (octets[0] & 0x0F) << 12 | (octets[1] & 0x3F) << 6 | octets[2] & 0x3F;
	      break;
	    case 4:
	      codePoint = (octets[0] & 0x07) << 18 | (octets[1] & 0x3F) << 12 | (octets[2] & 0x3F) << 6 | octets[3] & 0x3F;
	      break;
	  }

	  // reject surrogates, overlong encodings, and out-of-range codepoints
	  if (codePoint === null || codePoint > 0x10FFFF || codePoint >= 0xD800 && codePoint <= 0xDFFF || codePoint < (length > 3 ? 0x10000 : length > 2 ? 0x800 : length > 1 ? 0x80 : 0)) return null;
	  return codePoint;
	};

	/* eslint-disable max-statements, max-depth -- ok */
	var decode = function (input) {
	  input = replace$3(input, plus, ' ');
	  var length = input.length;
	  var result = '';
	  var i = 0;
	  while (i < length) {
	    var decodedChar = charAt$5(input, i);
	    if (decodedChar === '%') {
	      if (charAt$5(input, i + 1) === '%' || i + 3 > length) {
	        result += '%';
	        i++;
	        continue;
	      }
	      var octet = parseHexOctet(input, i + 1);

	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (octet !== octet) {
	        result += decodedChar;
	        i++;
	        continue;
	      }
	      i += 2;
	      var byteSequenceLength = getLeadingOnes(octet);
	      if (byteSequenceLength === 0) {
	        decodedChar = fromCharCode(octet);
	      } else {
	        if (byteSequenceLength === 1 || byteSequenceLength > 4) {
	          result += FALLBACK_REPLACER;
	          i++;
	          continue;
	        }
	        var octets = [octet];
	        var sequenceIndex = 1;
	        while (sequenceIndex < byteSequenceLength) {
	          i++;
	          if (i + 3 > length || charAt$5(input, i) !== '%') break;
	          var nextByte = parseHexOctet(input, i + 1);

	          // eslint-disable-next-line no-self-compare -- NaN check
	          if (nextByte !== nextByte || nextByte > 191 || nextByte < 128) break;

	          // https://encoding.spec.whatwg.org/#utf-8-decoder - position-specific byte ranges
	          if (sequenceIndex === 1) {
	            if (octet === 0xE0 && nextByte < 0xA0) break;
	            if (octet === 0xED && nextByte > 0x9F) break;
	            if (octet === 0xF0 && nextByte < 0x90) break;
	            if (octet === 0xF4 && nextByte > 0x8F) break;
	          }
	          push$3(octets, nextByte);
	          i += 2;
	          sequenceIndex++;
	        }
	        if (octets.length !== byteSequenceLength) {
	          result += FALLBACK_REPLACER;
	          continue;
	        }
	        var codePoint = utf8Decode(octets);
	        if (codePoint === null) {
	          for (var replacement = 0; replacement < byteSequenceLength; replacement++) result += FALLBACK_REPLACER;
	          i++;
	          continue;
	        } else {
	          decodedChar = fromCodePoint(codePoint);
	        }
	      }
	    }
	    result += decodedChar;
	    i++;
	  }
	  return result;
	};
	/* eslint-enable max-statements, max-depth -- ok */

	var find = /[!'()~]|%20/g;
	var replacements = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};
	var replacer = function (match) {
	  return replacements[match];
	};
	var serialize = function (it) {
	  return replace$3(encodeURIComponent$2(it), find, replacer);
	};
	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState$2(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    target: getInternalParamsState(params).entries,
	    index: 0,
	    kind: kind
	  });
	}, URL_SEARCH_PARAMS, function next() {
	  var state = getInternalIteratorState(this);
	  var target = state.target;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = null;
	    return createIterResultObject$1(undefined, true);
	  }
	  var entry = target[index];
	  switch (state.kind) {
	    case 'keys':
	      return createIterResultObject$1(entry.key, false);
	    case 'values':
	      return createIterResultObject$1(entry.value, false);
	  }
	  return createIterResultObject$1([entry.key, entry.value], false);
	}, true);
	var URLSearchParamsState = function (init) {
	  this.entries = [];
	  this.url = null;
	  if (init !== undefined) {
	    if (isObject$2(init)) this.parseObject(init);else this.parseQuery(typeof init == 'string' ? charAt$5(init, 0) === '?' ? stringSlice$4(init, 1) : init : $toString$1(init));
	  }
	};
	URLSearchParamsState.prototype = {
	  type: URL_SEARCH_PARAMS,
	  bindURL: function (url) {
	    this.url = url;
	    this.update();
	  },
	  parseObject: function (object) {
	    var entries = this.entries;
	    var iteratorMethod = getIteratorMethod(object);
	    var iterator, next, step, entryIterator, entryNext, first, second;
	    if (iteratorMethod) {
	      iterator = getIterator(object, iteratorMethod);
	      next = iterator.next;
	      while (!(step = call$9(next, iterator)).done) {
	        entryIterator = getIterator(anObject$5(step.value));
	        entryNext = entryIterator.next;
	        if ((first = call$9(entryNext, entryIterator)).done || (second = call$9(entryNext, entryIterator)).done || !call$9(entryNext, entryIterator).done) throw new TypeError$2('Expected sequence with length 2');
	        push$3(entries, {
	          key: $toString$1(first.value),
	          value: $toString$1(second.value)
	        });
	      }
	    } else for (var key in object) if (hasOwn$3(object, key)) {
	      push$3(entries, {
	        key: key,
	        value: $toString$1(object[key])
	      });
	    }
	  },
	  parseQuery: function (query) {
	    if (query) {
	      var entries = this.entries;
	      var attributes = split$1(query, '&');
	      var index = 0;
	      var attribute, entry;
	      while (index < attributes.length) {
	        attribute = attributes[index++];
	        if (attribute.length) {
	          entry = split$1(attribute, '=');
	          push$3(entries, {
	            key: decode(shift$1(entry)),
	            value: decode(join$1(entry, '='))
	          });
	        }
	      }
	    }
	  },
	  serialize: function () {
	    var entries = this.entries;
	    var result = [];
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      push$3(result, serialize(entry.key) + '=' + serialize(entry.value));
	    }
	    return join$1(result, '&');
	  },
	  update: function () {
	    this.entries.length = 0;
	    this.parseQuery(this.url.query);
	  },
	  updateURL: function () {
	    if (this.url) this.url.update();
	  }
	};

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */
	) {
	  anInstance$1(this, URLSearchParamsPrototype$3);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  var state = setInternalState$2(this, new URLSearchParamsState(init));
	  if (!DESCRIPTORS$4) this.size = state.entries.length;
	};
	var URLSearchParamsPrototype$3 = URLSearchParamsConstructor.prototype;
	defineBuiltIns$1(URLSearchParamsPrototype$3, {
	  // `URLSearchParams.prototype.append` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    var state = getInternalParamsState(this);
	    validateArgumentsLength$3(arguments.length, 2);
	    push$3(state.entries, {
	      key: $toString$1(name),
	      value: $toString$1(value)
	    });
	    if (!DESCRIPTORS$4) this.size++;
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name /* , value */) {
	    var state = getInternalParamsState(this);
	    var length = validateArgumentsLength$3(arguments.length, 1);
	    var entries = state.entries;
	    var key = $toString$1(name);
	    var $value = length < 2 ? undefined : arguments[1];
	    var value = $value === undefined ? $value : $toString$1($value);
	    var index = 0;
	    while (index < entries.length) {
	      var entry = entries[index];
	      if (entry.key === key && (value === undefined || entry.value === value)) {
	        splice(entries, index, 1);
	      } else index++;
	    }
	    if (!DESCRIPTORS$4) this.size = entries.length;
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    var entries = getInternalParamsState(this).entries;
	    validateArgumentsLength$3(arguments.length, 1);
	    var key = $toString$1(name);
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) return entries[index].value;
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    var entries = getInternalParamsState(this).entries;
	    validateArgumentsLength$3(arguments.length, 1);
	    var key = $toString$1(name);
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) push$3(result, entries[index].value);
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name /* , value */) {
	    var entries = getInternalParamsState(this).entries;
	    var length = validateArgumentsLength$3(arguments.length, 1);
	    var key = $toString$1(name);
	    var $value = length < 2 ? undefined : arguments[1];
	    var value = $value === undefined ? $value : $toString$1($value);
	    var index = 0;
	    while (index < entries.length) {
	      var entry = entries[index++];
	      if (entry.key === key && (value === undefined || entry.value === value)) return true;
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    var state = getInternalParamsState(this);
	    validateArgumentsLength$3(arguments.length, 2);
	    var entries = state.entries;
	    var found = false;
	    var key = $toString$1(name);
	    var val = $toString$1(value);
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) splice(entries, index--, 1);else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) push$3(entries, {
	      key: key,
	      value: val
	    });
	    if (!DESCRIPTORS$4) this.size = entries.length;
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    arraySort(state.entries, function (a, b) {
	      return a.key > b.key ? 1 : -1;
	    });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = bind$2(callback, arguments.length > 1 ? arguments[1] : undefined);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, {
	  enumerable: true
	});

	// `URLSearchParams.prototype[@@iterator]` method
	defineBuiltIn$5(URLSearchParamsPrototype$3, ITERATOR, URLSearchParamsPrototype$3.entries, {
	  name: 'entries'
	});

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	defineBuiltIn$5(URLSearchParamsPrototype$3, 'toString', function toString() {
	  return getInternalParamsState(this).serialize();
	}, {
	  enumerable: true
	});

	// `URLSearchParams.prototype.size` getter
	// https://url.spec.whatwg.org/#dom-urlsearchparams-size
	if (DESCRIPTORS$4) defineBuiltInAccessor$3(URLSearchParamsPrototype$3, 'size', {
	  get: function size() {
	    return getInternalParamsState(this).entries.length;
	  },
	  configurable: true,
	  enumerable: true
	});
	setToStringTag$1(URLSearchParamsConstructor, URL_SEARCH_PARAMS);
	$$a({
	  global: true,
	  constructor: true,
	  forced: !USE_NATIVE_URL$1
	}, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
	if (!USE_NATIVE_URL$1 && isCallable$2(Headers$1)) {
	  var headersHas = uncurryThis$8(HeadersPrototype.has);
	  var headersSet = uncurryThis$8(HeadersPrototype.set);
	  var wrapRequestOptions = function (init) {
	    if (isObject$2(init)) {
	      var body = init.body;
	      var headers;
	      if (classof$3(body) === URL_SEARCH_PARAMS) {
	        headers = init.headers ? new Headers$1(init.headers) : new Headers$1();
	        if (!headersHas(headers, 'content-type')) {
	          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	        return create$2(init, {
	          body: createPropertyDescriptor(0, $toString$1(body)),
	          headers: createPropertyDescriptor(0, headers)
	        });
	      }
	    }
	    return init;
	  };
	  if (isCallable$2(nativeFetch)) {
	    $$a({
	      global: true,
	      enumerable: true,
	      dontCallGetSet: true,
	      forced: true
	    }, {
	      fetch: function fetch(input /* , init */) {
	        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	      }
	    });
	  }
	  if (isCallable$2(NativeRequest)) {
	    var RequestConstructor = function Request(input /* , init */) {
	      anInstance$1(this, RequestPrototype);
	      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	    };
	    RequestPrototype.constructor = RequestConstructor;
	    RequestConstructor.prototype = RequestPrototype;
	    $$a({
	      global: true,
	      constructor: true,
	      dontCallGetSet: true,
	      forced: true
	    }, {
	      Request: RequestConstructor
	    });
	  }
	}
	var web_urlSearchParams_constructor = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

	var $$9 = _export;
	var DESCRIPTORS$3 = descriptors;
	var USE_NATIVE_URL = urlConstructorDetection;
	var globalThis$3 = globalThis_1;
	var bind$1 = functionBindContext;
	var uncurryThis$7 = functionUncurryThis;
	var defineBuiltIn$4 = defineBuiltIn$d;
	var defineBuiltInAccessor$2 = defineBuiltInAccessor$6;
	var anInstance = anInstance$4;
	var hasOwn$2 = hasOwnProperty_1;
	var assign = objectAssign;
	var arrayFrom = arrayFrom$1;
	var arraySlice = arraySlice$4;
	var codeAt = stringMultibyte.codeAt;
	var toASCII = stringPunycodeToAscii;
	var $toString = toString$b;
	var setToStringTag = setToStringTag$6;
	var validateArgumentsLength$2 = validateArgumentsLength$5;
	var URLSearchParamsModule = web_urlSearchParams_constructor;
	var InternalStateModule$1 = internalState;
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalURLState = InternalStateModule$1.getterFor('URL');
	var URLSearchParams$1 = URLSearchParamsModule.URLSearchParams;
	var getInternalSearchParamsState = URLSearchParamsModule.getState;
	var NativeURL = globalThis$3.URL;
	var TypeError$1 = globalThis$3.TypeError;
	var encodeURIComponent$1 = globalThis$3.encodeURIComponent;
	var parseInt$1 = globalThis$3.parseInt;
	var floor$1 = Math.floor;
	var pow = Math.pow;
	var charAt$4 = uncurryThis$7(''.charAt);
	var exec$1 = uncurryThis$7(/./.exec);
	var join = uncurryThis$7([].join);
	var numberToString = uncurryThis$7(1.1.toString);
	var pop = uncurryThis$7([].pop);
	var push$2 = uncurryThis$7([].push);
	var replace$2 = uncurryThis$7(''.replace);
	var shift = uncurryThis$7([].shift);
	var split = uncurryThis$7(''.split);
	var stringSlice$3 = uncurryThis$7(''.slice);
	var toLowerCase = uncurryThis$7(''.toLowerCase);
	var unshift = uncurryThis$7([].unshift);
	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';
	var ALPHA = /[a-z]/i;
	var ALPHANUMERIC_PLUS_MINUS_DOT = /[\d+\-.a-z]/i;
	var DIGIT = /\d/;
	var HEX_START = /^0x/i;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\da-f]+$/i;
	/* eslint-disable regexp/no-control-character -- safe */
	var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
	var LEADING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+/;
	var TRAILING_C0_CONTROL_OR_SPACE = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
	var TAB_AND_NEW_LINE = /[\t\n\r]/g;
	/* eslint-enable regexp/no-control-character -- safe */
	// eslint-disable-next-line no-unassigned-vars -- expected `undefined` value
	var EOF;

	// https://url.spec.whatwg.org/#ends-in-a-number-checker
	var endsInNumber = function (input) {
	  var parts = split(input, '.');
	  var last, hexPart;
	  if (parts[parts.length - 1] === '') {
	    if (parts.length === 1) return false;
	    parts.length--;
	  }
	  last = parts[parts.length - 1];
	  if (exec$1(DEC, last)) return true;
	  if (exec$1(HEX_START, last)) {
	    hexPart = stringSlice$3(last, 2);
	    return hexPart === '' || !!exec$1(HEX, hexPart);
	  }
	  return false;
	};

	// https://url.spec.whatwg.org/#concept-ipv4-parser
	var parseIPv4 = function (input) {
	  var parts = split(input, '.');
	  var partsLength, numbers, index, part, radix, number, ipv4;
	  if (parts.length && parts[parts.length - 1] === '') {
	    parts.length--;
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return null;
	  numbers = [];
	  for (index = 0; index < partsLength; index++) {
	    part = parts[index];
	    if (part === '') return null;
	    radix = 10;
	    if (part.length > 1 && charAt$4(part, 0) === '0') {
	      radix = exec$1(HEX_START, part) ? 16 : 8;
	      part = stringSlice$3(part, radix === 8 ? 1 : 2);
	    }
	    if (part === '') {
	      number = 0;
	    } else {
	      if (!exec$1(radix === 10 ? DEC : radix === 8 ? OCT : HEX, part)) return null;
	      number = parseInt$1(part, radix);
	    }
	    push$2(numbers, number);
	  }
	  for (index = 0; index < partsLength; index++) {
	    number = numbers[index];
	    if (index === partsLength - 1) {
	      if (number >= pow(256, 5 - partsLength)) return null;
	    } else if (number > 255) return null;
	  }
	  ipv4 = pop(numbers);
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow(256, 3 - index);
	  }
	  return ipv4;
	};

	// https://url.spec.whatwg.org/#concept-ipv6-parser
	// eslint-disable-next-line max-statements -- TODO
	var parseIPv6 = function (input) {
	  var address = [0, 0, 0, 0, 0, 0, 0, 0];
	  var pieceIndex = 0;
	  var compress = null;
	  var pointer = 0;
	  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;
	  var chr = function () {
	    return charAt$4(input, pointer);
	  };
	  if (chr() === ':') {
	    if (charAt$4(input, 1) !== ':') return;
	    pointer += 2;
	    pieceIndex++;
	    compress = pieceIndex;
	  }
	  while (chr()) {
	    if (pieceIndex === 8) return;
	    if (chr() === ':') {
	      if (compress !== null) return;
	      pointer++;
	      pieceIndex++;
	      compress = pieceIndex;
	      continue;
	    }
	    value = length = 0;
	    while (length < 4 && exec$1(HEX, chr())) {
	      value = value * 16 + parseInt$1(chr(), 16);
	      pointer++;
	      length++;
	    }
	    if (chr() === '.') {
	      if (length === 0) return;
	      pointer -= length;
	      if (pieceIndex > 6) return;
	      numbersSeen = 0;
	      while (chr()) {
	        ipv4Piece = null;
	        if (numbersSeen > 0) {
	          if (chr() === '.' && numbersSeen < 4) pointer++;else return;
	        }
	        if (!exec$1(DIGIT, chr())) return;
	        while (exec$1(DIGIT, chr())) {
	          number = parseInt$1(chr(), 10);
	          if (ipv4Piece === null) ipv4Piece = number;else if (ipv4Piece === 0) return;else ipv4Piece = ipv4Piece * 10 + number;
	          if (ipv4Piece > 255) return;
	          pointer++;
	        }
	        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
	        numbersSeen++;
	        if (numbersSeen === 2 || numbersSeen === 4) pieceIndex++;
	      }
	      if (numbersSeen !== 4) return;
	      break;
	    } else if (chr() === ':') {
	      pointer++;
	      if (!chr()) return;
	    } else if (chr()) return;
	    address[pieceIndex++] = value;
	  }
	  if (compress !== null) {
	    swaps = pieceIndex - compress;
	    pieceIndex = 7;
	    while (pieceIndex !== 0 && swaps > 0) {
	      swap = address[pieceIndex];
	      address[pieceIndex--] = address[compress + swaps - 1];
	      address[compress + --swaps] = swap;
	    }
	  } else if (pieceIndex !== 8) return;
	  return address;
	};
	var findLongestZeroSequence = function (ipv6) {
	  var maxIndex = null;
	  var maxLength = 1;
	  var currStart = null;
	  var currLength = 0;
	  var index = 0;
	  for (; index < 8; index++) {
	    if (ipv6[index] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = index;
	      ++currLength;
	    }
	  }
	  return currLength > maxLength ? currStart : maxIndex;
	};

	// https://url.spec.whatwg.org/#host-serializing
	var serializeHost = function (host) {
	  var result, index, compress, ignore0;

	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (index = 0; index < 4; index++) {
	      unshift(result, host % 256);
	      host = floor$1(host / 256);
	    }
	    return join(result, '.');
	  }

	  // ipv6
	  if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (index = 0; index < 8; index++) {
	      if (ignore0 && host[index] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === index) {
	        result += index ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += numberToString(host[index], 16);
	        if (index < 7) result += ':';
	      }
	    }
	    return '[' + result + ']';
	  }
	  return host;
	};
	var C0ControlPercentEncodeSet = {};
	var queryPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
	  ' ': 1,
	  '"': 1,
	  '#': 1,
	  '<': 1,
	  '>': 1
	});
	var specialQueryPercentEncodeSet = assign({}, queryPercentEncodeSet, {
	  "'": 1
	});
	var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
	  ' ': 1,
	  '"': 1,
	  '<': 1,
	  '>': 1,
	  '`': 1
	});
	var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
	  '#': 1,
	  '?': 1,
	  '{': 1,
	  '}': 1,
	  '^': 1
	});
	var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
	  '/': 1,
	  ':': 1,
	  ';': 1,
	  '=': 1,
	  '@': 1,
	  '[': 1,
	  '\\': 1,
	  ']': 1,
	  '^': 1,
	  '|': 1
	});
	var percentEncode = function (chr, set) {
	  var code = codeAt(chr, 0);
	  // encodeURIComponent does not encode ', which is in the special-query percent-encode set
	  return code >= 0x20 && code < 0x7F && !hasOwn$2(set, chr) ? chr : chr === "'" && hasOwn$2(set, chr) ? '%27' : encodeURIComponent$1(chr);
	};

	// https://url.spec.whatwg.org/#special-scheme
	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	// https://url.spec.whatwg.org/#windows-drive-letter
	var isWindowsDriveLetter = function (string, normalized) {
	  var second;
	  return string.length === 2 && exec$1(ALPHA, charAt$4(string, 0)) && ((second = charAt$4(string, 1)) === ':' || !normalized && second === '|');
	};

	// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
	var startsWithWindowsDriveLetter = function (string) {
	  var third;
	  return string.length > 1 && isWindowsDriveLetter(stringSlice$3(string, 0, 2)) && (string.length === 2 || (third = charAt$4(string, 2)) === '/' || third === '\\' || third === '?' || third === '#');
	};

	// https://url.spec.whatwg.org/#single-dot-path-segment
	var isSingleDot = function (segment) {
	  return segment === '.' || toLowerCase(segment) === '%2e';
	};

	// https://url.spec.whatwg.org/#double-dot-path-segment
	var isDoubleDot = function (segment) {
	  segment = toLowerCase(segment);
	  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
	};

	// States:
	var SCHEME_START = {};
	var SCHEME = {};
	var NO_SCHEME = {};
	var SPECIAL_RELATIVE_OR_AUTHORITY = {};
	var PATH_OR_AUTHORITY = {};
	var RELATIVE = {};
	var RELATIVE_SLASH = {};
	var SPECIAL_AUTHORITY_SLASHES = {};
	var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
	var AUTHORITY = {};
	var HOST = {};
	var HOSTNAME = {};
	var PORT = {};
	var FILE = {};
	var FILE_SLASH = {};
	var FILE_HOST = {};
	var PATH_START = {};
	var PATH = {};
	var CANNOT_BE_A_BASE_URL_PATH = {};
	var QUERY = {};
	var FRAGMENT = {};
	var URLState = function (url, isBase, base) {
	  var urlString = $toString(url);
	  var baseState, failure, searchParams;
	  if (isBase) {
	    failure = this.parse(urlString);
	    if (failure) throw new TypeError$1(failure);
	    this.searchParams = null;
	  } else {
	    if (base !== undefined) baseState = new URLState(base, true);
	    failure = this.parse(urlString, null, baseState);
	    if (failure) throw new TypeError$1(failure);
	    searchParams = getInternalSearchParamsState(new URLSearchParams$1());
	    searchParams.bindURL(this);
	    this.searchParams = searchParams;
	  }
	};
	URLState.prototype = {
	  type: 'URL',
	  // https://url.spec.whatwg.org/#url-parsing
	  // eslint-disable-next-line max-statements -- TODO
	  parse: function (input, stateOverride, base) {
	    var url = this;
	    var state = stateOverride || SCHEME_START;
	    var pointer = 0;
	    var buffer = '';
	    var seenAt = false;
	    var seenBracket = false;
	    var seenPasswordToken = false;
	    var codePoints, chr, bufferCodePoints, failure;
	    input = $toString(input);
	    if (!stateOverride) {
	      url.scheme = '';
	      url.username = '';
	      url.password = '';
	      url.host = null;
	      url.port = null;
	      url.path = [];
	      url.query = null;
	      url.fragment = null;
	      url.cannotBeABaseURL = false;
	      input = replace$2(input, LEADING_C0_CONTROL_OR_SPACE, '');
	      input = replace$2(input, TRAILING_C0_CONTROL_OR_SPACE, '$1');
	    }
	    input = replace$2(input, TAB_AND_NEW_LINE, '');
	    codePoints = arrayFrom(input);
	    while (pointer <= codePoints.length) {
	      chr = codePoints[pointer];
	      switch (state) {
	        case SCHEME_START:
	          if (chr && exec$1(ALPHA, chr)) {
	            buffer += toLowerCase(chr);
	            state = SCHEME;
	          } else if (!stateOverride) {
	            state = NO_SCHEME;
	            continue;
	          } else return INVALID_SCHEME;
	          break;
	        case SCHEME:
	          if (chr && exec$1(ALPHANUMERIC_PLUS_MINUS_DOT, chr)) {
	            buffer += toLowerCase(chr);
	          } else if (chr === ':') {
	            if (stateOverride && (url.isSpecial() !== hasOwn$2(specialSchemes, buffer) || buffer === 'file' && (url.includesCredentials() || url.port !== null) || url.scheme === 'file' && url.host === '')) return;
	            url.scheme = buffer;
	            if (stateOverride) {
	              if (url.isSpecial() && specialSchemes[url.scheme] === url.port) url.port = null;
	              return;
	            }
	            buffer = '';
	            if (url.scheme === 'file') {
	              state = FILE;
	            } else if (url.isSpecial() && base && base.scheme === url.scheme) {
	              state = SPECIAL_RELATIVE_OR_AUTHORITY;
	            } else if (url.isSpecial()) {
	              state = SPECIAL_AUTHORITY_SLASHES;
	            } else if (codePoints[pointer + 1] === '/') {
	              state = PATH_OR_AUTHORITY;
	              pointer++;
	            } else {
	              url.cannotBeABaseURL = true;
	              push$2(url.path, '');
	              state = CANNOT_BE_A_BASE_URL_PATH;
	            }
	          } else if (!stateOverride) {
	            buffer = '';
	            state = NO_SCHEME;
	            pointer = 0;
	            continue;
	          } else return INVALID_SCHEME;
	          break;
	        case NO_SCHEME:
	          if (!base || base.cannotBeABaseURL && chr !== '#') return INVALID_SCHEME;
	          if (base.cannotBeABaseURL && chr === '#') {
	            url.scheme = base.scheme;
	            url.path = arraySlice(base.path);
	            url.query = base.query;
	            url.fragment = '';
	            url.cannotBeABaseURL = true;
	            state = FRAGMENT;
	            break;
	          }
	          state = base.scheme === 'file' ? FILE : RELATIVE;
	          continue;
	        case SPECIAL_RELATIVE_OR_AUTHORITY:
	          if (chr === '/' && codePoints[pointer + 1] === '/') {
	            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	            pointer++;
	          } else {
	            state = RELATIVE;
	            continue;
	          }
	          break;
	        case PATH_OR_AUTHORITY:
	          if (chr === '/') {
	            state = AUTHORITY;
	            break;
	          } else {
	            state = PATH;
	            continue;
	          }
	        case RELATIVE:
	          url.scheme = base.scheme;
	          if (chr === EOF) {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            url.query = base.query;
	          } else if (chr === '/' || chr === '\\' && url.isSpecial()) {
	            state = RELATIVE_SLASH;
	          } else if (chr === '?') {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            url.query = '';
	            state = QUERY;
	          } else if (chr === '#') {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            url.query = base.query;
	            url.fragment = '';
	            state = FRAGMENT;
	          } else {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySlice(base.path);
	            if (url.path.length) url.path.length--;
	            state = PATH;
	            continue;
	          }
	          break;
	        case RELATIVE_SLASH:
	          if (url.isSpecial() && (chr === '/' || chr === '\\')) {
	            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          } else if (chr === '/') {
	            state = AUTHORITY;
	          } else {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            state = PATH;
	            continue;
	          }
	          break;
	        case SPECIAL_AUTHORITY_SLASHES:
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          if (chr !== '/' || codePoints[pointer + 1] !== '/') continue;
	          pointer++;
	          break;
	        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
	          if (chr !== '/' && chr !== '\\') {
	            state = AUTHORITY;
	            continue;
	          }
	          break;
	        case AUTHORITY:
	          if (chr === '@') {
	            if (seenAt) buffer = '%40' + buffer;
	            seenAt = true;
	            bufferCodePoints = arrayFrom(buffer);
	            for (var i = 0; i < bufferCodePoints.length; i++) {
	              var codePoint = bufferCodePoints[i];
	              if (codePoint === ':' && !seenPasswordToken) {
	                seenPasswordToken = true;
	                continue;
	              }
	              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
	              if (seenPasswordToken) url.password += encodedCodePoints;else url.username += encodedCodePoints;
	            }
	            buffer = '';
	          } else if (chr === EOF || chr === '/' || chr === '?' || chr === '#' || chr === '\\' && url.isSpecial()) {
	            if (seenAt && buffer === '') return INVALID_AUTHORITY;
	            pointer -= arrayFrom(buffer).length + 1;
	            buffer = '';
	            state = HOST;
	          } else buffer += chr;
	          break;
	        case HOST:
	        case HOSTNAME:
	          if (stateOverride && url.scheme === 'file') {
	            state = FILE_HOST;
	            continue;
	          } else if (chr === ':' && !seenBracket) {
	            if (buffer === '') return INVALID_HOST;
	            if (stateOverride === HOSTNAME) return;
	            failure = url.parseHost(buffer);
	            if (failure) return failure;
	            buffer = '';
	            state = PORT;
	          } else if (chr === EOF || chr === '/' || chr === '?' || chr === '#' || chr === '\\' && url.isSpecial()) {
	            if (url.isSpecial() && buffer === '') return INVALID_HOST;
	            if (stateOverride && buffer === '' && (url.includesCredentials() || url.port !== null)) return;
	            failure = url.parseHost(buffer);
	            if (failure) return failure;
	            buffer = '';
	            state = PATH_START;
	            if (stateOverride) return;
	            continue;
	          } else {
	            if (chr === '[') seenBracket = true;else if (chr === ']') seenBracket = false;
	            buffer += chr;
	          }
	          break;
	        case PORT:
	          if (exec$1(DIGIT, chr)) {
	            buffer += chr;
	          } else if (chr === EOF || chr === '/' || chr === '?' || chr === '#' || chr === '\\' && url.isSpecial() || stateOverride) {
	            if (buffer !== '') {
	              var port = parseInt$1(buffer, 10);
	              if (port > 0xFFFF) return INVALID_PORT;
	              url.port = url.isSpecial() && port === specialSchemes[url.scheme] ? null : port;
	              buffer = '';
	            }
	            if (stateOverride) return;
	            state = PATH_START;
	            continue;
	          } else return INVALID_PORT;
	          break;
	        case FILE:
	          url.scheme = 'file';
	          url.host = '';
	          if (chr === '/' || chr === '\\') state = FILE_SLASH;else if (base && base.scheme === 'file') {
	            switch (chr) {
	              case EOF:
	                url.host = base.host;
	                url.path = arraySlice(base.path);
	                url.query = base.query;
	                break;
	              case '?':
	                url.host = base.host;
	                url.path = arraySlice(base.path);
	                url.query = '';
	                state = QUERY;
	                break;
	              case '#':
	                url.host = base.host;
	                url.path = arraySlice(base.path);
	                url.query = base.query;
	                url.fragment = '';
	                state = FRAGMENT;
	                break;
	              default:
	                url.host = base.host;
	                if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
	                  url.path = arraySlice(base.path);
	                  url.shortenPath();
	                }
	                state = PATH;
	                continue;
	            }
	          } else {
	            state = PATH;
	            continue;
	          }
	          break;
	        case FILE_SLASH:
	          if (chr === '/' || chr === '\\') {
	            state = FILE_HOST;
	            break;
	          }
	          if (base && base.scheme === 'file') {
	            url.host = base.host;
	            if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), '')) && isWindowsDriveLetter(base.path[0], true)) push$2(url.path, base.path[0]);
	          }
	          state = PATH;
	          continue;
	        case FILE_HOST:
	          if (chr === EOF || chr === '/' || chr === '\\' || chr === '?' || chr === '#') {
	            if (!stateOverride && isWindowsDriveLetter(buffer)) {
	              state = PATH;
	            } else if (buffer === '') {
	              url.host = '';
	              if (stateOverride) return;
	              state = PATH_START;
	            } else {
	              failure = url.parseHost(buffer);
	              if (failure) return failure;
	              if (url.host === 'localhost') url.host = '';
	              if (stateOverride) return;
	              buffer = '';
	              state = PATH_START;
	            }
	            continue;
	          } else buffer += chr;
	          break;
	        case PATH_START:
	          if (url.isSpecial()) {
	            state = PATH;
	            if (chr !== '/' && chr !== '\\') continue;
	          } else if (!stateOverride && chr === '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (!stateOverride && chr === '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr !== EOF) {
	            state = PATH;
	            if (chr !== '/') continue;
	          }
	          break;
	        case PATH:
	          if (chr === EOF || chr === '/' || chr === '\\' && url.isSpecial() || !stateOverride && (chr === '?' || chr === '#')) {
	            if (isDoubleDot(buffer)) {
	              url.shortenPath();
	              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
	                push$2(url.path, '');
	              }
	            } else if (isSingleDot(buffer)) {
	              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
	                push$2(url.path, '');
	              }
	            } else {
	              if (url.scheme === 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
	                if (url.host !== null && url.host !== '') url.host = '';
	                buffer = charAt$4(buffer, 0) + ':'; // normalize windows drive letter
	              }
	              push$2(url.path, buffer);
	            }
	            buffer = '';
	            if (url.scheme === 'file' && (chr === EOF || chr === '?' || chr === '#')) {
	              while (url.path.length > 1 && url.path[0] === '') {
	                shift(url.path);
	              }
	            }
	            if (chr === '?') {
	              url.query = '';
	              state = QUERY;
	            } else if (chr === '#') {
	              url.fragment = '';
	              state = FRAGMENT;
	            }
	          } else {
	            buffer += percentEncode(chr, pathPercentEncodeSet);
	          }
	          break;
	        case CANNOT_BE_A_BASE_URL_PATH:
	          if (chr === '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (chr === '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr !== EOF) {
	            url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
	          }
	          break;
	        case QUERY:
	          if (!stateOverride && chr === '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr !== EOF) {
	            url.query += percentEncode(chr, url.isSpecial() ? specialQueryPercentEncodeSet : queryPercentEncodeSet);
	          }
	          break;
	        case FRAGMENT:
	          if (chr !== EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
	          break;
	      }
	      pointer++;
	    }
	  },
	  // https://url.spec.whatwg.org/#host-parsing
	  parseHost: function (input) {
	    var result, codePoints, index;
	    if (charAt$4(input, 0) === '[') {
	      if (charAt$4(input, input.length - 1) !== ']') return INVALID_HOST;
	      result = parseIPv6(stringSlice$3(input, 1, -1));
	      if (!result) return INVALID_HOST;
	      this.host = result;
	      // opaque host
	    } else if (!this.isSpecial()) {
	      if (exec$1(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
	      result = '';
	      codePoints = arrayFrom(input);
	      for (index = 0; index < codePoints.length; index++) {
	        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
	      }
	      this.host = result;
	    } else {
	      input = toASCII(input);
	      if (exec$1(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
	      if (endsInNumber(input)) {
	        result = parseIPv4(input);
	        if (result === null) return INVALID_HOST;
	        this.host = result;
	      } else {
	        this.host = input;
	      }
	    }
	  },
	  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
	  cannotHaveUsernamePasswordPort: function () {
	    return this.host === null || this.host === '' || this.cannotBeABaseURL || this.scheme === 'file';
	  },
	  // https://url.spec.whatwg.org/#include-credentials
	  includesCredentials: function () {
	    return this.username !== '' || this.password !== '';
	  },
	  // https://url.spec.whatwg.org/#is-special
	  isSpecial: function () {
	    return hasOwn$2(specialSchemes, this.scheme);
	  },
	  // https://url.spec.whatwg.org/#shorten-a-urls-path
	  shortenPath: function () {
	    var path = this.path;
	    var pathSize = path.length;
	    if (pathSize && (this.scheme !== 'file' || pathSize !== 1 || !isWindowsDriveLetter(path[0], true))) {
	      path.length--;
	    }
	  },
	  // https://url.spec.whatwg.org/#concept-url-serializer
	  serialize: function () {
	    var url = this;
	    var scheme = url.scheme;
	    var username = url.username;
	    var password = url.password;
	    var host = url.host;
	    var port = url.port;
	    var path = url.path;
	    var query = url.query;
	    var fragment = url.fragment;
	    var output = scheme + ':';
	    if (host !== null) {
	      output += '//';
	      if (url.includesCredentials()) {
	        output += username + (password ? ':' + password : '') + '@';
	      }
	      output += serializeHost(host);
	      if (port !== null) output += ':' + port;
	    } else if (scheme === 'file') output += '//';
	    if (host === null && !url.cannotBeABaseURL && path.length > 1 && path[0] === '') output += '/.';
	    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
	    if (query !== null) output += '?' + query;
	    if (fragment !== null) output += '#' + fragment;
	    return output;
	  },
	  // https://url.spec.whatwg.org/#dom-url-href
	  setHref: function (href) {
	    var failure = this.parse(href);
	    if (failure) throw new TypeError$1(failure);
	    this.searchParams.update();
	  },
	  // https://url.spec.whatwg.org/#dom-url-origin
	  getOrigin: function () {
	    var scheme = this.scheme;
	    var port = this.port;
	    if (scheme === 'blob') try {
	      return new URLConstructor(this.path[0]).origin;
	    } catch (error) {
	      return 'null';
	    }
	    if (scheme === 'file' || !this.isSpecial()) return 'null';
	    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
	  },
	  // https://url.spec.whatwg.org/#dom-url-protocol
	  getProtocol: function () {
	    return this.scheme + ':';
	  },
	  setProtocol: function (protocol) {
	    this.parse($toString(protocol) + ':', SCHEME_START);
	  },
	  // https://url.spec.whatwg.org/#dom-url-username
	  getUsername: function () {
	    return this.username;
	  },
	  setUsername: function (username) {
	    var codePoints = arrayFrom($toString(username));
	    if (this.cannotHaveUsernamePasswordPort()) return;
	    this.username = '';
	    for (var i = 0; i < codePoints.length; i++) {
	      this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	    }
	  },
	  // https://url.spec.whatwg.org/#dom-url-password
	  getPassword: function () {
	    return this.password;
	  },
	  setPassword: function (password) {
	    var codePoints = arrayFrom($toString(password));
	    if (this.cannotHaveUsernamePasswordPort()) return;
	    this.password = '';
	    for (var i = 0; i < codePoints.length; i++) {
	      this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	    }
	  },
	  // https://url.spec.whatwg.org/#dom-url-host
	  getHost: function () {
	    var host = this.host;
	    var port = this.port;
	    return host === null ? '' : port === null ? serializeHost(host) : serializeHost(host) + ':' + port;
	  },
	  setHost: function (host) {
	    if (this.cannotBeABaseURL) return;
	    this.parse(host, HOST);
	  },
	  // https://url.spec.whatwg.org/#dom-url-hostname
	  getHostname: function () {
	    var host = this.host;
	    return host === null ? '' : serializeHost(host);
	  },
	  setHostname: function (hostname) {
	    if (this.cannotBeABaseURL) return;
	    this.parse(hostname, HOSTNAME);
	  },
	  // https://url.spec.whatwg.org/#dom-url-port
	  getPort: function () {
	    var port = this.port;
	    return port === null ? '' : $toString(port);
	  },
	  setPort: function (port) {
	    if (this.cannotHaveUsernamePasswordPort()) return;
	    port = $toString(port);
	    if (port === '') this.port = null;else this.parse(port, PORT);
	  },
	  // https://url.spec.whatwg.org/#dom-url-pathname
	  getPathname: function () {
	    var path = this.path;
	    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
	  },
	  setPathname: function (pathname) {
	    if (this.cannotBeABaseURL) return;
	    this.path = [];
	    this.parse(pathname, PATH_START);
	  },
	  // https://url.spec.whatwg.org/#dom-url-search
	  getSearch: function () {
	    var query = this.query;
	    return query ? '?' + query : '';
	  },
	  setSearch: function (search) {
	    search = $toString(search);
	    if (search === '') {
	      this.query = null;
	    } else {
	      if (charAt$4(search, 0) === '?') search = stringSlice$3(search, 1);
	      this.query = '';
	      this.parse(search, QUERY);
	    }
	    this.searchParams.update();
	  },
	  // https://url.spec.whatwg.org/#dom-url-searchparams
	  getSearchParams: function () {
	    return this.searchParams.facade;
	  },
	  // https://url.spec.whatwg.org/#dom-url-hash
	  getHash: function () {
	    var fragment = this.fragment;
	    return fragment ? '#' + fragment : '';
	  },
	  setHash: function (hash) {
	    hash = $toString(hash);
	    if (hash === '') {
	      this.fragment = null;
	      return;
	    }
	    if (charAt$4(hash, 0) === '#') hash = stringSlice$3(hash, 1);
	    this.fragment = '';
	    this.parse(hash, FRAGMENT);
	  },
	  update: function () {
	    this.query = this.searchParams.serialize() || null;
	  }
	};

	// `URL` constructor
	// https://url.spec.whatwg.org/#url-class
	var URLConstructor = function URL(url /* , base */) {
	  var that = anInstance(this, URLPrototype);
	  var base = validateArgumentsLength$2(arguments.length, 1) > 1 ? arguments[1] : undefined;
	  var state = setInternalState$1(that, new URLState(url, false, base));
	  if (!DESCRIPTORS$3) {
	    that.href = state.serialize();
	    that.origin = state.getOrigin();
	    that.protocol = state.getProtocol();
	    that.username = state.getUsername();
	    that.password = state.getPassword();
	    that.host = state.getHost();
	    that.hostname = state.getHostname();
	    that.port = state.getPort();
	    that.pathname = state.getPathname();
	    that.search = state.getSearch();
	    that.searchParams = state.getSearchParams();
	    that.hash = state.getHash();
	  }
	};
	var URLPrototype = URLConstructor.prototype;
	var accessorDescriptor = function (getter, setter) {
	  return {
	    get: function () {
	      return getInternalURLState(this)[getter]();
	    },
	    set: setter && function (value) {
	      return getInternalURLState(this)[setter](value);
	    },
	    configurable: true,
	    enumerable: true
	  };
	};
	if (DESCRIPTORS$3) {
	  // `URL.prototype.href` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-href
	  defineBuiltInAccessor$2(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
	  // `URL.prototype.origin` getter
	  // https://url.spec.whatwg.org/#dom-url-origin
	  defineBuiltInAccessor$2(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
	  // `URL.prototype.protocol` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-protocol
	  defineBuiltInAccessor$2(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
	  // `URL.prototype.username` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-username
	  defineBuiltInAccessor$2(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
	  // `URL.prototype.password` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-password
	  defineBuiltInAccessor$2(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
	  // `URL.prototype.host` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-host
	  defineBuiltInAccessor$2(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
	  // `URL.prototype.hostname` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-hostname
	  defineBuiltInAccessor$2(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
	  // `URL.prototype.port` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-port
	  defineBuiltInAccessor$2(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
	  // `URL.prototype.pathname` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-pathname
	  defineBuiltInAccessor$2(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
	  // `URL.prototype.search` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-search
	  defineBuiltInAccessor$2(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
	  // `URL.prototype.searchParams` getter
	  // https://url.spec.whatwg.org/#dom-url-searchparams
	  defineBuiltInAccessor$2(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
	  // `URL.prototype.hash` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-hash
	  defineBuiltInAccessor$2(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	defineBuiltIn$4(URLPrototype, 'toJSON', function toJSON() {
	  return getInternalURLState(this).serialize();
	}, {
	  enumerable: true
	});

	// `URL.prototype.toString` method
	// https://url.spec.whatwg.org/#URL-stringification-behavior
	defineBuiltIn$4(URLPrototype, 'toString', function toString() {
	  return getInternalURLState(this).serialize();
	}, {
	  enumerable: true
	});
	if (NativeURL) {
	  var nativeCreateObjectURL = NativeURL.createObjectURL;
	  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
	  // `URL.createObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	  if (nativeCreateObjectURL) defineBuiltIn$4(URLConstructor, 'createObjectURL', bind$1(nativeCreateObjectURL, NativeURL));
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  if (nativeRevokeObjectURL) defineBuiltIn$4(URLConstructor, 'revokeObjectURL', bind$1(nativeRevokeObjectURL, NativeURL));
	}
	setToStringTag(URLConstructor, 'URL');
	$$9({
	  global: true,
	  constructor: true,
	  forced: !USE_NATIVE_URL,
	  sham: !DESCRIPTORS$3
	}, {
	  URL: URLConstructor
	});

	var $$8 = _export;
	var call$8 = functionCall;

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	$$8({
	  target: 'URL',
	  proto: true,
	  enumerable: true
	}, {
	  toJSON: function toJSON() {
	    return call$8(URL.prototype.toString, this);
	  }
	});

	var defineBuiltIn$3 = defineBuiltIn$d;
	var uncurryThis$6 = functionUncurryThis;
	var toString$4 = toString$b;
	var validateArgumentsLength$1 = validateArgumentsLength$5;
	var $URLSearchParams$1 = URLSearchParams;
	var URLSearchParamsPrototype$2 = $URLSearchParams$1.prototype;
	var append = uncurryThis$6(URLSearchParamsPrototype$2.append);
	var $delete = uncurryThis$6(URLSearchParamsPrototype$2['delete']);
	var forEach$1 = uncurryThis$6(URLSearchParamsPrototype$2.forEach);
	var push$1 = uncurryThis$6([].push);
	var params$1 = new $URLSearchParams$1('a=1&a=2&b=3');
	params$1['delete']('a', 1);
	// `undefined` case is a Chromium 117 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=14222
	params$1['delete']('b', undefined);
	if (params$1 + '' !== 'a=2') {
	  defineBuiltIn$3(URLSearchParamsPrototype$2, 'delete', function (name /* , value */) {
	    var length = arguments.length;
	    var $value = length < 2 ? undefined : arguments[1];
	    if (length && $value === undefined) return $delete(this, name);
	    var entries = [];
	    forEach$1(this, function (v, k) {
	      // also validates `this`
	      push$1(entries, {
	        key: k,
	        value: v
	      });
	    });
	    validateArgumentsLength$1(length, 1);
	    var key = toString$4(name);
	    var value = toString$4($value);
	    var index = 0;
	    var entriesLength = entries.length;
	    var entry;
	    while (index < entriesLength) {
	      entry = entries[index];
	      $delete(this, entry.key);
	      index++;
	    }
	    index = 0;
	    while (index < entriesLength) {
	      entry = entries[index++];
	      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
	    }
	  }, {
	    enumerable: true,
	    unsafe: true
	  });
	}

	var defineBuiltIn$2 = defineBuiltIn$d;
	var uncurryThis$5 = functionUncurryThis;
	var toString$3 = toString$b;
	var validateArgumentsLength = validateArgumentsLength$5;
	var $URLSearchParams = URLSearchParams;
	var URLSearchParamsPrototype$1 = $URLSearchParams.prototype;
	var getAll = uncurryThis$5(URLSearchParamsPrototype$1.getAll);
	var $has = uncurryThis$5(URLSearchParamsPrototype$1.has);
	var params = new $URLSearchParams('a=1');

	// `undefined` case is a Chromium 117 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=14222
	if (params.has('a', 2) || !params.has('a', undefined)) {
	  defineBuiltIn$2(URLSearchParamsPrototype$1, 'has', function has(name /* , value */) {
	    var length = arguments.length;
	    var $value = length < 2 ? undefined : arguments[1];
	    if (length && $value === undefined) return $has(this, name);
	    var values = getAll(this, name); // also validates `this`
	    validateArgumentsLength(length, 1);
	    var value = toString$3($value);
	    var index = 0;
	    while (index < values.length) {
	      if (values[index++] === value) return true;
	    }
	    return false;
	  }, {
	    enumerable: true,
	    unsafe: true
	  });
	}

	var DESCRIPTORS$2 = descriptors;
	var uncurryThis$4 = functionUncurryThis;
	var defineBuiltInAccessor$1 = defineBuiltInAccessor$6;
	var URLSearchParamsPrototype = URLSearchParams.prototype;
	var forEach = uncurryThis$4(URLSearchParamsPrototype.forEach);

	// `URLSearchParams.prototype.size` getter
	// https://github.com/whatwg/url/pull/734
	if (DESCRIPTORS$2 && !('size' in URLSearchParamsPrototype)) {
	  defineBuiltInAccessor$1(URLSearchParamsPrototype, 'size', {
	    get: function size() {
	      var count = 0;
	      forEach(this, function () {
	        count++;
	      });
	      return count;
	    },
	    configurable: true,
	    enumerable: true
	  });
	}

	function _assertClassBrand(e, t, n) {
	  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	  throw new TypeError("Private element is not present on this object");
	}
	function _checkInRHS(e) {
	  if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null"));
	  return e;
	}
	function _checkPrivateRedeclaration(e, t) {
	  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
	}
	function _classPrivateFieldGet2(s, a) {
	  return s.get(_assertClassBrand(s, a));
	}
	function _classPrivateFieldInitSpec(e, t, a) {
	  _checkPrivateRedeclaration(e, t), t.set(e, a);
	}
	function _classPrivateFieldSet2(s, a, r) {
	  return s.set(_assertClassBrand(s, a), r), r;
	}
	function _defineProperty(e, r, t) {
	  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
	    value: t,
	    enumerable: true,
	    configurable: true,
	    writable: true
	  }) : e[r] = t, e;
	}
	function _identity(t) {
	  return t;
	}
	function _setFunctionName(e, t, n) {
	  "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : "");
	  try {
	    Object.defineProperty(e, "name", {
	      configurable: !0,
	      value: n ? n + " " + t : t
	    });
	  } catch (e) {}
	  return e;
	}
	function _toPrimitive(t, r) {
	  if ("object" != typeof t || !t) return t;
	  var e = t[Symbol.toPrimitive];
	  if (void 0 !== e) {
	    var i = e.call(t, r);
	    if ("object" != typeof i) return i;
	    throw new TypeError("@@toPrimitive must return a primitive value.");
	  }
	  return ("string" === r ? String : Number)(t);
	}
	function _toPropertyKey(t) {
	  var i = _toPrimitive(t, "string");
	  return "symbol" == typeof i ? i : i + "";
	}
	function _applyDecs2305(e, t, r, n, o, a) {
	  function i(e, t, r) {
	    return function (n, o) {
	      return r && r(n), e[t].call(n, o);
	    };
	  }
	  function c(e, t) {
	    for (var r = 0; r < e.length; r++) e[r].call(t);
	    return t;
	  }
	  function s(e, t, r, n) {
	    if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined"));
	    return e;
	  }
	  function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) {
	    function m(e) {
	      if (!h(e)) throw new TypeError("Attempted to access private element on non-instance");
	    }
	    var y,
	      v = t[0],
	      g = t[3],
	      b = !u;
	    if (!b) {
	      r || Array.isArray(v) || (v = [v]);
	      var w = {},
	        S = [],
	        A = 3 === o ? "get" : 4 === o || d ? "set" : "value";
	      f ? (p || d ? w = {
	        get: _setFunctionName(function () {
	          return g(this);
	        }, n, "get"),
	        set: function (e) {
	          t[4](this, e);
	        }
	      } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n));
	    }
	    for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) {
	      var D = v[j],
	        E = r ? v[j - 1] : void 0,
	        I = {},
	        O = {
	          kind: ["field", "accessor", "method", "getter", "setter", "class"][o],
	          name: n,
	          metadata: a,
	          addInitializer: function (e, t) {
	            if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
	            s(t, "An initializer", "be", true), c.push(t);
	          }.bind(null, I)
	        };
	      try {
	        if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else {
	          var k, F;
	          O.static = l, O.private = f, f ? 2 === o ? k = function (e) {
	            return m(e), w.value;
	          } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) {
	            return e[n];
	          }, (o < 2 || 4 === o) && (F = function (e, t) {
	            e[n] = t;
	          }));
	          var N = O.access = {
	            has: f ? h.bind() : function (e) {
	              return n in e;
	            }
	          };
	          if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? {
	            get: w.get,
	            set: w.set
	          } : w[A], O), d) {
	            if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
	          } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P);
	        }
	      } finally {
	        I.v = true;
	      }
	    }
	    return (p || d) && u.push(function (e, t) {
	      for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t);
	      return t;
	    }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P;
	  }
	  function u(e, t) {
	    return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), {
	      configurable: true,
	      enumerable: true,
	      value: t
	    });
	  }
	  if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")];
	  var f = Object.create(null == l ? null : l),
	    p = function (e, t, r, n) {
	      var o,
	        a,
	        i = [],
	        s = function (t) {
	          return _checkInRHS(t) === e;
	        },
	        u = new Map();
	      function l(e) {
	        e && i.push(c.bind(null, e));
	      }
	      for (var f = 0; f < t.length; f++) {
	        var p = t[f];
	        if (Array.isArray(p)) {
	          var d = p[1],
	            h = p[2],
	            m = p.length > 3,
	            y = 16 & d,
	            v = !!(8 & d),
	            g = 0 == (d &= 7),
	            b = h + "/" + v;
	          if (!g && !m) {
	            var w = u.get(b);
	            if (true === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
	            u.set(b, !(d > 2) || d);
	          }
	          applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r);
	        }
	      }
	      return l(o), l(a), i;
	    }(e, t, o, f);
	  return r.length || u(e, f), {
	    e: p,
	    get c() {
	      var t = [];
	      return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)];
	    }
	  };
	}

	var iteratorClose$4 = iteratorClose$b;
	var iteratorCloseAll$1 = function (iters, kind, value) {
	  for (var i = iters.length - 1; i >= 0; i--) {
	    if (iters[i] === undefined) continue;
	    try {
	      value = iteratorClose$4(iters[i].iterator, kind, value);
	    } catch (error) {
	      kind = 'throw';
	      value = error;
	    }
	  }
	  if (kind === 'throw') throw value;
	  return value;
	};

	var call$7 = functionCall;
	var create$1 = objectCreate;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$a;
	var defineBuiltIns = defineBuiltIns$2;
	var wellKnownSymbol$4 = wellKnownSymbol$m;
	var InternalStateModule = internalState;
	var getMethod$1 = getMethod$5;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var createIterResultObject = createIterResultObject$4;
	var iteratorClose$3 = iteratorClose$b;
	var iteratorCloseAll = iteratorCloseAll$1;
	var TO_STRING_TAG = wellKnownSymbol$4('toStringTag');
	var ITERATOR_HELPER = 'IteratorHelper';
	var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
	var NORMAL = 'normal';
	var THROW = 'throw';
	var setInternalState = InternalStateModule.set;
	var createIteratorProxyPrototype = function (IS_ITERATOR) {
	  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);
	  return defineBuiltIns(create$1(IteratorPrototype), {
	    next: function next() {
	      var state = getInternalState(this);
	      // for simplification:
	      //   for `%WrapForValidIteratorPrototype%.next` or with `state.returnHandlerResult` our `nextHandler` returns `IterResultObject`
	      //   for `%IteratorHelperPrototype%.next` - just a value
	      if (IS_ITERATOR) return state.nextHandler();
	      if (state.done) return createIterResultObject(undefined, true);
	      try {
	        var result = state.nextHandler();
	        return state.returnHandlerResult ? result : createIterResultObject(result, state.done);
	      } catch (error) {
	        state.done = true;
	        throw error;
	      }
	    },
	    'return': function () {
	      var state = getInternalState(this);
	      var iterator = state.iterator;
	      var done = state.done;
	      state.done = true;
	      if (IS_ITERATOR) {
	        var returnMethod = getMethod$1(iterator, 'return');
	        return returnMethod ? call$7(returnMethod, iterator) : createIterResultObject(undefined, true);
	      }
	      if (done) return createIterResultObject(undefined, true);
	      if (state.inner) try {
	        iteratorClose$3(state.inner.iterator, NORMAL);
	      } catch (error) {
	        return iteratorClose$3(iterator, THROW, error);
	      }
	      if (state.openIters) try {
	        iteratorCloseAll(state.openIters, NORMAL);
	      } catch (error) {
	        if (iterator) return iteratorClose$3(iterator, THROW, error);
	        throw error;
	      }
	      if (iterator) iteratorClose$3(iterator, NORMAL);
	      return createIterResultObject(undefined, true);
	    }
	  });
	};
	var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
	var IteratorHelperPrototype = createIteratorProxyPrototype(false);
	createNonEnumerableProperty$2(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper');
	var iteratorCreateProxy = function (nextHandler, IS_ITERATOR, RETURN_HANDLER_RESULT) {
	  var IteratorProxy = function Iterator(record, state) {
	    if (state) {
	      state.iterator = record.iterator;
	      state.next = record.next;
	    } else state = record;
	    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
	    state.returnHandlerResult = !!RETURN_HANDLER_RESULT;
	    state.nextHandler = nextHandler;
	    state.counter = 0;
	    state.done = false;
	    setInternalState(this, state);
	  };
	  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;
	  return IteratorProxy;
	};

	// Should throw an error on invalid iterator
	// https://issues.chromium.org/issues/336839115
	var iteratorHelperThrowsOnInvalidIterator$2 = function (methodName, argument) {
	  // eslint-disable-next-line es/no-iterator -- required for testing
	  var method = typeof Iterator == 'function' && Iterator.prototype[methodName];
	  if (method) try {
	    method.call({
	      next: null
	    }, argument).next();
	  } catch (error) {
	    return true;
	  }
	};

	var $$7 = _export;
	var call$6 = functionCall;
	var aCallable$4 = aCallable$g;
	var anObject$4 = anObject$l;
	var getIteratorDirect$2 = getIteratorDirect$6;
	var createIteratorProxy$1 = iteratorCreateProxy;
	var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$3;
	var iteratorClose$2 = iteratorClose$b;
	var iteratorHelperThrowsOnInvalidIterator$1 = iteratorHelperThrowsOnInvalidIterator$2;
	var iteratorHelperWithoutClosingOnEarlyError$2 = iteratorHelperWithoutClosingOnEarlyError$6;
	var MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR = !iteratorHelperThrowsOnInvalidIterator$1('map', function () {/* empty */});
	var mapWithoutClosingOnEarlyError = !MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError$2('map', TypeError);
	var FORCED$3 = MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR || mapWithoutClosingOnEarlyError;
	var IteratorProxy$1 = createIteratorProxy$1(function () {
	  var iterator = this.iterator;
	  var result = anObject$4(call$6(this.next, iterator));
	  var done = this.done = !!result.done;
	  if (!done) return callWithSafeIterationClosing$1(iterator, this.mapper, [result.value, this.counter++], true);
	});

	// `Iterator.prototype.map` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.map
	$$7({
	  target: 'Iterator',
	  proto: true,
	  real: true,
	  forced: FORCED$3
	}, {
	  map: function map(mapper) {
	    anObject$4(this);
	    try {
	      aCallable$4(mapper);
	    } catch (error) {
	      iteratorClose$2(this, 'throw', error);
	    }
	    if (mapWithoutClosingOnEarlyError) return call$6(mapWithoutClosingOnEarlyError, this, mapper);
	    return new IteratorProxy$1(getIteratorDirect$2(this), {
	      mapper: mapper
	    });
	  }
	});

	// 日志记录
	const logs = [];
	const globalConfig = {
	  supportExport: true
	};
	let currentTotalSize = 0;
	const LoggerStyle = {
	  info: ``,
	  log: 'background: #4096ff; color: #FFF;',
	  warn: 'background: yellow; color: #FFF;',
	  error: 'background: red; color: #FFF;'
	};
	const LoggerNameStyle = `background: green;color: #fff`;

	/**
	 * logger 调试日志管理
	 *
	 * 支持四个日志等级 INFO | LOG | WARN | ERROR
	 *
	 * @example
	 *
	 * cosnt logger = new Logger({level: "INFO"})
	 * logger.log("this is log")
	 */
	class LoggerCls {
	  constructor() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    _defineProperty(this, "_options", {
	      level: 'INFO',
	      showTime: false
	    });
	    _defineProperty(this, "_levelNum", 3);
	    /**
	     * @description 信息日志 console.info
	     * @method
	     *
	     * @example
	     * logger.info("info") // [INFO] info
	     */
	    _defineProperty(this, "info", this._loggerFactory('info', this._levelNum >= 3));
	    /**
	     * @description 日志 console.log
	     * @method
	     *
	     * @example
	     * logger.log("log") // [LOG] log
	     */
	    _defineProperty(this, "log", this._loggerFactory('log', this._levelNum >= 2));
	    /**
	     * @description 警告日志 console.warn
	     * @method
	     *
	     * @example
	     * logger.warn("warn") // [WARN] warn
	     */
	    _defineProperty(this, "warn", this._loggerFactory('warn', this._levelNum >= 1));
	    /**
	     * @description 错误日志 console.error
	     * @method
	     *
	     * @example
	     * logger.error("error") // [ERROR] error
	     */
	    _defineProperty(this, "error", this._loggerFactory('error', this._levelNum >= 0));
	    _defineProperty(this, "debug", this._loggerFactory('debug', this._levelNum >= 0));
	    _defineProperty(this, "trace", this._loggerFactory('trace', this._levelNum >= 0));
	    this.setOptions(options);
	  }
	  /**
	   * @description 更新配置, 日志等级会重新衡量是否打印
	   * @param {LoggerOptions} options 配置
	   * @example
	   * logger.setOptions({level: "WARN"}) // 只打印 warn和error 的日志
	   */
	  setOptions(options) {
	    var _this$_options$level, _options$nameColor;
	    this._options = Object.assign({}, this._options, options);
	    this._levelNum = this._matchLevel((_this$_options$level = this._options.level) !== null && _this$_options$level !== void 0 ? _this$_options$level : 'INFO');
	    this._nameColor = (_options$nameColor = options.nameColor) !== null && _options$nameColor !== void 0 ? _options$nameColor : LoggerNameStyle;
	    this.info = this._loggerFactory('info', this._levelNum >= 3);
	    this.log = this._loggerFactory('log', this._levelNum >= 2);
	    this.warn = this._loggerFactory('warn', this._levelNum >= 1);
	    this.error = this._loggerFactory('error', this._levelNum >= 0);
	  }

	  /**
	   * @description Private method used to match logger level
	   * @private
	   *
	   * @example
	   * this._matchLevel("INFO") // 3
	   *
	   * @param {LoggerLevel} level logger level
	   * @return {number}
	   */
	  _matchLevel(level) {
	    let logLevel = 3;
	    switch (level) {
	      case 'INFO':
	        logLevel = 3;
	        break;
	      case 'LOG':
	        logLevel = 2;
	        break;
	      case 'WARN':
	        logLevel = 1;
	        break;
	      case 'ERROR':
	        logLevel = 0;
	        break;
	    }
	    return logLevel;
	  }

	  /**
	   * @private
	   * @description Logger factory
	   * @param {ConsoleKey} type
	   * @param {boolean} bool
	   * @returns
	   */
	  _loggerFactory(type, bool) {
	    const fn = console[type];
	    if (bool && fn) {
	      const args0 = this._options.name ? `%c[${this._options.name}]%c %c[${type.toUpperCase()}]` : `%c[${type.toUpperCase()}]`;
	      const color = [this._options.name ? this._nameColor : null, this._options.name ? '' : null, LoggerStyle[type]].filter(color => color != null);
	      return fn.bind(console, args0, ...color);
	    }
	    return LoggerCls.noop;
	  }
	  getOptions() {
	    return this._options;
	  }
	}

	// function Logger
	_defineProperty(LoggerCls, "noop", () => {});
	function currentTimeStr() {
	  const now = new Date(Date.now());
	  const year = now.getFullYear();
	  const month = now.getMonth() + 1;
	  const day = now.getDate();
	  const hour = now.getHours();
	  const min = now.getMinutes();
	  const sec = now.getSeconds();
	  // const ms = now.getMilliseconds();
	  // prettier-ignore
	  return `${year}/${fillTen(month)}/${fillTen(day)} ${fillTen(hour)}:${fillTen(min)}:${fillTen(sec)}`;
	}
	function fillTen(num) {
	  num = +num;
	  if (num < 10) {
	    num = `0${num}`;
	  }
	  return num + '';
	}

	// 对logs数据进行处理
	async function processLogs() {
	  // 如果当前日志数据的大小超过500kb（以字节为单位）
	  const maxSize = 0.5 * 1024 * 1024;
	  if (currentTotalSize > maxSize) {
	    let removedSize = 0;
	    let index = 0;

	    // 计算需要删除的日志数量
	    while (index < logs.length && currentTotalSize - removedSize > maxSize) {
	      removedSize += JSON.stringify(logs[index]).length;
	      index++;
	      // 异步等待
	      await new Promise(resolve => setTimeout(resolve, 0));
	    }
	    // 批量删除
	    logs.splice(0, index);
	    currentTotalSize -= removedSize;
	  }
	}
	const list = ['log', 'debug', 'info', 'warn', 'error', 'trace'];
	var logger = {
	  /**
	   * level?: 'INFO' | 'LOG' | 'WARN' | 'ERROR';
	   * supportExport?: boolean;
	   * name?: string;
	   * nameColor?: string;
	   * */
	  proxy: options => {
	    const loggerIns = new LoggerCls(options);
	    return new Proxy(loggerIns, {
	      get(target, prop) {
	        if (list.includes(prop)) {
	          const time = currentTimeStr();
	          if (globalConfig.supportExport) {
	            return function () {
	              target[prop].apply(console, arguments);
	              // 收集（只收集log,warn,error,info）
	              const newLog = [`[${time}][${options.name} ${prop}]：`, ...arguments];
	              ['log', 'info', 'warn', 'error'].includes(prop) && logs.push(newLog);
	              currentTotalSize += JSON.stringify(newLog).length;
	              // 对logs数据进行处理
	              processLogs();
	            };
	          } else {
	            return target[prop].bind(console);
	          }
	        }
	        return Reflect.get(target, prop);
	      }
	    });
	  },
	  setGlobalConfig(params) {
	    Object.assign(globalConfig, params);
	  },
	  // 导出
	  exportLogs() {
	    function mapLog(log) {
	      return log.map(arg => {
	        if (arg instanceof Array) {
	          return JSON.stringify(mapLog(arg));
	        } else if (arg instanceof Error) {
	          // 对 Error 数据类型做特殊处理
	          return arg.message;
	        } else if (arg instanceof MediaStreamTrack) {
	          // 对 MediaStreamTrack 数据类型做特殊处理
	          const mediaStreamTrackCopy = {
	            id: arg.id,
	            enabled: arg.enabled,
	            kind: arg.kind,
	            label: arg.label,
	            muted: arg.muted,
	            readyState: arg.readyState,
	            remote: arg.remote
	          };
	          return JSON.stringify(mediaStreamTrackCopy);
	        } else {
	          return JSON.stringify(arg);
	        }
	      });
	    }
	    const logText = logs.map(function (log) {
	      const logMapStr = mapLog(log).join('');
	      return logMapStr;
	    }).join("\r\n\r\n");
	    const blob = new Blob([logText], {
	      type: 'text/plain;charset=utf-8'
	    });
	    const url = URL.createObjectURL(blob);

	    // 创建隐藏的可下载链接
	    const downloadLink = document.createElement("a");
	    downloadLink.href = url;
	    downloadLink.download = "logs.txt";
	    downloadLink.click();

	    // 释放 URL 对象
	    window.URL.revokeObjectURL(url);
	  }
	};

	/*
		The MIT License (MIT)

		Copyright (c) 2016 Meetecho

		Permission is hereby granted, free of charge, to any person obtaining
		a copy of this software and associated documentation files (the "Software"),
		to deal in the Software without restriction, including without limitation
		the rights to use, copy, modify, merge, publish, distribute, sublicense,
		and/or sell copies of the Software, and to permit persons to whom the
		Software is furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included
		in all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
		OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
		THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
		OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
		ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
		OTHER DEALINGS IN THE SOFTWARE.
	 */

	// List of sessions
	Janus.sessions = {};
	Janus.isExtensionEnabled = function () {
	  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
	    // No need for the extension, getDisplayMedia is supported
	    return true;
	  }
	  if (window.navigator.userAgent.match('Chrome')) {
	    var chromever = parseInt(window.navigator.userAgent.match(/Chrome\/(.*) /)[1], 10);
	    var maxver = 33;
	    if (window.navigator.userAgent.match('Linux')) maxver = 35; // "known" crash in chrome 34 and 35 on linux
	    if (chromever >= 26 && chromever <= maxver) {
	      // Older versions of Chrome don't support this extension-based approach, so lie
	      return true;
	    }
	    return Janus.extension.isInstalled();
	  } else {
	    // Firefox of others, no need for the extension (but this doesn't mean it will work)
	    return true;
	  }
	};
	var defaultExtension = {
	  // Screensharing Chrome Extension ID
	  extensionId: 'hapfgfdkleiggjjpfpenajgdnfckjpaj',
	  isInstalled: function () {
	    return document.querySelector('#janus-extension-installed') !== null;
	  },
	  getScreen: function (callback) {
	    var pending = window.setTimeout(function () {
	      var error = new Error('NavigatorUserMediaError');
	      error.name = 'The required Chrome extension is not installed: click <a href="#">here</a> to install it. (NOTE: this will need you to refresh the page)';
	      return callback(error);
	    }, 1000);
	    this.cache[pending] = callback;
	    window.postMessage({
	      type: 'janusGetScreen',
	      id: pending
	    }, '*');
	  },
	  init: function () {
	    var cache = {};
	    this.cache = cache;
	    // Wait for events from the Chrome Extension
	    window.addEventListener('message', function (event) {
	      if (event.origin != window.location.origin) return;
	      if (event.data.type == 'janusGotScreen' && cache[event.data.id]) {
	        var callback = cache[event.data.id];
	        delete cache[event.data.id];
	        if (event.data.sourceId === '') {
	          // user canceled
	          var error = new Error('NavigatorUserMediaError');
	          error.name = 'You cancelled the request for permission, giving up...';
	          callback(error);
	        } else {
	          callback(null, event.data.sourceId);
	        }
	      } else if (event.data.type == 'janusGetScreenPending') {
	        Janus.log('clearing ', event.data.id);
	        window.clearTimeout(event.data.id);
	      }
	    });
	  }
	};
	Janus.useDefaultDependencies = function (deps) {
	  var f = deps && deps.fetch || fetch;
	  var p = deps && deps.Promise || Promise;
	  var socketCls = deps && deps.WebSocket || WebSocket;
	  return {
	    newWebSocket: function (server, proto) {
	      return new socketCls(server, proto);
	    },
	    extension: deps && deps.extension || defaultExtension,
	    isArray: function (arr) {
	      return Array.isArray(arr);
	    },
	    webRTCAdapter: deps && deps.adapter || adapter,
	    httpAPICall: function (url, options) {
	      var fetchOptions = {
	        method: options.verb,
	        headers: {
	          'Accept': 'application/json, text/plain, */*'
	        },
	        cache: 'no-cache'
	      };
	      if (options.verb === "POST") {
	        fetchOptions.headers['Content-Type'] = 'application/json';
	      }
	      if (options.withCredentials !== undefined) {
	        fetchOptions.credentials = options.withCredentials === true ? 'include' : options.withCredentials ? options.withCredentials : 'omit';
	      }
	      if (options.body !== undefined) {
	        fetchOptions.body = JSON.stringify(options.body);
	      }
	      var fetching = f(url, fetchOptions).catch(function (error) {
	        return p.reject({
	          message: 'Probably a network error, is the server down?',
	          error: error
	        });
	      });

	      /*
	       * fetch() does not natively support timeouts.
	       * Work around this by starting a timeout manually, and racing it agains the fetch() to see which thing resolves first.
	       */

	      if (options.timeout !== undefined) {
	        var timeout = new p(function (resolve, reject) {
	          var timerId = setTimeout(function () {
	            clearTimeout(timerId);
	            return reject({
	              message: 'Request timed out',
	              timeout: options.timeout
	            });
	          }, options.timeout);
	        });
	        fetching = p.race([fetching, timeout]);
	      }
	      fetching.then(function (response) {
	        if (response.ok) {
	          if (typeof options.success === typeof Janus.noop) {
	            return response.json().then(function (parsed) {
	              options.success(parsed);
	            }).catch(function (error) {
	              return p.reject({
	                message: 'Failed to parse response body',
	                error: error,
	                response: response
	              });
	            });
	          }
	        } else {
	          return p.reject({
	            message: 'API call failed',
	            response: response
	          });
	        }
	      }).catch(function (error) {
	        if (typeof options.error === typeof Janus.noop) {
	          options.error(error.message || '<< internal error >>', error);
	        }
	      });
	      return fetching;
	    }
	  };
	};
	Janus.useOldDependencies = function (deps) {
	  var jq = deps && deps.jQuery || jQuery;
	  var socketCls = deps && deps.WebSocket || WebSocket;
	  return {
	    newWebSocket: function (server, proto) {
	      return new socketCls(server, proto);
	    },
	    isArray: function (arr) {
	      return jq.isArray(arr);
	    },
	    extension: deps && deps.extension || defaultExtension,
	    webRTCAdapter: deps && deps.adapter || adapter,
	    httpAPICall: function (url, options) {
	      var payload = options.body !== undefined ? {
	        contentType: 'application/json',
	        data: JSON.stringify(options.body)
	      } : {};
	      var credentials = options.withCredentials !== undefined ? {
	        xhrFields: {
	          withCredentials: options.withCredentials
	        }
	      } : {};
	      return jq.ajax(jq.extend(payload, credentials, {
	        url: url,
	        type: options.verb,
	        cache: false,
	        dataType: 'json',
	        async: options.async,
	        timeout: options.timeout,
	        success: function (result) {
	          if (typeof options.success === typeof Janus.noop) {
	            options.success(result);
	          }
	        },
	        error: function (xhr, status, err) {
	          if (typeof options.error === typeof Janus.noop) {
	            options.error(status, err);
	          }
	        }
	      }));
	    }
	  };
	};
	Janus.noop = function () {};
	Janus.dataChanDefaultLabel = "JanusDataChannel";

	// Note: in the future we may want to change this, e.g., as was
	// attempted in https://github.com/meetecho/janus-gateway/issues/1670
	Janus.endOfCandidates = null;

	// Initialization
	const consoleProxy = logger.proxy({
	  name: 'Janus',
	  nameColor: 'color: #fff;background-color:#c7254e;'
	});
	Janus.init = function (options) {
	  options = options || {};
	  options.callback = typeof options.callback == "function" ? options.callback : Janus.noop;
	  if (Janus.initDone === true) {
	    // Already initialized
	    options.callback();
	  } else {
	    if (typeof console == "undefined" || typeof console.log == "undefined") console = {
	      log: function () {}
	    };
	    // Console logging (all debugging disabled by default)
	    Janus.trace = Janus.noop;
	    Janus.debug = Janus.noop;
	    Janus.vdebug = Janus.noop;
	    Janus.log = Janus.noop;
	    Janus.warn = Janus.noop;
	    Janus.error = Janus.noop;

	    // 对conosle进行代理，拼接上janus相关文字，方便日志排查
	    // const consoleProxy = new Proxy(console, {
	    // 	get: function (target, key, receiver) {
	    // 		return target[key].bind(target, `%c[Janus ${key}]`, 'color: #fff;background-color:#c7254e;')
	    // 	}
	    // });
	    ['log', 'debug', 'vdebug', 'info', 'warn', 'error', 'trace'].forEach(key => {
	      if (Array.isArray(options.debug) && options.debug.includes(key) || options.debug === true || options.debug === "all") {
	        Object.defineProperty(Janus, key, {
	          get: function () {
	            return consoleProxy[key];
	          },
	          set: function (val) {
	            consoleProxy[key] = val;
	          }
	        });
	      }
	    });
	    Janus.log("Initializing library");
	    var usedDependencies = options.dependencies || Janus.useDefaultDependencies();
	    Janus.isArray = usedDependencies.isArray;
	    Janus.webRTCAdapter = usedDependencies.webRTCAdapter;
	    Janus.httpAPICall = usedDependencies.httpAPICall;
	    Janus.newWebSocket = usedDependencies.newWebSocket;
	    Janus.extension = usedDependencies.extension;
	    Janus.extension.init();

	    // Helper method to enumerate devices
	    Janus.listDevices = function (callback, config) {
	      callback = typeof callback == "function" ? callback : Janus.noop;
	      if (config == null) config = {
	        audio: true,
	        video: true
	      };
	      if (Janus.isGetUserMediaAvailable()) {
	        navigator.mediaDevices.getUserMedia(config).then(function (stream) {
	          navigator.mediaDevices.enumerateDevices().then(function (devices) {
	            Janus.debug(devices);
	            callback(devices);
	            // Get rid of the now useless stream
	            try {
	              var tracks = stream.getTracks();
	              for (var i in tracks) {
	                var mst = tracks[i];
	                if (mst !== null && mst !== undefined) mst.stop();
	              }
	            } catch (e) {}
	          });
	        }).catch(function (err) {
	          Janus.error(err);
	          callback([]);
	        });
	      } else {
	        Janus.warn("navigator.mediaDevices unavailable");
	        callback([]);
	      }
	    };
	    // Helper methods to attach/reattach a stream to a video element (previously part of adapter.js)
	    Janus.attachMediaStream = function (element, stream) {
	      // if (Janus.webRTCAdapter.browserDetails.browser === 'chrome') {
	      // 	var chromever = Janus.webRTCAdapter.browserDetails.version;
	      // 	if (chromever >= 52) {
	      // 		element.srcObject = stream;
	      // 	} else if (typeof element.src !== 'undefined') {
	      // 		element.src = URL.createObjectURL(stream);
	      // 	} else {
	      // 		Janus.error("Error attaching stream to element");
	      // 	}
	      // } else {
	      // 	element.srcObject = stream;
	      // }
	      try {
	        if ('srcObject' in element) {
	          element.srcObject = stream;
	        } else {
	          element.src = URL.createObjectURL(stream);
	        }
	      } catch (error) {
	        Janus.error("Error attaching stream to element");
	      }
	    };
	    Janus.reattachMediaStream = function (to, from) {
	      if (Janus.webRTCAdapter.browserDetails.browser === 'chrome') {
	        var chromever = Janus.webRTCAdapter.browserDetails.version;
	        if (chromever >= 52) {
	          to.srcObject = from.srcObject;
	        } else if (typeof to.src !== 'undefined') {
	          to.src = from.src;
	        } else {
	          Janus.error("Error reattaching stream to element");
	        }
	      } else {
	        to.srcObject = from.srcObject;
	      }
	    };
	    // Detect tab close: make sure we don't loose existing onbeforeunload handlers
	    // (note: for iOS we need to subscribe to a different event, 'pagehide', see
	    // https://gist.github.com/thehunmonkgroup/6bee8941a49b86be31a787fe8f4b8cfe)
	    var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
	    var eventName = iOS ? 'pagehide' : 'beforeunload';
	    var oldOBF = window["on" + eventName];
	    window.addEventListener(eventName, function (event) {
	      Janus.log("Closing window");
	      for (var s in Janus.sessions) {
	        if (Janus.sessions[s] !== null && Janus.sessions[s] !== undefined && Janus.sessions[s].destroyOnUnload) {
	          Janus.log("Destroying session " + s);
	          Janus.sessions[s].destroy({
	            asyncRequest: false,
	            notifyDestroyed: false
	          });
	        }
	      }
	      if (oldOBF && typeof oldOBF == "function") oldOBF();
	    });
	    // If this is a Safari Technology Preview, check if VP8 is supported
	    Janus.safariVp8 = false;
	    if (Janus.webRTCAdapter.browserDetails.browser === 'safari' && Janus.webRTCAdapter.browserDetails.version >= 605) {
	      // Let's see if RTCRtpSender.getCapabilities() is there
	      if (RTCRtpSender && RTCRtpSender.getCapabilities && RTCRtpSender.getCapabilities("video") && RTCRtpSender.getCapabilities("video").codecs && RTCRtpSender.getCapabilities("video").codecs.length) {
	        for (var i in RTCRtpSender.getCapabilities("video").codecs) {
	          var codec = RTCRtpSender.getCapabilities("video").codecs[i];
	          if (codec && codec.mimeType && codec.mimeType.toLowerCase() === "video/vp8") {
	            Janus.safariVp8 = true;
	            break;
	          }
	        }
	        if (Janus.safariVp8) {
	          Janus.log("This version of Safari supports VP8");
	        } else {
	          Janus.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, " + "try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu");
	        }
	      } else {
	        // We do it in a very ugly way, as there's no alternative...
	        // We create a PeerConnection to see if VP8 is in an offer
	        var testpc = new RTCPeerConnection({}, {});
	        testpc.createOffer({
	          offerToReceiveVideo: true
	        }).then(function (offer) {
	          Janus.safariVp8 = offer.sdp.indexOf("VP8") !== -1;
	          if (Janus.safariVp8) {
	            Janus.log("This version of Safari supports VP8");
	          } else {
	            Janus.warn("This version of Safari does NOT support VP8: if you're using a Technology Preview, " + "try enabling the 'WebRTC VP8 codec' setting in the 'Experimental Features' Develop menu");
	          }
	          testpc.close();
	          testpc = null;
	        });
	      }
	    }
	    // Check if this browser supports Unified Plan and transceivers
	    // Based on https://codepen.io/anon/pen/ZqLwWV?editors=0010
	    Janus.unifiedPlan = false;
	    if (Janus.webRTCAdapter.browserDetails.browser === 'firefox' && Janus.webRTCAdapter.browserDetails.version >= 59) {
	      // Firefox definitely does, starting from version 59
	      Janus.unifiedPlan = true;
	    } else if (Janus.webRTCAdapter.browserDetails.browser === 'chrome' && Janus.webRTCAdapter.browserDetails.version < 72) {
	      // Chrome does, but it's only usable from version 72 on
	      Janus.unifiedPlan = false;
	    } else if (!('currentDirection' in RTCRtpTransceiver.prototype)) {
	      // Safari supports addTransceiver() but not Unified Plan when
	      // currentDirection is not defined (see codepen above)
	      Janus.unifiedPlan = false;
	    } else {
	      // Check if addTransceiver() throws an exception
	      const tempPc = new RTCPeerConnection();
	      try {
	        tempPc.addTransceiver('audio');
	        Janus.unifiedPlan = true;
	      } catch (e) {}
	      tempPc.close();
	    }
	    Janus.initDone = true;
	    options.callback();
	  }
	};

	// Helper method to check whether WebRTC is supported by this browser
	Janus.isWebrtcSupported = function () {
	  return window.RTCPeerConnection !== undefined && window.RTCPeerConnection !== null;
	};
	// Helper method to check whether devices can be accessed by this browser (e.g., not possible via plain HTTP)
	Janus.isGetUserMediaAvailable = function () {
	  return navigator.mediaDevices !== undefined && navigator.mediaDevices !== null && navigator.mediaDevices.getUserMedia !== undefined && navigator.mediaDevices.getUserMedia !== null;
	};

	// Helper method to create random identifiers (e.g., transaction)
	Janus.randomString = function (len) {
	  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  var randomString = '';
	  for (var i = 0; i < len; i++) {
	    var randomPoz = Math.floor(Math.random() * charSet.length);
	    randomString += charSet.substring(randomPoz, randomPoz + 1);
	  }
	  return randomString;
	};
	function Janus(gatewayCallbacks, requestOpt) {
	  if (Janus.initDone === undefined) {
	    gatewayCallbacks.error("Library not initialized");
	    return {};
	  }
	  if (!Janus.isWebrtcSupported()) {
	    gatewayCallbacks.error("WebRTC not supported by this browser");
	    return {};
	  }
	  Janus.log("Library initialized: " + Janus.initDone);
	  gatewayCallbacks = gatewayCallbacks || {};
	  gatewayCallbacks.success = typeof gatewayCallbacks.success == "function" ? gatewayCallbacks.success : Janus.noop;
	  gatewayCallbacks.error = typeof gatewayCallbacks.error == "function" ? gatewayCallbacks.error : Janus.noop;
	  gatewayCallbacks.destroyed = typeof gatewayCallbacks.destroyed == "function" ? gatewayCallbacks.destroyed : Janus.noop;
	  if (gatewayCallbacks.server === null || gatewayCallbacks.server === undefined) {
	    gatewayCallbacks.error("Invalid server url");
	    return {};
	  }
	  var websockets = false;
	  var ws = null;
	  var wsHandlers = {};
	  var wsKeepaliveTimeoutId = null;
	  var servers = null,
	    serversIndex = 0;
	  var server = gatewayCallbacks.server;
	  if (Janus.isArray(server)) {
	    Janus.log("Multiple servers provided (" + server.length + "), will use the first that works");
	    server = null;
	    servers = gatewayCallbacks.server;
	    Janus.debug(servers);
	  } else {
	    if (server.indexOf("ws") === 0) {
	      websockets = true;
	      Janus.log("Using WebSockets to contact Janus: " + server);
	    } else {
	      websockets = false;
	      Janus.log("Using REST API to contact Janus: " + server);
	    }
	  }
	  var iceServers = gatewayCallbacks.iceServers;
	  if (iceServers === undefined || iceServers === null) iceServers = [{
	    urls: "stun:stun.l.google.com:19302"
	  }];
	  var iceTransportPolicy = gatewayCallbacks.iceTransportPolicy;
	  var bundlePolicy = gatewayCallbacks.bundlePolicy;
	  // Whether IPv6 candidates should be gathered
	  var ipv6Support = gatewayCallbacks.ipv6;
	  if (ipv6Support === undefined || ipv6Support === null) ipv6Support = false;
	  // Whether we should enable the withCredentials flag for XHR requests
	  var withCredentials = false;
	  if (gatewayCallbacks.withCredentials !== undefined && gatewayCallbacks.withCredentials !== null) withCredentials = gatewayCallbacks.withCredentials === true;
	  // Optional max events
	  var maxev = 10;
	  if (gatewayCallbacks.max_poll_events !== undefined && gatewayCallbacks.max_poll_events !== null) maxev = gatewayCallbacks.max_poll_events;
	  if (maxev < 1) maxev = 1;
	  // Token to use (only if the token based authentication mechanism is enabled)
	  var token = null;
	  if (gatewayCallbacks.token !== undefined && gatewayCallbacks.token !== null) token = gatewayCallbacks.token;
	  // API secret to use (only if the shared API secret is enabled)
	  var apisecret = null;
	  if (gatewayCallbacks.apisecret !== undefined && gatewayCallbacks.apisecret !== null) apisecret = gatewayCallbacks.apisecret;
	  // Whether we should destroy this session when onbeforeunload is called
	  this.destroyOnUnload = true;
	  if (gatewayCallbacks.destroyOnUnload !== undefined && gatewayCallbacks.destroyOnUnload !== null) this.destroyOnUnload = gatewayCallbacks.destroyOnUnload === true;
	  // Some timeout-related values
	  var keepAlivePeriod = 25000;
	  if (gatewayCallbacks.keepAlivePeriod !== undefined && gatewayCallbacks.keepAlivePeriod !== null) keepAlivePeriod = gatewayCallbacks.keepAlivePeriod;
	  if (isNaN(keepAlivePeriod)) keepAlivePeriod = 25000;
	  var longPollTimeout = 60000;
	  if (gatewayCallbacks.longPollTimeout !== undefined && gatewayCallbacks.longPollTimeout !== null) longPollTimeout = gatewayCallbacks.longPollTimeout;
	  if (isNaN(longPollTimeout)) longPollTimeout = 60000;

	  // overrides for default maxBitrate values for simulcasting
	  function getMaxBitrates(simulcastMaxBitrates) {
	    var maxBitrates = {
	      high: 900000,
	      medium: 300000,
	      low: 100000
	    };
	    if (simulcastMaxBitrates !== undefined && simulcastMaxBitrates !== null) {
	      if (simulcastMaxBitrates.high) maxBitrates.high = simulcastMaxBitrates.high;
	      if (simulcastMaxBitrates.medium) maxBitrates.medium = simulcastMaxBitrates.medium;
	      // 如果high的值小于medium的值，那么medium的值就等于high的值
	      if (simulcastMaxBitrates.high && simulcastMaxBitrates.high < simulcastMaxBitrates.medium) {
	        maxBitrates.medium = simulcastMaxBitrates.high;
	      }
	      if (simulcastMaxBitrates.low) maxBitrates.low = simulcastMaxBitrates.low;
	    }
	    return maxBitrates;
	  }
	  var connected = false;
	  var sessionId = null;
	  var pluginHandles = {};
	  var that = this;
	  var retries = 0;
	  var transactions = {};
	  createSession(gatewayCallbacks);

	  // Public methods
	  this.getServer = function () {
	    return server;
	  };
	  this.isConnected = function () {
	    return connected;
	  };
	  this.reconnect = function (callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    callbacks["reconnect"] = true;
	    createSession(callbacks);
	  };
	  this.getSessionId = function () {
	    return sessionId;
	  };
	  this.destroy = function (callbacks) {
	    destroySession(callbacks);
	  };
	  this.attach = function (callbacks) {
	    createHandle(callbacks);
	  };
	  function eventHandler() {
	    if (sessionId == null) return;
	    Janus.debug('Long poll...');
	    if (!connected) {
	      Janus.warn("Is the server down? (connected=false)");
	      return;
	    }
	    var longpoll = server + "/" + sessionId + "?rid=" + new Date().getTime();
	    if (maxev !== undefined && maxev !== null) longpoll = longpoll + "&maxev=" + maxev;
	    if (token !== null && token !== undefined) longpoll = longpoll + "&token=" + encodeURIComponent(token);
	    if (apisecret !== null && apisecret !== undefined) longpoll = longpoll + "&apisecret=" + encodeURIComponent(apisecret);
	    Janus.httpAPICall(longpoll, {
	      verb: 'GET',
	      withCredentials: withCredentials,
	      success: handleEvent,
	      timeout: longPollTimeout,
	      error: function (textStatus, errorThrown) {
	        Janus.error(textStatus + ":", errorThrown);
	        retries++;
	        if (retries > 3) {
	          // Did we just lose the server? :-(
	          connected = false;
	          gatewayCallbacks.error("Lost connection to the server (is it down?)");
	          return;
	        }
	        eventHandler();
	      }
	    });
	  }

	  // Private event handler: this will trigger plugin callbacks, if set
	  function handleEvent(json, skipTimeout) {
	    retries = 0;
	    if (!websockets && sessionId !== undefined && sessionId !== null && skipTimeout !== true) eventHandler();
	    if (!websockets && Janus.isArray(json)) {
	      // We got an array: it means we passed a maxev > 1, iterate on all objects
	      for (var i = 0; i < json.length; i++) {
	        handleEvent(json[i], true);
	      }
	      return;
	    }
	    if (json["rtcgw"] === "keepalive") {
	      // Nothing happened
	      Janus.vdebug("Got a keepalive on session " + sessionId);
	      return;
	    } else if (json["rtcgw"] === "ack") {
	      // Just an ack, we can probably ignore
	      Janus.debug("Got an ack on session " + sessionId);
	      Janus.debug(json);
	      var transaction = json["transaction"];
	      if (transaction !== null && transaction !== undefined) {
	        var reportSuccess = transactions[transaction];
	        if (reportSuccess !== null && reportSuccess !== undefined) {
	          reportSuccess(json);
	        }
	        delete transactions[transaction];
	      }
	      return;
	    } else if (json["rtcgw"] === "success") {
	      // Success!
	      Janus.debug("Got a success on session " + sessionId);
	      Janus.debug(json);
	      var transaction = json["transaction"];
	      if (transaction !== null && transaction !== undefined) {
	        var reportSuccess = transactions[transaction];
	        if (reportSuccess !== null && reportSuccess !== undefined) {
	          reportSuccess(json);
	        }
	        delete transactions[transaction];
	      }
	      return;
	    } else if (json["rtcgw"] === "trickle") {
	      // We got a trickle candidate from Janus
	      var sender = json["sender"];
	      if (sender === undefined || sender === null) {
	        Janus.warn("Missing sender...");
	        return;
	      }
	      var pluginHandle = pluginHandles[sender];
	      if (pluginHandle === undefined || pluginHandle === null) {
	        Janus.debug("This handle is not attached to this session");
	        return;
	      }
	      var candidate = json["candidate"];
	      Janus.debug("Got a trickled candidate on session " + sessionId);
	      Janus.debug(candidate);
	      var config = pluginHandle.webrtcStuff;
	      if (config.pc && config.remoteSdp) {
	        // Add candidate right now
	        Janus.log("Adding remote candidate:", candidate);
	        if (!candidate || candidate.completed === true) {
	          // end-of-candidates
	          config.pc.addIceCandidate(Janus.endOfCandidates);
	        } else {
	          // New candidate
	          config.pc.addIceCandidate(candidate);
	        }
	      } else {
	        // We didn't do setRemoteDescription (trickle got here before the offer?)
	        Janus.debug("We didn't do setRemoteDescription (trickle got here before the offer?), caching candidate");
	        if (!config.candidates) config.candidates = [];
	        config.candidates.push(candidate);
	        Janus.debug(config.candidates);
	      }
	    } else if (json["rtcgw"] === "webrtcup") {
	      // The PeerConnection with the server is up! Notify this
	      Janus.debug("Got a webrtcup event on session " + sessionId);
	      Janus.debug(json);
	      var sender = json["sender"];
	      if (sender === undefined || sender === null) {
	        Janus.warn("Missing sender...");
	        return;
	      }
	      var pluginHandle = pluginHandles[sender];
	      if (pluginHandle === undefined || pluginHandle === null) {
	        Janus.debug("This handle is not attached to this session");
	        return;
	      }
	      pluginHandle.webrtcState(true);
	      return;
	    } else if (json["rtcgw"] === "hangup") {
	      // A plugin asked the core to hangup a PeerConnection on one of our handles
	      Janus.debug("Got a hangup event on session " + sessionId);
	      Janus.debug(json);
	      var sender = json["sender"];
	      if (sender === undefined || sender === null) {
	        Janus.warn("Missing sender...");
	        return;
	      }
	      var pluginHandle = pluginHandles[sender];
	      if (pluginHandle === undefined || pluginHandle === null) {
	        Janus.debug("This handle is not attached to this session");
	        return;
	      }
	      pluginHandle.webrtcState(false, json["reason"]);
	      pluginHandle.hangup();
	    } else if (json["rtcgw"] === "detached") {
	      // A plugin asked the core to detach one of our handles
	      Janus.debug("Got a detached event on session " + sessionId);
	      Janus.debug(json);
	      var sender = json["sender"];
	      if (sender === undefined || sender === null) {
	        Janus.warn("Missing sender...");
	        return;
	      }
	      var pluginHandle = pluginHandles[sender];
	      if (pluginHandle === undefined || pluginHandle === null) {
	        // Don't warn here because destroyHandle causes this situation.
	        return;
	      }
	      pluginHandle.detached = true;
	      pluginHandle.ondetached();
	      pluginHandle.detach();
	    } else if (json["rtcgw"] === "media") {
	      // Media started/stopped flowing
	      Janus.debug("Got a media event on session " + sessionId);
	      Janus.debug(json);
	      var sender = json["sender"];
	      if (sender === undefined || sender === null) {
	        Janus.warn("Missing sender...");
	        return;
	      }
	      var pluginHandle = pluginHandles[sender];
	      if (pluginHandle === undefined || pluginHandle === null) {
	        Janus.debug("This handle is not attached to this session");
	        return;
	      }
	      pluginHandle.mediaState(json["type"], json["receiving"]);
	    } else if (json["rtcgw"] === "slowlink") {
	      Janus.debug("Got a slowlink event on session " + sessionId);
	      // Trouble uplink or downlink
	      var sender = json["sender"];
	      if (sender === undefined || sender === null) {
	        Janus.warn("Missing sender...");
	        return;
	      }
	      var pluginHandle = pluginHandles[sender];
	      if (pluginHandle === undefined || pluginHandle === null) {
	        Janus.debug("This handle is not attached to this session");
	        return;
	      }
	      pluginHandle.slowLink(json["uplink"], json["lost"]);
	    } else if (json["rtcgw"] === "error") {
	      // Oops, something wrong happened
	      Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	      Janus.debug(json);
	      var transaction = json["transaction"];
	      if (transaction !== null && transaction !== undefined) {
	        var reportSuccess = transactions[transaction];
	        if (reportSuccess !== null && reportSuccess !== undefined) {
	          reportSuccess(json);
	        }
	        delete transactions[transaction];
	      }
	      return;
	    } else if (json["rtcgw"] === "event") {
	      Janus.debug("Got a plugin event on session " + sessionId);
	      Janus.debug(json);
	      var sender = json["sender"];
	      if (sender === undefined || sender === null) {
	        Janus.warn("Missing sender...");
	        return;
	      }
	      var plugindata = json["plugindata"];
	      if (plugindata === undefined || plugindata === null) {
	        Janus.warn("Missing plugindata...");
	        return;
	      }
	      Janus.debug("  -- Event is coming from " + sender + " (" + plugindata["plugin"] + ")");
	      var data = plugindata["data"];
	      Janus.debug(data);
	      var pluginHandle = pluginHandles[sender];
	      if (pluginHandle === undefined || pluginHandle === null) {
	        Janus.warn("This handle is not attached to this session");
	        return;
	      }
	      var jsep = json["jsep"];
	      if (jsep !== undefined && jsep !== null) {
	        Janus.debug("Handling SDP as well...");
	        Janus.debug(jsep);
	      }
	      var callback = pluginHandle.onmessage;
	      if (callback !== null && callback !== undefined) {
	        Janus.debug("Notifying application...");
	        // Send to callback specified when attaching plugin handle
	        callback(data, jsep);
	      } else {
	        // Send to generic callback (?)
	        Janus.debug("No provided notification callback");
	      }
	    } else if (json["rtcgw"] === "timeout") {
	      Janus.error("Timeout on session " + sessionId);
	      Janus.debug(json);
	      if (websockets) {
	        ws.close(3504, "Gateway timeout");
	      }
	      return;
	    } else {
	      Janus.warn("Unknown message/event  '" + json["rtcgw"] + "' on session " + sessionId);
	      Janus.debug(json);
	    }
	  }

	  // Private helper to send keep-alive messages on WebSockets
	  function keepAlive() {
	    if (server === null || !websockets || !connected) return;
	    wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
	    var request = {
	      "rtcgw": "keepalive",
	      "session_id": sessionId,
	      "transaction": Janus.randomString(12)
	    };
	    if (token !== null && token !== undefined) request["token"] = token;
	    if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	    ws.send(JSON.stringify(request));
	  }

	  // Private method to create a session
	  function createSession(callbacks) {
	    var transaction = Janus.randomString(12);
	    // var request = { "rtcgw": "create", "transaction": transaction, "token": "testtoken", "device": "deviceserial", "channel": 1 };
	    var request = {
	      "rtcgw": "create",
	      "transaction": transaction,
	      "token": "testtoken"
	    };
	    request = Object.assign({}, request, requestOpt);
	    if (callbacks["reconnect"]) {
	      // We're reconnecting, claim the session
	      connected = false;
	      request["rtcgw"] = "claim";
	      request["session_id"] = sessionId;
	      // If we were using websockets, ignore the old connection
	      if (ws) {
	        ws.onopen = null;
	        ws.onerror = null;
	        ws.onclose = null;
	        if (wsKeepaliveTimeoutId) {
	          clearTimeout(wsKeepaliveTimeoutId);
	          wsKeepaliveTimeoutId = null;
	        }
	      }
	    }
	    if (token !== null && token !== undefined) request["token"] = token;
	    if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	    if (server === null && Janus.isArray(servers)) {
	      // We still need to find a working server from the list we were given
	      server = servers[serversIndex];
	      if (server.indexOf("ws") === 0) {
	        websockets = true;
	        Janus.log("Server #" + (serversIndex + 1) + ": trying WebSockets to contact Janus (" + server + ")");
	      } else {
	        websockets = false;
	        Janus.log("Server #" + (serversIndex + 1) + ": trying REST API to contact Janus (" + server + ")");
	      }
	    }
	    if (websockets) {
	      ws = Janus.newWebSocket(server, 'rtcgw-protocol');
	      wsHandlers = {
	        'error': function () {
	          Janus.error("Error connecting to the Janus WebSockets server... " + server);
	          if (Janus.isArray(servers) && !callbacks["reconnect"]) {
	            serversIndex++;
	            if (serversIndex == servers.length) {
	              // We tried all the servers the user gave us and they all failed
	              callbacks.error("Error connecting to any of the provided Janus servers: Is the server down?");
	              return;
	            }
	            // Let's try the next server
	            server = null;
	            setTimeout(function () {
	              createSession(callbacks);
	            }, 200);
	            return;
	          }
	          callbacks.error("Error connecting to the Janus WebSockets server: Is the server down?");
	        },
	        'open': function () {
	          // We need to be notified about the success
	          transactions[transaction] = function (json) {
	            Janus.debug(json);
	            if (json["rtcgw"] !== "success") {
	              Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	              callbacks.error(json["error"].reason);
	              return;
	            }
	            wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
	            connected = true;
	            sessionId = json["session_id"] ? json["session_id"] : json.data["id"];
	            if (callbacks["reconnect"]) {
	              Janus.log("Claimed session: " + sessionId);
	            } else {
	              Janus.log("Created session: " + sessionId);
	            }
	            Janus.sessions[sessionId] = that;
	            callbacks.success(sessionId);
	          };
	          ws.send(JSON.stringify(request));
	        },
	        'message': function (event) {
	          handleEvent(JSON.parse(event.data));
	        },
	        'close': function () {
	          if (server === null || !connected) {
	            return;
	          }
	          connected = false;

	          // FIXME What if this is called when the page is closed?
	          gatewayCallbacks.error("Lost connection to the server");
	        }
	      };
	      for (var eventName in wsHandlers) {
	        ws.addEventListener(eventName, wsHandlers[eventName]);
	      }
	      return;
	    }
	    Janus.httpAPICall(server, {
	      verb: 'POST',
	      withCredentials: withCredentials,
	      body: request,
	      success: function (json) {
	        Janus.debug(json);
	        if (json["rtcgw"] !== "success") {
	          Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	          callbacks.error(json["error"].reason);
	          return;
	        }
	        connected = true;
	        sessionId = json["session_id"] ? json["session_id"] : json.data["id"];
	        if (callbacks["reconnect"]) {
	          Janus.log("Claimed session: " + sessionId);
	        } else {
	          Janus.log("Created session: " + sessionId);
	        }
	        Janus.sessions[sessionId] = that;
	        eventHandler();
	        callbacks.success();
	      },
	      error: function (textStatus, errorThrown) {
	        Janus.error(textStatus + ":", errorThrown); // FIXME
	        if (Janus.isArray(servers) && !callbacks["reconnect"]) {
	          serversIndex++;
	          if (serversIndex == servers.length) {
	            // We tried all the servers the user gave us and they all failed
	            callbacks.error("Error connecting to any of the provided Janus servers: Is the server down?");
	            return;
	          }
	          // Let's try the next server
	          server = null;
	          setTimeout(function () {
	            createSession(callbacks);
	          }, 200);
	          return;
	        }
	        if (errorThrown === "") callbacks.error(textStatus + ": Is the server down?");else callbacks.error(textStatus + ": " + errorThrown);
	      }
	    });
	  }

	  // Private method to destroy a session
	  function destroySession(callbacks) {
	    callbacks = callbacks || {};
	    // FIXME This method triggers a success even when we fail
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    var asyncRequest = true;
	    if (callbacks.asyncRequest !== undefined && callbacks.asyncRequest !== null) asyncRequest = callbacks.asyncRequest === true;
	    var notifyDestroyed = true;
	    if (callbacks.notifyDestroyed !== undefined && callbacks.notifyDestroyed !== null) notifyDestroyed = callbacks.notifyDestroyed === true;
	    var cleanupHandles = false;
	    if (callbacks.cleanupHandles !== undefined && callbacks.cleanupHandles !== null) cleanupHandles = callbacks.cleanupHandles === true;
	    Janus.log("Destroying session " + sessionId + " (async=" + asyncRequest + ")");
	    if (!connected) {
	      Janus.warn("Is the server down? (connected=false)");
	      callbacks.success();
	      return;
	    }
	    if (sessionId === undefined || sessionId === null) {
	      Janus.warn("No session to destroy");
	      callbacks.success();
	      if (notifyDestroyed) gatewayCallbacks.destroyed();
	      return;
	    }
	    if (cleanupHandles) {
	      for (var handleId in pluginHandles) destroyHandle(handleId, {
	        noRequest: true
	      });
	    }
	    // No need to destroy all handles first, Janus will do that itself
	    var request = {
	      "rtcgw": "destroy",
	      "transaction": Janus.randomString(12)
	    };
	    if (token !== null && token !== undefined) request["token"] = token;
	    if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	    if (websockets) {
	      request["session_id"] = sessionId;
	      var unbindWebSocket = function () {
	        for (var eventName in wsHandlers) {
	          ws.removeEventListener(eventName, wsHandlers[eventName]);
	        }
	        ws.removeEventListener('message', onUnbindMessage);
	        ws.removeEventListener('error', onUnbindError);
	        if (wsKeepaliveTimeoutId) {
	          clearTimeout(wsKeepaliveTimeoutId);
	        }
	        ws.close();
	      };
	      var onUnbindMessage = function (event) {
	        var data = JSON.parse(event.data);
	        if (data.session_id == request.session_id && data.transaction == request.transaction) {
	          unbindWebSocket();
	          callbacks.success();
	          if (notifyDestroyed) gatewayCallbacks.destroyed();
	        }
	      };
	      var onUnbindError = function (event) {
	        unbindWebSocket();
	        callbacks.error("Failed to destroy the server: Is the server down?");
	        if (notifyDestroyed) gatewayCallbacks.destroyed();
	      };
	      ws.addEventListener('message', onUnbindMessage);
	      ws.addEventListener('error', onUnbindError);
	      ws.send(JSON.stringify(request));
	      return;
	    }
	    Janus.httpAPICall(server + "/" + sessionId, {
	      verb: 'POST',
	      async: asyncRequest,
	      // Sometimes we need false here, or destroying in onbeforeunload won't work
	      withCredentials: withCredentials,
	      body: request,
	      success: function (json) {
	        Janus.log("Destroyed session:");
	        Janus.debug(json);
	        sessionId = null;
	        connected = false;
	        if (json["rtcgw"] !== "success") {
	          Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	        }
	        callbacks.success();
	        if (notifyDestroyed) gatewayCallbacks.destroyed();
	      },
	      error: function (textStatus, errorThrown) {
	        Janus.error(textStatus + ":", errorThrown); // FIXME
	        // Reset everything anyway
	        sessionId = null;
	        connected = false;
	        callbacks.success();
	        if (notifyDestroyed) gatewayCallbacks.destroyed();
	        pluginHandlesp;
	      }
	    });
	  }

	  // Private method to create a plugin handle
	  function createHandle(callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    callbacks.consentDialog = typeof callbacks.consentDialog == "function" ? callbacks.consentDialog : Janus.noop;
	    callbacks.iceState = typeof callbacks.iceState == "function" ? callbacks.iceState : Janus.noop;
	    callbacks.mediaState = typeof callbacks.mediaState == "function" ? callbacks.mediaState : Janus.noop;
	    callbacks.webrtcState = typeof callbacks.webrtcState == "function" ? callbacks.webrtcState : Janus.noop;
	    callbacks.slowLink = typeof callbacks.slowLink == "function" ? callbacks.slowLink : Janus.noop;
	    callbacks.onmessage = typeof callbacks.onmessage == "function" ? callbacks.onmessage : Janus.noop;
	    callbacks.onlocalstream = typeof callbacks.onlocalstream == "function" ? callbacks.onlocalstream : Janus.noop;
	    callbacks.onremotestream = typeof callbacks.onremotestream == "function" ? callbacks.onremotestream : Janus.noop;
	    callbacks.ondata = typeof callbacks.ondata == "function" ? callbacks.ondata : Janus.noop;
	    callbacks.ondataopen = typeof callbacks.ondataopen == "function" ? callbacks.ondataopen : Janus.noop;
	    callbacks.oncleanup = typeof callbacks.oncleanup == "function" ? callbacks.oncleanup : Janus.noop;
	    callbacks.ondetached = typeof callbacks.ondetached == "function" ? callbacks.ondetached : Janus.noop;
	    if (!connected) {
	      Janus.warn("Is the server down? (connected=false)");
	      callbacks.error("Is the server down? (connected=false)");
	      return;
	    }
	    var plugin = callbacks.plugin;
	    if (plugin === undefined || plugin === null) {
	      Janus.error("Invalid plugin");
	      callbacks.error("Invalid plugin");
	      return;
	    }
	    var opaqueId = callbacks.opaqueId;
	    var handleToken = callbacks.token ? callbacks.token : token;
	    var transaction = Janus.randomString(12);
	    var request = {
	      "rtcgw": "attach",
	      "plugin": plugin,
	      "opaque_id": opaqueId,
	      "transaction": transaction
	    };
	    if (handleToken !== null && handleToken !== undefined) request["token"] = handleToken;
	    if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	    if (websockets) {
	      transactions[transaction] = function (json) {
	        Janus.debug(json);
	        if (json["rtcgw"] !== "success") {
	          Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	          callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
	          return;
	        }
	        var handleId = json.data["id"];
	        Janus.log("Created handle: " + handleId);
	        var pluginHandle = {
	          session: that,
	          plugin: plugin,
	          id: handleId,
	          token: handleToken,
	          detached: false,
	          webrtcStuff: {
	            started: false,
	            myStream: null,
	            streamExternal: false,
	            remoteStream: null,
	            mySdp: null,
	            mediaConstraints: null,
	            pc: null,
	            dataChannel: {},
	            dtmfSender: null,
	            trickle: true,
	            iceDone: false,
	            volume: {
	              value: null,
	              timer: null
	            },
	            bitrate: {
	              value: null,
	              bsnow: null,
	              bsbefore: null,
	              tsnow: null,
	              tsbefore: null,
	              timer: null
	            }
	          },
	          listenList: [],
	          getId: function () {
	            return handleId;
	          },
	          getPlugin: function () {
	            return plugin;
	          },
	          getVolume: function () {
	            return getVolume(handleId, true);
	          },
	          getRemoteVolume: function () {
	            return getVolume(handleId, true);
	          },
	          getLocalVolume: function () {
	            return getVolume(handleId, false);
	          },
	          isAudioMuted: function () {
	            return isMuted(handleId, false);
	          },
	          muteAudio: function () {
	            return mute(handleId, false, true);
	          },
	          unmuteAudio: function () {
	            return mute(handleId, false, false);
	          },
	          isVideoMuted: function () {
	            return isMuted(handleId, true);
	          },
	          muteVideo: function () {
	            return mute(handleId, true, true);
	          },
	          unmuteVideo: function () {
	            return mute(handleId, true, false);
	          },
	          getBitrate: function () {
	            return getBitrate(handleId);
	          },
	          getNetworkQuality: function (handleId, callbacks) {
	            getNetworkQuality(handleId, callbacks);
	          },
	          messageListen: function (key, fn) {
	            messageListen(handleId, key, fn);
	          },
	          messageTrigger: function (key, data) {
	            messageTrigger(handleId, key, data);
	          },
	          send: function (callbacks) {
	            sendMessage(handleId, callbacks);
	          },
	          data: function (callbacks) {
	            sendData(handleId, callbacks);
	          },
	          dtmf: function (callbacks) {
	            sendDtmf(handleId, callbacks);
	          },
	          consentDialog: callbacks.consentDialog,
	          iceState: callbacks.iceState,
	          mediaState: callbacks.mediaState,
	          webrtcState: callbacks.webrtcState,
	          slowLink: callbacks.slowLink,
	          onmessage: callbacks.onmessage,
	          createOffer: function (callbacks) {
	            prepareWebrtc(handleId, true, callbacks);
	          },
	          createAnswer: function (callbacks) {
	            prepareWebrtc(handleId, false, callbacks);
	          },
	          handleRemoteJsep: function (callbacks) {
	            prepareWebrtcPeer(handleId, callbacks);
	          },
	          onlocalstream: callbacks.onlocalstream,
	          onremotestream: callbacks.onremotestream,
	          ondata: callbacks.ondata,
	          ondataopen: callbacks.ondataopen,
	          oncleanup: callbacks.oncleanup,
	          ondetached: callbacks.ondetached,
	          hangup: function (sendRequest) {
	            cleanupWebrtc(handleId, sendRequest === true);
	          },
	          detach: function (callbacks) {
	            destroyHandle(handleId, callbacks);
	          }
	        };
	        pluginHandles[handleId] = pluginHandle;
	        callbacks.success(pluginHandle);
	      };
	      request["session_id"] = sessionId;
	      ws.send(JSON.stringify(request));
	      return;
	    }
	    Janus.httpAPICall(server + "/" + sessionId, {
	      verb: 'POST',
	      withCredentials: withCredentials,
	      body: request,
	      success: function (json) {
	        Janus.debug(json);
	        if (json["rtcgw"] !== "success") {
	          Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	          callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
	          return;
	        }
	        var handleId = json.data["id"];
	        Janus.log("Created handle: " + handleId);
	        var pluginHandle = {
	          session: that,
	          plugin: plugin,
	          id: handleId,
	          token: handleToken,
	          detached: false,
	          webrtcStuff: {
	            started: false,
	            myStream: null,
	            streamExternal: false,
	            remoteStream: null,
	            mySdp: null,
	            mediaConstraints: null,
	            pc: null,
	            dataChannel: {},
	            dtmfSender: null,
	            trickle: true,
	            iceDone: false,
	            volume: {
	              value: null,
	              timer: null
	            },
	            bitrate: {
	              value: null,
	              bsnow: null,
	              bsbefore: null,
	              tsnow: null,
	              tsbefore: null,
	              timer: null
	            }
	          },
	          listenList: [],
	          getId: function () {
	            return handleId;
	          },
	          getPlugin: function () {
	            return plugin;
	          },
	          getVolume: function () {
	            return getVolume(handleId, true);
	          },
	          getRemoteVolume: function () {
	            return getVolume(handleId, true);
	          },
	          getLocalVolume: function () {
	            return getVolume(handleId, false);
	          },
	          isAudioMuted: function () {
	            return isMuted(handleId, false);
	          },
	          muteAudio: function () {
	            return mute(handleId, false, true);
	          },
	          unmuteAudio: function () {
	            return mute(handleId, false, false);
	          },
	          isVideoMuted: function () {
	            return isMuted(handleId, true);
	          },
	          muteVideo: function () {
	            return mute(handleId, true, true);
	          },
	          unmuteVideo: function () {
	            return mute(handleId, true, false);
	          },
	          getBitrate: function () {
	            return getBitrate(handleId);
	          },
	          getNetworkQuality: function (callbacks) {
	            getNetworkQuality(handleId, callbacks);
	          },
	          messageListen: function (key, fn) {
	            messageListen(handleId, key, fn);
	          },
	          messageTrigger: function (key, data) {
	            messageTrigger(handleId, key, data);
	          },
	          send: function (callbacks) {
	            sendMessage(handleId, callbacks);
	          },
	          data: function (callbacks) {
	            sendData(handleId, callbacks);
	          },
	          dtmf: function (callbacks) {
	            sendDtmf(handleId, callbacks);
	          },
	          consentDialog: callbacks.consentDialog,
	          iceState: callbacks.iceState,
	          mediaState: callbacks.mediaState,
	          webrtcState: callbacks.webrtcState,
	          slowLink: callbacks.slowLink,
	          onmessage: callbacks.onmessage,
	          createOffer: function (callbacks) {
	            prepareWebrtc(handleId, true, callbacks);
	          },
	          createAnswer: function (callbacks) {
	            prepareWebrtc(handleId, false, callbacks);
	          },
	          handleRemoteJsep: function (callbacks) {
	            prepareWebrtcPeer(handleId, callbacks);
	          },
	          onlocalstream: callbacks.onlocalstream,
	          onremotestream: callbacks.onremotestream,
	          ondata: callbacks.ondata,
	          ondataopen: callbacks.ondataopen,
	          oncleanup: callbacks.oncleanup,
	          ondetached: callbacks.ondetached,
	          hangup: function (sendRequest) {
	            cleanupWebrtc(handleId, sendRequest === true);
	          },
	          detach: function (callbacks) {
	            destroyHandle(handleId, callbacks);
	          }
	        };
	        pluginHandles[handleId] = pluginHandle;
	        callbacks.success(pluginHandle);
	      },
	      error: function (textStatus, errorThrown) {
	        Janus.error(textStatus + ":", errorThrown); // FIXME
	      }
	    });
	  }

	  // Private method to send a message
	  function sendMessage(handleId, callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    if (!connected) {
	      Janus.warn("Is the server down? (connected=false)");
	      callbacks.error("Is the server down? (connected=false)");
	      return;
	    }
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var message = callbacks.message;
	    var jsep = callbacks.jsep;
	    var transaction = Janus.randomString(12);
	    var request = {
	      "rtcgw": "message",
	      "body": message,
	      "transaction": transaction
	    };
	    if (pluginHandle.token !== null && pluginHandle.token !== undefined) request["token"] = pluginHandle.token;
	    if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	    if (jsep !== null && jsep !== undefined) request.jsep = jsep;
	    Janus.debug("Sending message to plugin (handle=" + handleId + "):");
	    Janus.debug(request);
	    if (websockets) {
	      request["session_id"] = sessionId;
	      request["handle_id"] = handleId;
	      transactions[transaction] = function (json) {
	        Janus.debug("Message sent!");
	        Janus.debug(json);
	        if (json["rtcgw"] === "success") {
	          // We got a success, must have been a synchronous transaction
	          var plugindata = json["plugindata"];
	          if (plugindata === undefined || plugindata === null) {
	            Janus.warn("Request succeeded, but missing plugindata...");
	            callbacks.success();
	            return;
	          }
	          Janus.log("Synchronous transaction successful (" + plugindata["plugin"] + ")");
	          var data = plugindata["data"];
	          Janus.debug(data);
	          callbacks.success(data);
	          return;
	        } else if (json["rtcgw"] !== "ack") {
	          // Not a success and not an ack, must be an error
	          if (json["error"] !== undefined && json["error"] !== null) {
	            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	            callbacks.error(json["error"].code + " " + json["error"].reason);
	          } else {
	            Janus.error("Unknown error"); // FIXME
	            callbacks.error("Unknown error");
	          }
	          return;
	        }
	        // If we got here, the plugin decided to handle the request asynchronously
	        callbacks.success();
	      };
	      ws.send(JSON.stringify(request));
	      return;
	    }
	    Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
	      verb: 'POST',
	      withCredentials: withCredentials,
	      body: request,
	      success: function (json) {
	        Janus.debug("Message sent!");
	        Janus.debug(json);
	        if (json["rtcgw"] === "success") {
	          // We got a success, must have been a synchronous transaction
	          var plugindata = json["plugindata"];
	          if (plugindata === undefined || plugindata === null) {
	            Janus.warn("Request succeeded, but missing plugindata...");
	            callbacks.success();
	            return;
	          }
	          Janus.log("Synchronous transaction successful (" + plugindata["plugin"] + ")");
	          var data = plugindata["data"];
	          Janus.debug(data);
	          callbacks.success(data);
	          return;
	        } else if (json["rtcgw"] !== "ack") {
	          // Not a success and not an ack, must be an error
	          if (json["error"] !== undefined && json["error"] !== null) {
	            Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	            callbacks.error(json["error"].code + " " + json["error"].reason);
	          } else {
	            Janus.error("Unknown error"); // FIXME
	            callbacks.error("Unknown error");
	          }
	          return;
	        }
	        // If we got here, the plugin decided to handle the request asynchronously
	        callbacks.success();
	      },
	      error: function (textStatus, errorThrown) {
	        Janus.error(textStatus + ":", errorThrown); // FIXME
	        callbacks.error(textStatus + ": " + errorThrown);
	      }
	    });
	  }

	  // Private method to send a trickle candidate
	  function sendTrickleCandidate(handleId, candidate) {
	    if (!connected) {
	      Janus.warn("Is the server down? (connected=false)");
	      return;
	    }
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      return;
	    }
	    var request = {
	      "rtcgw": "trickle",
	      "candidate": candidate,
	      "transaction": Janus.randomString(12)
	    };
	    if (pluginHandle.token !== null && pluginHandle.token !== undefined) request["token"] = pluginHandle.token;
	    if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	    Janus.vdebug("Sending trickle candidate (handle=" + handleId + "):");
	    Janus.vdebug(request);
	    if (websockets) {
	      request["session_id"] = sessionId;
	      request["handle_id"] = handleId;
	      ws.send(JSON.stringify(request));
	      return;
	    }
	    Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
	      verb: 'POST',
	      withCredentials: withCredentials,
	      body: request,
	      success: function (json) {
	        Janus.vdebug("Candidate sent!");
	        Janus.vdebug(json);
	        if (json["rtcgw"] !== "ack") {
	          Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	          return;
	        }
	      },
	      error: function (textStatus, errorThrown) {
	        Janus.error(textStatus + ":", errorThrown); // FIXME
	      }
	    });
	  }

	  // Private method to create a data channel
	  function createDataChannel(handleId, dclabel, incoming, pendingText) {
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    var onDataChannelMessage = function (event) {
	      Janus.log('Received message on data channel:', event);
	      var label = event.target.label;
	      pluginHandle.ondata(event.data, label);
	    };
	    var onDataChannelStateChange = function (event) {
	      Janus.log('Received state change on data channel:', event);
	      var label = event.target.label;
	      var dcState = config.dataChannel[label] ? config.dataChannel[label].readyState : "null";
	      Janus.log('State change on <' + label + '> data channel: ' + dcState);
	      if (dcState === 'open') {
	        // Any pending messages to send?
	        if (config.dataChannel[label].pending && config.dataChannel[label].pending.length > 0) {
	          Janus.log("Sending pending messages on <" + label + ">:", config.dataChannel[label].pending.length);
	          for (var i in config.dataChannel[label].pending) {
	            var text = config.dataChannel[label].pending[i];
	            Janus.log("Sending string on data channel <" + label + ">: " + text);
	            config.dataChannel[label].send(text);
	          }
	          config.dataChannel[label].pending = [];
	        }
	        // Notify the open data channel
	        pluginHandle.ondataopen(label);
	      }
	    };
	    var onDataChannelError = function (error) {
	      Janus.error('Got error on data channel:', error);
	      // TODO
	    };
	    if (!incoming) {
	      // FIXME Add options (ordered, maxRetransmits, etc.)
	      config.dataChannel[dclabel] = config.pc.createDataChannel(dclabel, {
	        ordered: false
	      });
	    } else {
	      // The channel was created by Janus
	      config.dataChannel[dclabel] = incoming;
	    }
	    config.dataChannel[dclabel].onmessage = onDataChannelMessage;
	    config.dataChannel[dclabel].onopen = onDataChannelStateChange;
	    config.dataChannel[dclabel].onclose = onDataChannelStateChange;
	    config.dataChannel[dclabel].onerror = onDataChannelError;
	    config.dataChannel[dclabel].pending = [];
	    if (pendingText) config.dataChannel[dclabel].pending.push(pendingText);
	  }

	  // Private method to send a data channel message
	  function sendData(handleId, callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    var text = callbacks.text;
	    if (text === null || text === undefined) {
	      Janus.warn("Invalid text");
	      callbacks.error("Invalid text");
	      return;
	    }
	    var label = callbacks.label ? callbacks.label : Janus.dataChanDefaultLabel;
	    if (!config.dataChannel[label]) {
	      // Create new data channel and wait for it to open
	      createDataChannel(handleId, label, false, text);
	      callbacks.success();
	      return;
	    }
	    if (config.dataChannel[label].readyState !== "open") {
	      config.dataChannel[label].pending.push(text);
	      callbacks.success();
	      return;
	    }
	    Janus.log("Sending string on data channel <" + label + ">: " + text);
	    config.dataChannel[label].send(text);
	    callbacks.success();
	  }

	  // Private method to send a DTMF tone
	  function sendDtmf(handleId, callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (config.dtmfSender === null || config.dtmfSender === undefined) {
	      // Create the DTMF sender the proper way, if possible
	      if (config.pc !== undefined && config.pc !== null) {
	        var senders = config.pc.getSenders();
	        var audioSender = senders.find(function (sender) {
	          return sender.track && sender.track.kind === 'audio';
	        });
	        if (!audioSender) {
	          Janus.warn("Invalid DTMF configuration (no audio track)");
	          callbacks.error("Invalid DTMF configuration (no audio track)");
	          return;
	        }
	        config.dtmfSender = audioSender.dtmf;
	        if (config.dtmfSender) {
	          Janus.log("Created DTMF Sender");
	          config.dtmfSender.ontonechange = function (tone) {
	            Janus.debug("Sent DTMF tone: " + tone.tone);
	          };
	        }
	      }
	      if (config.dtmfSender === null || config.dtmfSender === undefined) {
	        Janus.warn("Invalid DTMF configuration");
	        callbacks.error("Invalid DTMF configuration");
	        return;
	      }
	    }
	    var dtmf = callbacks.dtmf;
	    if (dtmf === null || dtmf === undefined) {
	      Janus.warn("Invalid DTMF parameters");
	      callbacks.error("Invalid DTMF parameters");
	      return;
	    }
	    var tones = dtmf.tones;
	    if (tones === null || tones === undefined) {
	      Janus.warn("Invalid DTMF string");
	      callbacks.error("Invalid DTMF string");
	      return;
	    }
	    var duration = dtmf.duration;
	    if (duration === null || duration === undefined) duration = 500; // We choose 500ms as the default duration for a tone
	    var gap = dtmf.gap;
	    if (gap === null || gap === undefined) gap = 50; // We choose 50ms as the default gap between tones
	    Janus.debug("Sending DTMF string " + tones + " (duration " + duration + "ms, gap " + gap + "ms)");
	    config.dtmfSender.insertDTMF(tones, duration, gap);
	    callbacks.success();
	  }

	  // Private method to destroy a plugin handle
	  function destroyHandle(handleId, callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    var asyncRequest = true;
	    if (callbacks.asyncRequest !== undefined && callbacks.asyncRequest !== null) asyncRequest = callbacks.asyncRequest === true;
	    let noRequest = callbacks.noRequest === true;
	    if (callbacks.noRequest !== undefined && callbacks.noRequest !== null) noRequest = callbacks.noRequest === true;
	    Janus.log("Destroying handle " + handleId + " (async=" + asyncRequest + ")");
	    cleanupWebrtc(handleId);
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.detached) {
	      // Plugin was already detached by Janus, calling detach again will return a handle not found error, so just exit here
	      delete pluginHandles[handleId];
	      callbacks.success();
	      return;
	    }
	    if (noRequest) {
	      // We're only removing the handle locally
	      delete pluginHandles[handleId];
	      callbacks.success();
	      return;
	    }
	    if (!connected) {
	      Janus.warn("Is the server down? (connected=false)");
	      callbacks.error("Is the server down? (connected=false)");
	      return;
	    }
	    var request = {
	      "rtcgw": "detach",
	      "transaction": Janus.randomString(12)
	    };
	    if (pluginHandle.token !== null && pluginHandle.token !== undefined) request["token"] = pluginHandle.token;
	    if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	    if (websockets) {
	      request["session_id"] = sessionId;
	      request["handle_id"] = handleId;
	      ws.send(JSON.stringify(request));
	      delete pluginHandles[handleId];
	      callbacks.success();
	      return;
	    }
	    Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
	      verb: 'POST',
	      async: asyncRequest,
	      // Sometimes we need false here, or destroying in onbeforeunload won't work
	      withCredentials: withCredentials,
	      body: request,
	      success: function (json) {
	        Janus.log("Destroyed handle:");
	        Janus.debug(json);
	        if (json["rtcgw"] !== "success") {
	          Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason); // FIXME
	        }
	        delete pluginHandles[handleId];
	        callbacks.success();
	      },
	      error: function (textStatus, errorThrown) {
	        Janus.error(textStatus + ":", errorThrown); // FIXME
	        // We cleanup anyway
	        delete pluginHandles[handleId];
	        callbacks.success();
	      }
	    });
	  }

	  // WebRTC stuff，创建webrtc连接，对媒体流进行配置，添加到连接中
	  async function streamsDone(handleId, jsep, media, callbacks, stream) {
	    Janus.debug("进入streamsDone函数");
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (stream) {
	      Janus.log("  -- Audio tracks:", stream.getAudioTracks());
	      Janus.log("  -- Video tracks:", stream.getVideoTracks());
	    }
	    // We're now capturing the new stream: check if we're updating or if it's a new thing
	    var addTracks = false;
	    var simulcast = callbacks.simulcast === true ? true : false;
	    const maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
	    //用于设置流的格式
	    const sendEncodingsItem = {
	      active: true,
	      scaleResolutionDownBy: 1
	    };
	    callbacks.bitrate && (sendEncodingsItem.maxBitrate = callbacks.bitrate);
	    callbacks.frameRate && (sendEncodingsItem.maxFramerate = callbacks.frameRate);
	    const sendEncodings = simulcast ? [{
	      ...sendEncodingsItem,
	      rid: "h",
	      priority: 'high',
	      maxBitrate: maxBitrates.high
	    }, {
	      ...sendEncodingsItem,
	      rid: "l",
	      priority: 'low',
	      maxBitrate: maxBitrates.low,
	      scaleResolutionDownBy: 4
	    }] : [sendEncodingsItem];
	    if (!config.myStream || !media.update || config.streamExternal) {
	      config.myStream = stream;
	      addTracks = true;
	    } else {
	      // We only need to update the existing stream
	      if ((!media.update && isAudioSendEnabled(media) || media.update && (media.addAudio || media.replaceAudio)) && stream.getAudioTracks() && stream.getAudioTracks().length) {
	        config.myStream.addTrack(stream.getAudioTracks()[0]);
	        if (Janus.unifiedPlan) {
	          // Use Transceivers
	          Janus.log((media.replaceAudio ? "Replacing" : "Adding") + " audio track:", stream.getAudioTracks()[0]);
	          var audioTransceiver = null;
	          var transceivers = config.pc.getTransceivers();
	          if (transceivers && transceivers.length > 0) {
	            for (var i in transceivers) {
	              var t = transceivers[i];
	              if (t.sender && t.sender.track && t.sender.track.kind === "audio" || t.receiver && t.receiver.track && t.receiver.track.kind === "audio") {
	                audioTransceiver = t;
	                break;
	              }
	            }
	          }
	          let transformedStream = null;
	          try {
	            transformedStream = await callbacks.customizeAudioTrack(stream); // 变声转换
	          } catch (error) {
	            callbacks.error(error);
	          }
	          if (audioTransceiver && audioTransceiver.sender) {
	            var _transformedStream, _transformedStream$ge;
	            audioTransceiver.sender.replaceTrack(((_transformedStream = transformedStream) === null || _transformedStream === void 0 || (_transformedStream$ge = _transformedStream.getAudioTracks) === null || _transformedStream$ge === void 0 || (_transformedStream$ge = _transformedStream$ge.call(_transformedStream)) === null || _transformedStream$ge === void 0 ? void 0 : _transformedStream$ge[0]) || stream.getAudioTracks()[0]);
	          } else {
	            var _transformedStream2, _transformedStream2$g;
	            config.pc.addTrack(((_transformedStream2 = transformedStream) === null || _transformedStream2 === void 0 || (_transformedStream2$g = _transformedStream2.getAudioTracks) === null || _transformedStream2$g === void 0 || (_transformedStream2$g = _transformedStream2$g.call(_transformedStream2)) === null || _transformedStream2$g === void 0 ? void 0 : _transformedStream2$g[0]) || stream.getAudioTracks()[0], transformedStream || stream);
	          }
	        } else {
	          Janus.log((media.replaceAudio ? "Replacing" : "Adding") + " audio track:", stream.getAudioTracks()[0]);
	          config.pc.addTrack(stream.getAudioTracks()[0], stream);
	        }
	      }
	      if ((!media.update && isVideoSendEnabled(media) || media.update && (media.addVideo || media.replaceVideo)) && stream.getVideoTracks() && stream.getVideoTracks().length) {
	        config.myStream.addTrack(stream.getVideoTracks()[0]);
	        if (Janus.unifiedPlan) {
	          // Use Transceivers
	          Janus.log((media.replaceVideo ? "Replacing" : "Adding") + " video track:", stream.getVideoTracks()[0]);
	          var videoTransceiver = null;
	          var transceivers = config.pc.getTransceivers();
	          if (transceivers && transceivers.length > 0) {
	            for (var i in transceivers) {
	              var t = transceivers[i];
	              if (t.sender && t.sender.track && t.sender.track.kind === "video" || t.receiver && t.receiver.track && t.receiver.track.kind === "video") {
	                videoTransceiver = t;
	                break;
	              }
	            }
	          }
	          if (videoTransceiver && videoTransceiver.sender) {
	            videoTransceiver.sender.replaceTrack(stream.getVideoTracks()[0]);
	          } else {
	            // config.pc.addTrack(stream.getVideoTracks()[0], stream);
	            config.pc.addTransceiver(stream.getVideoTracks()[0], {
	              direction: "sendrecv",
	              streams: [stream],
	              sendEncodings: sendEncodings
	            });
	          }
	        } else {
	          Janus.log((media.replaceVideo ? "Replacing" : "Adding") + " video track:", stream.getVideoTracks()[0]);
	          config.pc.addTrack(stream.getVideoTracks()[0], stream);
	        }
	      }
	    }
	    // If we still need to create a PeerConnection, let's do that
	    if (!config.pc) {
	      var pc_config = {
	        "iceServers": iceServers,
	        "iceTransportPolicy": iceTransportPolicy,
	        "bundlePolicy": bundlePolicy
	      };
	      if (Janus.webRTCAdapter.browserDetails.browser === "chrome") {
	        // For Chrome versions before 72, we force a plan-b semantic, and unified-plan otherwise
	        pc_config["sdpSemantics"] = Janus.webRTCAdapter.browserDetails.version < 72 ? "plan-b" : "unified-plan";
	      }
	      var pc_constraints = {
	        "optional": [{
	          "DtlsSrtpKeyAgreement": true
	        }]
	      };
	      if (ipv6Support === true) {
	        pc_constraints.optional.push({
	          "googIPv6": true
	        });
	      }
	      // Any custom constraint to add?
	      if (callbacks.rtcConstraints && typeof callbacks.rtcConstraints === 'object') {
	        Janus.debug("Adding custom PeerConnection constraints:", callbacks.rtcConstraints);
	        for (var i in callbacks.rtcConstraints) {
	          pc_constraints.optional.push(callbacks.rtcConstraints[i]);
	        }
	      }
	      if (Janus.webRTCAdapter.browserDetails.browser === "edge") {
	        // This is Edge, enable BUNDLE explicitly
	        pc_config.bundlePolicy = "max-bundle";
	      }
	      Janus.log("创建PeerConnection实例");
	      config.pc = new RTCPeerConnection(pc_config, pc_constraints);
	      Janus.debug(config.pc);
	      if (config.pc.getStats) {
	        // FIXME
	        config.volume = {};
	        config.bitrate.value = "0 kbits/sec";
	      }
	      Janus.log("Preparing local SDP and gathering candidates (trickle=" + config.trickle + ")");
	      config.pc.oniceconnectionstatechange = function (e) {
	        if (config.pc) pluginHandle.iceState(config.pc.iceConnectionState, ws);
	      };
	      config.pc.onicecandidate = function (event) {
	        if (event.candidate == null || Janus.webRTCAdapter.browserDetails.browser === 'edge' && event.candidate.candidate.indexOf('endOfCandidates') > 0) {
	          Janus.log("End of candidates.");
	          config.iceDone = true;
	          if (config.trickle === true) {
	            // Notify end of candidates
	            sendTrickleCandidate(handleId, {
	              "completed": true
	            });
	          } else {
	            // No trickle, time to send the complete SDP (including all candidates)
	            sendSDP(handleId, callbacks);
	          }
	        } else {
	          // JSON.stringify doesn't work on some WebRTC objects anymore
	          // See https://code.google.com/p/chromium/issues/detail?id=467366
	          var candidate = {
	            "candidate": event.candidate.candidate,
	            "sdpMid": event.candidate.sdpMid,
	            "sdpMLineIndex": event.candidate.sdpMLineIndex
	          };
	          if (config.trickle === true) {
	            // Send candidate
	            sendTrickleCandidate(handleId, candidate);
	          }
	        }
	      };
	      config.pc.ontrack = function (event) {
	        Janus.debug("进入peerConnection的ontrack事件");
	        Janus.log("监听到peerConnection连接，添加了新的RTCRtpReceiver:", event);
	        let trackMutedTimeoutId = null;
	        if (!event.streams) return;
	        config.remoteStream = event.streams[0];
	        pluginHandle.onremotestream(config.remoteStream);
	        if (event.track.onended) return;
	        event.track.onended = function (ev) {
	          Janus.log("流媒体轨道 关闭:", ev);
	          clearTimeout(trackMutedTimeoutId);
	          trackMutedTimeoutId = null;
	          if (config.remoteStream) {
	            config.remoteStream.removeTrack(ev.target);
	            pluginHandle.onremotestream(config.remoteStream);
	          }
	        };
	        event.track.onmute = function (ev) {
	          Janus.debug("Remote track muted:", ev);
	          if (!trackMutedTimeoutId) {
	            trackMutedTimeoutId = setTimeout(function () {
	              try {
	                Janus.log('流媒体轨道 移除：', ev);
	                if (config.remoteStream) {
	                  config.remoteStream.removeTrack(ev.target);
	                  pluginHandle.onremotestream(config.remoteStream);
	                }
	              } catch (e) {
	                Janus.error("流媒体轨道 移除失败，原因：", e);
	              }
	              trackMutedTimeoutId = null;
	              // Chrome seems to raise mute events only at multiples of 834ms;
	              // we set the timeout to three times this value (rounded to 840ms)
	            }, 3 * 840);
	          }
	        };
	        event.track.onunmute = function (ev) {
	          Janus.debug("Remote track flowing again:", ev);
	          if (trackMutedTimeoutId != null) {
	            clearTimeout(trackMutedTimeoutId);
	            trackMutedTimeoutId = null;
	          } else {
	            try {
	              Janus.log('流媒体轨道 添加：', ev);
	              config.remoteStream.addTrack(ev.target);
	              pluginHandle.onremotestream(config.remoteStream);
	            } catch (e) {
	              Janus.errpr("流媒体轨道添加失败，原因：", e);
	            }
	          }
	        };
	      };
	    }
	    try {
	      if (addTracks && stream !== null && stream !== undefined) {
	        Janus.log('Adding local stream');
	        if (callbacks.media.video == "screen") {
	          stream.getTracks().forEach(function (track) {
	            Janus.log('Adding local track:', track);
	            if (track.kind === "audio") {
	              config.pc.addTrack(track, stream);
	            } else {
	              config.pc.addTransceiver(track, {
	                direction: "sendrecv",
	                streams: [stream],
	                sendEncodings: [sendEncodingsItem]
	              });
	            }
	          });
	        } else {
	          var tracks = stream.getTracks();
	          for (let i = 0; i < tracks.length; i++) {
	            const track = tracks[i];
	            Janus.log('Adding local track:', track);
	            Janus.log('Adding local track settings:', track.getSettings());
	            if (track.kind === "audio") {
	              var _transformedStream3, _transformedStream3$g;
	              let transformedStream = null;
	              try {
	                transformedStream = await callbacks.customizeAudioTrack(stream); // 变声转换
	              } catch (error) {
	                callbacks.error(error);
	              }
	              config.pc.addTrack(((_transformedStream3 = transformedStream) === null || _transformedStream3 === void 0 || (_transformedStream3$g = _transformedStream3.getAudioTracks) === null || _transformedStream3$g === void 0 || (_transformedStream3$g = _transformedStream3$g.call(_transformedStream3)) === null || _transformedStream3$g === void 0 ? void 0 : _transformedStream3$g[0]) || track, transformedStream || stream);
	            } else {
	              config.pc.addTransceiver(track, {
	                direction: "sendrecv",
	                streams: [stream],
	                sendEncodings: sendEncodings
	              });
	            }
	          }
	        }
	      }
	    } catch (error) {
	      callbacks.error(error);
	    }

	    // Any data channel to create?
	    if (isDataEnabled(media) && !config.dataChannel[Janus.dataChanDefaultLabel]) {
	      Janus.log("Creating data channel");
	      createDataChannel(handleId, Janus.dataChanDefaultLabel, false);
	      config.pc.ondatachannel = function (event) {
	        Janus.log("Data channel created by Janus:", event);
	        createDataChannel(handleId, event.channel.label, event.channel);
	      };
	    }
	    // If there's a new local stream, let's notify the application
	    if (config.myStream) pluginHandle.onlocalstream(config.myStream);
	    // Create offer/answer now
	    if (jsep === null || jsep === undefined) {
	      createOffer(handleId, media, callbacks);
	    } else {
	      config.pc.setRemoteDescription(jsep).then(function () {
	        Janus.log("Remote description accepted!");
	        config.remoteSdp = jsep.sdp;
	        // Any trickle candidate we cached?
	        if (config.candidates && config.candidates.length > 0) {
	          for (var i = 0; i < config.candidates.length; i++) {
	            var candidate = config.candidates[i];
	            Janus.log("Adding remote candidate:", candidate);
	            if (!candidate || candidate.completed === true) {
	              // end-of-candidates
	              config.pc.addIceCandidate(Janus.endOfCandidates);
	            } else {
	              // New candidate
	              config.pc.addIceCandidate(candidate);
	            }
	          }
	          config.candidates = [];
	        }
	        // Create the answer now
	        createAnswer(handleId, media, callbacks);
	      }, callbacks.error);
	    }
	  }
	  //调用webrtc的getUserMedia()  设置视频流的分辨率，将获取的stream传入streamsDone(handleId, jsep, media, callbacks, stream);
	  function prepareWebrtc(handleId, offer, callbacks) {
	    Janus.debug("进入prepareWebrtc函数");
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : webrtcError;
	    callbacks.customizeSdp = typeof callbacks.customizeSdp == "function" ? callbacks.customizeSdp : Janus.noop;
	    callbacks.customizeAudioTrack = typeof callbacks.customizeAudioTrack == "function" ? callbacks.customizeAudioTrack : Janus.noop;
	    var jsep = callbacks.jsep;
	    if (offer && jsep) {
	      Janus.error("Provided a JSEP to a createOffer");
	      callbacks.error("Provided a JSEP to a createOffer");
	      return;
	    } else if (!offer && (!jsep || !jsep.type || !jsep.sdp)) {
	      Janus.error("A valid JSEP is required for createAnswer");
	      callbacks.error("A valid JSEP is required for createAnswer");
	      return;
	    }
	    callbacks.media = callbacks.media || {
	      audio: true,
	      video: true
	    };
	    var media = callbacks.media;
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    config.trickle = isTrickleEnabled(callbacks.trickle);
	    // Are we updating a session?
	    if (config.pc === undefined || config.pc === null) {
	      // Nope, new PeerConnection
	      media.update = false;
	      media.keepAudio = false;
	      media.keepVideo = false;
	    } else if (config.pc !== undefined && config.pc !== null) {
	      Janus.log("Updating existing media session");
	      media.update = true;
	      // Check if there's anything to add/remove/replace, or if we
	      // can go directly to preparing the new SDP offer or answer
	      if (callbacks.stream !== null && callbacks.stream !== undefined) {
	        // External stream: is this the same as the one we were using before?
	        if (callbacks.stream !== config.myStream) {
	          Janus.log("Renegotiation involves a new external stream");
	        }
	      } else {
	        // Check if there are changes on audio
	        if (media.addAudio) {
	          media.keepAudio = false;
	          media.replaceAudio = false;
	          media.removeAudio = false;
	          media.audioSend = true;
	          if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
	            Janus.error("Can't add audio stream, there already is one");
	            callbacks.error("Can't add audio stream, there already is one");
	            return;
	          }
	        } else if (media.removeAudio) {
	          media.keepAudio = false;
	          media.replaceAudio = false;
	          media.addAudio = false;
	          media.audioSend = false;
	        } else if (media.replaceAudio) {
	          media.keepAudio = false;
	          media.addAudio = false;
	          media.removeAudio = false;
	          media.audioSend = true;
	        }
	        if (config.myStream === null || config.myStream === undefined) {
	          // No media stream: if we were asked to replace, it's actually an "add"
	          if (media.replaceAudio) {
	            media.keepAudio = false;
	            media.replaceAudio = false;
	            media.addAudio = true;
	            media.audioSend = true;
	          }
	          if (isAudioSendEnabled(media)) {
	            media.keepAudio = false;
	            media.addAudio = true;
	          }
	        } else {
	          if (config.myStream.getAudioTracks() === null || config.myStream.getAudioTracks() === undefined || config.myStream.getAudioTracks().length === 0) {
	            // No audio track: if we were asked to replace, it's actually an "add"
	            if (media.replaceAudio) {
	              media.keepAudio = false;
	              media.replaceAudio = false;
	              media.addAudio = true;
	              media.audioSend = true;
	            }
	            if (isAudioSendEnabled(media)) {
	              media.keepVideo = false;
	              media.addAudio = true;
	            }
	          } else {
	            // We have an audio track: should we keep it as it is?
	            if (isAudioSendEnabled(media) && !media.removeAudio && !media.replaceAudio) {
	              media.keepAudio = true;
	            }
	          }
	        }
	        // Check if there are changes on video
	        if (media.addVideo) {
	          media.keepVideo = false;
	          media.replaceVideo = false;
	          media.removeVideo = false;
	          media.videoSend = true;
	          if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
	            Janus.error("Can't add video stream, there already is one");
	            callbacks.error("Can't add video stream, there already is one");
	            return;
	          }
	        } else if (media.removeVideo) {
	          media.keepVideo = false;
	          media.replaceVideo = false;
	          media.addVideo = false;
	          media.videoSend = false;
	        } else if (media.replaceVideo) {
	          media.keepVideo = false;
	          media.addVideo = false;
	          media.removeVideo = false;
	          media.videoSend = true;
	        }
	        if (config.myStream === null || config.myStream === undefined) {
	          // No media stream: if we were asked to replace, it's actually an "add"
	          if (media.replaceVideo) {
	            media.keepVideo = false;
	            media.replaceVideo = false;
	            media.addVideo = true;
	            media.videoSend = true;
	          }
	          if (isVideoSendEnabled(media)) {
	            media.keepVideo = false;
	            media.addVideo = true;
	          }
	        } else {
	          if (config.myStream.getVideoTracks() === null || config.myStream.getVideoTracks() === undefined || config.myStream.getVideoTracks().length === 0) {
	            // No video track: if we were asked to replace, it's actually an "add"
	            if (media.replaceVideo) {
	              media.keepVideo = false;
	              media.replaceVideo = false;
	              media.addVideo = true;
	              media.videoSend = true;
	            }
	            if (isVideoSendEnabled(media)) {
	              media.keepVideo = false;
	              media.addVideo = true;
	            }
	          } else {
	            // We have a video track: should we keep it as it is?
	            if (isVideoSendEnabled(media) && !media.removeVideo && !media.replaceVideo) {
	              media.keepVideo = true;
	            }
	          }
	        }
	        // Data channels can only be added
	        if (media.addData) media.data = true;
	      }
	      // If we're updating and keeping all tracks, let's skip the getUserMedia part
	      if (isAudioSendEnabled(media) && media.keepAudio && isVideoSendEnabled(media) && media.keepVideo) {
	        pluginHandle.consentDialog(false);
	        streamsDone(handleId, jsep, media, callbacks, config.myStream);
	        return;
	      }
	    }
	    // If we're updating, check if we need to remove/replace one of the tracks
	    if (media.update && !config.streamExternal) {
	      if (media.removeAudio || media.replaceAudio) {
	        if (config.myStream && config.myStream.getAudioTracks() && config.myStream.getAudioTracks().length) {
	          var s = config.myStream.getAudioTracks()[0];
	          Janus.log("Removing audio track:", s);
	          try {
	            // 先执行stop则黑屏，直接removeTrack则卡在最后一帧
	            s.stop();
	            config.myStream.removeTrack(s);
	          } catch (e) {}
	        }
	        if (config.pc.getSenders() && config.pc.getSenders().length) {
	          var ra = true;
	          if (media.replaceAudio && Janus.unifiedPlan) {
	            // We can use replaceTrack
	            ra = false;
	          }
	          if (ra) {
	            for (var index in config.pc.getSenders()) {
	              var s = config.pc.getSenders()[index];
	              if (s && s.track && s.track.kind === "audio") {
	                Janus.log("Removing audio sender:", s);
	                config.pc.removeTrack(s);
	              }
	            }
	          }
	        }
	      }
	      if (media.removeVideo || media.replaceVideo) {
	        if (config.myStream && config.myStream.getVideoTracks() && config.myStream.getVideoTracks().length) {
	          var s = config.myStream.getVideoTracks()[0];
	          Janus.log("Removing video track:", s);
	          try {
	            // 先执行stop则黑屏，直接removeTrack则卡在最后一帧
	            s.stop();
	            config.myStream.removeTrack(s);
	          } catch (e) {}
	        }
	        if (config.pc.getSenders() && config.pc.getSenders().length) {
	          var rv = true;
	          if (media.replaceVideo && Janus.unifiedPlan) {
	            // We can use replaceTrack
	            rv = false;
	          }
	          if (rv) {
	            for (var index in config.pc.getSenders()) {
	              var s = config.pc.getSenders()[index];
	              if (s && s.track && s.track.kind === "video") {
	                Janus.log("Removing video sender:", s);
	                config.pc.removeTrack(s);
	              }
	            }
	          }
	        }
	      }
	    }
	    // Was a MediaStream object passed, or do we need to take care of that?
	    if (callbacks.stream !== null && callbacks.stream !== undefined) {
	      var stream = callbacks.stream;
	      Janus.log("MediaStream provided by the application");
	      Janus.debug(stream);
	      // If this is an update, let's check if we need to release the previous stream
	      if (media.update) {
	        if (config.myStream && config.myStream !== callbacks.stream && !config.streamExternal) {
	          // We're replacing a stream we captured ourselves with an external one
	          try {
	            // Try a MediaStreamTrack.stop() for each track
	            var tracks = config.myStream.getTracks();
	            for (var i in tracks) {
	              var mst = tracks[i];
	              Janus.log(mst);
	              if (mst !== null && mst !== undefined) mst.stop();
	            }
	          } catch (e) {
	            // Do nothing if this fails
	          }
	          config.myStream = null;
	        }
	      }
	      // Skip the getUserMedia part
	      config.streamExternal = true;
	      pluginHandle.consentDialog(false);
	      streamsDone(handleId, jsep, media, callbacks, stream);
	      return;
	    }
	    // 判断audioSend和videoSend，默认为true，获取媒体权限
	    if (isAudioSendEnabled(media) || isVideoSendEnabled(media)) {
	      if (!Janus.isGetUserMediaAvailable()) {
	        callbacks.error("getUserMedia not available");
	        return;
	      }
	      var constraints = {
	        mandatory: {},
	        optional: []
	      };
	      pluginHandle.consentDialog(true);
	      var audioSupport = isAudioSendEnabled(media);
	      if (audioSupport === true && media != undefined && media != null) {
	        if (typeof media.audio === 'object') {
	          audioSupport = media.audio;
	        }
	      }
	      var videoSupport = isVideoSendEnabled(media);
	      if (videoSupport === true && media != undefined && media != null) {
	        var simulcast = callbacks.simulcast === true ? true : false;
	        if (simulcast && !jsep && (media.video === undefined || media.video === false)) media.video = "hires";
	        if (media.video && media.video != 'screen' && media.video != 'window') {
	          if (typeof media.video === 'object') {
	            videoSupport = media.video;
	          } else {
	            var width = 0;
	            var height = 0;
	            if (media.video === 'lowres') {
	              // Small resolution, 4:3
	              height = 240;
	              width = 320;
	            } else if (media.video === 'lowres-16:9') {
	              // Small resolution, 16:9
	              height = 180;
	              width = 320;
	            } else if (media.video === 'hires' || media.video === 'hires-16:9' || media.video === 'hdres') {
	              // High(HD) resolution is only 16:9
	              height = 720;
	              width = 1280;
	            } else if (media.video === 'fhdres') {
	              // Full HD resolution is only 16:9
	              height = 1080;
	              width = 1920;
	            } else if (media.video === '4kres') {
	              // 4K resolution is only 16:9
	              height = 2160;
	              width = 3840;
	            } else if (media.video === 'stdres') {
	              // Normal resolution, 4:3
	              height = 480;
	              width = 640;
	            } else if (media.video === 'stdres-16:9') {
	              // Normal resolution, 16:9
	              height = 360;
	              width = 640;
	            } else {
	              Janus.log("Default video setting is stdres 4:3");
	              height = 480;
	              width = 640;
	            }
	            Janus.log("Adding media constraint:", media.video);
	            videoSupport = {
	              'height': {
	                ideal: height,
	                max: height
	              },
	              'width': {
	                ideal: width,
	                max: width
	              }
	            };
	            Janus.log("Adding video constraint:", videoSupport);
	          }
	        } else if (media.video === 'screen' || media.video === 'window') {
	          if (!media.screenshareFrameRate) {
	            media.screenshareFrameRate = 3;
	          }
	          if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
	            // The new experimental getDisplayMedia API is available, let's use that
	            // https://groups.google.com/forum/#!topic/discuss-webrtc/Uf0SrR4uxzk
	            // https://webrtchacks.com/chrome-screensharing-getdisplaymedia/

	            // 对屏幕分享流设置分辨率、帧率（业务需要兼容）
	            const screenConstraints = {};
	            if (callbacks.screenWidth) screenConstraints.width = {
	              ideal: callbacks.screenWidth
	            };
	            if (callbacks.screenHeight) screenConstraints.height = {
	              ideal: callbacks.screenHeight
	            };
	            if (callbacks.displaySurface) screenConstraints.displaySurface = callbacks.displaySurface;
	            const screenVideoConstraints = screenConstraints.width || screenConstraints.height || screenConstraints.displaySurface ? screenConstraints : true;
	            Janus.log('采集屏幕约束条件设置：', screenVideoConstraints);
	            navigator.mediaDevices.getDisplayMedia({
	              video: screenVideoConstraints
	            }).then(function (stream) {
	              // 兼容safari一开始采集stream不清晰的情况，延迟1.5s再往后执行
	              if (Janus.webRTCAdapter.browserDetails.browser === 'safari') {
	                setTimeout(next, 1500);
	              } else {
	                // 其他浏览器直接往后执行
	                next();
	              }
	              function next() {
	                var _stream$getVideoTrack;
	                pluginHandle.consentDialog(false);

	                // 兼容frameRate不能被强制设置的情况
	                screenConstraints.frameRate = {
	                  exact: callbacks.frameRate || 15
	                };
	                stream.getVideoTracks()[0].applyConstraints(screenConstraints);
	                ((_stream$getVideoTrack = stream.getVideoTracks()[0]) === null || _stream$getVideoTrack === void 0 ? void 0 : _stream$getVideoTrack.getCapabilities) && Janus.log('采集到的屏幕约束条件范围：', stream.getVideoTracks()[0].getCapabilities()); // 兼容火狐浏览器不支持getCapabilities
	                Janus.log('采集到的屏幕约束条件：', stream.getVideoTracks()[0].getSettings());
	                if (isAudioSendEnabled(media) && !media.keepAudio) {
	                  navigator.mediaDevices.getUserMedia({
	                    audio: true,
	                    video: false
	                  }).then(function (audioStream) {
	                    stream.addTrack(audioStream.getAudioTracks()[0]);
	                    streamsDone(handleId, jsep, media, callbacks, stream);
	                  });
	                } else {
	                  streamsDone(handleId, jsep, media, callbacks, stream);
	                }
	              }
	            }).catch(error => {
	              pluginHandle.consentDialog(false);
	              callbacks.error(error);
	            });
	            return;
	          }
	          // We're going to try and use the extension for Chrome 34+, the old approach
	          // for older versions of Chrome, or the experimental support in Firefox 33+
	          function callbackUserMedia(error, stream) {
	            pluginHandle.consentDialog(false);
	            if (error) {
	              callbacks.error(error);
	            } else {
	              streamsDone(handleId, jsep, media, callbacks, stream);
	            }
	          }
	          function getScreenMedia(constraints, gsmCallback, useAudio) {
	            Janus.log("Adding media constraint (screen capture)");
	            Janus.debug(constraints);
	            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
	              if (useAudio) {
	                navigator.mediaDevices.getUserMedia({
	                  audio: true,
	                  video: false
	                }).then(function (audioStream) {
	                  stream.addTrack(audioStream.getAudioTracks()[0]);
	                  gsmCallback(null, stream);
	                });
	              } else {
	                gsmCallback(null, stream);
	              }
	            }).catch(function (error) {
	              pluginHandle.consentDialog(false);
	              gsmCallback(error);
	            });
	          }
	          if (Janus.webRTCAdapter.browserDetails.browser === 'chrome') {
	            var chromever = Janus.webRTCAdapter.browserDetails.version;
	            var maxver = 33;
	            if (window.navigator.userAgent.match('Linux')) maxver = 35; // "known" crash in chrome 34 and 35 on linux
	            if (chromever >= 26 && chromever <= maxver) {
	              // Chrome 26->33 requires some awkward chrome://flags manipulation
	              constraints = {
	                video: {
	                  mandatory: {
	                    googLeakyBucket: true,
	                    maxWidth: window.screen.width,
	                    maxHeight: window.screen.height,
	                    minFrameRate: media.screenshareFrameRate,
	                    maxFrameRate: media.screenshareFrameRate,
	                    chromeMediaSource: 'screen'
	                  }
	                },
	                audio: isAudioSendEnabled(media) && !media.keepAudio
	              };
	              getScreenMedia(constraints, callbackUserMedia);
	            } else {
	              // Chrome 34+ requires an extension
	              Janus.extension.getScreen(function (error, sourceId) {
	                if (error) {
	                  pluginHandle.consentDialog(false);
	                  return callbacks.error(error);
	                }
	                constraints = {
	                  audio: false,
	                  video: {
	                    mandatory: {
	                      chromeMediaSource: 'desktop',
	                      maxWidth: window.screen.width,
	                      maxHeight: window.screen.height,
	                      minFrameRate: media.screenshareFrameRate,
	                      maxFrameRate: media.screenshareFrameRate
	                    },
	                    optional: [{
	                      googLeakyBucket: true
	                    }, {
	                      googTemporalLayeredScreencast: true
	                    }]
	                  }
	                };
	                constraints.video.mandatory.chromeMediaSourceId = sourceId;
	                getScreenMedia(constraints, callbackUserMedia, isAudioSendEnabled(media) && !media.keepAudio);
	              });
	            }
	          } else if (Janus.webRTCAdapter.browserDetails.browser === 'firefox') {
	            if (Janus.webRTCAdapter.browserDetails.version >= 33) {
	              // Firefox 33+ has experimental support for screen sharing
	              constraints = {
	                video: {
	                  mozMediaSource: media.video,
	                  mediaSource: media.video
	                },
	                audio: isAudioSendEnabled(media) && !media.keepAudio
	              };
	              getScreenMedia(constraints, function (err, stream) {
	                callbackUserMedia(err, stream);
	                // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810
	                if (!err) {
	                  var lastTime = stream.currentTime;
	                  var polly = window.setInterval(function () {
	                    if (!stream) window.clearInterval(polly);
	                    if (stream.currentTime == lastTime) {
	                      window.clearInterval(polly);
	                      if (stream.onended) {
	                        stream.onended();
	                      }
	                    }
	                    lastTime = stream.currentTime;
	                  }, 500);
	                }
	              });
	            } else {
	              var error = new Error('NavigatorUserMediaError');
	              error.name = 'Your version of Firefox does not support screen sharing, please install Firefox 33 (or more recent versions)';
	              pluginHandle.consentDialog(false);
	              callbacks.error(error);
	              return;
	            }
	          }
	          return;
	        }
	      }
	      // If we got here, we're not screensharing
	      if (media === null || media === undefined || media.video !== 'screen') {
	        // Check whether all media sources are actually available or not
	        navigator.mediaDevices.enumerateDevices().then(function (devices) {
	          var audioExist = devices.some(function (device) {
	              return device.kind === 'audioinput';
	            }),
	            videoExist = isScreenSendEnabled(media) || devices.some(function (device) {
	              return device.kind === 'videoinput';
	            });

	          // Check whether a missing device is really a problem
	          var audioSend = isAudioSendEnabled(media);
	          var videoSend = isVideoSendEnabled(media);
	          var needAudioDevice = isAudioSendRequired(media);
	          var needVideoDevice = isVideoSendRequired(media);
	          if (audioSend || videoSend || needAudioDevice || needVideoDevice) {
	            // We need to send either audio or video
	            var haveAudioDevice = audioSend ? audioExist : false;
	            var haveVideoDevice = videoSend ? videoExist : false;
	            if (!haveAudioDevice && !haveVideoDevice) {
	              // FIXME Should we really give up, or just assume recvonly for both?
	              pluginHandle.consentDialog(false);
	              callbacks.error('No capture device found');
	              return false;
	            } else if (!haveAudioDevice && needAudioDevice) {
	              pluginHandle.consentDialog(false);
	              callbacks.error('Audio capture is required, but no capture device found');
	              return false;
	            } else if (!haveVideoDevice && needVideoDevice) {
	              pluginHandle.consentDialog(false);
	              callbacks.error('Video capture is required, but no capture device found');
	              return false;
	            }
	          }
	          let gumConstraints = {
	            audio: audioExist && !media.keepAudio ? audioSupport : false,
	            video: videoExist && !media.keepVideo ? videoSupport : false
	          };
	          if (media.encodings) {
	            gumConstraints = media.encodings;
	          }
	          Janus.log('采集音视频约束条件设置：', gumConstraints);
	          if (!gumConstraints.audio && !gumConstraints.video) {
	            pluginHandle.consentDialog(false);
	            streamsDone(handleId, jsep, media, callbacks, stream);
	          } else {
	            const retryCount = 3; // 超时次数设置
	            const getUserMediaFun = function (count) {
	              let isMediaTimeout = false; // 是否进入超时状态
	              let getMediaTimeoutId = window.setTimeout(() => {
	                Janus.log(`getUserMedia重试次数：${count}`);
	                // 设置3000ms的获取媒体超时时间，兼容在chrome中有时候调用navigator.mediaDevices.getUserMedia，无任何响应，连续3次，超过3次，则提示timeout
	                isMediaTimeout = true;
	                getMediaTimeoutId = null;
	                if (count >= retryCount) {
	                  callbacks.error('getUserMedia timeout');
	                } else {
	                  getUserMediaFun(++count);
	                }
	              }, 3000);
	              navigator.mediaDevices.getUserMedia(media.encodings ? media.encodings : gumConstraints).then(async function (stream) {
	                var _stream$getVideoTrack2;
	                if (isMediaTimeout) {
	                  // 如果已经进入超时的定时器中了，再获取到设备的响应，也不执行后续逻辑，直接跳出
	                  stream.getTracks().forEach(track => {
	                    track.stop();
	                  });
	                  return;
	                }
	                pluginHandle.consentDialog(false);

	                // 设置参数
	                const videoTrack = (_stream$getVideoTrack2 = stream.getVideoTracks()) === null || _stream$getVideoTrack2 === void 0 ? void 0 : _stream$getVideoTrack2[0];
	                const videoSettings = {
	                  ...gumConstraints.video,
	                  frameRate: {
	                    ideal: callbacks.frameRate,
	                    max: callbacks.frameRate
	                  }
	                };
	                if (videoTrack) {
	                  var _stream$getVideoTrack3;
	                  videoTrack.applyConstraints(videoSettings);
	                  // videoTrack.contentHint = 'detail' // 清晰度优先

	                  ((_stream$getVideoTrack3 = stream.getVideoTracks()[0]) === null || _stream$getVideoTrack3 === void 0 ? void 0 : _stream$getVideoTrack3.getCapabilities) && Janus.log('摄像头采集后，约束条件范围：', stream.getVideoTracks()[0].getCapabilities()); // 兼容火狐浏览器不支持getCapabilities
	                  Janus.log('摄像头采集后，约束条件：', stream.getVideoTracks()[0].getSettings());
	                }
	                streamsDone(handleId, jsep, media, callbacks, stream);
	              }).catch(function (error) {
	                pluginHandle.consentDialog(false);
	                callbacks.error({
	                  code: error.code,
	                  name: error.name,
	                  message: error.message
	                });
	              }).finally(() => {
	                window.clearTimeout(getMediaTimeoutId);
	                getMediaTimeoutId = null;
	              });
	            };
	            getUserMediaFun(1);
	          }
	        }).catch(function (error) {
	          pluginHandle.consentDialog(false);
	          callbacks.error(`enumerateDevices error：${error}`);
	        });
	      }
	    } else {
	      // No need to do a getUserMedia, create offer/answer right away
	      streamsDone(handleId, jsep, media, callbacks);
	    }
	  }

	  // 接收远端的SDP信息，并设置到本地的PeerConnection中
	  function prepareWebrtcPeer(handleId, callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : webrtcError;
	    var jsep = callbacks.jsep;
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (jsep !== undefined && jsep !== null) {
	      if (config.pc === null) {
	        Janus.warn("Wait, no PeerConnection?? if this is an answer, use createAnswer and not handleRemoteJsep");
	        callbacks.error("No PeerConnection: if this is an answer, use createAnswer and not handleRemoteJsep");
	        return;
	      }
	      config.pc.setRemoteDescription(jsep).then(function () {
	        Janus.log("设置remote sdp成功");
	        config.remoteSdp = jsep.sdp;
	        // Any trickle candidate we cached?
	        if (config.candidates && config.candidates.length > 0) {
	          for (var i = 0; i < config.candidates.length; i++) {
	            var candidate = config.candidates[i];
	            Janus.log("Adding remote candidate:", candidate);
	            if (!candidate || candidate.completed === true) {
	              // end-of-candidates
	              config.pc.addIceCandidate(Janus.endOfCandidates);
	            } else {
	              // New candidate
	              config.pc.addIceCandidate(candidate);
	            }
	          }
	          config.candidates = [];
	        }
	        // Done
	        callbacks.success();
	      }, callbacks.error);
	    } else {
	      callbacks.error("Invalid JSEP");
	    }
	  }

	  // 创建offer
	  function createOffer(handleId, media, callbacks) {
	    Janus.debug("进入createOffer函数");
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    var simulcast = callbacks.simulcast === true ? true : false;
	    if (!simulcast) {
	      Janus.log("Creating offer (iceDone=" + config.iceDone + ")");
	    } else {
	      Janus.log("Creating offer (iceDone=" + config.iceDone + ", simulcast=" + simulcast + ")");
	    }
	    // https://code.google.com/p/webrtc/issues/detail?id=3508
	    var mediaConstraints = {};
	    if (Janus.unifiedPlan) {
	      // We can use Transceivers
	      var audioTransceiver = null,
	        videoTransceiver = null;
	      var transceivers = config.pc.getTransceivers();
	      if (transceivers && transceivers.length > 0) {
	        for (var i in transceivers) {
	          var t = transceivers[i];
	          if (t.sender && t.sender.track && t.sender.track.kind === "audio" || t.receiver && t.receiver.track && t.receiver.track.kind === "audio") {
	            if (!audioTransceiver) audioTransceiver = t;
	            continue;
	          }
	          if (t.sender && t.sender.track && t.sender.track.kind === "video" || t.receiver && t.receiver.track && t.receiver.track.kind === "video") {
	            if (!videoTransceiver) videoTransceiver = t;
	            continue;
	          }
	        }
	      }
	      // Handle audio (and related changes, if any)
	      var audioSend = isAudioSendEnabled(media);
	      var audioRecv = isAudioRecvEnabled(media);
	      if (!audioSend && !audioRecv) {
	        // Audio disabled: have we removed it?
	        if (media.removeAudio && audioTransceiver) {
	          if (audioTransceiver.setDirection) {
	            audioTransceiver.setDirection("inactive");
	          } else {
	            audioTransceiver.direction = "inactive";
	          }
	          Janus.log("Setting audio transceiver to inactive:", audioTransceiver);
	        }
	      } else {
	        // Take care of audio m-line
	        if (audioSend && audioRecv) {
	          if (audioTransceiver) {
	            if (audioTransceiver.setDirection) {
	              audioTransceiver.setDirection("sendrecv");
	            } else {
	              audioTransceiver.direction = "sendrecv";
	            }
	            Janus.log("Setting audio transceiver to sendrecv:", audioTransceiver);
	          }
	        } else if (audioSend && !audioRecv) {
	          if (audioTransceiver) {
	            if (audioTransceiver.setDirection) {
	              audioTransceiver.setDirection("sendonly");
	            } else {
	              audioTransceiver.direction = "sendonly";
	            }
	            Janus.log("Setting audio transceiver to sendonly:", audioTransceiver);
	          }
	        } else if (!audioSend && audioRecv) {
	          if (audioTransceiver) {
	            if (audioTransceiver.setDirection) {
	              audioTransceiver.setDirection("recvonly");
	            } else {
	              audioTransceiver.direction = "recvonly";
	            }
	            Janus.log("Setting audio transceiver to recvonly:", audioTransceiver);
	          } else {
	            // In theory, this is the only case where we might not have a transceiver yet
	            audioTransceiver = config.pc.addTransceiver("audio", {
	              direction: "recvonly"
	            });
	            Janus.log("Adding recvonly audio transceiver:", audioTransceiver);
	          }
	        }
	      }
	      // Handle video (and related changes, if any)
	      var videoSend = isVideoSendEnabled(media);
	      var videoRecv = isVideoRecvEnabled(media);
	      if (!videoSend && !videoRecv) {
	        // Video disabled: have we removed it?
	        if (media.removeVideo && videoTransceiver) {
	          if (videoTransceiver.setDirection) {
	            videoTransceiver.setDirection("inactive");
	          } else {
	            videoTransceiver.direction = "inactive";
	          }
	          Janus.log("Setting video transceiver to inactive:", videoTransceiver);
	        }
	      } else {
	        // Take care of video m-line
	        if (videoSend && videoRecv) {
	          if (videoTransceiver) {
	            if (videoTransceiver.setDirection) {
	              videoTransceiver.setDirection("sendrecv");
	            } else {
	              videoTransceiver.direction = "sendrecv";
	            }
	            Janus.log("Setting video transceiver to sendrecv:", videoTransceiver);
	          }
	        } else if (videoSend && !videoRecv) {
	          if (videoTransceiver) {
	            if (videoTransceiver.setDirection) {
	              videoTransceiver.setDirection("sendonly");
	            } else {
	              videoTransceiver.direction = "sendonly";
	            }
	            Janus.log("Setting video transceiver to sendonly:", videoTransceiver);
	          }
	        } else if (!videoSend && videoRecv) {
	          if (videoTransceiver) {
	            if (videoTransceiver.setDirection) {
	              videoTransceiver.setDirection("recvonly");
	            } else {
	              videoTransceiver.direction = "recvonly";
	            }
	            Janus.log("Setting video transceiver to recvonly:", videoTransceiver);
	          } else {
	            // In theory, this is the only case where we might not have a transceiver yet
	            videoTransceiver = config.pc.addTransceiver("video", {
	              direction: "recvonly"
	            });
	            Janus.log("Adding recvonly video transceiver:", videoTransceiver);
	          }
	        }
	      }
	    } else {
	      mediaConstraints["offerToReceiveAudio"] = isAudioRecvEnabled(media);
	      mediaConstraints["offerToReceiveVideo"] = isVideoRecvEnabled(media);
	    }
	    var iceRestart = callbacks.iceRestart === true ? true : false;
	    if (iceRestart) {
	      mediaConstraints["iceRestart"] = true;
	    }
	    Janus.debug(mediaConstraints);
	    // Check if this is Firefox and we've been asked to do simulcasting
	    var sendVideo = isVideoSendEnabled(media);
	    // if (sendVideo && simulcast && Janus.webRTCAdapter.browserDetails.browser === "firefox") {
	    // 	// FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
	    // 	Janus.log("Enabling Simulcasting for Firefox (RID)");
	    // 	var sender = config.pc.getSenders().find(function (s) {
	    // 		return s?.track?.kind == "video"
	    // 	});
	    // 	if (sender) {
	    // 		var parameters = sender.getParameters();
	    // 		if (!parameters)
	    // 			parameters = {};

	    // 		const maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
	    // 		parameters.encodings = [
	    // 			{ rid: "h", priority: 'high', active: true, maxBitrate: maxBitrates.high, scaleResolutionDownBy: 1 },
	    // 			// { rid: "m", active: true, maxBitrate: maxBitrates.medium, scaleResolutionDownBy: 2 },
	    // 			{ rid: "l", priority: 'low', active: true, maxBitrate: maxBitrates.low, scaleResolutionDownBy: 4 }
	    // 		];
	    // 		sender.setParameters(parameters);
	    // 	}
	    // }
	    Janus.log('执行peerConnection.createOffer，生成sdp信息');
	    config.pc.createOffer(mediaConstraints).then(async function (offer) {
	      Janus.debug(offer);
	      // JSON.stringify doesn't work on some WebRTC objects anymore
	      // See https://code.google.com/p/chromium/issues/detail?id=467366
	      var jsep = {
	        "type": offer.type,
	        "sdp": offer.sdp
	      };
	      callbacks.customizeSdp(jsep);
	      offer.sdp = jsep.sdp;
	      if (sendVideo && simulcast) {
	        // This SDP munging only works with Chrome (Safari STP may support it too)
	        if (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "safari") {
	          Janus.log("Enabling Simulcasting for Chrome (SDP munging)");
	          // offer.sdp = mungeSdpForSimulcasting(offer.sdp);
	        } else if (Janus.webRTCAdapter.browserDetails.browser !== "firefox") {
	          Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring");
	        }
	      }
	      config.mySdp = offer.sdp;
	      Janus.log("设置local sdp信息：", offer);
	      if (Janus.webRTCAdapter.browserDetails.browser === 'firefox') {
	        // 如果是火狐，同步执行，避免出现音视频订阅的时候，执行到setLocalDescription的时候,音频订阅开始执行了，导致冲突报错 Cannot set local offer when createOffer has not been called
	        await config.pc.setLocalDescription(offer);
	        Janus.log("火狐执行 setLocalDescription 完毕");
	      } else {
	        // 其他浏览器没有上述问题，异步执行，增加性能
	        config.pc.setLocalDescription(offer).catch(callbacks.error);
	      }
	      return offer;
	    }).then(offer => {
	      config.mediaConstraints = mediaConstraints;
	      if (!config.iceDone && !config.trickle) {
	        // Don't do anything until we have all candidates
	        Janus.log("Waiting for all candidates...");
	        return;
	      }
	      Janus.log("Offer ready");
	      callbacks.success(offer);
	    }).catch(callbacks.error);
	  }

	  // 创建answer
	  function createAnswer(handleId, media, callbacks) {
	    Janus.log('进入createAnswer函数');
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    callbacks.customizeSdp = typeof callbacks.customizeSdp == "function" ? callbacks.customizeSdp : Janus.noop;
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      callbacks.error("Invalid handle");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    var simulcast = callbacks.simulcast === true ? true : false;
	    if (!simulcast) {
	      Janus.log("Creating answer (iceDone=" + config.iceDone + ")");
	    } else {
	      Janus.log("Creating answer (iceDone=" + config.iceDone + ", simulcast=" + simulcast + ")");
	    }
	    var mediaConstraints = null;
	    if (Janus.unifiedPlan) {
	      // We can use Transceivers
	      mediaConstraints = {};
	      var audioTransceiver = null,
	        videoTransceiver = null;
	      var transceivers = config.pc.getTransceivers();
	      if (transceivers && transceivers.length > 0) {
	        for (var i in transceivers) {
	          var t = transceivers[i];
	          if (t.sender && t.sender.track && t.sender.track.kind === "audio" || t.receiver && t.receiver.track && t.receiver.track.kind === "audio") {
	            if (!audioTransceiver) audioTransceiver = t;
	            continue;
	          }
	          if (t.sender && t.sender.track && t.sender.track.kind === "video" || t.receiver && t.receiver.track && t.receiver.track.kind === "video") {
	            if (!videoTransceiver) videoTransceiver = t;
	            continue;
	          }
	        }
	      }
	      // Handle audio (and related changes, if any)
	      var audioSend = isAudioSendEnabled(media);
	      var audioRecv = isAudioRecvEnabled(media);
	      if (!audioSend && !audioRecv) {
	        // Audio disabled: have we removed it?
	        if (media.removeAudio && audioTransceiver) {
	          try {
	            if (audioTransceiver.setDirection) {
	              audioTransceiver.setDirection("inactive");
	            } else {
	              audioTransceiver.direction = "inactive";
	            }
	            Janus.log("Setting audio transceiver to inactive:", audioTransceiver);
	          } catch (e) {
	            Janus.error(e);
	          }
	        }
	      } else {
	        // Take care of audio m-line
	        if (audioSend && audioRecv) {
	          if (audioTransceiver) {
	            try {
	              if (audioTransceiver.setDirection) {
	                audioTransceiver.setDirection("sendrecv");
	              } else {
	                audioTransceiver.direction = "sendrecv";
	              }
	              Janus.log("Setting audio transceiver to sendrecv:", audioTransceiver);
	            } catch (e) {
	              Janus.error(e);
	            }
	          }
	        } else if (audioSend && !audioRecv) {
	          try {
	            if (audioTransceiver) {
	              if (audioTransceiver.setDirection) {
	                audioTransceiver.setDirection("sendonly");
	              } else {
	                audioTransceiver.direction = "sendonly";
	              }
	              Janus.log("Setting audio transceiver to sendonly:", audioTransceiver);
	            }
	          } catch (e) {
	            Janus.error(e);
	          }
	        } else if (!audioSend && audioRecv) {
	          if (audioTransceiver) {
	            try {
	              if (audioTransceiver.setDirection) {
	                audioTransceiver.setDirection("recvonly");
	              } else {
	                audioTransceiver.direction = "recvonly";
	              }
	              Janus.log("Setting audio transceiver to recvonly:", audioTransceiver);
	            } catch (e) {
	              Janus.error(e);
	            }
	          } else {
	            // In theory, this is the only case where we might not have a transceiver yet
	            audioTransceiver = config.pc.addTransceiver("audio", {
	              direction: "recvonly"
	            });
	            Janus.log("Adding recvonly audio transceiver:", audioTransceiver);
	          }
	        }
	      }
	      // Handle video (and related changes, if any)
	      var videoSend = isVideoSendEnabled(media);
	      var videoRecv = isVideoRecvEnabled(media);
	      if (!videoSend && !videoRecv) {
	        // Video disabled: have we removed it?
	        if (media.removeVideo && videoTransceiver) {
	          try {
	            if (videoTransceiver.setDirection) {
	              videoTransceiver.setDirection("inactive");
	            } else {
	              videoTransceiver.direction = "inactive";
	            }
	            Janus.log("Setting video transceiver to inactive:", videoTransceiver);
	          } catch (e) {
	            Janus.error(e);
	          }
	        }
	      } else {
	        // Take care of video m-line
	        if (videoSend && videoRecv) {
	          if (videoTransceiver) {
	            try {
	              if (videoTransceiver.setDirection) {
	                videoTransceiver.setDirection("sendrecv");
	              } else {
	                videoTransceiver.direction = "sendrecv";
	              }
	              Janus.log("Setting video transceiver to sendrecv:", videoTransceiver);
	            } catch (e) {
	              Janus.error(e);
	            }
	          }
	        } else if (videoSend && !videoRecv) {
	          if (videoTransceiver) {
	            try {
	              if (videoTransceiver.setDirection) {
	                videoTransceiver.setDirection("sendonly");
	              } else {
	                videoTransceiver.direction = "sendonly";
	              }
	              Janus.log("Setting video transceiver to sendonly:", videoTransceiver);
	            } catch (e) {
	              Janus.error(e);
	            }
	          }
	        } else if (!videoSend && videoRecv) {
	          if (videoTransceiver) {
	            try {
	              if (videoTransceiver.setDirection) {
	                videoTransceiver.setDirection("recvonly");
	              } else {
	                videoTransceiver.direction = "recvonly";
	              }
	              Janus.log("Setting video transceiver to recvonly:", videoTransceiver);
	            } catch (e) {
	              Janus.error(e);
	            }
	          } else {
	            // In theory, this is the only case where we might not have a transceiver yet
	            videoTransceiver = config.pc.addTransceiver("video", {
	              direction: "recvonly"
	            });
	            Janus.log("Adding recvonly video transceiver:", videoTransceiver);
	          }
	        }
	      }
	    } else {
	      if (Janus.webRTCAdapter.browserDetails.browser == "firefox" || Janus.webRTCAdapter.browserDetails.browser == "edge") {
	        mediaConstraints = {
	          offerToReceiveAudio: isAudioRecvEnabled(media),
	          offerToReceiveVideo: isVideoRecvEnabled(media)
	        };
	      } else {
	        mediaConstraints = {
	          mandatory: {
	            OfferToReceiveAudio: isAudioRecvEnabled(media),
	            OfferToReceiveVideo: isVideoRecvEnabled(media)
	          }
	        };
	      }
	    }
	    Janus.debug(mediaConstraints);
	    // Check if this is Firefox and we've been asked to do simulcasting
	    var sendVideo = isVideoSendEnabled(media);
	    if (sendVideo && simulcast && Janus.webRTCAdapter.browserDetails.browser === "firefox") {
	      // FIXME Based on https://gist.github.com/voluntas/088bc3cc62094730647b
	      Janus.log("Enabling Simulcasting for Firefox (RID)");
	      var sender = config.pc.getSenders()[1];
	      Janus.log(sender);
	      var parameters = sender.getParameters();
	      Janus.log(parameters);
	      const maxBitrates = getMaxBitrates(callbacks.simulcastMaxBitrates);
	      sender.setParameters({
	        encodings: [{
	          rid: "high",
	          active: true,
	          priority: "high",
	          maxBitrate: maxBitrates.high
	        }, {
	          rid: "medium",
	          active: true,
	          priority: "medium",
	          maxBitrate: maxBitrates.medium
	        }, {
	          rid: "low",
	          active: true,
	          priority: "low",
	          maxBitrate: maxBitrates.low
	        }]
	      });
	    }
	    config.pc.createAnswer(mediaConstraints).then(function (answer) {
	      Janus.debug(answer);
	      // JSON.stringify doesn't work on some WebRTC objects anymore
	      // See https://code.google.com/p/chromium/issues/detail?id=467366
	      var jsep = {
	        "type": answer.type,
	        "sdp": answer.sdp
	      };
	      callbacks.customizeSdp(jsep);
	      answer.sdp = jsep.sdp;
	      Janus.log("Setting local description");
	      if (sendVideo && simulcast) {
	        // This SDP munging only works with Chrome
	        if (Janus.webRTCAdapter.browserDetails.browser === "chrome") {
	          // FIXME Apparently trying to simulcast when answering breaks video in Chrome...
	          //~ Janus.log("Enabling Simulcasting for Chrome (SDP munging)");
	          //~ answer.sdp = mungeSdpForSimulcasting(answer.sdp);
	          Janus.warn("simulcast=true, but this is an answer, and video breaks in Chrome if we enable it");
	        } else if (Janus.webRTCAdapter.browserDetails.browser !== "firefox") {
	          Janus.warn("simulcast=true, but this is not Chrome nor Firefox, ignoring");
	        }
	      }
	      config.mySdp = answer.sdp;
	      config.pc.setLocalDescription(answer).catch(callbacks.error);
	      config.mediaConstraints = mediaConstraints;
	      if (!config.iceDone && !config.trickle) {
	        // Don't do anything until we have all candidates
	        Janus.log("Waiting for all candidates...");
	        return;
	      }
	      callbacks.success(answer);
	    }, callbacks.error);
	  }

	  // 发送sdp信息
	  function sendSDP(handleId, callbacks) {
	    callbacks = callbacks || {};
	    callbacks.success = typeof callbacks.success == "function" ? callbacks.success : Janus.noop;
	    callbacks.error = typeof callbacks.error == "function" ? callbacks.error : Janus.noop;
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle, not sending anything");
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    Janus.log("Sending offer/answer SDP...");
	    if (config.mySdp === null || config.mySdp === undefined) {
	      Janus.warn("Local SDP instance is invalid, not sending anything...");
	      return;
	    }
	    config.mySdp = {
	      "type": config.pc.localDescription.type,
	      "sdp": config.pc.localDescription.sdp
	    };
	    if (config.trickle === false) config.mySdp["trickle"] = false;
	    Janus.debug(callbacks);
	    config.sdpSent = true;
	    callbacks.success(config.mySdp);
	  }
	  function getVolume(handleId, remote) {
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      return 0;
	    }
	    var stream = remote ? "remote" : "local";
	    var config = pluginHandle.webrtcStuff;
	    if (!config.volume[stream]) config.volume[stream] = {
	      value: 0
	    };
	    // Start getting the volume, if getStats is supported
	    if (config.pc.getStats && Janus.webRTCAdapter.browserDetails.browser === "chrome") {
	      if (remote && (config.remoteStream === null || config.remoteStream === undefined)) {
	        Janus.warn("Remote stream unavailable");
	        return 0;
	      } else if (!remote && (config.myStream === null || config.myStream === undefined)) {
	        Janus.warn("Local stream unavailable");
	        return 0;
	      }
	      if (config.volume[stream].timer === null || config.volume[stream].timer === undefined) {
	        Janus.log("Starting " + stream + " volume monitor");
	        config.volume[stream].timer = setInterval(function () {
	          config.pc.getStats(function (stats) {
	            var results = stats.result();
	            for (var i = 0; i < results.length; i++) {
	              var res = results[i];
	              if (res.type == 'ssrc') {
	                if (remote && res.stat('audioOutputLevel')) config.volume[stream].value = parseInt(res.stat('audioOutputLevel'));else if (!remote && res.stat('audioInputLevel')) config.volume[stream].value = parseInt(res.stat('audioInputLevel'));
	              }
	            }
	          });
	        }, 200);
	        return 0; // We don't have a volume to return yet
	      }
	      return config.volume[stream].value;
	    } else {
	      // audioInputLevel and audioOutputLevel seem only available in Chrome? audioLevel
	      // seems to be available on Chrome and Firefox, but they don't seem to work
	      Janus.warn("Getting the " + stream + " volume unsupported by browser");
	      return 0;
	    }
	  }
	  function isMuted(handleId, video) {
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      return true;
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (config.pc === null || config.pc === undefined) {
	      Janus.warn("Invalid PeerConnection");
	      return true;
	    }
	    if (config.myStream === undefined || config.myStream === null) {
	      Janus.warn("Invalid local MediaStream");
	      return true;
	    }
	    if (video) {
	      // Check video track
	      if (config.myStream.getVideoTracks() === null || config.myStream.getVideoTracks() === undefined || config.myStream.getVideoTracks().length === 0) {
	        Janus.warn("No video track");
	        return true;
	      }
	      return !config.myStream.getVideoTracks()[0].enabled;
	    } else {
	      // Check audio track
	      if (config.myStream.getAudioTracks() === null || config.myStream.getAudioTracks() === undefined || config.myStream.getAudioTracks().length === 0) {
	        Janus.warn("No audio track");
	        return true;
	      }
	      return !config.myStream.getAudioTracks()[0].enabled;
	    }
	  }
	  function mute(handleId, video, mute) {
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      return false;
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (config.pc === null || config.pc === undefined) {
	      Janus.warn("Invalid PeerConnection");
	      return false;
	    }
	    if (config.myStream === undefined || config.myStream === null) {
	      Janus.warn("Invalid local MediaStream");
	      return false;
	    }
	    if (video) {
	      // Mute/unmute video track
	      if (config.myStream.getVideoTracks() === null || config.myStream.getVideoTracks() === undefined || config.myStream.getVideoTracks().length === 0) {
	        Janus.warn("No video track");
	        return false;
	      }
	      config.myStream.getVideoTracks()[0].enabled = mute ? false : true;
	      return true;
	    } else {
	      // Mute/unmute audio track
	      if (config.myStream.getAudioTracks() === null || config.myStream.getAudioTracks() === undefined || config.myStream.getAudioTracks().length === 0) {
	        Janus.warn("No audio track");
	        return false;
	      }
	      config.myStream.getAudioTracks()[0].enabled = mute ? false : true;
	      return true;
	    }
	  }
	  function getNetworkQuality(handleId, callbacks) {
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      return "Invalid handle";
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (config.pc === null || config.pc === undefined) return "Invalid PeerConnection";
	    // Start getting the bitrate, if getStats is supported
	    if (config.pc.getStats) {
	      config.pc.getStats().then(function (stats) {
	        const statsTotal = {};
	        stats.forEach(function (res) {
	          if (!res) return;
	          let inStats = false;
	          statsTotal[res.type] = res;
	          // // Check if these are statistics on incoming media
	          // if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) &&
	          // 	res.type === "inbound-rtp" && res.id.indexOf("rtcp") < 0) {
	          // 	// New stats
	          // 	inStats = true;
	          // }
	          if ((res.type === "inbound-rtp" || res.type === "outbound-rtp") && res.id.indexOf("rtcp") < 0) {
	            inStats = true;
	          } else if (res.type == 'ssrc' && res.bytesReceived && (res.googCodecName === "VP8" || res.googCodecName === "")) {
	            // Older Chromer versions
	            inStats = true;
	          } else if (res.type == 'ssrc' && res.bytesSent && (res.googCodecName === "VP8" || res.googCodecName === "")) {
	            // Older Chromer versions
	            inStats = true;
	          }

	          // Parse stats now
	          if (inStats) {
	            config.bitrate.bsnow = res.bytesReceived;
	            config.bitrate.tsnow = res.timestamp;
	            if (config.bitrate.bsbefore === null || config.bitrate.tsbefore === null) {
	              // Skip this round
	              config.bitrate.bsbefore = config.bitrate.bsnow;
	              config.bitrate.tsbefore = config.bitrate.tsnow;
	            } else {
	              // Calculate bitrate
	              var timePassed = config.bitrate.tsnow - config.bitrate.tsbefore;
	              if (Janus.webRTCAdapter.browserDetails.browser == "safari") timePassed = timePassed / 1000; // Apparently the timestamp is in microseconds, in Safari
	              var bitRate = Math.round((config.bitrate.bsnow - config.bitrate.bsbefore) * 8 / timePassed);
	              if (Janus.webRTCAdapter.browserDetails.browser === 'safari') bitRate = parseInt(bitRate / 1000);
	              config.bitrate.value = bitRate + ' kbits/sec';
	              //~ Janus.log("Estimated bitrate is " + config.bitrate.value);
	              config.bitrate.bsbefore = config.bitrate.bsnow;
	              config.bitrate.tsbefore = config.bitrate.tsnow;
	            }
	          }
	        });
	        callbacks && callbacks(statsTotal);
	      });
	    } else {
	      Janus.warn("Getting the video bitrate unsupported by browser");
	      return "Feature unsupported by browser";
	    }
	  }
	  // 订阅message消息的回调 
	  function messageListen(handleId, key, fn) {
	    const pluginHandle = pluginHandles[handleId];
	    // 如果不存在该事件的订阅者，则创建一个订阅者数组
	    if (!pluginHandle.listenList[key]) {
	      pluginHandle.listenList[key] = [];
	    }
	    // 过滤订阅重复的回调
	    for (var i = 0; i < pluginHandle.listenList[key].length; i++) {
	      if (pluginHandle.listenList[key][i].fn === fn) {
	        return;
	      }
	    }
	    pluginHandle.listenList[key].push({
	      time: new Date().getTime(),
	      fn
	    }); //将回调放入订阅列表
	  }
	  // 订阅message消息触发
	  function messageTrigger(handleId, key, data) {
	    const pluginHandle = pluginHandles[handleId];
	    const fns = pluginHandle.listenList[key]; //取出该订阅对应的回调列表
	    if (!fns || fns.length === 0) return false; //没有订阅则直接返回

	    new Date().getTime();
	    for (let i = 0; i < fns.length; i++) {
	      const fnObj = fns[i];
	      // 不做时间过滤了，可能出现网络波动，导致websocket回复很慢
	      // if (currentTime - fnObj.time > 2000) {
	      // 	continue;
	      // }
	      fnObj.fn.call(pluginHandle, data);
	    }
	    // 执行后，清除订阅列表
	    pluginHandle.listenList[key] = null;
	  }
	  function getBitrate(handleId) {
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined || pluginHandle.webrtcStuff === null || pluginHandle.webrtcStuff === undefined) {
	      Janus.warn("Invalid handle");
	      return "Invalid handle";
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (config.pc === null || config.pc === undefined) return "Invalid PeerConnection";
	    // Start getting the bitrate, if getStats is supported
	    if (config.pc.getStats) {
	      if (config.bitrate.timer === null || config.bitrate.timer === undefined) {
	        Janus.log("Starting bitrate timer (via getStats)");
	        config.bitrate.timer = setInterval(function () {
	          config.pc.getStats().then(function (stats) {
	            stats.forEach(function (res) {
	              if (!res) return;
	              var inStats = false;
	              // Check if these are statistics on incoming media
	              if ((res.mediaType === "video" || res.id.toLowerCase().indexOf("video") > -1) && res.type === "inbound-rtp" && res.id.indexOf("rtcp") < 0) {
	                // New stats
	                inStats = true;
	              } else if (res.type == 'ssrc' && res.bytesReceived && (res.googCodecName === "VP8" || res.googCodecName === "")) {
	                // Older Chromer versions
	                inStats = true;
	              }
	              // Parse stats now
	              if (inStats) {
	                config.bitrate.bsnow = res.bytesReceived;
	                config.bitrate.tsnow = res.timestamp;
	                if (config.bitrate.bsbefore === null || config.bitrate.tsbefore === null) {
	                  // Skip this round
	                  config.bitrate.bsbefore = config.bitrate.bsnow;
	                  config.bitrate.tsbefore = config.bitrate.tsnow;
	                } else {
	                  // Calculate bitrate
	                  var timePassed = config.bitrate.tsnow - config.bitrate.tsbefore;
	                  if (Janus.webRTCAdapter.browserDetails.browser == "safari") timePassed = timePassed / 1000; // Apparently the timestamp is in microseconds, in Safari
	                  var bitRate = Math.round((config.bitrate.bsnow - config.bitrate.bsbefore) * 8 / timePassed);
	                  if (Janus.webRTCAdapter.browserDetails.browser === 'safari') bitRate = parseInt(bitRate / 1000);
	                  config.bitrate.value = bitRate + ' kbits/sec';
	                  //~ Janus.log("Estimated bitrate is " + config.bitrate.value);
	                  config.bitrate.bsbefore = config.bitrate.bsnow;
	                  config.bitrate.tsbefore = config.bitrate.tsnow;
	                }
	              }
	            });
	          });
	        }, 1000);
	        return "0 kbits/sec"; // We don't have a bitrate value yet
	      }
	      return config.bitrate.value;
	    } else {
	      Janus.warn("Getting the video bitrate unsupported by browser");
	      return "Feature unsupported by browser";
	    }
	  }
	  function webrtcError(error) {
	    Janus.error("WebRTC error:", error);
	  }
	  function cleanupWebrtc(handleId, hangupRequest) {
	    Janus.log("Cleaning WebRTC stuff");
	    var pluginHandle = pluginHandles[handleId];
	    if (pluginHandle === null || pluginHandle === undefined) {
	      // Nothing to clean
	      return;
	    }
	    var config = pluginHandle.webrtcStuff;
	    if (config !== null && config !== undefined) {
	      if (hangupRequest === true) {
	        // Send a hangup request (we don't really care about the response)
	        var request = {
	          "rtcgw": "hangup",
	          "transaction": Janus.randomString(12)
	        };
	        if (pluginHandle.token !== null && pluginHandle.token !== undefined) request["token"] = pluginHandle.token;
	        if (apisecret !== null && apisecret !== undefined) request["apisecret"] = apisecret;
	        Janus.debug("Sending hangup request (handle=" + handleId + "):");
	        Janus.debug(request);
	        if (websockets) {
	          request["session_id"] = sessionId;
	          request["handle_id"] = handleId;
	          ws.send(JSON.stringify(request));
	        } else {
	          Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
	            verb: 'POST',
	            withCredentials: withCredentials,
	            body: request
	          });
	        }
	      }
	      // Cleanup stack
	      config.remoteStream = null;
	      if (config.volume) {
	        if (config.volume["local"] && config.volume["local"].timer) clearInterval(config.volume["local"].timer);
	        if (config.volume["remote"] && config.volume["remote"].timer) clearInterval(config.volume["remote"].timer);
	      }
	      config.volume = {};
	      if (config.bitrate.timer) clearInterval(config.bitrate.timer);
	      config.bitrate.timer = null;
	      config.bitrate.bsnow = null;
	      config.bitrate.bsbefore = null;
	      config.bitrate.tsnow = null;
	      config.bitrate.tsbefore = null;
	      config.bitrate.value = null;
	      try {
	        // Try a MediaStreamTrack.stop() for each track
	        if (!config.streamExternal && config.myStream !== null && config.myStream !== undefined) {
	          Janus.log("Stopping local stream tracks");
	          var tracks = config.myStream.getTracks();
	          for (var i in tracks) {
	            var mst = tracks[i];
	            Janus.log(mst);
	            if (mst !== null && mst !== undefined) mst.stop();
	          }
	        }
	      } catch (e) {
	        // Do nothing if this fails
	      }
	      config.streamExternal = false;
	      config.myStream = null;
	      // Close PeerConnection
	      try {
	        Janus.log('关闭peerConnection');
	        config.pc.close();
	      } catch (e) {
	        // Do nothing
	      }
	      config.pc = null;
	      config.candidates = null;
	      config.mySdp = null;
	      config.remoteSdp = null;
	      config.iceDone = false;
	      config.dataChannel = {};
	      config.dtmfSender = null;
	    }
	    pluginHandle.oncleanup();
	  }

	  // Helper methods to parse a media object
	  function isAudioSendEnabled(media) {
	    Janus.debug("isAudioSendEnabled:", media);
	    if (media === undefined || media === null) return true; // Default
	    if (media.audio === false) return false; // Generic audio has precedence
	    if (media.audioSend === undefined || media.audioSend === null) return true; // Default
	    return media.audioSend === true;
	  }
	  function isAudioSendRequired(media) {
	    Janus.debug("isAudioSendRequired:", media);
	    if (media === undefined || media === null) return false; // Default
	    if (media.audio === false || media.audioSend === false) return false; // If we're not asking to capture audio, it's not required
	    if (media.failIfNoAudio === undefined || media.failIfNoAudio === null) return false; // Default
	    return media.failIfNoAudio === true;
	  }
	  function isAudioRecvEnabled(media) {
	    Janus.debug("isAudioRecvEnabled:", media);
	    if (media === undefined || media === null) return true; // Default
	    if (media.audio === false) return false; // Generic audio has precedence
	    if (media.audioRecv === undefined || media.audioRecv === null) return true; // Default
	    return media.audioRecv === true;
	  }
	  function isVideoSendEnabled(media) {
	    Janus.debug("isVideoSendEnabled:", media);
	    if (media === undefined || media === null) return true; // Default
	    if (media.video === false) return false; // Generic video has precedence
	    if (media.videoSend === undefined || media.videoSend === null) return true; // Default
	    return media.videoSend === true;
	  }
	  function isVideoSendRequired(media) {
	    Janus.debug("isVideoSendRequired:", media);
	    if (media === undefined || media === null) return false; // Default
	    if (media.video === false || media.videoSend === false) return false; // If we're not asking to capture video, it's not required
	    if (media.failIfNoVideo === undefined || media.failIfNoVideo === null) return false; // Default
	    return media.failIfNoVideo === true;
	  }
	  function isVideoRecvEnabled(media) {
	    Janus.debug("isVideoRecvEnabled:", media);
	    if (media === undefined || media === null) return true; // Default
	    if (media.video === false) return false; // Generic video has precedence
	    if (media.videoRecv === undefined || media.videoRecv === null) return true; // Default
	    return media.videoRecv === true;
	  }
	  function isScreenSendEnabled(media) {
	    Janus.debug("isScreenSendEnabled:", media);
	    if (media === undefined || media === null) return false;
	    if (typeof media.video !== 'object' || typeof media.video.mandatory !== 'object') return false;
	    var constraints = media.video.mandatory;
	    if (constraints.chromeMediaSource) return constraints.chromeMediaSource === 'desktop' || constraints.chromeMediaSource === 'screen';else if (constraints.mozMediaSource) return constraints.mozMediaSource === 'window' || constraints.mozMediaSource === 'screen';else if (constraints.mediaSource) return constraints.mediaSource === 'window' || constraints.mediaSource === 'screen';
	    return false;
	  }
	  function isDataEnabled(media) {
	    Janus.debug("isDataEnabled:", media);
	    if (Janus.webRTCAdapter.browserDetails.browser == "edge") {
	      Janus.warn("Edge doesn't support data channels yet");
	      return false;
	    }
	    if (media === undefined || media === null) return false; // Default
	    return media.data === true;
	  }
	  function isTrickleEnabled(trickle) {
	    Janus.debug("isTrickleEnabled:", trickle);
	    if (trickle === undefined || trickle === null) return true; // Default is true
	    return trickle === true;
	  }
	}

	var $$6 = _export;
	var toObject$3 = toObject$9;
	var lengthOfArrayLike$2 = lengthOfArrayLike$8;
	var toIntegerOrInfinity$2 = toIntegerOrInfinity$6;
	var addToUnscopables$1 = addToUnscopables$4;

	// `Array.prototype.at` method
	// https://tc39.es/ecma262/#sec-array.prototype.at
	$$6({
	  target: 'Array',
	  proto: true
	}, {
	  at: function at(index) {
	    var O = toObject$3(this);
	    var len = lengthOfArrayLike$2(O);
	    var relativeIndex = toIntegerOrInfinity$2(index);
	    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	    return k < 0 || k >= len ? undefined : O[k];
	  }
	});
	addToUnscopables$1('at');

	var bind = functionBindContext;
	var IndexedObject$1 = indexedObject;
	var toObject$2 = toObject$9;
	var lengthOfArrayLike$1 = lengthOfArrayLike$8;

	// `Array.prototype.{ findLast, findLastIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_FIND_LAST_INDEX = TYPE === 1;
	  return function ($this, callbackfn, that) {
	    var O = toObject$2($this);
	    var self = IndexedObject$1(O);
	    var index = lengthOfArrayLike$1(self);
	    var boundFunction = bind(callbackfn, that);
	    var value, result;
	    while (index-- > 0) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (result) switch (TYPE) {
	        case 0:
	          return value;
	        // findLast
	        case 1:
	          return index;
	        // findLastIndex
	      }
	    }
	    return IS_FIND_LAST_INDEX ? -1 : undefined;
	  };
	};
	var arrayIterationFromLast = {
	  // `Array.prototype.findLastIndex` method
	  // https://github.com/tc39/proposal-array-find-from-last
	  findLastIndex: createMethod$1(1)
	};

	var $$5 = _export;
	var $findLastIndex = arrayIterationFromLast.findLastIndex;
	var addToUnscopables = addToUnscopables$4;

	// `Array.prototype.findLastIndex` method
	// https://tc39.es/ecma262/#sec-array.prototype.findlastindex
	$$5({
	  target: 'Array',
	  proto: true
	}, {
	  findLastIndex: function findLastIndex(callbackfn /* , that = undefined */) {
	    return $findLastIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	addToUnscopables('findLastIndex');

	var $$4 = _export;
	var uncurryThis$3 = functionUncurryThis;
	var requireObjectCoercible$1 = requireObjectCoercible$6;
	var toIntegerOrInfinity$1 = toIntegerOrInfinity$6;
	var toString$2 = toString$b;
	var fails$6 = fails$w;
	var charAt$3 = uncurryThis$3(''.charAt);
	var FORCED$2 = fails$6(function () {
	  // eslint-disable-next-line es/no-string-prototype-at -- safe
	  return '𠮷'.at(-2) !== '\uD842';
	});

	// `String.prototype.at` method
	// https://tc39.es/ecma262/#sec-string.prototype.at
	$$4({
	  target: 'String',
	  proto: true,
	  forced: FORCED$2
	}, {
	  at: function at(index) {
	    var S = toString$2(requireObjectCoercible$1(this));
	    var len = S.length;
	    var relativeIndex = toIntegerOrInfinity$1(index);
	    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	    return k < 0 || k >= len ? undefined : charAt$3(S, k);
	  }
	});

	var aCallable$3 = aCallable$g;
	var toObject$1 = toObject$9;
	var IndexedObject = indexedObject;
	var lengthOfArrayLike = lengthOfArrayLike$8;
	var $TypeError$3 = TypeError;
	var REDUCE_EMPTY = 'Reduce of empty array with no initial value';

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    var O = toObject$1(that);
	    var self = IndexedObject(O);
	    var length = lengthOfArrayLike(O);
	    aCallable$3(callbackfn);
	    if (length === 0 && argumentsLength < 2) throw new $TypeError$3(REDUCE_EMPTY);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw new $TypeError$3(REDUCE_EMPTY);
	      }
	    }
	    for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};
	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod(false)};

	var fails$5 = fails$w;
	var arrayMethodIsStrict$1 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$5(function () {
	    // eslint-disable-next-line no-useless-call -- required for testing
	    method.call(null, argument || function () {
	      return 1;
	    }, 1);
	  });
	};

	var $$3 = _export;
	var $reduce = arrayReduce.left;
	var arrayMethodIsStrict = arrayMethodIsStrict$1;
	var CHROME_VERSION = environmentV8Version;
	var IS_NODE = environmentIsNode;

	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
	var FORCED$1 = CHROME_BUG || !arrayMethodIsStrict('reduce');

	// `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce
	$$3({
	  target: 'Array',
	  proto: true,
	  forced: FORCED$1
	}, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    var length = arguments.length;
	    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
	  }
	});

	var isObject$1 = isObject$h;
	var classof$2 = classofRaw$2;
	var wellKnownSymbol$3 = wellKnownSymbol$m;
	var MATCH$1 = wellKnownSymbol$3('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject$1(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classof$2(it) === 'RegExp');
	};

	var globalThis$2 = globalThis_1;
	var fails$4 = fails$w;

	// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
	var RegExp$1 = globalThis$2.RegExp;
	var FLAGS_GETTER_IS_CORRECT = !fails$4(function () {
	  var INDICES_SUPPORT = true;
	  try {
	    RegExp$1('.', 'd');
	  } catch (error) {
	    INDICES_SUPPORT = false;
	  }
	  var O = {};
	  // modern V8 bug
	  var calls = '';
	  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';
	  var addGetter = function (key, chr) {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty(O, key, {
	      get: function () {
	        calls += chr;
	        return true;
	      }
	    });
	  };
	  var pairs = {
	    dotAll: 's',
	    global: 'g',
	    ignoreCase: 'i',
	    multiline: 'm',
	    sticky: 'y'
	  };
	  if (INDICES_SUPPORT) pairs.hasIndices = 'd';
	  for (var key in pairs) addGetter(key, pairs[key]);

	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  var result = Object.getOwnPropertyDescriptor(RegExp$1.prototype, 'flags').get.call(O);
	  return result !== expected || calls !== expected;
	});
	var regexpFlagsDetection = {
	  correct: FLAGS_GETTER_IS_CORRECT
	};

	var call$5 = functionCall;
	var hasOwn$1 = hasOwnProperty_1;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var regExpFlagsDetection = regexpFlagsDetection;
	var regExpFlagsGetterImplementation = regexpFlags$1;
	var RegExpPrototype$3 = RegExp.prototype;
	var regexpGetFlags = regExpFlagsDetection.correct ? function (it) {
	  return it.flags;
	} : function (it) {
	  return !regExpFlagsDetection.correct && isPrototypeOf$1(RegExpPrototype$3, it) && !hasOwn$1(it, 'flags') ? call$5(regExpFlagsGetterImplementation, it) : it.flags;
	};

	var DESCRIPTORS$1 = descriptors;
	var globalThis$1 = globalThis_1;
	var uncurryThis$2 = functionUncurryThis;
	var isForced = isForced_1;
	var inheritIfRequired = inheritIfRequired$2;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$a;
	var create = objectCreate;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var isPrototypeOf = objectIsPrototypeOf;
	var isRegExp = isRegexp;
	var toString$1 = toString$b;
	var getRegExpFlags$1 = regexpGetFlags;
	var stickyHelpers = regexpStickyHelpers;
	var proxyAccessor = proxyAccessor$2;
	var defineBuiltIn$1 = defineBuiltIn$d;
	var fails$3 = fails$w;
	var hasOwn = hasOwnProperty_1;
	var enforceInternalState = internalState.enforce;
	var setSpecies = setSpecies$2;
	var wellKnownSymbol$2 = wellKnownSymbol$m;
	var UNSUPPORTED_DOT_ALL$1 = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG = regexpUnsupportedNcg;
	var MATCH = wellKnownSymbol$2('match');
	var NativeRegExp = globalThis$1.RegExp;
	var RegExpPrototype$2 = NativeRegExp.prototype;
	var SyntaxError$1 = globalThis$1.SyntaxError;
	var exec = uncurryThis$2(RegExpPrototype$2.exec);
	var charAt$2 = uncurryThis$2(''.charAt);
	var replace$1 = uncurryThis$2(''.replace);
	var stringIndexOf$1 = uncurryThis$2(''.indexOf);
	var stringSlice$2 = uncurryThis$2(''.slice);
	// TODO: Use only proper RegExpIdentifierName
	var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;
	var MISSED_STICKY = stickyHelpers.MISSED_STICKY;
	var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
	var BASE_FORCED = DESCRIPTORS$1 && (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL$1 || UNSUPPORTED_NCG || fails$3(function () {
	  re2[MATCH] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  // eslint-disable-next-line sonarjs/inconsistent-function-call -- required for testing
	  return NativeRegExp(re1) !== re1 || NativeRegExp(re2) === re2 || String(NativeRegExp(re1, 'i')) !== '/a/i';
	}));
	var handleDotAll = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var brackets = false;
	  var chr;
	  for (; index < length; index++) {
	    chr = charAt$2(string, index);
	    if (chr === '\\') {
	      result += chr + charAt$2(string, ++index);
	      continue;
	    }
	    if (!brackets && chr === '.') {
	      result += '[\\s\\S]';
	    } else {
	      if (chr === '[') {
	        brackets = true;
	      } else if (chr === ']') {
	        brackets = false;
	      }
	      result += chr;
	    }
	  }
	  return result;
	};
	var handleNCG = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var named = [];
	  var names = create(null);
	  var brackets = false;
	  var ncg = false;
	  var groupid = 0;
	  var groupname = '';
	  var chr;
	  for (; index < length; index++) {
	    chr = charAt$2(string, index);
	    if (chr === '\\') {
	      chr += charAt$2(string, ++index);
	      // use `\x5c` for escaped backslash to avoid corruption by `\k<name>` to `\N` replacement below
	      if (!ncg && charAt$2(chr, 1) === '\\') {
	        result += '\\x5c';
	        continue;
	      }
	    } else if (chr === ']') {
	      brackets = false;
	    } else if (!brackets) switch (true) {
	      case chr === '[':
	        brackets = true;
	        break;
	      case chr === '(':
	        result += chr;
	        if (exec(IS_NCG, stringSlice$2(string, index + 1))) {
	          index += 2;
	          ncg = true;
	          groupid++;
	        } else if (charAt$2(string, index + 1) !== '?') {
	          groupid++;
	        }
	        continue;
	      case chr === '>' && ncg:
	        if (groupname === '' || hasOwn(names, groupname)) {
	          throw new SyntaxError$1('Invalid capture group name');
	        }
	        names[groupname] = true;
	        named[named.length] = [groupname, groupid];
	        ncg = false;
	        groupname = '';
	        continue;
	    }
	    if (ncg) groupname += chr;else result += chr;
	  }
	  // convert `\k<name>` backreferences to numbered backreferences
	  for (var ni = 0; ni < named.length; ni++) {
	    var backref = '\\k<' + named[ni][0] + '>';
	    var numRef = '\\' + named[ni][1];
	    while (stringIndexOf$1(result, backref) > -1) {
	      result = replace$1(result, backref, numRef);
	    }
	  }
	  return [result, named];
	};

	// `RegExp` constructor
	// https://tc39.es/ecma262/#sec-regexp-constructor
	if (isForced('RegExp', BASE_FORCED)) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = isPrototypeOf(RegExpPrototype$2, this);
	    var patternIsRegExp = isRegExp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var groups = [];
	    var rawPattern = pattern;
	    var rawFlags, dotAll, sticky, handled, result, state;
	    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
	      return pattern;
	    }
	    if (patternIsRegExp || isPrototypeOf(RegExpPrototype$2, pattern)) {
	      pattern = pattern.source;
	      if (flagsAreUndefined) flags = getRegExpFlags$1(rawPattern);
	    }
	    pattern = pattern === undefined ? '' : toString$1(pattern);
	    flags = flags === undefined ? '' : toString$1(flags);
	    rawPattern = pattern;
	    if (UNSUPPORTED_DOT_ALL$1 && 'dotAll' in re1) {
	      dotAll = !!flags && stringIndexOf$1(flags, 's') > -1;
	      if (dotAll) flags = replace$1(flags, /s/g, '');
	    }
	    rawFlags = flags;
	    if (MISSED_STICKY && 'sticky' in re1) {
	      sticky = !!flags && stringIndexOf$1(flags, 'y') > -1;
	      if (sticky && UNSUPPORTED_Y) flags = replace$1(flags, /y/g, '');
	    }
	    if (UNSUPPORTED_NCG) {
	      handled = handleNCG(pattern);
	      pattern = handled[0];
	      groups = handled[1];
	    }
	    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$2, RegExpWrapper);
	    if (dotAll || sticky || groups.length) {
	      state = enforceInternalState(result);
	      if (dotAll) {
	        state.dotAll = true;
	        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
	      }
	      if (sticky) state.sticky = true;
	      if (groups.length) state.groups = groups;
	    }
	    if (pattern !== rawPattern) try {
	      // fails in old engines, but we have no alternatives for unsupported regex syntax
	      createNonEnumerableProperty$1(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
	    } catch (error) {/* empty */}
	    return result;
	  };
	  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
	    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
	  }
	  RegExpPrototype$2.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$2;
	  defineBuiltIn$1(globalThis$1, 'RegExp', RegExpWrapper, {
	    constructor: true
	  });
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var DESCRIPTORS = descriptors;
	var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
	var classof$1 = classofRaw$2;
	var defineBuiltInAccessor = defineBuiltInAccessor$6;
	var getInternalState = internalState.get;
	var RegExpPrototype$1 = RegExp.prototype;
	var $TypeError$2 = TypeError;

	// `RegExp.prototype.dotAll` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
	if (DESCRIPTORS && UNSUPPORTED_DOT_ALL) {
	  defineBuiltInAccessor(RegExpPrototype$1, 'dotAll', {
	    configurable: true,
	    get: function dotAll() {
	      if (this === RegExpPrototype$1) return;
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (classof$1(this) === 'RegExp') {
	        return !!getInternalState(this).dotAll;
	      }
	      throw new $TypeError$2('Incompatible receiver, RegExp required');
	    }
	  });
	}

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var call$4 = functionCall;
	var defineBuiltIn = defineBuiltIn$d;
	var regexpExec$1 = regexpExec$2;
	var fails$2 = fails$w;
	var wellKnownSymbol$1 = wellKnownSymbol$m;
	var createNonEnumerableProperty = createNonEnumerableProperty$a;
	var SPECIES = wellKnownSymbol$1('species');
	var RegExpPrototype = RegExp.prototype;
	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol$1(KEY);
	  var DELEGATES_TO_SYMBOL = !fails$2(function () {
	    // String methods call symbol-named RegExp methods
	    var O = {};
	    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	    O[SYMBOL] = function () {
	      return 7;
	    };
	    return ''[KEY](O) !== 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$2(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;
	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      var constructor = {};
	      // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	      constructor[SPECIES] = function () {
	        return re;
	      };
	      re = {
	        constructor: constructor,
	        flags: ''
	      };
	      // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
	      re[SYMBOL] = /./[SYMBOL];
	    }
	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };
	    re[SYMBOL]('');
	    return !execCalled;
	  });
	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var $exec = regexp.exec;
	      if ($exec === regexpExec$1 || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: call$4(nativeRegExpMethod, regexp, str, arg2)
	          };
	        }
	        return {
	          done: true,
	          value: call$4(nativeMethod, str, regexp, arg2)
	        };
	      }
	      return {
	        done: false
	      };
	    });
	    defineBuiltIn(String.prototype, KEY, methods[0]);
	    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
	  }
	  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex$1 = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length || 1 : 1);
	};

	var uncurryThis$1 = functionUncurryThis;
	var toObject = toObject$9;
	var floor = Math.floor;
	var charAt = uncurryThis$1(''.charAt);
	var replace = uncurryThis$1(''.replace);
	var stringSlice$1 = uncurryThis$1(''.slice);
	// eslint-disable-next-line redos/no-vulnerable -- safe
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution$1 = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (charAt(ch, 0)) {
	      case '$':
	        return '$';
	      case '&':
	        return matched;
	      case '`':
	        return stringSlice$1(str, 0, position);
	      case "'":
	        return stringSlice$1(str, tailPos);
	      case '<':
	        capture = namedCaptures[stringSlice$1(ch, 1, -1)];
	        break;
	      default:
	        // \d\d?
	        var n = +ch;
	        if (n === 0) return match;
	        if (n > m) {
	          var f = floor(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var call$3 = functionCall;
	var anObject$3 = anObject$l;
	var isCallable$1 = isCallable$r;
	var classof = classofRaw$2;
	var regexpExec = regexpExec$2;
	var $TypeError$1 = TypeError;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable$1(exec)) {
	    var result = call$3(exec, R, S);
	    if (result !== null) anObject$3(result);
	    return result;
	  }
	  if (classof(R) === 'RegExp') return call$3(regexpExec, R, S);
	  throw new $TypeError$1('RegExp#exec called on incompatible receiver');
	};

	var apply$1 = functionApply;
	var call$2 = functionCall;
	var uncurryThis = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var fails$1 = fails$w;
	var anObject$2 = anObject$l;
	var isCallable = isCallable$r;
	var isObject = isObject$h;
	var toIntegerOrInfinity = toIntegerOrInfinity$6;
	var toLength = toLength$2;
	var toString = toString$b;
	var requireObjectCoercible = requireObjectCoercible$6;
	var advanceStringIndex = advanceStringIndex$1;
	var getMethod = getMethod$5;
	var getSubstitution = getSubstitution$1;
	var getRegExpFlags = regexpGetFlags;
	var regExpExec = regexpExecAbstract;
	var wellKnownSymbol = wellKnownSymbol$m;
	var REPLACE = wellKnownSymbol('replace');
	var max = Math.max;
	var min = Math.min;
	var concat = uncurryThis([].concat);
	var push = uncurryThis([].push);
	var stringIndexOf = uncurryThis(''.indexOf);
	var stringSlice = uncurryThis(''.slice);
	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	}();

	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	}();
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$1(function () {
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };
	  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
	  return ''.replace(re, '$<a>') !== '7';
	});

	// @@replace logic
	fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
	  return [
	  // `String.prototype.replace` method
	  // https://tc39.es/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = requireObjectCoercible(this);
	    var replacer = isObject(searchValue) ? getMethod(searchValue, REPLACE) : undefined;
	    return replacer ? call$2(replacer, searchValue, O, replaceValue) : call$2(nativeReplace, toString(O), searchValue, replaceValue);
	  },
	  // `RegExp.prototype[@@replace]` method
	  // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	  function (string, replaceValue) {
	    var rx = anObject$2(this);
	    var S = toString(string);
	    var functionalReplace = isCallable(replaceValue);
	    if (!functionalReplace) replaceValue = toString(replaceValue);
	    var flags = toString(getRegExpFlags(rx));
	    if (typeof replaceValue == 'string' && !~stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) && !~stringIndexOf(replaceValue, '$<') && !~stringIndexOf(flags, 'y')) {
	      var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	      if (res.done) return res.value;
	    }
	    var global = !!~stringIndexOf(flags, 'g');
	    var fullUnicode;
	    if (global) {
	      fullUnicode = !!~stringIndexOf(flags, 'u') || !!~stringIndexOf(flags, 'v');
	      rx.lastIndex = 0;
	    }
	    var results = [];
	    var result;
	    while (true) {
	      result = regExpExec(rx, S);
	      if (result === null) break;
	      push(results, result);
	      if (!global) break;
	      var matchStr = toString(result[0]);
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	    }
	    var accumulatedResult = '';
	    var nextSourcePosition = 0;
	    for (var i = 0; i < results.length; i++) {
	      result = results[i];
	      var matched = toString(result[0]);
	      var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
	      var captures = [];
	      var replacement;
	      // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	      for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
	      var namedCaptures = result.groups;
	      if (functionalReplace) {
	        var replacerArgs = concat([matched], captures, position, S);
	        if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
	        replacement = toString(apply$1(replaceValue, undefined, replacerArgs));
	      } else {
	        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	      }
	      if (position >= nextSourcePosition) {
	        accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
	        nextSourcePosition = position + matched.length;
	      }
	    }
	    return accumulatedResult + stringSlice(S, nextSourcePosition);
	  }];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

	const ERROR_CODE = {
	  // 成功
	  ERR_OK: {
	    code: 0,
	    desc: '成功'
	  },
	  /**
	   * 一般性错误
	   * */
	  ERR_UNKNOWN: {
	    code: 100001,
	    desc: '未知错误'
	  },
	  ERR_INIT_FAILED: {
	    code: 100002,
	    desc: '初始化失败'
	  },
	  ERR_NOT_SUPPORT: {
	    code: 100003,
	    desc: '调用不支持'
	  },
	  ERR_INVALID_ARGUMENT: {
	    code: 100004,
	    desc: '参数非法'
	  },
	  ERR_REFUSED: {
	    code: 100005,
	    desc: '调用被拒绝'
	  },
	  ERR_NOT_INIT: {
	    code: 100006,
	    desc: 'SDK尚未初始化'
	  },
	  ERR_TIMEOUT: {
	    code: 100007,
	    desc: '调用超时'
	  },
	  // ERR_NOT_IN_ROOM: {
	  //   code: 100008,
	  //   desc: '房间内用户不存在'
	  // },
	  ERR_REQUEST_PARAMETER: {
	    code: 100009,
	    desc: '接口请求参数错误'
	  },
	  ERR_REQUEST_UNKNOWN: {
	    code: 100010,
	    desc: '接口请求异常'
	  },
	  ERR_SDK_CONNECTED: {
	    code: 100011,
	    desc: 'SDK连接异常'
	  },
	  /**
	   * 房间相关错误
	   * */
	  ERR_ROOM_ENTER_FAIL: {
	    code: 101001,
	    desc: '进入房间失败'
	  },
	  // ERR_ROOM_INVALID_PARAMETER: {
	  //   code: 101002,
	  //   desc: '进入房间参数错误'
	  // },
	  // ERR_ROOM_INVALID_APPID: {
	  //   code: 101003,
	  //   desc: '不是有效的App ID'
	  // },
	  // ERR_ROOM_INVALID_ROOM: {
	  //   code: 101004,
	  //   desc: '房间号无效'
	  // },
	  // ERR_ROOM_INVALID_USERID: {
	  //   code: 101005,
	  //   desc: '无效的用户'
	  // },
	  ERR_ROOM_INVALID_TOKEN: {
	    code: 101006,
	    desc: '无效token'
	  },
	  // ERR_ROOM_ENTER_TIMEOUT: {
	  //   code: 101007,
	  //   desc: '进入房间超时'
	  // },
	  // ERR_ROOM_INVALID_SERVICE: {
	  //   code: 101008,
	  //   desc: '服务不可用'
	  // },
	  // ERR_ALREADY_IN_USE: {
	  //   code: 101009,
	  //   desc: '资源已被占用'
	  // },
	  // ERR_PASSWORD: {
	  //   code: 101010,
	  //   desc: '进入房间密码错误'
	  // },
	  ERR_TOKEN_EXPIRED: {
	    code: 101011,
	    desc: 'token异常或过期'
	  },
	  // ERR_ROOM_KEEPALIVE_TIMEOUT: {
	  //   code: 101012,
	  //   desc: '房间内客户端同服务心跳断开'
	  // },
	  // ERR_STS_CHECK_CLIENT_KEEP_TIMEOUT: {
	  //   code: 101025,
	  //   desc: '服务端检测客户端心跳超时'
	  // },
	  ERR_ROOM_EXIT_FAIL: {
	    code: 101501,
	    desc: '退出房间失败'
	  },
	  ERR_SERVICE_ACCESSTOKEN_INVALID: {
	    code: 210002,
	    desc: 'accessToken异常或过期'
	  },
	  /**
	   * 设备相关错误
	   * */
	  ERR_DEVICE_NO_PERMISSION: {
	    code: 102001,
	    desc: '设备未授权'
	  },
	  ERR_CAMERA_START_FAIL: {
	    code: 102002,
	    desc: '摄像头驱动异常'
	  },
	  // ERR_CAMERA_BUSY: {
	  //   code: 102003,
	  //   desc: '摄像头正在被占用中'
	  // },
	  ERR_CAMERA_SET_PARAM_FAIL: {
	    code: 102004,
	    desc: '摄像头参数设置出错（参数不支持或其它）'
	  },
	  ERR_NO_DEVICE: {
	    code: 102005,
	    desc: '未查询到设备'
	  },
	  ERR_MICROPHONE_UNKNOWN: {
	    code: 102401,
	    desc: '麦克风未知错误'
	  },
	  // ERR_MICROPHONE_CAPTURE_FAIL: {
	  //   code: 102402,
	  //   desc: '采集音频错误'
	  // },
	  // ERR_MICROPHONE_BUSY: {
	  //   code: 102403,
	  //   desc: '无麦克风或麦克风正在使用中'
	  // },
	  ERR_MICROPHONE_START_FAIL: {
	    code: 102404,
	    desc: '麦克风驱动异常'
	  },
	  ERR_MICROPHONE_SET_PARAM_FAIL: {
	    code: 102405,
	    desc: '麦克风参数错误'
	  },
	  // ERR_MICROPHONE_STOP_FAIL: {
	  //   code: 102406,
	  //   desc: '停止麦克风失败'
	  // },
	  // ERR_SPEAKER_START_FAIL: {
	  //   code: 102801,
	  //   desc: '扬声器驱动异常'
	  // },
	  // ERR_SPEAKER_SET_PARAM_FAIL: {
	  //   code: 102802,
	  //   desc: '扬声器设置参数失败'
	  // },
	  // ERR_SPEAKER_PLAY_FAIL: {
	  //   code: 102803,
	  //   desc: '播放音频错误'
	  // },
	  // ERR_SPEAKER_STOP_FAIL: {
	  //   code: 102804,
	  //   desc: '停止扬声器失败'
	  // },
	  ERR_SUBSCRIBE_FAIL: {
	    code: 102902,
	    desc: '订阅音视频失败'
	  },
	  /**
	   * 编解码错误
	   * */
	  // ERR_VIDEO_ENCODE_FAIL: {
	  //   code: 103201,
	  //   desc: '视频编码失败'
	  // },
	  // ERR_VIDEO_UNSUPPORT_RES: {
	  //   code: 103202,
	  //   desc: '不支持的视频分辨率'
	  // },
	  // ERR_AUDIO_ENCODE_FAIL: {
	  //   code: 103203,
	  //   desc: '音频编码失败'
	  // },
	  // ERR_AUDIO_UNSUPPORT_SMAPLERATE: {
	  //   code: 103204,
	  //   desc: '不支持的音频采样率'
	  // },
	  // ERR_MEDIA_LOAD_FAILED: {
	  //   code: 103205,
	  //   desc: '媒体模块加载失败'
	  // },
	  /**
	   * 信令相关错误
	   * */
	  ERR_SIGNAL_SEND: {
	    code: 104001,
	    desc: '信令发送报错'
	  },
	  ERR_SIGNAL_RECEIVE: {
	    code: 104002,
	    desc: '信令接收报错'
	  }
	  /**
	   * 网络相关错误
	   * */
	  // ERR_SERVICE_RESPONSE_BAD: {
	  //   code: 200001,
	  //   desc: '平台服务不在'
	  // },
	  // ERR_CURLE_COULDNT_RESOLVE_HOST: {
	  //   code: 200006,
	  //   desc: '无法解析平台地址，请检查DNS配置'
	  // },
	  // ERR_CURLE_COULDNT_CONNECT: {
	  //   code: 200007,
	  //   desc: '无法连接主机，请检查网络'
	  // },
	  // ERR_CURLE_OPERATION_TIMEDOUT: {
	  //   code: 200028,
	  //   desc: '操作超时，可能服务不在线或者不支持'
	  // },
	  // ERR_SERVICE_APPID_NOTEXIST: {
	  //   code: 210017,
	  //   desc: 'appId不存在'
	  // },
	  // ERR_SERVICE_APPID_TOKEN_NOTMATCH: {
	  //   code: 210018,
	  //   desc: 'AccessToken与Appkey不匹配'
	  // },
	};

	// 匹配getUserMedia报错
	const mapErrorGetUserMedia = (error, kind) => {
	  const errorMap = {
	    'NotAllowedError': {
	      'video': 'ERR_DEVICE_NO_PERMISSION',
	      'audio': 'ERR_DEVICE_NO_PERMISSION',
	      'screen': 'ERR_DEVICE_NO_PERMISSION'
	    },
	    'NotFoundError': {
	      'video': 'ERR_CAMERA_START_FAIL',
	      'audio': 'ERR_MICROPHONE_START_FAIL',
	      'screen': 'ERR_DEVICE_NO_PERMISSION'
	    },
	    'NotReadableError': {
	      'video': 'ERR_CAMERA_START_FAIL',
	      'audio': 'ERR_MICROPHONE_START_FAIL',
	      'screen': 'ERR_DEVICE_NO_PERMISSION'
	    },
	    'OverconstrainedError': {
	      'video': 'ERR_CAMERA_SET_PARAM_FAIL',
	      'audio': 'ERR_MICROPHONE_SET_PARAM_FAIL',
	      'screen': 'ERR_UNKNOWN'
	    },
	    'AbortError': {
	      'video': 'ERR_CAMERA_START_FAIL',
	      'audio': 'ERR_MICROPHONE_UNKNOWN',
	      'screen': 'ERR_UNKNOWN'
	    },
	    'SecurityError': {
	      'video': 'ERR_CAMERA_START_FAIL',
	      'audio': 'ERR_MICROPHONE_START_FAIL',
	      'screen': 'ERR_UNKNOWN'
	    }
	  };
	  if (errorMap[error === null || error === void 0 ? void 0 : error.name]) {
	    return errorCodeFormat({
	      key: errorMap[error.name][kind],
	      msg: error.message
	    });
	  }
	  return null;
	};

	// 匹配开放平台接口报错
	const mapErrorOpenPlatform = error => {
	  const errorMap = {
	    '10002': 'ERR_SERVICE_ACCESSTOKEN_INVALID',
	    '400': 'ERR_REQUEST_PARAMETER'
	  };
	  return errorCodeFormat({
	    key: errorMap[error.code] || 'ERR_REQUEST_UNKNOWN',
	    msg: error.message,
	    data: error
	  });
	};

	// 匹配信令消息错误
	const mapErrorSignalReceived = error => {
	  const errorMap = {
	    '-101': 'ERR_SIGNAL_RECEIVE' // 已存在屏幕共享流
	  };
	  return errorCodeFormat({
	    key: errorMap[error.code] || 'ERR_SIGNAL_RECEIVE',
	    msg: error.msg,
	    data: error
	  });
	};

	// 错误码使用
	function errorCodeFormat(errorKey) {
	  const isObj = typeof errorKey === 'object';
	  if (isObj) {
	    let msg = errorKey.msg || ERROR_CODE[errorKey.key].desc;
	    // 对 Error 数据类型做特殊处理
	    if (errorKey.msg instanceof Error) {
	      msg = msg.message;
	    }
	    return {
	      code: ERROR_CODE[errorKey.key].code,
	      msg,
	      data: errorKey.data || null
	    };
	  } else {
	    return {
	      code: ERROR_CODE[errorKey].code,
	      msg: ERROR_CODE[errorKey].desc,
	      data: null
	    };
	  }
	}

	// eslint-disable-next-line no-extend-native
	Date.prototype.Format = function (fmt) {
	  var o = {
	    "M+": this.getMonth() + 1,
	    "d+": this.getDate(),
	    "h+": this.getHours(),
	    "m+": this.getMinutes(),
	    "s+": this.getSeconds(),
	    "q+": Math.floor((this.getMonth() + 3) / 3),
	    "S": this.getMilliseconds()
	  };
	  if (/(y+)/.test(fmt)) {
	    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	  }
	  for (var k in o) {
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	  }
	  return fmt;
	};

	/*
	* deffer
	* 分配函数
	* @param {number} timeout - 超时时间 默认15秒
	*/
	function deffer$2() {
	  let timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 15000;
	  // 创建新的对象实例
	  let deferred = {};

	  // 构造 promise 对象
	  deferred.promise = new Promise((resolve, reject) => {
	    deferred.resolve = resolve;
	    deferred.reject = reject;
	  });
	  if (timeout) {
	    setTimeout(() => {
	      deferred.resolve(errorCodeFormat({
	        key: 'ERR_TIMEOUT',
	        msg: 'timeout'
	      }));
	    }, timeout);
	  }

	  // 返回包含了 promise 的对象
	  return deferred;
	}

	/**
	 * 超时promise
	 * @param {number} time - 超时时间
	 * */
	function timeoutPromise() {
	  let time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
	  return new Promise((resolve, reject) => {
	    setTimeout(() => {
	      resolve('timeout');
	    }, time);
	  });
	}

	/**
	 * Promise队列
	 * */
	// export function PromiseQueue() {
	//   this.queueMap = new Map();

	//   this.add = ({ key, promise }) => {
	//     if (this.queueMap.has(key)) {
	//       this.queueMap.get(key).push(promise);
	//     } else {
	//       this.queueMap.set(key, [promise]);
	//     }

	//     promise.finally().then(() => this.next(key));
	//   }

	//   this.await = (key) => {
	//     const queue = this.queueMap.get(key);
	//     if (queue) {
	//       const promise = queue.shift();
	//       if (queue.length === 0) {
	//         this.queueMap.delete(key);
	//       }
	//       return promise;
	//     }
	//     return null;
	//   }
	// }

	/**
	 * 随机字符串
	 * @param {number} len - 长度
	 * */
	const randomString = function (len) {
	  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  var randomString = '';
	  for (var i = 0; i < len; i++) {
	    var randomPoz = Math.floor(Math.random() * charSet.length);
	    randomString += charSet.substring(randomPoz, randomPoz + 1);
	  }
	  return randomString;
	};

	/* eslint-disable prefer-destructuring */
	/**
	 * @method fetchData GET POST 请求处理函数
	 * @param { String } url      请求地址 (必选)
	 * @param { String } method   请求方式 默认 GET 可选'GET'、'POST' (必选)
	 * @param { Object } data   请求参数 GET,POST 请求统一为对象格式,如无参数填写{}, 如{ key0: value0, key1: value1 } (必选)
	 * @param { Function } success 请求成功回调(必选),
	 * @param { Function } error 请求失败回调(可选)
	 */

	const fetchData = options => {
	  return new Promise((resolve, reject) => {
	    var _options$method;
	    const url = options.url || '';
	    const method = ((_options$method = options.method) === null || _options$method === void 0 ? void 0 : _options$method.toUpperCase()) || 'GET';
	    const data = options.data || {};
	    const headerOptions = options.headerOptions || {};
	    let headers = {
	      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	    };

	    // test11环境多版本部署配置
	    //  if (window.location.host === 'test11open.ys7.com' && /^\/api/.test(url)) {
	    //    url = url.replace('/api/', '/console/test12api/');
	    //  }
	    let paramsStr = '';
	    headers = Object.assign(headers, headerOptions);
	    var myHeaders = new Headers();
	    Object.keys(headers).map(item => {
	      myHeaders.append(item, headers[item]);
	    });
	    headers = myHeaders;

	    // 参数处理
	    Object.keys(Object.assign({}, data)).forEach(item => {
	      let value = data[item];
	      if (typeof data[item] === 'string') {
	        value = data[item].replace('%', '%25'); // decodeURIComponent 无法解析%
	      }
	      if (typeof data[item] === 'undefined') {
	        return;
	      }
	      paramsStr += `&${item}=${encodeURIComponent(value)}`;
	    });
	    if (paramsStr.length > 0) {
	      paramsStr = ['GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) !== -1 ? `?${paramsStr.slice(1)}` : paramsStr.slice(1);
	    }
	    let fetchUrl = url + (['GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) !== -1 ? paramsStr : '');
	    const requestObj = {
	      //  cache: 'no-cache', // 禁用缓存
	      headers,
	      method
	    };
	    if (method === 'POST') {
	      requestObj.body = paramsStr;
	    }
	    if (method === 'POST' && headerOptions && headerOptions['Content-Type'] === 'application/json') {
	      requestObj.body = JSON.stringify(data);
	    }

	    // GET请求增加随机参数 _r
	    if (method === 'GET') {
	      if (fetchUrl.indexOf('?') === -1) {
	        fetchUrl += `?_r=${Math.random()}`;
	      } else {
	        fetchUrl += `&_r=${Math.random()}`;
	      }
	    }
	    requestObj.credentials = 'same-origin';
	    fetch(fetchUrl, requestObj).then(response => response.json()).then(data => {
	      resolve(data);
	    }).catch(err => {
	      reject(err);
	    });
	  });
	};

	/**
	 * @description: 订阅发布装饰器，后续可以考虑换成基础类，通过集成的方式来
	 * */
	function eventbus(target) {
	  // target.prototype.listenList = {}; //订阅列表,多个实例之间共享，不知道为什么，class类这种方式的缺陷。
	  //添加订阅者
	  target.prototype.on = function (key, fn) {
	    if (!this.listenList) {
	      this.listenList = {};
	    }
	    if (!this.listenList[key]) {
	      this.listenList[key] = []; //如果没有订阅过此类消息 就给该消息创建订阅列表
	    }
	    this.listenList[key].push(fn); //将回调放入订阅列表
	  };
	  // 单次订阅
	  target.prototype.once = function (key, fn) {
	    const _this = this;
	    function on() {
	      _this.remove(key, on);
	      fn.apply(_this, arguments);
	    }
	    this.on(key, on);
	  };
	  //发布消息
	  target.prototype.trigger = function () {
	    var _this$listenList;
	    const key = Array.prototype.shift.call(arguments),
	      //取出消息类型
	      fns = (_this$listenList = this.listenList) === null || _this$listenList === void 0 ? void 0 : _this$listenList[key]; //取出该订阅对应的回调列表
	    if (!fns || fns.length === 0) return false; //没有订阅则直接返回
	    for (let i = 0, fn; fn = fns[i]; i++) {
	      fn.apply(this, arguments); //绑定this
	    }
	  };
	  //取消订阅
	  target.prototype.remove = function (key, fn) {
	    var _this$listenList2;
	    const fns = (_this$listenList2 = this.listenList) === null || _this$listenList2 === void 0 ? void 0 : _this$listenList2[key]; //取出该key对应的列表
	    if (!fns) {
	      //如果该key没被人订阅，直接返回
	      return false;
	    }
	    if (!fn) {
	      //如果传入了key但是没有对应的回调函数，则标识取消该key对应的所有订阅！！
	      fns && (fns.length = 0);
	    } else {
	      for (let len = fns.length - 1; len >= 0; len--) {
	        //反向遍历订阅的回调列表
	        const _fn = fns[len];
	        if (_fn === fn) {
	          fns.splice(len, 1); //删除订阅者的回调函数
	        }
	      }
	    }
	  };
	}

	var version = "2.1.3-alpha.21";
	var packageJson = {
		version: version};

	/**
	 * @description 工具函数装饰器
	 * */
	function utils (target) {
	  // 获取版本号
	  target.prototype.getVersion = function () {
	    return Promise.resolve(packageJson.version);
	  };
	  //获取浏览器兼容性（废弃）
	  target.prototype.getSupport = function () {
	    // 创建新的对象实例
	    let _deffer = deffer$2();
	    let obj = {
	      isWebrtcSupport: true,
	      isH264Support: true
	    };
	    var myVideo = document.createElement('video');
	    if (myVideo.canPlayType) {
	      if (myVideo.canPlayType('video/mp4;codecs="avc1.64001E"')) {
	        obj.isH264Support = true;
	      } else {
	        obj.isH264Support = false;
	      }
	    }
	    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && navigator.mediaDevices.getDisplayMedia) {
	      obj.isWebrtcSupport = true;
	      _deffer.resolve(errorCodeFormat({
	        key: 'ERR_OK',
	        data: obj
	      }));
	    } else {
	      obj.isWebrtcSupport = false;
	      _deffer.resolve(errorCodeFormat({
	        key: 'ERR_OK',
	        data: obj
	      }));
	    }
	    return _deffer.promise;
	  };
	  // 获取浏览器支持情况
	  target.prototype.isSupported = function () {
	    var _document$createEleme, _navigator$mediaDevic, _navigator$mediaDevic2;
	    const isSupportH264 = !!((_document$createEleme = document.createElement('video')) !== null && _document$createEleme !== void 0 && _document$createEleme.canPlayType('video/mp4;codecs="avc1.64001E"'));
	    const isSupportMedia = !!((_navigator$mediaDevic = navigator.mediaDevices) !== null && _navigator$mediaDevic !== void 0 && _navigator$mediaDevic.getUserMedia);
	    const isSupportScreen = !!((_navigator$mediaDevic2 = navigator.mediaDevices) !== null && _navigator$mediaDevic2 !== void 0 && _navigator$mediaDevic2.getDisplayMedia);
	    const isSupportWebmain = /^(https:\/\/|file:\/\/|http:\/\/localhost|http:\/\/127\.0\.0\.1).*$/.test(window.location.origin);
	    // const isBrowserSupported = 
	    const result = isSupportH264 && isSupportMedia && isSupportScreen && isSupportWebmain;
	    return errorCodeFormat({
	      key: 'ERR_OK',
	      data: {
	        result: result,
	        detail: {
	          isSupportH264,
	          isSupportMedia,
	          isSupportScreen,
	          isSupportWebmain
	        }
	      }
	    });
	  };

	  //获取所有设备列表
	  target.prototype.getMediaList = function () {
	    // 创建新的对象实例
	    let _deffer = deffer$2();
	    if (navigator.mediaDevices) {
	      target.log('获取媒体设备：', navigator.mediaDevices.enumerateDevices());
	      navigator.mediaDevices.enumerateDevices().then(devices => {
	        _deffer.resolve(errorCodeFormat({
	          key: 'ERR_OK',
	          data: devices
	        }));
	      });
	    } else {
	      _deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: "no devices"
	      }));
	    }
	    return _deffer.promise;
	  };

	  //获取摄像头列表
	  target.prototype.getCamerasList = function () {
	    // 创建新的对象实例
	    let _deffer = deffer$2();
	    if (navigator.mediaDevices) {
	      navigator.mediaDevices.enumerateDevices().then(devices => {
	        let arr = [];
	        devices.map(item => {
	          if (item.kind == "videoinput") {
	            arr.push(item);
	          }
	        });
	        _deffer.resolve(errorCodeFormat({
	          key: 'ERR_OK',
	          data: arr
	        }));
	      });
	    } else {
	      _deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: "no devices"
	      }));
	    }
	    return _deffer.promise;
	  };

	  //获取麦克风列表
	  target.prototype.getMicrophonesList = function () {
	    // 创建新的对象实例
	    let _deffer = deffer$2();
	    if (navigator.mediaDevices) {
	      navigator.mediaDevices.enumerateDevices().then(devices => {
	        let arr = [];
	        devices.map(item => {
	          if (item.kind == "audioinput") {
	            arr.push(item);
	          }
	        });
	        _deffer.resolve(errorCodeFormat({
	          key: 'ERR_OK',
	          data: arr
	        }));
	      });
	    } else {
	      _deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: "no devices"
	      }));
	    }
	    return _deffer.promise;
	  };

	  //获取扬声器列表
	  target.prototype.getSpeakerList = function () {
	    // 创建新的对象实例
	    let _deffer = deffer$2();
	    if (navigator.mediaDevices) {
	      navigator.mediaDevices.enumerateDevices().then(devices => {
	        let arr = [];
	        devices.map(item => {
	          if (item.kind == "audiooutput") {
	            arr.push(item);
	          }
	        });
	        _deffer.resolve(errorCodeFormat({
	          key: 'ERR_OK',
	          data: arr
	        }));
	      });
	    } else {
	      _deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: "no devices"
	      }));
	    }
	    return _deffer.promise;
	  };

	  // 获取摄像头权限
	  target.prototype.getCameraPermission = function () {
	    return new Promise((resolve, reject) => {
	      navigator.mediaDevices.getUserMedia({
	        video: true
	      }).then(stream => {
	        stream.getTracks().forEach(track => {
	          track.stop();
	        });
	        resolve(errorCodeFormat({
	          key: 'ERR_OK',
	          data: true
	        }));
	      }).catch(err => {
	        reject(errorCodeFormat({
	          key: 'ERR_UNKNOWN',
	          data: false,
	          msg: err
	        }));
	      });
	    });
	  };
	  // 获取麦克风权限
	  target.prototype.getMicrophonePermission = function () {
	    return new Promise((resolve, reject) => {
	      navigator.mediaDevices.getUserMedia({
	        audio: true
	      }).then(stream => {
	        stream.getTracks().forEach(track => {
	          track.stop();
	        });
	        resolve(errorCodeFormat({
	          key: 'ERR_OK',
	          data: true
	        }));
	      }).catch(err => {
	        reject(errorCodeFormat({
	          key: 'ERR_UNKNOWN',
	          data: false,
	          msg: err
	        }));
	      });
	    });
	  };
	}

	var $$2 = _export;
	var call$1 = functionCall;
	var aCallable$2 = aCallable$g;
	var anObject$1 = anObject$l;
	var getIteratorDirect$1 = getIteratorDirect$6;
	var createIteratorProxy = iteratorCreateProxy;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$3;
	var iteratorClose$1 = iteratorClose$b;
	var iteratorHelperThrowsOnInvalidIterator = iteratorHelperThrowsOnInvalidIterator$2;
	var iteratorHelperWithoutClosingOnEarlyError$1 = iteratorHelperWithoutClosingOnEarlyError$6;
	var FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR = !iteratorHelperThrowsOnInvalidIterator('filter', function () {/* empty */});
	var filterWithoutClosingOnEarlyError = !FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError$1('filter', TypeError);
	var FORCED = FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR || filterWithoutClosingOnEarlyError;
	var IteratorProxy = createIteratorProxy(function () {
	  var iterator = this.iterator;
	  var predicate = this.predicate;
	  var next = this.next;
	  var result, done, value;
	  while (true) {
	    result = anObject$1(call$1(next, iterator));
	    done = this.done = !!result.done;
	    if (done) return;
	    value = result.value;
	    if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true)) return value;
	  }
	});

	// `Iterator.prototype.filter` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.filter
	$$2({
	  target: 'Iterator',
	  proto: true,
	  real: true,
	  forced: FORCED
	}, {
	  filter: function filter(predicate) {
	    anObject$1(this);
	    try {
	      aCallable$2(predicate);
	    } catch (error) {
	      iteratorClose$1(this, 'throw', error);
	    }
	    if (filterWithoutClosingOnEarlyError) return call$1(filterWithoutClosingOnEarlyError, this, predicate);
	    return new IteratorProxy(getIteratorDirect$1(this), {
	      predicate: predicate
	    });
	  }
	});

	/**
	 * 用户列表
	 * */
	var _userList = /*#__PURE__*/new WeakMap();
	class Users {
	  constructor(props) {
	    // 私有属性
	    _classPrivateFieldInitSpec(this, _userList, []);
	    if (props.onChange) {
	      this.onChange = props.onChange;
	    }
	  }
	  // 公有方法
	  init() {
	    // TODO: 初始化
	  }
	  addUser(props) {
	    if (_classPrivateFieldGet2(_userList, this).find(item => item.id === props.id)) {
	      return false;
	    }
	    _classPrivateFieldGet2(_userList, this).push(props);
	    this.onChange && this.onChange(_classPrivateFieldGet2(_userList, this));
	  }
	  removeUser(props) {
	    _classPrivateFieldSet2(_userList, this, _classPrivateFieldGet2(_userList, this).filter(item => item.id !== props.id));
	    this.onChange && this.onChange(_classPrivateFieldGet2(_userList, this));
	  }
	  updateUser(props, cover) {
	    let hasChange = false;
	    _classPrivateFieldSet2(_userList, this, _classPrivateFieldGet2(_userList, this).map(item => {
	      if (item.id === props.id) {
	        if (JSON.stringify(item) !== JSON.stringify(props)) hasChange = true;
	        return cover ? props : {
	          ...item,
	          ...props
	        };
	      }
	      return item;
	    }));
	    hasChange && this.onChange && this.onChange(_classPrivateFieldGet2(_userList, this));
	  }
	  query(props) {
	    return _classPrivateFieldGet2(_userList, this).find(item => item.id === props.id);
	  }
	  getUsers(props) {
	    return lodashEs.cloneDeep(_classPrivateFieldGet2(_userList, this));
	  }
	  empty(props) {
	    _classPrivateFieldSet2(_userList, this, []);
	    this.onChange && this.onChange(_classPrivateFieldGet2(_userList, this));
	  }
	}

	/**
	 * 公共的函数装饰器
	 * */
	var commonFun = {
	  // websocket断网检测
	  websocketCheck(value, _ref) {
	    let {
	      name,
	      addInitializer
	    } = _ref;
	    return async function () {
	      var _this$janusInstance;
	      // 这种方式和sdk代码耦合，目前没想到什么好的方式去检测websocket是否断网，在装饰器中去获取janusInstance实例
	      if ((_this$janusInstance = this.janusInstance) !== null && _this$janusInstance !== void 0 && _this$janusInstance.isConnected()) {
	        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }
	        return await value.apply(this, args);
	      } else {
	        return Promise.reject(errorCodeFormat({
	          key: 'ERR_NOT_INIT',
	          msg: `check websocket connnect false. (connected=false), error function: ${name}`
	        }));
	      }
	    };
	  }
	};

	var _Class, _EzRtcCore3;
	let _initProto, _initClass, _publishStreamDecs, _unpublishStreamDecs, _subscribeStreamDecs, _unsubscribeDecs, _subscribeMixDecs, _unsubscribeMixDecs, _controlStreamDecs, _resumePullPeerStreamDecs, _pausePullPeerStreamDecs, _EzRtcCore2, _ref;

	// 网络质量初始值
	const INIT_NETWORK_QUALITY = {
	  // 上行网络
	  uplink: {
	    quality: 0,
	    // 网络质量得分
	    reportedQuality: 0,
	    // 已经上报的得分
	    packageLost: null,
	    // 丢包率
	    jitter: null,
	    // 抖动
	    rtt: null,
	    // 时延
	    lastReports: {},
	    // 上一次记录的数据报告
	    currentReports: {} // 当前记录的数据报告
	  },
	  // 下行网络
	  downlink: {
	    quality: 0,
	    // 网络质量得分
	    reportedQuality: 0,
	    // 已经上报的得分
	    packageLost: null,
	    // 丢包率
	    jitter: null,
	    // 抖动
	    rtt: null,
	    // 时延
	    // 下行网络列表
	    remotes: {
	      // [userId]: {
	      //   quality: null, // 网络质量得分
	      //   packageLost: null, // 丢包率
	      //   jitter: null, // 抖动
	      //   rtt: null, // 时延
	      //   lastReports: {}, // 上一次记录的数据报告
	      //   currentReports: {}, // 当前记录的数据报告
	      // }
	    }
	  }
	};

	// 类装饰器部分
	let _EzRtcCore;
	new (_EzRtcCore2 = (_ref = (_publishStreamDecs = [commonFun, commonFun.websocketCheck], _unpublishStreamDecs = [commonFun, commonFun.websocketCheck], _subscribeStreamDecs = [commonFun, commonFun.websocketCheck], _unsubscribeDecs = [commonFun, commonFun.websocketCheck], _subscribeMixDecs = [commonFun, commonFun.websocketCheck], _unsubscribeMixDecs = [commonFun, commonFun.websocketCheck], _controlStreamDecs = [commonFun, commonFun.websocketCheck], _resumePullPeerStreamDecs = [commonFun, commonFun.websocketCheck], _pausePullPeerStreamDecs = [commonFun, commonFun.websocketCheck], "extend"), _EzRtcCore3 = class EzRtcCore {
	  // 静态属性
	  // sdk版本号

	  // 流的类型

	  // 流的类型对应的发布的通道

	  // 外部可监听的事件

	  // 内部事件广播

	  // 插件列表

	  // 扩展插件
	  static [_ref](plugins) {
	    if (Array.isArray(plugins)) {
	      plugins.forEach(plugin => addPlugin(plugin));
	    }
	    function addPlugin(plugin) {
	      if (typeof plugin === 'object') {
	        // Object.assign(EzRtcCore.prototype, plugin.extends || {})
	        _EzRtcCore.plugins.push(plugin);
	      }
	    }
	  }
	  constructor(params) {
	    var _params$exportLogs, _params$autoPublish;
	    _initProto(this);
	    this.params = params || {};
	    this.debug = (params === null || params === void 0 ? void 0 : params.debug) || false; // 是否打印日志输出
	    this.exportLogs = (_params$exportLogs = params === null || params === void 0 ? void 0 : params.exportLogs) !== null && _params$exportLogs !== void 0 ? _params$exportLogs : true; // 是否支持日志导出
	    this.autoPublish = (_params$autoPublish = params === null || params === void 0 ? void 0 : params.autoPublish) !== null && _params$autoPublish !== void 0 ? _params$autoPublish : true; // 是否断线重连后自动发布
	    this.domain = (params === null || params === void 0 ? void 0 : params.domain) || null; // api域名
	    this.janusInstance = null;
	    this.usersInstance = null;
	    this.config = {
	      opaqueId: "sts-" + Janus.randomString(12),
	      wsServer: null,
	      // websocket地址

	      customId: null,
	      // 用户输入的用户id
	      strRoomId: null,
	      // 用户输入的房间号
	      appId: null,
	      // 用户输入的appId
	      accessToken: null,
	      // 用户输入的资源访问token
	      roomId: null,
	      // 存储在服务器的房间真实id
	      clientId: null,
	      // 存储在服务器的用户真实id
	      timeout: null // 用户断线后超时时间
	    };
	    this.plugins = {};
	    this.state = {
	      // 房间内信息
	      roomInfo: {
	        id: '',
	        // 服务端的真实房间id
	        roomId: '',
	        // 用户传入的房间id
	        isJoined: false,
	        // 是否加入房间
	        me: {
	          clientId: '',
	          // 服务端对应的用户id
	          userId: '',
	          // 用户传入的id
	          // nickName: '', // 用户昵称
	          astate: 0,
	          // 音频状态
	          vstate: 0,
	          // 视频状态
	          sstate: 0,
	          // 屏幕共享状态
	          networkQuality: null,
	          // 网络质量等级
	          pluginHandle: null,
	          // 插件句柄
	          streams: [] // 流信息
	        },
	        // 自身信息
	        amixer: {
	          id: 'amixer',
	          pluginHandle: null,
	          streams: []
	        },
	        // 混音流信息
	        shareInfo: {},
	        // 屏幕共享流信息
	        persons: [] // 房间内其他成员信息
	      },
	      // 设备信息
	      profile: {},
	      // 当前用户网络质量
	      networkQuality: lodashEs.cloneDeep(INIT_NETWORK_QUALITY),
	      networkQualityRemotes: {},
	      // 房间内其他用户的网络质量（上下行，由信令服务器广播得知）

	      messagePluginHandle: null,
	      // 消息通道 创建的主句柄
	      // 发布流通道列表
	      publishAttaches: {
	        // default: {
	        // createOfferParams: null, // 创建offer时的参数
	        // pluginHandle: null, // 创建的视频句柄
	        // pluginHandleAudio: null, // 创建的音频句柄，为满足有些情况，音频和视频分成两个pc连接
	        // mediaStream: null, // 创建的流
	        // streamtype: null, // 流类型
	        // videostreamtype: null, // 视频流类型
	        // }, // 默认发布流通道, 用于发布音视频流
	        // screen: null, // 屏幕共享通道, 用于发布屏幕共享流
	      },
	      // 订阅通道列表
	      subscribeAttaches: {
	        // '[userId]': {
	        //   default: null, // 默认订阅通道, 用于订阅音视频流
	        //   screen: null, // 屏幕共享通道, 用于订阅屏幕共享流
	        // }
	      },
	      publishAttachesQueue: [],
	      // 发布队列
	      subscribeAttachesQueue: [],
	      // 订阅队列
	      // 视频参数设置
	      videoSettingParams: {
	        cameraId: null,
	        // 摄像头id
	        frameRate: null,
	        // 帧率
	        width: null,
	        // 视频宽度
	        height: null,
	        // 视频高度
	        bitrate: null,
	        // 码率
	        simulcast: false,
	        // 是否开启大小流
	        simulcastMaxBitrates: null // 大小流最大码率
	      },
	      // 音频参数设置
	      audioSettingParams: {
	        microphoneId: null // 麦克风id
	      }
	    };
	    this.registerPlugins();
	    this.bindConsoleProxy();
	    this.registerMethods(params);

	    // 内部事件绑定到实例上
	    this.INNER_EVENT = _EzRtcCore.INNER_EVENT;
	    this.STREAM_TYPE = _EzRtcCore.STREAM_TYPE;

	    // 挂载一些全局方法到window对象上
	    this.bindGlobalFuns();
	  }
	  registerPlugins() {
	    _EzRtcCore.plugins.forEach(plugin => {
	      plugin.exec({
	        instance: this,
	        classNative: _EzRtcCore
	      });
	      this.plugins[plugin.pluginName || `plugin_${Math.random()}`] = plugin;
	    });
	  }
	  bindConsoleProxy() {
	    this.logger = {};
	    logger.setGlobalConfig({
	      supportExport: this.exportLogs
	    });
	    const EzLogger = logger.proxy({
	      name: 'ERTC'
	    });
	    ['log', 'debug', 'info', 'warn', 'error', 'trace'].forEach(key => {
	      this.logger[key] = () => {};
	      if (this.debug) {
	        // 通过Object.defineProperty，保证每次调用都是走get，从而保证日志时间最新，如果通过EzRtcCode[key] = EzLogger[key] 赋值的方式，日志时间会固定
	        Object.defineProperty(this.logger, key, {
	          get() {
	            return EzLogger[key];
	          },
	          set(val) {
	            EzLogger[key] = val;
	          }
	        });
	      }
	    });
	  }
	  bindGlobalFuns() {
	    if (window) {
	      window.ERTC_WEB = {
	        exportLogs: logger.exportLogs
	      };
	    }
	  }
	  registerMethods(params) {
	    // ice超时重启websocket防抖函数
	    this.iceTimeoutRestartWebsocket = lodashEs.debounce(ws => {
	      var _this$janusInstance;
	      this.logger.log('ice超时，重启websocket');
	      if ((_this$janusInstance = this.janusInstance) !== null && _this$janusInstance !== void 0 && _this$janusInstance.isConnected()) {
	        var _ws$close;
	        ws === null || ws === void 0 || (_ws$close = ws.close) === null || _ws$close === void 0 || _ws$close.call(ws);
	      }
	    }, (params === null || params === void 0 ? void 0 : params.iceResetWsTime) || 10000);
	  }
	  settingMessageBody(params) {
	    return {
	      "requestId": Janus.randomString(12),
	      "customId": this.config.customId,
	      "roomId": this.config.roomId,
	      ...params
	    };
	  }
	  // 加入房间
	  async enterRoom(params) {
	    let res = null;
	    // 初始化
	    await this.initConfig(params);

	    // 连接websocket
	    await this.connectWebsocket();

	    // 绑定房间
	    res = await this.attachRoom();
	    // 设置视频参数
	    this.setVideoProfile(this.state.profile);
	    // 设置音频参数
	    this.setAudioProfile(this.state.profile);
	    return res;
	  }
	  // 离开房间
	  leaveRoom(params) {
	    const that = this;
	    // 构建 deffer 实例
	    let _deffer = deffer$2();
	    if (!this.state.messagePluginHandle) {
	      _deffer.resolve(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: 'no handle'
	      }));
	    } else {
	      // 订阅退出房间事件
	      this.state.messagePluginHandle.messageListen(_EzRtcCore.EVENT.EXITROOMACK, msg => {
	        var _this$janusInstance2, _this$usersInstance;
	        this.logger.log('退出房间成功：', msg);
	        // 重置配置
	        this.resettingConfig();
	        (_this$janusInstance2 = this.janusInstance) === null || _this$janusInstance2 === void 0 || _this$janusInstance2.destroy();
	        this.janusInstance = null;
	        // 清空用户列表
	        (_this$usersInstance = this.usersInstance) === null || _this$usersInstance === void 0 || _this$usersInstance.empty();
	        _deffer.resolve(errorCodeFormat('ERR_OK'));
	      });
	      // 发送退出房间信令
	      this.state.messagePluginHandle.send({
	        "message": this.settingMessageBody({
	          cmdType: "exitRoom"
	        }),
	        success: () => {},
	        error: error => {
	          that.logger.error("离开房间失败，原因：", error);
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_ROOM_EXIT_FAIL',
	            msg: error
	          }));
	        }
	      });
	      this.state.roomInfo.isJoined = false;
	    }
	    return _deffer.promise;
	  }

	  // 初始化config，获取webscoket地址
	  initConfig(params) {
	    const that = this;
	    this.logger.log('EzRtcCore 初始化入参：', params);
	    // 每次初始化之后重置配置
	    this.resettingConfig();
	    const _deffer = deffer$2();
	    const requestData = {
	      appId: params.appId,
	      strRoomId: params.roomId,
	      customId: params.userId
	    };
	    fetchData({
	      // url: `${this.domain || "https://open.ys7.com"}/api/v3/rtc/wss`,
	      // url: `http://localhost:5173/api/v3/ertc/wss`,
	      url: `${this.domain || "https://open.ys7.com"}/api/v3/ertc/wss`,
	      method: 'POST',
	      data: requestData,
	      headerOptions: {
	        accessToken: params.accessToken
	      }
	    }).then(logSuccess).catch(logError);
	    function logSuccess(data) {
	      var _data$meta;
	      that.logger.log("wss接口请求成功：", data);
	      if (((_data$meta = data.meta) === null || _data$meta === void 0 ? void 0 : _data$meta.code) === 200) {
	        const {
	          clientId,
	          domain,
	          roomId,
	          wssPath
	        } = data.data;
	        Object.assign(that.config, {
	          ...requestData,
	          // wsServer: `wss://10.86.33.236:15060`,
	          wsServer: `wss://${domain}/${wssPath}`,
	          // wsServer: `wss://test13.ys7.com/${wssPath}`,
	          accessToken: params.accessToken,
	          roomId,
	          clientId,
	          timeout: params.timeout || 300 // 默认300秒
	        });
	        that.usersInstance = new Users({
	          onChange: res => {
	            that.trigger(_EzRtcCore.EVENT.USERS_CHANGE, res);
	          }
	        });
	        _deffer.resolve(errorCodeFormat({
	          key: 'ERR_OK',
	          data: data.data
	        }));
	      } else {
	        var _data$meta2;
	        const errorReturn = mapErrorOpenPlatform(data === null || data === void 0 ? void 0 : data.meta) || errorCodeFormat({
	          key: 'ERR_INIT_FAILED',
	          msg: (data === null || data === void 0 || (_data$meta2 = data.meta) === null || _data$meta2 === void 0 ? void 0 : _data$meta2.message) || data.msg
	        });
	        _deffer.reject(errorReturn);
	        return;
	      }
	    }
	    function logError(err) {
	      _deffer.reject(errorCodeFormat({
	        key: 'ERR_INIT_FAILED',
	        msg: err
	      }));
	    }
	    return _deffer.promise;
	  }

	  /**
	   * 初始化janus，创建websocket连接
	   * @param {number} count - 重连次数
	  */
	  async connectWebsocket() {
	    var _this$janusInstance3;
	    let count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    const _deffer = deffer$2();
	    const that = this;
	    const {
	      accessToken,
	      customId,
	      strRoomId,
	      appId
	    } = this.config;
	    const startTime = new Date().getTime(); // 初始化开始时间，用来设置重连最短间隔
	    let hasConnectedFlag = false; // 是否已经连接过websocket
	    let isReconnecting = false; // 当前janus实例是否在重连中，用来兼容部分情况，error重复触发，导致同时触发多次重连，比如火狐浏览器
	    let countNum = count; // 重连次数
	    let Janusparams = {
	      "token": `token=${accessToken}&customId=${customId}&strRoomId=${strRoomId}&appId=${appId}`,
	      "authtype": 23,
	      "sdk_version": _EzRtcCore.VERSION
	    };

	    // 每次连接前，清除老的janus实例（只针对重新进入房间，对于重连似乎没什么用，因为webscoket连接已断开）
	    (_this$janusInstance3 = this.janusInstance) === null || _this$janusInstance3 === void 0 || _this$janusInstance3.destroy();
	    this.janusInstance = null;
	    // 每次连接前，重置订阅通道，因为开发者使用sdk，都会自动订阅，如果不重置，会复用之前的订阅通道，导致重连后，订阅失败
	    this.resettingAttaches('subscribe');
	    Janus.init({
	      debug: this.debug ? ['log', 'warn', 'error'] : false,
	      callback: () => {
	        that.janusInstance = new Janus({
	          server: that.params.wsServer || that.config.wsServer,
	          success: function (sessionId) {
	            hasConnectedFlag = true;
	            if (sessionId) {
	              // 如果重连成功，则自动重新加入房间
	              if (countNum > 0) {
	                that.trigger(_EzRtcCore.EVENT.CONNECT_STATE_CHANGE, errorCodeFormat({
	                  key: 'ERR_OK',
	                  msg: 'reconnect success'
	                }));
	                setTimeout(() => {
	                  // 延迟3000ms加入房间，兼容风远SDK，避免过早接收到websocket信令消息，而风远那边房间状态还未更新。临时这么处理，后续再考虑优化
	                  that.attachRoom('reconnect');
	                }, 3000);
	                countNum = 0;
	              }
	              that.trigger(_EzRtcCore.EVENT.CONNECT_STATE_CHANGE, errorCodeFormat({
	                key: 'ERR_OK',
	                msg: 'success'
	              }));

	              // 如果是safari浏览器，则每次websocket连接后，都预先建立一个用来发布屏幕流的通道，不用考虑销毁，因为websocket断开销毁的是整个janus
	              that.attachScreenBySafari();
	              _deffer.resolve(errorCodeFormat({
	                key: 'ERR_OK',
	                data: sessionId
	              }));
	            }
	          },
	          error: async function (error) {
	            // 监听到错误信息，关闭连接
	            that.logger.log('监听websocket连接error：', error);
	            // token校验失败，直接报错
	            if (error === 'rcstoken check failed') {
	              if (countNum > 0) {
	                that.trigger(_EzRtcCore.EVENT.CONNECT_STATE_CHANGE, errorCodeFormat({
	                  key: 'ERR_SDK_CONNECTED',
	                  msg: 'fail'
	                }));
	              }
	              _deffer.reject(errorCodeFormat({
	                key: 'ERR_ROOM_INVALID_TOKEN',
	                msg: error
	              }));
	              return;
	            }
	            // 服务器断开连接， 开启重连，且必须是加入过房间后才会触发重连
	            if (that.state.roomInfo.isJoined && (hasConnectedFlag || countNum > 0) && (error == 'Lost connection to the server' || error == 'Error connecting to the Janus WebSockets server: Is the server down?')) {
	              if (isReconnecting) {
	                // 判断当前janus实例是否在重连中，如果是，则直接返回，避免单个janus实例同时触发多次重连
	                return;
	              }
	              isReconnecting = true;
	              // 重连超过30次，退出重连
	              if (countNum >= 30) {
	                var _that$usersInstance;
	                that.logger.log(`重连超过${countNum}次退出重连机制`);
	                // 重连失败，重置数据
	                that.resettingConfig();
	                that.janusInstance && that.janusInstance.destroy();
	                that.janusInstance = null;
	                (_that$usersInstance = that.usersInstance) === null || _that$usersInstance === void 0 || _that$usersInstance.empty();
	                that.trigger(_EzRtcCore.EVENT.CONNECT_STATE_CHANGE, errorCodeFormat({
	                  key: 'ERR_SDK_CONNECTED',
	                  msg: 'fail'
	                }));
	                return;
	              }
	              // // 如果websocket连接建立时间小于5秒，则延迟3秒后重连，否则立即重连
	              if (new Date().getTime() - startTime < 5000) {
	                await timeoutPromise(3000);
	              }
	              // 开始重连
	              if (countNum === 0) {
	                that.trigger(_EzRtcCore.EVENT.CONNECT_STATE_CHANGE, errorCodeFormat({
	                  key: 'ERR_SDK_CONNECTED',
	                  msg: 'reconnecting'
	                }));
	              }
	              that.logger.log(`正在开始第${countNum + 1}次重连`);
	              that.connectWebsocket(countNum + 1);
	            } else {
	              // 不再执行重连机制
	              _deffer.reject(errorCodeFormat({
	                key: 'ERR_INIT_FAILED',
	                msg: error
	              }));
	            }
	          },
	          destroyed: function () {
	            that.logger.log('监听janus被销毁');
	            that.state.networkQualityRemotes = {};
	            that.trigger(_EzRtcCore.EVENT.CONNECT_STATE_CHANGE, errorCodeFormat({
	              key: 'ERR_SDK_CONNECTED',
	              msg: 'destroyed'
	            }));
	            _deffer.reject(errorCodeFormat({
	              key: 'ERR_UNKNOWN',
	              msg: "Janus destroyed"
	            }));
	          }
	        }, Janusparams);
	      }
	    });
	    return _deffer.promise;
	  }

	  // 绑定房间 & 重连后绑定房间
	  attachRoom() {
	    let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'enterRoom';
	    const that = this;
	    const {
	      timeout
	    } = this.config;
	    // 构建 deffer 实例
	    let _deffer = deffer$2();
	    let messagePluginHandle = null;
	    this.janusInstance.attach({
	      plugin: "rtcgw.plugin.sts",
	      opaqueId: this.config.opaqueId,
	      success: function (pluginHandle) {
	        var _that$usersInstance2;
	        that.logger.log("attachRoom attach success回调，返回类型：", type, "返回句柄pluginHandle：", pluginHandle);
	        messagePluginHandle = pluginHandle;
	        const body = that.settingMessageBody({
	          "cmdType": type,
	          // enterRoom/reconnect
	          "clientId": that.config.clientId,
	          "strroomId": that.config.strRoomId,
	          "authtype": 23,
	          "authentication": that.config.accessToken,
	          "appId": that.config.appId
	        });
	        timeout && (body.timeout = timeout);

	        // 发送加入房间的消息
	        messagePluginHandle.send({
	          "message": body,
	          error: err => _deffer.reject(errorCodeFormat({
	            key: 'ERR_ROOM_ENTER_FAIL',
	            msg: err
	          }))
	        });

	        // 加入房间之后，清空用户列表
	        (_that$usersInstance2 = that.usersInstance) === null || _that$usersInstance2 === void 0 || _that$usersInstance2.empty();

	        // 监听 enterRoomack 信令回调
	        messagePluginHandle.messageListen(_EzRtcCore.EVENT.ENTERROOMACK, msg => {
	          if (msg["code"] === 0) {
	            that.state.messagePluginHandle = messagePluginHandle;
	            that.state.roomInfo.isJoined = true;
	            that.usersInstance.addUser({
	              id: that.config.customId,
	              clientId: that.config.clientId
	            });
	            if (type === 'reconnect') {
	              // 重连房间，进行历史订阅与发布
	              setTimeout(() => {
	                // 加个500ms延迟，避免enterRoomack回调有了，其他用户加入的消息还没收到
	                that.reconnectRoomEffect();
	              }, 500);
	            }
	            _deffer.resolve(errorCodeFormat({
	              key: 'ERR_OK',
	              data: pluginHandle.id
	            }));
	          } else {
	            that.logger.log('加入房间失败：', msg.msg);
	            _deffer.reject(errorCodeFormat({
	              key: 'ERR_ROOM_ENTER_FAIL',
	              msg: msg.msg || '加入房间失败'
	            }));
	          }
	        });
	        // 监听通用错误
	        messagePluginHandle.messageListen(_EzRtcCore.EVENT.ERROR, msg => {
	          that.logger.log('加入房间失败，监听到通用错误：', msg);
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_ROOM_ENTER_FAIL',
	            msg: msg.msg || '加入房间失败'
	          }));
	        });
	      },
	      error: function (error) {
	        that.logger.error("attachRoom attach error回调：", error);
	        _deffer.reject(errorCodeFormat({
	          key: 'ERR_ROOM_ENTER_FAIL',
	          msg: error
	        }));
	      },
	      consentDialog: function (on) {
	        that.logger.debug("attachRoom consentDialog回调：", on);
	      },
	      iceState: function (state) {
	        that.logger.debug("attachRoom iceState回调：" + state);
	        switch (state) {
	          case 'connected':
	            that.logger.log("attachRoom ice 连接成功");
	            break;
	          case 'disconnected':
	            that.logger.log("attachRoom ice 连接断开");
	            break;
	        }
	      },
	      mediaState: function (medium, on) {
	        that.logger.log("attachRoom mediaState回调，Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
	      },
	      webrtcState: function (on) {
	        that.logger.log("attachRoom webrtcState回调，Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
	        // $("#audioleft").parent().unblock();
	      },
	      slowLink: function (uplink, lost) {
	        that.logger.warn("attachRoom slowLink回调，Janus reports problems " + (uplink ? "sending" : "receiving") + " packets on this PeerConnection (" + lost + " lost packets)");
	      },
	      onmessage: function (msg, jsep) {
	        // 过滤掉一些重复console的消息，方便日志排查
	        const consoleRtcgwStrFilter = [_EzRtcCore.EVENT.AUDIOLEVEL, 'networkquality']; // console需要过滤的rtcgw消息类型
	        !consoleRtcgwStrFilter.includes(msg['rtcgw']) && that.logger.log("attachRoom onMessage回调，返回msg:", msg, "返回jsep:", jsep);
	        if (jsep !== undefined && jsep !== null) {
	          that.logger.debug("Handling SDP as well...");
	          messagePluginHandle.handleRemoteJsep({
	            jsep: jsep
	          });
	        }
	        var result = msg["result"];
	        if (result !== null && result !== undefined) {
	          if (result === "done") {
	            var _that$usersInstance3;
	            // The plugin closed
	            that.resettingConfig();
	            that.janusInstance.destroy();
	            that.janusInstance = null;
	            (_that$usersInstance3 = that.usersInstance) === null || _that$usersInstance3 === void 0 || _that$usersInstance3.empty();
	            return;
	          }
	          // Any loss?
	          result["status"];
	        }

	        // 消费句柄收集的订阅任务
	        messagePluginHandle.messageTrigger(msg["rtcgw"], msg);

	        // 监听老版本报错
	        if (msg["error"]) {
	          that.trigger(_EzRtcCore.EVENT.ERROR, errorCodeFormat({
	            key: 'ERR_UNKNOWN',
	            data: msg,
	            msg: msg === null || msg === void 0 ? void 0 : msg.msg
	          }));
	        }
	        // 监听应用程序的报错
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.ERROR) {
	          // 用户被挤下线
	          if (msg.code === 21) {
	            var _that$usersInstance4;
	            that.resettingConfig();
	            that.janusInstance.destroy();
	            that.janusInstance = null;
	            (_that$usersInstance4 = that.usersInstance) === null || _that$usersInstance4 === void 0 || _that$usersInstance4.empty();
	          }
	          // sts错误码8，重连websocket
	          if (msg.code === 8) {
	            // 等待500ms后进行websocket重连
	            setTimeout(() => {
	              that.connectWebsocket(1);
	            }, 500);
	          }
	        }

	        // 监听用户加入
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.CLIENTJOIN) {
	          that.usersInstance.addUser({
	            id: msg['customId'],
	            clientId: msg['clientId'],
	            networkQuality: that.state.networkQualityRemotes[msg['customId']] || null
	          });
	        }
	        // 监听用户离开房间
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.CLIENTLEAVE) {
	          that.usersInstance.removeUser({
	            id: msg['customId']
	          });
	          // 销毁对应用户的订阅通道
	          that.destroySubscribeAttach(msg['customId']);
	        }
	        // 监听其他用户推流
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.STREAM_ADDED) {
	          // 更新用户列表信息
	          if (msg['streamtype'] === _EzRtcCore.STREAM_TYPE.VIDEO_ONLY) {
	            that.usersInstance.updateUser({
	              id: msg['customId'],
	              vstate: 1
	            });
	          }
	          if (msg['streamtype'] === _EzRtcCore.STREAM_TYPE.AUDIO_ONLY) {
	            that.usersInstance.updateUser({
	              id: msg['customId'],
	              astate: 1
	            });
	          }
	          if (msg['streamtype'] === _EzRtcCore.STREAM_TYPE.SCREEN) {
	            that.usersInstance.updateUser({
	              id: msg['customId'],
	              sstate: 1
	            });
	          }
	        }
	        // 监听其他用户停止推流
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.STREAM_REMOVED) {
	          // 更新用户列表信息
	          if (msg['streamtype'] === _EzRtcCore.STREAM_TYPE.VIDEO_ONLY) {
	            that.usersInstance.updateUser({
	              id: msg['customId'],
	              vstate: 0
	            });
	          }
	          if (msg['streamtype'] === _EzRtcCore.STREAM_TYPE.AUDIO_ONLY) {
	            that.usersInstance.updateUser({
	              id: msg['customId'],
	              astate: 0
	            });
	          }
	          if (msg['streamtype'] === _EzRtcCore.STREAM_TYPE.SCREEN) {
	            that.usersInstance.updateUser({
	              id: msg['customId'],
	              sstate: 0
	            });
	          }
	        }
	        // 监听当前用户发布权限变更
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.CLIENT_PERMISSION) {
	          const user = that.usersInstance.query({
	            id: msg['customId']
	          });
	          // 当前用户发布权限改变，执行相关操作 1：启用  2：禁用 0：不变 （与订阅权限字段值不同）
	          if ((user === null || user === void 0 ? void 0 : user.videoPermission) !== msg['videoPermission'] && msg['videoPermission'] === 2 && user.vstate === 1) {
	            // 取消发布视频
	            that.unpublishStream({
	              type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	            });
	          }
	          if ((user === null || user === void 0 ? void 0 : user.audioPermission) !== msg['audioPermission'] && msg['audioPermission'] === 2 && user.astate === 1) {
	            // 取消发布音频
	            that.unpublishStream({
	              type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	            });
	          }
	          if ((user === null || user === void 0 ? void 0 : user.sharePermission) !== msg['sharePermission'] && msg['sharePermission'] === 2 && user.sstate === 1) {
	            // 取消发布屏幕共享
	            that.unpublishStream({
	              type: _EzRtcCore.STREAM_TYPE.SCREEN
	            });
	          }

	          // 更新用户列表信息
	          that.usersInstance.updateUser({
	            id: msg['customId'],
	            audioPermission: msg['audioPermission'],
	            videoPermission: msg['videoPermission'],
	            sharePermission: msg['sharePermission']
	          });
	        }
	        // 监听当前用户订阅权限变更
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.SUB_PERMISSION) {
	          // 0: 启用 1：禁用
	          // 状态变更后都可直接发起取消订阅，因为只有订阅成功，才会收到禁用的消息通知
	          if (msg['audioPermission'] === 1) {
	            that.unsubscribe({
	              userId: msg['customId'],
	              type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	            });
	          }
	          if (msg['videoPermission'] === 1) {
	            that.unsubscribe({
	              userId: msg['customId'],
	              type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	            });
	          }
	          if (msg['sharePermission'] === 1) {
	            that.unsubscribe({
	              userId: msg['customId'],
	              type: _EzRtcCore.STREAM_TYPE.SCREEN
	            });
	          }
	        }

	        // 监听网络质量的实时统计
	        if (msg["rtcgw"] === _EzRtcCore.EVENT.NETWORKQUALITY) {
	          that.state.networkQualityRemotes[msg['customId']] = {
	            upquality: msg['upquality'],
	            downquality: msg['downquality']
	          };
	          Object.entries(that.state.networkQualityRemotes).forEach(_ref2 => {
	            let [userId, value] = _ref2;
	            if (that.usersInstance.query({
	              id: userId
	            })) {
	              that.usersInstance.updateUser({
	                id: userId,
	                networkQuality: value
	              });
	            }
	          });
	        }
	        if (msg['rtcgw']) {
	          // 服务端发回来的信令，都暴露出去，可被监听
	          let msgReturn = msg;
	          if (msg["rtcgw"] === 'error') {
	            msgReturn = mapErrorSignalReceived(msg);
	          }
	          that.trigger(msg["rtcgw"], msgReturn);
	        }
	      },
	      onlocalstream: function (stream) {
	        that.logger.log("attachRoom onlocalstream回调：", stream);
	      },
	      onremotestream: function (stream) {
	        that.logger.log("attachRoom onremotestream回调：", stream);
	      },
	      ondataopen: function (data) {
	        that.logger.log("attachRoom ondataopen回调：", data);
	      },
	      ondata: function (data) {
	        that.logger.log("attachRoom ondata回调：", data);
	      },
	      oncleanup: function () {
	        that.logger.log("attachRoom oncleanup回调");
	        that.trigger(_EzRtcCore.EVENT.CONNECT_STATE_CHANGE, {
	          code: 205,
	          msg: 'disconnected'
	        });
	      }
	    });
	    return _deffer.promise;
	  }

	  // 重连房间后，执行的副作用函数
	  reconnectRoomEffect() {
	    const {
	      publishAttaches,
	      subscribeAttaches,
	      roomInfo
	    } = this.state;
	    const that = this;
	    // 重置网络
	    this.resettingNetworkQuality();

	    // 如果不支持自动发布，则不执行以下操作
	    if (this.autoPublish) {
	      this.logger.log('重连房间后，重新发布：', publishAttaches);
	      // 重新发布
	      publishAttaches && Object.entries(publishAttaches).forEach(async _ref3 => {
	        let [key, item] = _ref3;
	        try {
	          // 通过key来判断视频流还是屏幕共享流
	          if (item !== null && item !== void 0 && item.pluginHandle && item !== null && item !== void 0 && item.createOfferParams) {
	            const {
	              media,
	              simulcast
	            } = item.createOfferParams;
	            // 重发视频
	            if (media.video) {
	              const params = item.videoParams || {};
	              // 理论上下面两段逻辑可以合并，自研还没机会验证，后续优化
	              if (params.isSingleConnect && params.stream) {
	                await this.publishStream({
	                  ...params,
	                  refrush: true
	                });
	              } else {
	                await this.publishStream({
	                  type: key === _EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.SCREEN] ? _EzRtcCore.STREAM_TYPE.SCREEN : _EzRtcCore.STREAM_TYPE.VIDEO_ONLY,
	                  simulcast: simulcast,
	                  refrush: true
	                });
	              }
	            }
	            // 重发音频，如果视频已重发，则复用通道
	            if (media.audio) {
	              const params = item.audioParams || {};
	              if (params.isSingleConnect && params.stream) {
	                var _item$pluginHandleAud, _item$pluginHandleAud2;
	                // refrush不强制设为true，避免重新发布音频的时候，把createOffer里的video信息全删除了，导致第二次重连不会重新订阅视频了
	                // 并且删除 pluginHandleAudio ，保证会重新attach
	                (_item$pluginHandleAud = item.pluginHandleAudio) === null || _item$pluginHandleAud === void 0 || (_item$pluginHandleAud2 = _item$pluginHandleAud.detach) === null || _item$pluginHandleAud2 === void 0 || _item$pluginHandleAud2.call(_item$pluginHandleAud);
	                item.pluginHandleAudio = null;
	                await this.publishStream({
	                  ...params,
	                  refrush: !media.video
	                });
	              } else {
	                await this.publishStream({
	                  type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY,
	                  refrush: !media.video
	                });
	              }
	            }
	          }
	        } catch (error) {
	          that.logger.error('重连房间后，重新发布失败：', error);
	          // 针对getUserMedia timeout做上报
	          if (typeof error === 'string' && error.indexOf('getUserMedia timeout') > -1) {
	            that.trigger(_EzRtcCore.EVENT.ERROR, errorCodeFormat({
	              key: 'ERR_CAMERA_START_FAIL',
	              msg: error
	            }));
	          }
	        }
	      });
	    }

	    // 重新订阅，理论上不需要，因为开发者要订阅，会监听stream-add，重连之后会自动触发
	    // subscribeAttaches && Object.entries(subscribeAttaches).forEach(([userId, attaches]) => {
	    //   attaches && Object.values(attaches).forEach(async (item) => {
	    //     if (item?.pluginHandle) {
	    //       item.pluginHandle.detach();
	    //       const { media } = item.createOfferParams
	    //       // 视频
	    //       if (media.video) {
	    //         await this.subscribeStream({
	    //           userId,
	    //           type: item.videostreamtype || EzRtcCore.STREAM_TYPE.VIDEO_ONLY,
	    //           refrush: true
	    //         })
	    //       }
	    //       // 音频
	    //       if (media.audio) {
	    //         this.subscribeStream({
	    //           userId,
	    //           type: EzRtcCore.STREAM_TYPE.AUDIO_ONLY,
	    //           refrush: !media.video
	    //         })
	    //       }
	    //     }
	    //   });
	    // });

	    // 重新订阅混音流
	    if (roomInfo.amixer.pluginHandle) {
	      var _roomInfo$amixer$stre;
	      this.logger.log('混音流原句柄还存在，先进行detach后再订阅');
	      roomInfo.amixer.pluginHandle.detach();
	      this.subscribeMix({
	        view: (_roomInfo$amixer$stre = roomInfo.amixer.streams) === null || _roomInfo$amixer$stre === void 0 || (_roomInfo$amixer$stre = _roomInfo$amixer$stre[0]) === null || _roomInfo$amixer$stre === void 0 ? void 0 : _roomInfo$amixer$stre.view
	      });
	    }
	  }

	  //发布本地音视频
	  async publishStream(params) {
	    var _Janus$webRTCAdapter, _publishAttach$create, _publishAttach$create2, _publishAttach$create3, _publishAttach$create4, _publishAttach$create5;
	    this.logger.log('发布本地音视频，入参：', JSON.stringify(params));
	    const that = this;
	    const _deffer = deffer$2(params.type === _EzRtcCore.STREAM_TYPE.SCREEN ? null : 15000); // 如果发布的是屏幕共享流，不加超时时间，因为涉及到用户选择屏幕的操作

	    const {
	      type: streamtype,
	      view,
	      simulcast: simulcastAs,
	      refrush,
	      attachOnly = false,
	      stream: externalStream,
	      isSingleConnect
	    } = params;
	    const {
	      videoSettingParams,
	      audioSettingParams,
	      publishAttaches
	    } = this.state;
	    const simulcast = simulcastAs !== null && simulcastAs !== void 0 ? simulcastAs : this.state.videoSettingParams.simulcast;

	    // 发布权限判断
	    const user = this.usersInstance.query({
	      id: this.config.customId
	    });
	    if ([_EzRtcCore.STREAM_TYPE['VIDEO_ONLY'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LITTLE'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LARGE'], _EzRtcCore.STREAM_TYPE['AUDIO_AND_VIDEO']].includes(streamtype) && (user === null || user === void 0 ? void 0 : user.videoPermission) === 2) {
	      return Promise.reject(errorCodeFormat({
	        key: 'ERR_REFUSED',
	        msg: 'no video publish permission'
	      }));
	    }
	    if ([_EzRtcCore.STREAM_TYPE['AUDIO_ONLY'], _EzRtcCore.STREAM_TYPE['AUDIO_AND_VIDEO']].includes(streamtype) && (user === null || user === void 0 ? void 0 : user.audioPermission) === 2) {
	      return Promise.reject(errorCodeFormat({
	        key: 'ERR_REFUSED',
	        msg: 'no audio publish permission'
	      }));
	    }
	    if (streamtype === _EzRtcCore.STREAM_TYPE['SCREEN'] && (user === null || user === void 0 ? void 0 : user.sharePermission) === 2) {
	      return Promise.reject(errorCodeFormat({
	        key: 'ERR_REFUSED',
	        msg: 'no share publish permission'
	      }));
	    }

	    // 判断是火狐或者safari浏览器，且是大小流，直接报错不支持
	    if (['safari', 'firefox'].includes((_Janus$webRTCAdapter = Janus.webRTCAdapter) === null || _Janus$webRTCAdapter === void 0 || (_Janus$webRTCAdapter = _Janus$webRTCAdapter.browserDetails) === null || _Janus$webRTCAdapter === void 0 ? void 0 : _Janus$webRTCAdapter.browser) && streamtype === _EzRtcCore.STREAM_TYPE.VIDEO_ONLY && simulcast) {
	      return Promise.reject(errorCodeFormat({
	        key: 'ERR_NOT_SUPPORT',
	        msg: 'firefox/safari not support simulcast'
	      }));
	    }

	    // 前置逻辑 等待发布队列完成
	    await this.publishAttachesQueueAwait(_deffer);

	    // 获取发布通道
	    const publishAttach = publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]];
	    // 获取发布句柄
	    const pluginHandleMap = {
	      [_EzRtcCore.STREAM_TYPE.VIDEO_ONLY]: 'pluginHandle',
	      [_EzRtcCore.STREAM_TYPE.AUDIO_ONLY]: 'pluginHandleAudio',
	      [_EzRtcCore.STREAM_TYPE.SCREEN]: 'pluginHandle'
	    };
	    const mediaStreamMap = {
	      [_EzRtcCore.STREAM_TYPE.VIDEO_ONLY]: 'mediaStream',
	      [_EzRtcCore.STREAM_TYPE.AUDIO_ONLY]: 'mediaStreamAudio',
	      [_EzRtcCore.STREAM_TYPE.SCREEN]: 'mediaStream'
	    };
	    const paramsMap = {
	      [_EzRtcCore.STREAM_TYPE.VIDEO_ONLY]: 'videoParams',
	      [_EzRtcCore.STREAM_TYPE.AUDIO_ONLY]: 'audioParams',
	      [_EzRtcCore.STREAM_TYPE.SCREEN]: 'videoParams'
	    };
	    let publishPluginHandle = publishAttach === null || publishAttach === void 0 ? void 0 : publishAttach[isSingleConnect ? pluginHandleMap[streamtype] : 'pluginHandle'];
	    // 默认额外配置
	    let settingParamsDefault = {};
	    const body = this.settingMessageBody({
	      "cmdType": "publishlocalstream",
	      "streamtype": streamtype
	    });
	    // 发布媒体基础配置
	    let media = {
	      videoSend: refrush ? false : !!(publishAttach !== null && publishAttach !== void 0 && (_publishAttach$create = publishAttach.createOfferParams) !== null && _publishAttach$create !== void 0 && (_publishAttach$create = _publishAttach$create.media) !== null && _publishAttach$create !== void 0 && _publishAttach$create.video),
	      videoRecv: false,
	      audioSend: refrush ? false : !!(publishAttach !== null && publishAttach !== void 0 && (_publishAttach$create2 = publishAttach.createOfferParams) !== null && _publishAttach$create2 !== void 0 && (_publishAttach$create2 = _publishAttach$create2.media) !== null && _publishAttach$create2 !== void 0 && _publishAttach$create2.audio),
	      audioRecv: false,
	      data: false,
	      video: refrush ? false : (publishAttach === null || publishAttach === void 0 || (_publishAttach$create3 = publishAttach.createOfferParams) === null || _publishAttach$create3 === void 0 || (_publishAttach$create3 = _publishAttach$create3.media) === null || _publishAttach$create3 === void 0 ? void 0 : _publishAttach$create3.video) || false,
	      audio: refrush ? false : (publishAttach === null || publishAttach === void 0 || (_publishAttach$create4 = publishAttach.createOfferParams) === null || _publishAttach$create4 === void 0 || (_publishAttach$create4 = _publishAttach$create4.media) === null || _publishAttach$create4 === void 0 ? void 0 : _publishAttach$create4.audio) || false
	    };
	    switch (streamtype) {
	      //视频
	      case _EzRtcCore.STREAM_TYPE['VIDEO_ONLY']:
	        let videoObj = {};
	        if (videoSettingParams.cameraId) videoObj.deviceId = videoSettingParams.cameraId;
	        if (videoSettingParams.width) videoObj.width = {
	          ideal: videoSettingParams.width
	        };
	        if (videoSettingParams.height) videoObj.height = {
	          ideal: videoSettingParams.height
	        };
	        if (Object.keys(videoObj).length === 0) videoObj = true;
	        media = {
	          ...media,
	          videoSend: true,
	          videoRecv: false,
	          video: videoObj
	          // replaceVideo: !!media.video
	        };
	        // 大小流只能和视频流一起发送
	        body.streamtype = simulcast ? _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LARGE'] : _EzRtcCore.STREAM_TYPE['VIDEO_ONLY'];
	        break;
	      //音频
	      case _EzRtcCore.STREAM_TYPE['AUDIO_ONLY']:
	        media = {
	          ...media,
	          audioSend: true,
	          audioRecv: false,
	          audio: {
	            deviceId: audioSettingParams.microphoneId,
	            echoCancellation: true // 消除回音
	          }
	          // replaceAudio: !!media.audio
	        };
	        break;
	      //屏幕共享
	      case _EzRtcCore.STREAM_TYPE['SCREEN']:
	        media = {
	          ...media,
	          audioRecv: false,
	          audioSend: false,
	          audio: false,
	          videoSend: true,
	          videoRecv: false,
	          video: "screen",
	          screenshareFrameRate: 3
	          // replaceVideo: !!media.video
	        };
	        settingParamsDefault = {
	          // 注释宽高的设置，还是不要通过视频的width和height来设置共享屏幕的属性了
	          // screenWidth: videoSettingParams.width || 1920, // 默认1080p
	          // screenHeight: videoSettingParams.height || 1080, // 默认1080p
	          frameRate: 15,
	          // 屏幕共享帧率，默认设置成15，说是效果最好
	          simulcastMaxBitrates: 2000000,
	          // 屏幕共享码率，最大2M,默认1080p的码率设置为2M
	          bitrate: 2000000 // 屏幕共享码率，最大2M,默认设置成2M
	        };
	        params.displaySurface && (settingParamsDefault.displaySurface = params.displaySurface);
	        break;
	    }
	    const createOfferParams = {
	      media,
	      ...settingParamsDefault,
	      simulcast: simulcast || (publishAttach === null || publishAttach === void 0 || (_publishAttach$create5 = publishAttach.createOfferParams) === null || _publishAttach$create5 === void 0 ? void 0 : _publishAttach$create5.simulcast) || false
	    };
	    videoSettingParams.simulcastMaxBitrates && (createOfferParams.simulcastMaxBitrates = videoSettingParams.simulcastMaxBitrates);
	    videoSettingParams.frameRate && (createOfferParams.frameRate = videoSettingParams.frameRate);
	    videoSettingParams.bitrate && (createOfferParams.bitrate = videoSettingParams.bitrate);
	    this.logger.log("发布音视频 createOfferParams：", createOfferParams);

	    // 如果是refrush，且发布流handle存在，则销毁老的句柄
	    if (refrush && publishPluginHandle) {
	      publishPluginHandle.detach();
	      this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]] = null;
	    }

	    // 只做attach，不做createOffer
	    if (attachOnly) {
	      await attach();
	      _deffer.resolve(errorCodeFormat('ERR_OK'));
	      return true;
	    }

	    // 如果发布流handle存在,且参数refrush不为true，则复用
	    if (publishPluginHandle && !refrush) {
	      // 如果是屏幕共享流类型，并且已经发布过屏幕共享流，则不再重复发布，为了兼容后端会接收到两次发布屏幕共享流，但第二次不会替换第一次的内容，导致订阅方直接卡住，websocket却返回成功
	      if (streamtype === _EzRtcCore.STREAM_TYPE.SCREEN && publishAttach !== null && publishAttach !== void 0 && publishAttach.createOfferParams) {
	        _deffer.reject(errorCodeFormat({
	          key: 'ERR_NOT_SUPPORT',
	          msg: "repeat publish screen stream"
	        }));
	        return _deffer.promise;
	      }
	      createOffer();
	    } else {
	      attach().then(createOffer).catch(error => {
	        that.logger.error('发布本地音视频失败：', error);
	        _deffer.reject(errorCodeFormat({
	          key: 'ERR_UNKNOWN',
	          msg: error
	        }));
	      });
	    }

	    // attach，建立通道
	    function attach() {
	      return new Promise((resolve, reject) => {
	        that.janusInstance.attach({
	          plugin: "rtcgw.plugin.sts",
	          opaqueId: that.config.opaqueId,
	          success: function (pluginHandle) {
	            that.logger.log("publishStream attach success回调，返回发布流句柄：", pluginHandle);
	            publishPluginHandle = pluginHandle;
	            // 更新发布通道
	            if (isSingleConnect) {
	              // 兼容音视频单独通道的逻辑
	              if (that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]]) {
	                that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]][pluginHandleMap[streamtype]] = publishPluginHandle;
	              } else {
	                that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]] = {
	                  [pluginHandleMap[streamtype]]: publishPluginHandle
	                };
	              }
	            } else {
	              // 常规逻辑
	              that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]] = {
	                pluginHandle: publishPluginHandle
	              };
	            }
	            resolve(pluginHandle);
	          },
	          error: function (error) {
	            that.logger.error("publishStream attach error回调：", error);
	            _deffer.reject(errorCodeFormat({
	              key: 'ERR_UNKNOWN',
	              msg: error
	            }));
	          },
	          consentDialog: function (on) {
	            that.logger.debug("publishStream consentDialog回调：", on);
	          },
	          iceState: function (state, ws) {
	            that.logger.log("publishStream iceState回调：", state);
	            switch (state) {
	              case 'connected':
	                // that.logger.log("ice connect success");
	                that.iceTimeoutRestartWebsocket.cancel();
	                break;
	              case 'disconnected':
	                // that.logger.log("ice connect loss");
	                that.iceTimeoutRestartWebsocket(ws);
	                break;
	            }
	          },
	          mediaState: function (medium, on) {
	            that.logger.log("publishStream mediaState回调，Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
	          },
	          webrtcState: function (on) {
	            that.logger.log("publishStream webrtcState回调，Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
	            // $("#audioleft").parent().unblock();
	            // 在发布流程中，webrtc建立连接后，媒体状态更新后，开始计算网络质量,发布流中，网络数据的更新是在mediaState更新后，不过我们上报网络是轮询的，会在2s后获取，所以放这里没事
	            on && that.pollingNetworkQuality();
	          },
	          slowLink: function (uplink, lost) {
	            that.logger.warn("publishStream slowLink回调，Janus reports problems " + (uplink ? "sending" : "receiving") + " packets on this PeerConnection (" + lost + " lost packets)");
	          },
	          onmessage: function (msg, jsep) {
	            that.logger.log("publishStream onMessage回调，返回msg:", msg, "返回jsep:", jsep);
	            if (jsep !== undefined && jsep !== null) {
	              that.logger.debug("Handling SDP as well...");
	              publishPluginHandle.handleRemoteJsep({
	                jsep: jsep
	              });
	            }
	            if (msg["rtcgw"]) {
	              // 消费句柄收集的回调任务
	              publishPluginHandle.messageTrigger(msg["rtcgw"], msg);
	              // 对外暴露
	              let msgReturn = msg;
	              if (msg["rtcgw"] === 'error') {
	                msgReturn = mapErrorSignalReceived(msg);
	              }
	              that.trigger(msg["rtcgw"], msgReturn);
	            }
	          },
	          onlocalstream: function (stream) {
	            that.logger.log("publishStream onlocalstream回调：", stream, 'steamTracks：', stream === null || stream === void 0 ? void 0 : stream.getTracks());
	            if (!(stream !== null && stream !== void 0 && stream.active)) {
	              // 返回的流未激活，不进行处理
	              return;
	            }
	            if (isSingleConnect) {
	              // 兼容音视频单独通道的逻辑
	              that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]][mediaStreamMap[streamtype]] = externalStream;
	            } else {
	              // TODO: 这里是一个闭包的逻辑，streamtype一直为attach创建时传入的type，不会变化，暂时不知道怎么修复
	              that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]].mediaStream = stream;
	            }
	            // 对外提供一个新的MediaStream实例，避免外部直接操作stream，引发一些奇怪的问题。比如对外demo上的，先开启摄像头，隐藏播放窗口后，再打开麦克风，仍能听到本地声音
	            that.trigger(_EzRtcCore.EVENT.LOCAL_STREAM_AVAILABLE, {
	              stream: new MediaStream(stream),
	              streamtype
	            });
	            // 播放本地流
	            // if (view) {
	            //   that.playStream({ domId: view, stream })
	            // }
	            if (streamtype === _EzRtcCore.STREAM_TYPE.SCREEN) {
	              var _stream$getVideoTrack;
	              stream === null || stream === void 0 || (_stream$getVideoTrack = stream.getVideoTracks()) === null || _stream$getVideoTrack === void 0 || (_stream$getVideoTrack = _stream$getVideoTrack[0]) === null || _stream$getVideoTrack === void 0 || _stream$getVideoTrack.addEventListener('ended', () => {
	                that.logger.log("停止了屏幕共享-----------------------");
	                let screenBody = that.settingMessageBody({
	                  "cmdType": "unpublishlocalstream",
	                  "streamtype": 8
	                });
	                if (publishPluginHandle) {
	                  publishPluginHandle.send({
	                    "message": screenBody,
	                    success: () => {
	                      that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.SCREEN]].pluginHandle.messageListen(_EzRtcCore.EVENT.UNPUBLISHLOCALSTREAMACK, msg => {
	                        if (msg.code === 0) {
	                          // 取消发布屏幕共享流，需要销毁通道
	                          [_EzRtcCore.STREAM_TYPE['SCREEN']].includes(params.type) && that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.SCREEN]].pluginHandle.detach({
	                            success: () => that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.SCREEN]] = null
	                          });
	                          that.attachScreenBySafari();
	                        }
	                      });
	                    },
	                    error: error => {}
	                  });
	                }
	              });
	            }
	          },
	          onremotestream: function (stream) {
	            that.logger.log("publishStream onremotestream回调：", stream);
	          },
	          ondataopen: function (data) {
	            that.logger.log("publishStream ondataopen回调：", data);
	          },
	          ondata: function (data) {
	            that.logger.log("publishStream ondata回调：", data);
	          },
	          oncleanup: function () {
	            that.logger.log("publishStream oncleanup回调");
	          },
	          ondetached: function () {
	            that.logger.log("publishStream ondetached回调");
	          }
	        });
	      });
	    }

	    // createOffer，建立webrtc连接
	    function createOffer() {
	      publishPluginHandle.createOffer({
	        ...lodashEs.cloneDeep(createOfferParams),
	        // 对数据进行深拷贝，防止janus源码中修改原数据
	        stream: externalStream,
	        customizeSdp: jsep => {
	          that.logger.log('jsep', jsep);
	          const isVideoOnly = streamtype === _EzRtcCore.STREAM_TYPE.VIDEO_ONLY && isSingleConnect; // 兼容单通道音视频流
	          const isAudioOnly = streamtype === _EzRtcCore.STREAM_TYPE.AUDIO_ONLY && isSingleConnect; // 兼容单通道音视频流
	          /**
	           * 如果是纯音频流，则修改sdp，添加 'a=extmap:10' 和 'a=extmap:11'
	           * */
	          if ((jsep === null || jsep === void 0 ? void 0 : jsep.type) === 'offer' && (!!media.audio && !media.video || isAudioOnly)) {
	            that.logger.log('纯音频流，自定义修改sdp，添加额外extmap');
	            // 如果是纯音频流，则修改sdp，添加 'a=extmap:10' 和 'a=extmap:11',防止发送音频后，再发送大小流，订阅端订阅不到视频
	            // 造成这个问题的原因是，服务端的底层库对sdp的解析，首次建立通道的时候，就决定了能否传输大小流，所以在建立纯音频通道的时候，就要把可以开启大小流的头信息添加上
	            let sdp = jsep.sdp;
	            const lines = sdp.split("\r\n");
	            if (!lines.find(item => item.indexOf('a=extmap:10') > -1)) {
	              // 如果没有 a=extmap:10，则寻找最后一条a=extmap:，在其后面添加 a=extmap:10
	              let lastIndex = lines.findLastIndex(item => item.indexOf('a=extmap:') > -1);
	              // 如果没有a=extmap:，则寻找a=mid:，在其后面添加 a=extmap:10
	              lastIndex = lastIndex > -1 ? lastIndex : lines.findIndex(item => item.indexOf('a=mid:') > -1);
	              if (lastIndex > -1) {
	                lines.splice(lastIndex + 1, 0, 'a=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id');
	              }
	            }
	            if (!lines.find(item => item.indexOf('a=extmap:11') > -1)) {
	              let lastIndex = lines.findLastIndex(item => item.indexOf('a=extmap:') > -1);
	              lines.splice(lastIndex + 1, 0, 'a=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id');
	            }
	            sdp = lines.join("\r\n");
	            if (!sdp.endsWith("\r\n")) sdp += "\r\n";
	            // 由于传进来的是个对象，直接修改对象属性值
	            jsep.sdp = sdp;
	          }

	          /**
	           * 如果是音频流，添加nack标识,支持音频重传
	           * */
	          if ((jsep === null || jsep === void 0 ? void 0 : jsep.type) === 'offer' && !!media.audio && !isVideoOnly) {
	            let sdp = jsep.sdp;
	            let sdpLines = sdp.split('\r\n');
	            let audioStart = sdpLines.indexOf(sdpLines.find(line => line.startsWith('m=audio')));
	            let audioEnd = sdpLines.indexOf(sdpLines.slice(audioStart + 1).find(line => line.startsWith('m='))) || sdpLines.length;
	            let audioSdpLines = sdpLines.slice(audioStart, audioEnd);
	            let payloadType = audioSdpLines.find(line => line.startsWith('a=rtpmap')).split(' ')[0].split(':')[1];
	            let nackLine = `a=rtcp-fb:${payloadType} nack`;

	            // 检查是否已包含NACK信息
	            if (!audioSdpLines.some(line => line.includes("nack"))) {
	              audioSdpLines.push(nackLine);
	              sdpLines = [...sdpLines.slice(0, audioStart), ...audioSdpLines, ...sdpLines.slice(audioEnd)];
	              sdp = sdpLines.join('\r\n');
	            }
	            if (!sdp.endsWith("\r\n")) sdp += "\r\n";
	            // 由于传进来的是个对象，直接修改对象属性值
	            jsep.sdp = sdp;
	          }
	        },
	        customizeAudioTrack: stream => {
	          // TODO: 目前订阅发布，无法监听返回数据，所以这里暂时不做处理，等后续完善插件集成后，再做处理
	          // return that.trigger(EzRtcCore.INNER_EVENT.CUSTOMIZE_AUDIO_TRACK, stream)
	          return new Promise((_resolve, _reject) => {
	            var _that$plugins$VoiceCh;
	            const localMediaStream = new MediaStream();
	            const audioTrack = stream.getAudioTracks()[0];
	            if (audioTrack && ((_that$plugins$VoiceCh = that.plugins['VoiceChange']) === null || _that$plugins$VoiceCh === void 0 ? void 0 : _that$plugins$VoiceCh.pluginStatus) === 'on') {
	              localMediaStream.addTrack(audioTrack);
	              that.plugins['VoiceChange'].recStart(localMediaStream).then(newStream => {
	                _resolve(newStream);
	              }).catch(error => {
	                that.logger.error('publishStream customizeAudioTrack error：', error);
	                _resolve(stream);
	              });
	            } else {
	              _resolve(stream);
	            }
	          });
	        },
	        success: function (jsep) {
	          that.logger.log("publishStream createOffer success回调，返回jsep：", jsep);
	          publishPluginHandle.send({
	            "message": body,
	            "jsep": jsep,
	            error: error => _deffer.reject(errorCodeFormat({
	              key: 'ERR_SIGNAL_SEND',
	              msg: error
	            }))
	          });
	          const callback = msg => {
	            if (msg["code"] === 0) {
	              // 只有创建成功了，才会改变createOfferParams，避免detachAttach的时候，逻辑判断出错
	              that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]].createOfferParams = createOfferParams;
	              that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]][paramsMap[streamtype]] = params;
	              that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]].videostreamtype = streamtype === _EzRtcCore.STREAM_TYPE['AUDIO_ONLY'] ? (publishAttach === null || publishAttach === void 0 ? void 0 : publishAttach.videostreamtype) || null : streamtype;

	              // 更新users
	              if ([_EzRtcCore.STREAM_TYPE['VIDEO_ONLY'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LITTLE'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LARGE']].includes(params.type)) {
	                that.usersInstance.updateUser({
	                  id: that.config.customId,
	                  vstate: 1
	                });
	              }
	              if ([_EzRtcCore.STREAM_TYPE['AUDIO_ONLY']].includes(params.type)) {
	                that.usersInstance.updateUser({
	                  id: that.config.customId,
	                  astate: 1
	                });
	              }
	              if ([_EzRtcCore.STREAM_TYPE['SCREEN']].includes(params.type)) {
	                that.usersInstance.updateUser({
	                  id: that.config.customId,
	                  sstate: 1
	                });
	              }
	              _deffer.resolve(errorCodeFormat('ERR_OK'));
	            } else {
	              // 屏幕共享发布失败，销毁屏幕共享发布通道（同一房间内如果多人发布屏幕共享流则会走到这个逻辑里）
	              detachAttach();
	              const errorReturn = mapErrorSignalReceived(msg);
	              _deffer.reject(errorReturn);
	            }
	          };
	          if (streamtype === _EzRtcCore.STREAM_TYPE['SCREEN']) {
	            that.state.messagePluginHandle.messageListen(_EzRtcCore.EVENT.PUBLISHSCREENSTREAMACK, callback);
	          } else {
	            publishPluginHandle.messageListen(_EzRtcCore.EVENT.PUBLISHLOCALSTREAMACK, callback);
	          }

	          // 监听onmessage error情况
	          publishPluginHandle.messageListen(_EzRtcCore.EVENT.ERROR, msg => {
	            // 例如未加入房间，但句柄创建了，导致后续发送请求都是在老的句柄上报错
	            that.logger.log("发布失败：", msg === null || msg === void 0 ? void 0 : msg.msg);
	            detachAttach();
	            const errorReturn = mapErrorSignalReceived(msg);
	            _deffer.reject(errorReturn);
	          });
	        },
	        error: function (error) {
	          that.logger.error("publishStream createOffer error回调：", error);
	          detachAttach();
	          const deviceKind = {
	            [_EzRtcCore.STREAM_TYPE['VIDEO_ONLY']]: 'video',
	            [_EzRtcCore.STREAM_TYPE['AUDIO_ONLY']]: 'audio',
	            [_EzRtcCore.STREAM_TYPE['SCREEN']]: 'screen',
	            [_EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LITTLE']]: 'video',
	            [_EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LARGE']]: 'video'
	          }[streamtype];
	          let errorReturn = mapErrorGetUserMedia(error, deviceKind) || errorCodeFormat({
	            key: 'ERR_UNKNOWN',
	            msg: error
	          });
	          if (typeof error === 'string' && error.toLocaleLowerCase().indexOf('no capture device found') > -1) {
	            errorReturn = errorCodeFormat({
	              key: 'ERR_NO_DEVICE',
	              msg: error
	            });
	          }
	          _deffer.reject(errorReturn);
	        }
	      });
	    }

	    // 销毁通道
	    function detachAttach() {
	      var _publishPluginHandle;
	      if (streamtype !== _EzRtcCore.STREAM_TYPE['SCREEN']) {
	        var _that$state$publishAt;
	        // 非屏幕共享流的情况，要去判断通道中是否还存在音频或视频，如果存在，则不去销毁通道
	        const {
	          video,
	          audio
	        } = ((_that$state$publishAt = that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]]) === null || _that$state$publishAt === void 0 || (_that$state$publishAt = _that$state$publishAt.createOfferParams) === null || _that$state$publishAt === void 0 ? void 0 : _that$state$publishAt.media) || {};
	        if (!!video + !!audio >= 1) {
	          return;
	        }
	      }
	      (_publishPluginHandle = publishPluginHandle) === null || _publishPluginHandle === void 0 || _publishPluginHandle.detach();
	      that.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[streamtype]] = null;

	      // 如果是safari浏览器，则重新建立屏幕共享流通道
	      params.type === _EzRtcCore.STREAM_TYPE['SCREEN'] && that.attachScreenBySafari();
	    }
	    return _deffer.promise;
	  }

	  //取消发布本地音视频
	  async unpublishStream(params) {
	    this.logger.log('取消发布本地音视频，入参：', JSON.stringify(params));
	    const that = this;
	    const _deffer = deffer$2();
	    // 获取发布通道
	    const publishAttach = this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[params.type]];
	    // 获取发布句柄
	    const pluginHandleMap = {
	      [_EzRtcCore.STREAM_TYPE.VIDEO_ONLY]: 'pluginHandle',
	      [_EzRtcCore.STREAM_TYPE.AUDIO_ONLY]: 'pluginHandleAudio',
	      [_EzRtcCore.STREAM_TYPE.SCREEN]: 'pluginHandle'
	    };
	    let pluginHandle = publishAttach === null || publishAttach === void 0 ? void 0 : publishAttach[params.isSingleConnect ? pluginHandleMap[params.type] : 'pluginHandle'];
	    // 先获取发布视频流时，大小流开关，如果大小流开关打开，则取消发布视频流需要同时取消小流
	    const body = this.settingMessageBody({
	      "cmdType": "unpublishlocalstream",
	      "streamtype": params.type == _EzRtcCore.STREAM_TYPE['VIDEO_ONLY'] ? this.state.videoSettingParams.simulcast == true ? _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LARGE'] : _EzRtcCore.STREAM_TYPE['VIDEO_ONLY'] : params.type
	    });

	    // 等待发布队列中的任务执行完毕
	    await this.publishAttachesQueueAwait(_deffer);
	    if (pluginHandle) {
	      var _publishAttach$create6;
	      pluginHandle.createOffer({
	        media: params.isSingleConnect ? {
	          // 如果是独立通道的，则全部设置为false，避免janus中判断，导致调用getUserMedia方法。
	          audio: false,
	          audioSend: false,
	          audioRecv: false,
	          addAudio: false,
	          replaceAudio: false,
	          video: false,
	          videoSend: false,
	          videoRecv: false,
	          addVideo: false,
	          replaceVideo: false,
	          [params.type === _EzRtcCore.STREAM_TYPE['AUDIO_ONLY'] ? 'removeAudio' : 'removeVideo']: true
	        } : lodashEs.cloneDeep({
	          ...((_publishAttach$create6 = publishAttach.createOfferParams) === null || _publishAttach$create6 === void 0 ? void 0 : _publishAttach$create6.media),
	          replaceAudio: false,
	          replaceVideo: false,
	          addVideo: false,
	          addAudio: false,
	          [params.type === _EzRtcCore.STREAM_TYPE['AUDIO_ONLY'] ? 'removeAudio' : 'removeVideo']: true
	        }),
	        success: jsep => {
	          pluginHandle.send({
	            "message": body,
	            error: error => {
	              _deffer.reject(errorCodeFormat({
	                key: 'ERR_SIGNAL_SEND',
	                msg: error
	              }));
	            }
	          });
	          pluginHandle.messageListen(_EzRtcCore.EVENT.UNPUBLISHLOCALSTREAMACK, msg => {
	            if (msg.code === 0) {
	              // 如果取消发布的是视频流，则需要判断通道中是否还存在音频或视频，如果都不存在，则销毁通道
	              if (params.type !== _EzRtcCore.STREAM_TYPE['SCREEN']) {
	                if ([_EzRtcCore.STREAM_TYPE['VIDEO_ONLY'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LITTLE'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LARGE']].includes(params.type)) {
	                  publishAttach.createOfferParams.media.video = false;
	                  that.usersInstance.updateUser({
	                    id: that.config.customId,
	                    vstate: 0
	                  });
	                }
	                if ([_EzRtcCore.STREAM_TYPE['AUDIO_ONLY']].includes(params.type)) {
	                  var _this$plugins$VoiceCh;
	                  publishAttach.createOfferParams.media.audio = false;
	                  that.usersInstance.updateUser({
	                    id: that.config.customId,
	                    astate: 0
	                  });
	                  (_this$plugins$VoiceCh = this.plugins['VoiceChange']) === null || _this$plugins$VoiceCh === void 0 || _this$plugins$VoiceCh.recStop(); // 如果有变声插件，则停止变声，都是历史逻辑兼容一下，看后面优化
	                }
	                const {
	                  video,
	                  audio
	                } = publishAttach.createOfferParams.media;
	                if (!!video + !!audio == 0) {
	                  // pluginHandle.detach({ noRequest: false }); // 不确定之前为什么加noRequest false，为了复用通道么，那detach的含义就模糊了，理论上应该是销毁通道
	                  pluginHandle.detach({
	                    success: () => this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[params.type]] = null
	                  });
	                }

	                // 兼容音视频单独通道的逻辑
	                if (params.isSingleConnect) {
	                  pluginHandle.detach({
	                    success: () => {
	                      var _this$state$publishAt;
	                      if ((_this$state$publishAt = this.state.publishAttaches) !== null && _this$state$publishAt !== void 0 && (_this$state$publishAt = _this$state$publishAt[_EzRtcCore.ATTACHES_TYPE[params.type]]) !== null && _this$state$publishAt !== void 0 && _this$state$publishAt[pluginHandleMap[params.type]]) {
	                        this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[params.type]][pluginHandleMap[params.type]] = null;
	                      }
	                    }
	                  });
	                }
	              }
	              // 取消发布屏幕共享流，需要销毁通道
	              if ([_EzRtcCore.STREAM_TYPE['SCREEN']].includes(params.type)) {
	                pluginHandle.detach({
	                  success: () => this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[params.type]] = null
	                });
	                that.attachScreenBySafari();
	                that.usersInstance.updateUser({
	                  id: that.config.customId,
	                  sstate: 0
	                });
	              }
	              _deffer.resolve(errorCodeFormat('ERR_OK'));
	            } else {
	              const errorReturn = mapErrorSignalReceived(msg);
	              _deffer.reject(errorReturn);
	            }
	          });
	        },
	        error: function (error) {
	          that.logger.error("取消发布流失败：", error);
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_UNKNOWN',
	            msg: error
	          }));
	        }
	      });
	    } else {
	      setTimeout(_deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: 'no handle'
	      })), 0);
	    }
	    return _deffer.promise;
	  }
	  //订阅
	  async subscribeStream(params) {
	    var _this$state$subscribe, _subscribeAttach$crea, _subscribeAttach$crea2, _subscribeAttach$crea3, _subscribeAttach$crea4;
	    this.logger.log('订阅音视频，入参：', JSON.stringify(params));
	    const that = this;
	    // 构建 deffer 实例
	    let _deffer = deffer$2();

	    // 前置逻辑 等待订阅队列完成
	    await this.subscribeAttachesQueueAwait(_deffer);

	    // 获取订阅流通道
	    const subscribeAttach = (_this$state$subscribe = this.state.subscribeAttaches) === null || _this$state$subscribe === void 0 || (_this$state$subscribe = _this$state$subscribe[params.userId]) === null || _this$state$subscribe === void 0 ? void 0 : _this$state$subscribe[_EzRtcCore.ATTACHES_TYPE[params.type]];
	    // 获取订阅流句柄
	    let subscribePluginHandle = (subscribeAttach === null || subscribeAttach === void 0 ? void 0 : subscribeAttach.pluginHandle) || null;
	    const body = this.settingMessageBody({
	      "cmdType": "subremote",
	      "streamtype": params.type,
	      "customId": params.userId
	    });
	    // 订阅媒体基础配置
	    let media = {
	      videoSend: false,
	      videoRecv: !!(subscribeAttach !== null && subscribeAttach !== void 0 && (_subscribeAttach$crea = subscribeAttach.createOfferParams) !== null && _subscribeAttach$crea !== void 0 && (_subscribeAttach$crea = _subscribeAttach$crea.media) !== null && _subscribeAttach$crea !== void 0 && _subscribeAttach$crea.video),
	      audioSend: false,
	      audioRecv: !!(subscribeAttach !== null && subscribeAttach !== void 0 && (_subscribeAttach$crea2 = subscribeAttach.createOfferParams) !== null && _subscribeAttach$crea2 !== void 0 && (_subscribeAttach$crea2 = _subscribeAttach$crea2.media) !== null && _subscribeAttach$crea2 !== void 0 && _subscribeAttach$crea2.audio),
	      data: false,
	      video: (subscribeAttach === null || subscribeAttach === void 0 || (_subscribeAttach$crea3 = subscribeAttach.createOfferParams) === null || _subscribeAttach$crea3 === void 0 || (_subscribeAttach$crea3 = _subscribeAttach$crea3.media) === null || _subscribeAttach$crea3 === void 0 ? void 0 : _subscribeAttach$crea3.video) || false,
	      audio: (subscribeAttach === null || subscribeAttach === void 0 || (_subscribeAttach$crea4 = subscribeAttach.createOfferParams) === null || _subscribeAttach$crea4 === void 0 || (_subscribeAttach$crea4 = _subscribeAttach$crea4.media) === null || _subscribeAttach$crea4 === void 0 ? void 0 : _subscribeAttach$crea4.audio) || false
	    };

	    // 根据不同的订阅类型，设置不同的媒体配置
	    switch (params.type) {
	      //视频（大流、小流）
	      case (_EzRtcCore.STREAM_TYPE['VIDEO_ONLY'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LARGE'], _EzRtcCore.STREAM_TYPE['VIDEO_SIMULCAST_LITTLE']):
	        media = {
	          ...media,
	          videoRecv: true,
	          video: true
	        };
	        break;
	      //音频
	      case _EzRtcCore.STREAM_TYPE['AUDIO_ONLY']:
	        media = {
	          ...media,
	          audioRecv: true,
	          audio: true
	        };
	        break;
	      //屏幕共享
	      case _EzRtcCore.STREAM_TYPE['SCREEN']:
	        media = {
	          ...media,
	          audioRecv: false,
	          audio: false,
	          videoRecv: true,
	          video: true
	        };
	        break;
	      // 默认视频流，防止type为空的时候，media信息都为false，导致sdp添加失败
	      default:
	        media = {
	          ...media,
	          videoRecv: true,
	          video: true
	        };
	    }

	    // 创建offer配置，用于记录订阅时的媒体配置
	    const createOfferParams = {
	      media,
	      simulcast: false
	    };

	    // 如果是refrush，且订阅流handle存在，则销毁老的句柄
	    if (subscribePluginHandle && params.refrush) {
	      subscribePluginHandle.detach();
	      this.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]] = null;
	    }
	    this.logger.log("订阅音视频 createOfferParams：", createOfferParams);
	    // 订阅只能用一个通道，先判断是否已经attach
	    if (!subscribePluginHandle || params.refrush) {
	      this.janusInstance.attach({
	        plugin: "rtcgw.plugin.sts",
	        opaqueId: this.config.opaqueId,
	        success: pluginHandle => {
	          var _that$state$subscribe;
	          that.logger.log("subscribeStream attach success回调，返回订阅流句柄：", pluginHandle);
	          subscribePluginHandle = pluginHandle;

	          // 存储pluginHandle到实例状态中
	          if ((_that$state$subscribe = that.state.subscribeAttaches) !== null && _that$state$subscribe !== void 0 && _that$state$subscribe[params.userId]) {
	            that.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]] = {
	              pluginHandle: subscribePluginHandle
	            };
	          } else {
	            that.state.subscribeAttaches[params.userId] = {
	              [_EzRtcCore.ATTACHES_TYPE[params.type]]: {
	                pluginHandle: subscribePluginHandle
	              }
	            };
	          }
	          createOffer();
	        },
	        error: function (error) {
	          that.logger.error("subscribeStream attach error回调：", error);
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_SUBSCRIBE_FAIL',
	            msg: error
	          }));
	        },
	        consentDialog: function (on) {
	          that.logger.debug("subscribeStream consentDialog回调：", on);
	        },
	        iceState: function (state, ws) {
	          that.logger.log("subscribeStream iceState回调：", state);
	          switch (state) {
	            case 'connected':
	              // that.logger.log("ice connect success");
	              that.iceTimeoutRestartWebsocket.cancel();
	              break;
	            case 'disconnected':
	              // that.logger.log("ice connect loss");
	              that.iceTimeoutRestartWebsocket(ws);
	              break;
	          }
	        },
	        mediaState: function (medium, on) {
	          that.logger.log("subscribeStream mediaState回调，Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
	        },
	        webrtcState: function (on) {
	          that.logger.log("subscribeStream webrtcState回调，Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
	          // 在订阅流程中，webrtc建立连接后，开始计算网络质量
	          on && that.pollingNetworkQuality();
	        },
	        slowLink: function (uplink, lost) {
	          that.logger.warn("subscribeStream slowLink回调，Janus reports problems " + (uplink ? "sending" : "receiving") + " packets on this PeerConnection (" + lost + " lost packets)");
	        },
	        onmessage: function (msg, jsep) {
	          that.logger.log('subscribeStream onMessage回调，返回msg：', msg, '返回jsep：', jsep);
	          if (jsep !== undefined && jsep !== null) {
	            that.logger.debug("Handling SDP as well...");
	            that.logger.debug(jsep);
	            subscribePluginHandle.handleRemoteJsep({
	              jsep: jsep
	            });
	          }
	          if (msg["rtcgw"]) {
	            // 消费句柄收集的回调任务
	            subscribePluginHandle.messageTrigger(msg["rtcgw"], msg);
	            // 对外暴露
	            let msgReturn = msg;
	            if (msg["rtcgw"] === 'error') {
	              msgReturn = mapErrorSignalReceived(msg);
	            }
	            that.trigger(msg["rtcgw"], msgReturn);
	          }
	        },
	        onlocalstream: function (stream) {
	          that.logger.log("subscribeStream onlocalstream回调：", stream);
	        },
	        onremotestream: function (stream) {
	          that.logger.log("subscribeStream onremotestream回调：", stream, 'steamTracks：', stream === null || stream === void 0 ? void 0 : stream.getTracks());
	          if (!(stream !== null && stream !== void 0 && stream.active)) {
	            // 返回的流未激活，不进行处理
	            return;
	          }
	          // 针对屏幕共享流码率不稳定的原因，导致频繁断流，加载，白屏或者loading，所以对onmuted和onunmuted重复被触发的时候，不进行流的重新加载
	          if (params.type === _EzRtcCore.STREAM_TYPE['SCREEN']) {
	            this.countScreenStream = (this.countScreenStream || 0) + 1;
	            if (this.countScreenStream > 2) {
	              return;
	            }
	          }
	          // 如果传入domId，则绑定流到dom上
	          if (params !== null && params !== void 0 && params.view) {
	            that.playStream({
	              domId: params.view,
	              stream
	            });
	          }
	          // 保存订阅流
	          that.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]].mediaStream = stream;
	          that.trigger(_EzRtcCore.EVENT.REMOTE_STREAM_AVAILABLE, {
	            stream: stream,
	            streamtype: params.type,
	            userId: params.userId
	          });
	        },
	        ondataopen: function (data) {
	          that.logger.log("subscribeStream ondataopen回调：", data);
	        },
	        ondata: function (data) {
	          that.logger.log("subscribeStream ondata回调：", data);
	        },
	        oncleanup: function () {
	          that.logger.log("subscribeStream oncleanup回调");
	        }
	      });
	    } else {
	      createOffer();
	    }

	    // createOffer，建立rtc连接
	    function createOffer() {
	      subscribePluginHandle.createOffer({
	        ...lodashEs.cloneDeep(createOfferParams),
	        success: function (jsep) {
	          that.logger.log("subscribeStream createOffer success回调，返回jsep：", jsep);
	          // 发送订阅消息
	          subscribePluginHandle.send({
	            "message": body,
	            "jsep": jsep,
	            error: error => _deffer.reject(errorCodeFormat({
	              key: 'ERR_SIGNAL_SEND',
	              msg: error
	            }))
	          });
	          subscribePluginHandle.messageListen(_EzRtcCore.EVENT.SUBREMOTEACK, msg => {
	            that.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]].createOfferParams = createOfferParams;
	            that.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]].videostreamtype = params.type === _EzRtcCore.STREAM_TYPE['AUDIO_ONLY'] ? (subscribeAttach === null || subscribeAttach === void 0 ? void 0 : subscribeAttach.videostreamtype) || null : params.type;
	            if ((msg === null || msg === void 0 ? void 0 : msg.code) === 0) {
	              _deffer.resolve(errorCodeFormat('ERR_OK'));
	            } else {
	              // 不为0时，发起取消订阅，在控制订阅权限时会涉及
	              that.unsubscribe({
	                userId: params.userId,
	                type: params.type
	              });
	              const errorReturn = mapErrorSignalReceived(msg);
	              _deffer.reject(errorReturn);
	            }
	          });
	          subscribePluginHandle.messageListen(_EzRtcCore.EVENT.ERROR, msg => {
	            that.logger.log("订阅失败：", msg === null || msg === void 0 ? void 0 : msg.msg);
	            detachAttach();
	            // 针对未加入房间，但句柄创建了，导致后续发送请求都是在老的句柄上报错
	            that.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]] = null;
	            const errorReturn = mapErrorSignalReceived(msg);
	            _deffer.reject(errorReturn);
	          });
	        },
	        error: function (error) {
	          that.logger.error("subscribeStream createOffer error回调:", error);
	          detachAttach();
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_SUBSCRIBE_FAIL',
	            msg: error
	          }));
	        }
	      });
	    }
	    function detachAttach() {
	      var _subscribePluginHandl;
	      if (params.type !== _EzRtcCore.STREAM_TYPE['SCREEN']) {
	        var _that$state$subscribe2;
	        // 非屏幕共享流的情况，要去判断通道中是否还存在音频或视频，如果同时存在，则不去销毁通道
	        const {
	          video,
	          audio
	        } = ((_that$state$subscribe2 = that.state.subscribeAttaches[params.userId]) === null || _that$state$subscribe2 === void 0 || (_that$state$subscribe2 = _that$state$subscribe2[_EzRtcCore.ATTACHES_TYPE[params.type]]) === null || _that$state$subscribe2 === void 0 || (_that$state$subscribe2 = _that$state$subscribe2.createOfferParams) === null || _that$state$subscribe2 === void 0 ? void 0 : _that$state$subscribe2.media) || {};
	        if (!!video + !!audio >= 1) {
	          return;
	        }
	      }
	      (_subscribePluginHandl = subscribePluginHandle) === null || _subscribePluginHandl === void 0 || _subscribePluginHandl.detach();
	      if (that.state.subscribeAttaches[params.userId]) that.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]] = null;
	    }
	    return _deffer.promise;
	  }

	  //取消订阅用户
	  async unsubscribe(params) {
	    var _this$state$subscribe2;
	    this.logger.log('取消订阅音视频，入参：', JSON.stringify(params));
	    // 构建 deffer 实例
	    let _deffer = deffer$2();
	    const subscribeAttach = (_this$state$subscribe2 = this.state.subscribeAttaches) === null || _this$state$subscribe2 === void 0 || (_this$state$subscribe2 = _this$state$subscribe2[params.userId]) === null || _this$state$subscribe2 === void 0 ? void 0 : _this$state$subscribe2[_EzRtcCore.ATTACHES_TYPE[params.type]];
	    const body = this.settingMessageBody({
	      "cmdType": "unsubremote",
	      "streamtype": params.type,
	      "customId": params.userId
	    });

	    // 前置逻辑 等待订阅队列完成
	    await this.subscribeAttachesQueueAwait(_deffer);
	    if (subscribeAttach !== null && subscribeAttach !== void 0 && subscribeAttach.pluginHandle) {
	      var _subscribeAttach$plug;
	      (_subscribeAttach$plug = subscribeAttach.pluginHandle) === null || _subscribeAttach$plug === void 0 || _subscribeAttach$plug.send({
	        "message": body,
	        error: error => {
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_SIGNAL_SEND',
	            msg: error
	          }));
	        }
	      });

	      // 监听取消发布的回调（不去监听具体的信令，避免同时触发clientLeave和unpublishlocalstreamack的消息处理逻辑，导致消息通道销毁了，但是还在等待取消流的结果，导致报错超时）

	      // subscribeAttach.pluginHandle?.messageListen(EzRtcCore.EVENT.UNSUBREMOTEACK, (msg) => {
	      //   if (msg.code === 0) {
	      //   } else {
	      //     _deffer.reject(msg?.msg)
	      //   }
	      // })

	      // 如果取消订阅的是视频流，则需要判断通道中是否还存在音频或视频，如果都不存在，则销毁通道
	      if (params.type !== 8) {
	        [1, 4, 5].includes(params.type) && (subscribeAttach.createOfferParams.media.video = false);
	        params.type == 2 && (subscribeAttach.createOfferParams.media.audio = false);
	        const {
	          video,
	          audio
	        } = subscribeAttach.createOfferParams.media;
	        if (video + audio === 0) {
	          // subscribeAttach.pluginHandle.detach({ noRequest: false }); // 不确定之前为什么加noRequest false，为了复用通道么，那detach的含义就模糊了，理论上应该是销毁通道
	          subscribeAttach.pluginHandle.detach({
	            success: () => this.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]] = null
	          });
	        }
	      }
	      // 取消订阅屏幕共享流，需要销毁通道
	      [8].includes(params.type) && subscribeAttach.pluginHandle.detach({
	        success: () => this.state.subscribeAttaches[params.userId][_EzRtcCore.ATTACHES_TYPE[params.type]] = null
	      });
	      _deffer.resolve(errorCodeFormat('ERR_OK'));
	    } else {
	      setTimeout(_deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: 'no handle'
	      })), 0);
	    }
	    return _deffer.promise;
	  }

	  // 订阅混音流
	  async subscribeMix(params) {
	    this.logger.log('订阅混音流');
	    const _deffer = deffer$2();
	    const that = this;
	    const body = this.settingMessageBody({
	      "cmdType": "subremotemix",
	      "streamtype": _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	    });
	    let subscribePluginHandle = null;
	    this.janusInstance.attach({
	      plugin: "rtcgw.plugin.sts",
	      opaqueId: this.config.opaqueId,
	      success: pluginHandle => {
	        that.logger.log("subscribeMix attach success回调，返回订阅流句柄：", pluginHandle);
	        subscribePluginHandle = this.state.roomInfo.amixer.pluginHandle = pluginHandle;
	        subscribePluginHandle.createOffer({
	          media: {
	            videoSend: false,
	            videoRecv: false,
	            audioSend: false,
	            audioRecv: true,
	            data: false,
	            video: false,
	            audio: true
	          },
	          success: function (jsep) {
	            that.logger.log("subscribeMix createOffer success回调，返回jsep：", jsep);
	            // 发送订阅消息
	            subscribePluginHandle.send({
	              "message": body,
	              "jsep": jsep,
	              error: error => _deffer.reject(errorCodeFormat({
	                key: 'ERR_SIGNAL_SEND',
	                msg: error
	              }))
	            });
	            subscribePluginHandle.messageListen(_EzRtcCore.EVENT.SUBREMOTEMIXACK, msg => {
	              if ((msg === null || msg === void 0 ? void 0 : msg.code) === 0) {
	                _deffer.resolve(errorCodeFormat('ERR_OK'));
	              } else {
	                // 不为0时，发起取消订阅，在控制订阅权限时会涉及
	                that.unsubscribeMix();
	                const errorReturn = mapErrorSignalReceived(msg);
	                _deffer.reject(errorReturn);
	              }
	            });
	            subscribePluginHandle.messageListen(_EzRtcCore.EVENT.ERROR, msg => {
	              that.logger.log("订阅失败：", msg === null || msg === void 0 ? void 0 : msg.msg);
	              const errorReturn = mapErrorSignalReceived(msg);
	              _deffer.reject(errorReturn);
	            });
	          },
	          error: function (error) {
	            that.logger.error("subscribeMix createOffer error回调:", error);
	            _deffer.reject(errorCodeFormat({
	              key: 'ERR_SUBSCRIBE_FAIL',
	              msg: error
	            }));
	          }
	        });
	      },
	      error: function (error) {
	        that.logger.error("subscribeMix attach error回调：", error);
	        _deffer.reject(errorCodeFormat({
	          key: 'ERR_SUBSCRIBE_FAIL',
	          msg: error
	        }));
	      },
	      consentDialog: function (on) {
	        that.logger.debug("subscribeMix consentDialog回调：", on);
	      },
	      iceState: function (state, ws) {
	        that.logger.log("subscribeMix iceState回调：", state);
	        switch (state) {
	          case 'connected':
	            // that.logger.log("ice connect success");
	            that.iceTimeoutRestartWebsocket.cancel();
	            break;
	          case 'disconnected':
	            // that.logger.log("ice connect loss");
	            that.iceTimeoutRestartWebsocket(ws);
	            break;
	        }
	      },
	      mediaState: function (medium, on) {
	        that.logger.log("subscribeMix mediaState回调，Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
	      },
	      webrtcState: function (on) {
	        that.logger.log("subscribeMix webrtcState回调，Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
	        // 在订阅流程中，webrtc建立连接后，开始计算网络质量
	        on && that.pollingNetworkQuality();
	      },
	      slowLink: function (uplink, lost) {
	        that.logger.warn("subscribeMix slowLink回调，Janus reports problems " + (uplink ? "sending" : "receiving") + " packets on this PeerConnection (" + lost + " lost packets)");
	      },
	      onmessage: function (msg, jsep) {
	        that.logger.log('subscribeMix onMessage回调，返回msg：', msg, '返回jsep：', jsep);
	        if (jsep !== undefined && jsep !== null) {
	          that.logger.debug("Handling SDP as well...");
	          that.logger.debug(jsep);
	          subscribePluginHandle.handleRemoteJsep({
	            jsep: jsep
	          });
	        }
	        if (msg["rtcgw"]) {
	          // 消费句柄收集的回调任务
	          subscribePluginHandle.messageTrigger(msg["rtcgw"], msg);
	          // 对外暴露
	          let msgReturn = msg;
	          if (msg["rtcgw"] === 'error') {
	            msgReturn = mapErrorSignalReceived(msg);
	          }
	          that.trigger(msg["rtcgw"], msgReturn);
	        }
	      },
	      onlocalstream: function (stream) {
	        that.logger.log("subscribeMix onlocalstream回调：", stream);
	      },
	      onremotestream: function (stream) {
	        that.logger.log("subscribeMix onremotestream回调：", stream, 'steamTracks：', stream === null || stream === void 0 ? void 0 : stream.getTracks());
	        if (!(stream !== null && stream !== void 0 && stream.active)) {
	          // 返回的流未激活，不进行处理
	          return;
	        }

	        // 保存订阅流
	        that.state.roomInfo.amixer.streams[0] = {
	          streamtype: 'amixer',
	          mediaStream: stream
	        };
	        // 如果传入domId，则绑定流到dom上
	        if (params !== null && params !== void 0 && params.view) {
	          that.state.roomInfo.amixer.streams[0].view = params.view;
	          that.playStream({
	            domId: params.view,
	            stream
	          });
	        }
	        // that.state.subscribeAttaches[params.userId][EzRtcCore.ATTACHES_TYPE[params.type]].mediaStream = stream;
	        that.trigger(_EzRtcCore.EVENT.REMOTE_STREAM_AVAILABLE, {
	          stream: stream,
	          streamtype: 'amixer'
	        });
	      },
	      ondataopen: function (data) {
	        that.logger.log("subscribeMix ondataopen回调：", data);
	      },
	      ondata: function (data) {
	        that.logger.log("subscribeMix ondata回调：", data);
	      },
	      oncleanup: function () {
	        that.logger.log("subscribeMix oncleanup回调");
	      }
	    });
	    return _deffer.promise;
	  }

	  //取消订阅混音流
	  async unsubscribeMix(params) {
	    this.logger.log('取消订阅混音流');
	    // 构建 deffer 实例
	    let _deffer = deffer$2();
	    const amixerPluginHandle = this.state.roomInfo.amixer.pluginHandle;
	    const body = this.settingMessageBody({
	      "cmdType": "unsubremotemix",
	      "streamtype": _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	    });
	    if (amixerPluginHandle) {
	      amixerPluginHandle.send({
	        "message": body,
	        error: error => {
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_SIGNAL_SEND',
	            msg: error
	          }));
	        }
	      });
	      amixerPluginHandle.detach({
	        success: () => this.state.roomInfo.amixer.pluginHandle = null
	      });
	      _deffer.resolve(errorCodeFormat('ERR_OK'));
	    } else {
	      // 没有混音流句柄
	      setTimeout(_deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: 'no handle'
	      })), 0);
	    }
	    return _deffer.promise;
	  }

	  //设置摄像头设备
	  setCameraDevice(params) {
	    var _publishAttaches$_EzR;
	    const that = this;
	    const _deffer = deffer$2();
	    const {
	      publishAttaches,
	      videoSettingParams
	    } = this.state;
	    const publishPluginHandle = (_publishAttaches$_EzR = publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.VIDEO_ONLY]]) === null || _publishAttaches$_EzR === void 0 ? void 0 : _publishAttaches$_EzR.pluginHandle;
	    const simulcast = this.state.videoSettingParams.simulcast;
	    this.state.videoSettingParams.cameraId = params.deviceId;
	    this.state.profile.cameraId = params.deviceId;
	    if (publishPluginHandle) {
	      var _publishAttaches$_EzR2;
	      publishPluginHandle.createOffer({
	        // No media provided: by default, it's sendrecv for audio and video
	        media: {
	          video: {
	            deviceId: params.deviceId
	          },
	          replaceVideo: true,
	          audio: (_publishAttaches$_EzR2 = publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.VIDEO_ONLY]]) !== null && _publishAttaches$_EzR2 !== void 0 && (_publishAttaches$_EzR2 = _publishAttaches$_EzR2.createOfferParams) !== null && _publishAttaches$_EzR2 !== void 0 && (_publishAttaches$_EzR2 = _publishAttaches$_EzR2.media) !== null && _publishAttaches$_EzR2 !== void 0 && _publishAttaches$_EzR2.audio ? true : false
	        },
	        simulcast,
	        bitrate: videoSettingParams.bitrate,
	        frameRate: videoSettingParams.frameRate,
	        success: function (jsep) {
	          that.logger.log("设置video deviceId成功，返回jsep：", jsep);
	          _deffer.resolve(errorCodeFormat('ERR_OK'));
	        },
	        error: function (error) {
	          that.logger.error("设置video deviceId失败：", error);
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_UNKNOWN',
	            msg: error
	          }));
	        }
	      });
	    }
	    return _deffer.promise;
	  }
	  //设置麦克风设备
	  setMicrophoneDevice(params) {
	    var _publishAttaches$_EzR3;
	    const that = this;
	    const _deffer = deffer$2();
	    const {
	      publishAttaches,
	      videoSettingParams
	    } = this.state;
	    const publishPluginHandle = (_publishAttaches$_EzR3 = publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.AUDIO_ONLY]]) === null || _publishAttaches$_EzR3 === void 0 ? void 0 : _publishAttaches$_EzR3.pluginHandle;
	    const simulcast = this.state.videoSettingParams.simulcast;
	    this.state.audioSettingParams.microphoneId = params.deviceId;
	    this.state.profile.microphoneId = params.deviceId;
	    if (publishPluginHandle) {
	      var _publishAttaches$_EzR4;
	      publishPluginHandle.createOffer({
	        // No media provided: by default, it's sendrecv for audio and video
	        media: {
	          audio: {
	            deviceId: params.deviceId
	          },
	          replaceAudio: true,
	          video: (_publishAttaches$_EzR4 = publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE.AUDIO_ONLY]]) !== null && _publishAttaches$_EzR4 !== void 0 && (_publishAttaches$_EzR4 = _publishAttaches$_EzR4.createOfferParams) !== null && _publishAttaches$_EzR4 !== void 0 && (_publishAttaches$_EzR4 = _publishAttaches$_EzR4.media) !== null && _publishAttaches$_EzR4 !== void 0 && _publishAttaches$_EzR4.video ? true : false
	        },
	        simulcast,
	        bitrate: videoSettingParams.bitrate,
	        frameRate: videoSettingParams.frameRate,
	        success: function (jsep) {
	          that.logger.log("设置audio deviceId成功，返回jsep：", jsep);
	          _deffer.resolve(errorCodeFormat('ERR_OK'));
	        },
	        error: function (error) {
	          that.logger.error("设置audio deviceId失败：", error);
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_UNKNOWN',
	            msg: error
	          }));
	        }
	      });
	    }
	    return _deffer.promise;
	  }

	  // 设置参数
	  setProfile(params) {
	    const {
	      cameraId,
	      microphoneId,
	      width,
	      height,
	      frameRate,
	      bitrate,
	      simulcast
	    } = params;
	    this.state.profile = Object.assign(this.state.profile, params);
	  }

	  //设置视频参数
	  setVideoProfile(data) {
	    let _deffer = deffer$2();
	    this.state.videoSettingParams = {
	      cameraId: data.cameraId || null,
	      width: data.width || null,
	      height: data.height || null,
	      frameRate: data.frameRate || null,
	      bitrate: data.bitrate ? data.bitrate * 1000 : null,
	      simulcast: data.simulcast || false,
	      simulcastMaxBitrates: data.bitrate ? {
	        high: data.bitrate * 1000,
	        medium: null,
	        low: null
	      } : null
	    };
	    _deffer.resolve(errorCodeFormat('ERR_OK'));
	    return _deffer.promise;
	  }

	  //设置音频参数
	  setAudioProfile(data) {
	    let _deffer = deffer$2();
	    this.state.audioSettingParams = {
	      microphoneId: data.microphoneId || null
	    };
	    _deffer.resolve(errorCodeFormat('ERR_OK'));
	    return _deffer.promise;
	  }

	  //暂停本地流
	  pausePushStream(params) {
	    const that = this;
	    return that.controlStream(params, "suspend");
	  }

	  //恢复本地流
	  resumePushStream(params) {
	    const that = this;
	    return that.controlStream(params, "resume");
	  }

	  /**恢复和暂停的公共方法*/
	  controlStream(params, controlType) {
	    const _deffer = deffer$2();
	    // 获取发布句柄
	    const publishAttach = this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[params.type]];
	    publishAttach === null || publishAttach === void 0 ? void 0 : publishAttach.pluginHandle;
	    const publishStream = publishAttach === null || publishAttach === void 0 ? void 0 : publishAttach.mediaStream;
	    let isMatchedTrack = false;
	    publishStream === null || publishStream === void 0 || publishStream.getTracks().forEach(track => {
	      const isContinue = [2].includes(params.type) && track.kind == 'audio' || [1, 8].includes(params.type) && track.kind == 'video';
	      if (isContinue) {
	        if (controlType == "resume") {
	          track.enabled = true;
	        } else {
	          track.enabled = false;
	        }
	        isMatchedTrack = true;
	        _deffer.resolve(errorCodeFormat('ERR_OK'));
	      }
	    });
	    if (!isMatchedTrack) {
	      _deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: 'no matched track'
	      }));
	    }
	    // 并且给服务端发送信令
	    // const body = this.settingMessageBody({
	    //   "cmdType": controlType == "resume" ? "resumelocalstream" : "pauselocalstream",
	    //   "streamtype": params.type,
	    // })
	    // publishPluginHandle?.send({
	    //   "message": body,
	    //   success: () => {
	    //     _deffer.resolve(errorCodeFormat('ERR_OK'));
	    //   },
	    //   error: (error) => {
	    //     _deffer.reject(error)
	    //   }
	    // })

	    return _deffer.promise;
	  }

	  // 销毁对应订阅用户下的所有通道
	  destroySubscribeAttach(userId) {
	    if (userId) {
	      var _this$state$subscribe3;
	      const subscribeAttaches = (_this$state$subscribe3 = this.state.subscribeAttaches) === null || _this$state$subscribe3 === void 0 ? void 0 : _this$state$subscribe3[userId];
	      subscribeAttaches && Object.entries(subscribeAttaches).forEach(_ref4 => {
	        var _value$pluginHandle;
	        let [key, value] = _ref4;
	        value === null || value === void 0 || (_value$pluginHandle = value.pluginHandle) === null || _value$pluginHandle === void 0 || _value$pluginHandle.detach({
	          success: () => this.state.subscribeAttaches[userId][key] = null
	        });
	      });
	      delete this.state.subscribeAttaches[userId];
	    }
	  }

	  //恢复
	  resumePullPeerStream(params) {
	    var _this$state$subscribe4;
	    // 构建 deffer 实例
	    let _deffer = deffer$2();
	    const subscribeAttach = (_this$state$subscribe4 = this.state.subscribeAttaches) === null || _this$state$subscribe4 === void 0 || (_this$state$subscribe4 = _this$state$subscribe4[params.userId]) === null || _this$state$subscribe4 === void 0 ? void 0 : _this$state$subscribe4[_EzRtcCore.ATTACHES_TYPE[params.type]];
	    const body = this.settingMessageBody({
	      "cmdType": "resumesubremote",
	      "streamtype": params.type,
	      "customId": params.userId
	    });
	    if (subscribeAttach !== null && subscribeAttach !== void 0 && subscribeAttach.pluginHandle) {
	      subscribeAttach.pluginHandle.send({
	        "message": body,
	        success: () => {
	          _deffer.resolve(errorCodeFormat('ERR_OK'));
	        },
	        error: error => {
	          _deffer.reject(errorCodeFormat({
	            key: 'ERR_UNKNOWN',
	            msg: error
	          }));
	        }
	      });
	    }
	    return _deffer.promise;
	  }

	  //暂停订阅音频或视频
	  pausePullPeerStream(params) {
	    var _this$state$subscribe5;
	    // 构建 deffer 实例
	    let _deffer = deffer$2();
	    const subscribeAttach = (_this$state$subscribe5 = this.state.subscribeAttaches) === null || _this$state$subscribe5 === void 0 || (_this$state$subscribe5 = _this$state$subscribe5[params.userId]) === null || _this$state$subscribe5 === void 0 ? void 0 : _this$state$subscribe5[_EzRtcCore.ATTACHES_TYPE[params.type]];
	    subscribeAttach === null || subscribeAttach === void 0 || subscribeAttach.pluginHandle.send({
	      "message": this.settingMessageBody({
	        cmdType: "pausesubremote",
	        streamtype: params.type,
	        "customId": params.userId
	      }),
	      success: () => {
	        _deffer.resolve(errorCodeFormat('ERR_OK'));
	      },
	      error: error => {
	        _deffer.reject(errorCodeFormat({
	          key: 'ERR_UNKNOWN',
	          msg: error
	        }));
	      }
	    });
	    return _deffer.promise;
	  }

	  // 将流绑定到id上进行播放
	  playStream(params) {
	    let _deffer = deffer$2();
	    let localVideo = params.domId;
	    if (typeof params.domId === 'string') {
	      localVideo = document.getElementById(params.domId);
	    }
	    if (localVideo && params.stream) {
	      //媒体流绑定标签
	      Janus.attachMediaStream(localVideo, params.stream);

	      // localVideo.load();
	      localVideo.play();
	      _deffer.resolve(errorCodeFormat('ERR_OK'));
	      // if (playPromise !== undefined) {
	      //   playPromise.then(() => {
	      //     localVideo.play()
	      //   }).catch((e) => {
	      //   })
	      // }
	    } else {
	      _deffer.reject(errorCodeFormat({
	        key: 'ERR_UNKNOWN',
	        msg: 'play fail'
	      }));
	    }
	    return _deffer.promise;
	  }

	  // 轮询查询网络质量
	  pollingNetworkQuality() {
	    if (this.state.networkQualityPollingTimer) {
	      return;
	    } else {
	      // 开始网络质量轮询
	      this.state.networkQualityPollingTimer = setInterval(() => {
	        const {
	          publishAttaches,
	          subscribeAttaches
	        } = this.state;
	        let isStopPolling = true;
	        // 获取上旬网络质量
	        if (publishAttaches) {
	          for (let i = 0; i < ((_Object$values = Object.values(publishAttaches)) === null || _Object$values === void 0 ? void 0 : _Object$values.length) || 0; i++) {
	            var _Object$values;
	            const item = Object.values(publishAttaches)[i];
	            if (item !== null && item !== void 0 && item.pluginHandle) {
	              var _item$createOfferPara;
	              // 如果有通道，就不停止轮询
	              isStopPolling = false;
	              if (item !== null && item !== void 0 && (_item$createOfferPara = item.createOfferParams) !== null && _item$createOfferPara !== void 0 && (_item$createOfferPara = _item$createOfferPara.media) !== null && _item$createOfferPara !== void 0 && _item$createOfferPara.video) {
	                var _item$pluginHandle;
	                (_item$pluginHandle = item.pluginHandle) === null || _item$pluginHandle === void 0 || _item$pluginHandle.getNetworkQuality(item.pluginHandle.id, reports => {
	                  const lastReports = this.state.networkQuality.uplink.lastReports = this.state.networkQuality.uplink.currentReports;
	                  const currentReports = this.state.networkQuality.uplink.currentReports = reports;
	                  const res = this.getQuality({
	                    currentReports,
	                    lastReports
	                  }, 'up');
	                  if (res !== null && res !== void 0 && res.quality || (res === null || res === void 0 ? void 0 : res.quality) === 0) {
	                    Object.assign(this.state.networkQuality.uplink, {
	                      ...res
	                    });
	                  }
	                });
	                // 如果匹配到视频了，则从循环中出来，避免同时存在视频和屏幕共享时，lastReports被覆盖的问题
	                break;
	              }
	            }
	          }
	        }
	        // 获取下旬网络质量
	        if (subscribeAttaches) {
	          Object.entries(subscribeAttaches).forEach(_ref5 => {
	            let [userId, attaches] = _ref5;
	            if (attaches) {
	              // 以用户维度进行循环，因为一个用户可能存在多个流
	              for (let i = 0; i < ((_Object$values2 = Object.values(attaches)) === null || _Object$values2 === void 0 ? void 0 : _Object$values2.length) || 0; i++) {
	                var _Object$values2;
	                const item = Object.values(attaches)[i];
	                if (item !== null && item !== void 0 && item.pluginHandle) {
	                  var _item$createOfferPara2;
	                  // 如果有通道，就不停止轮询
	                  isStopPolling = false;
	                  if (item !== null && item !== void 0 && (_item$createOfferPara2 = item.createOfferParams) !== null && _item$createOfferPara2 !== void 0 && (_item$createOfferPara2 = _item$createOfferPara2.media) !== null && _item$createOfferPara2 !== void 0 && _item$createOfferPara2.video) {
	                    var _item$pluginHandle2;
	                    (_item$pluginHandle2 = item.pluginHandle) === null || _item$pluginHandle2 === void 0 || _item$pluginHandle2.getNetworkQuality(item.pluginHandle.id, reports => {
	                      // 如果没有该用户的网络质量数据，则初始化
	                      if (!this.state.networkQuality.downlink.remotes[userId]) {
	                        this.state.networkQuality.downlink.remotes[userId] = {
	                          currentReports: reports
	                        };
	                      }
	                      const lastReports = this.state.networkQuality.downlink.remotes[userId].lastReports = this.state.networkQuality.downlink.remotes[userId].currentReports;
	                      const currentReports = this.state.networkQuality.downlink.remotes[userId].currentReports = reports;
	                      const res = this.getQuality({
	                        currentReports,
	                        lastReports
	                      }, 'down');
	                      if (res !== null && res !== void 0 && res.quality || (res === null || res === void 0 ? void 0 : res.quality) === 0) {
	                        Object.assign(this.state.networkQuality.downlink.remotes[userId], {
	                          ...res
	                        });
	                      }
	                    });
	                    // 如果匹配到视频了，则从循环中出来，避免同时存在视频和屏幕共享时，lastReports被覆盖的问题
	                    break;
	                  }
	                }
	              }
	            }
	          });
	          // 计算下旬网络最差的一路
	          const downlinkRemotes = Object.values(this.state.networkQuality.downlink.remotes);
	          Object.assign(this.state.networkQuality.downlink, downlinkRemotes && lodashEs.maxBy(downlinkRemotes, item => item.quality) || {});
	        }
	        // 如果没有通道了，停止轮询
	        if (isStopPolling) {
	          clearInterval(this.state.networkQualityPollingTimer);
	          this.state.networkQualityPollingTimer = null;
	          this.logger.log('检测到流通道都关闭，停止网络质量轮询');
	        }
	        // 上报网络质量，延迟500ms，等结果都计算好再上报
	        setTimeout(() => this.reportNetWork(), 500);
	      }, 2000);
	    }
	  }
	  /**
	   * 获取网络质量接口
	   * @desc 质量得分规则是规范给的 http://nvwa.hikvision.com.cn/pages/viewpage.action?pageId=651320838
	   * @desc 取的数据值，是自己根据webRtc getStats得到的所有报告，自己计算的，并非绝对标准，仅供参考
	  */
	  getQuality(_ref6) {
	    var _currentReports$remot, _currentReports$inbou;
	    let {
	      currentReports,
	      lastReports
	    } = _ref6;
	    let direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'up';
	    const that = this;
	    // 计算网络质量, up时选取type=='remote-inbound-rtp', rid == 'h',down时选取type == "inbound-rtp"
	    // 质量得分 = 丢包率 * 30% / 10% + 抖动 * 50% / 100 ms + 时延 * 20% / 50 ms
	    const isUplink = direction == 'up' && ((_currentReports$remot = currentReports['remote-inbound-rtp']) === null || _currentReports$remot === void 0 ? void 0 : _currentReports$remot.kind) === 'video';
	    const isDownlink = direction == 'down' && ((_currentReports$inbou = currentReports['inbound-rtp']) === null || _currentReports$inbou === void 0 ? void 0 : _currentReports$inbou.kind) === 'video';
	    // 只记录video的网络质量，audio类型的返回内容和video的不一样
	    if (isUplink) {
	      // that.logger.log('获取当前流上旬网络情况：', currentReports)
	      // 上旬网络计算
	      if (currentReports['remote-inbound-rtp'] && lastReports['remote-inbound-rtp'] && currentReports['outbound-rtp'] && lastReports['outbound-rtp']) {
	        const {
	          packetsSent
	        } = currentReports['outbound-rtp']; // 本端的出站报告
	        const {
	          packetsLost,
	          jitter,
	          roundTripTime,
	          fractionLost
	        } = currentReports['remote-inbound-rtp']; // 远端的入站报告
	        const {
	          packetsSent: lastPacketsSent
	        } = lastReports['outbound-rtp'];
	        const {
	          packetsLost: lastPacketsLost2
	        } = lastReports['remote-inbound-rtp'];
	        if (!roundTripTime || !packetsLost && packetsLost !== 0 || !jitter) return; // 某些时候延迟可能获取不到，如果延迟没有，则不计算得分
	        const upPackageLostOld = (packetsLost - lastPacketsLost2) / (packetsSent - lastPacketsSent); // 老版本浏览器getStats获取不到fractionLost的情况下，丢包率计算方式
	        const upPackageLostNew = fractionLost !== null && fractionLost !== void 0 ? fractionLost : 0; // 新getStats获取，丢包率计算方式
	        const upPackageLost = upPackageLostNew !== null && upPackageLostNew !== void 0 ? upPackageLostNew : upPackageLostOld; // 丢包率
	        const upJitter = jitter * 1000; // 抖动 ms
	        const upRtt = roundTripTime * 1000; // 时延 ms
	        const quality = upPackageLost / 0.1 * 0.3 + upJitter / 100 * 0.5 + upRtt / 50 * 0.2;
	        return {
	          quality: that.qualityLeavel(quality) || 0,
	          packageLost: (upPackageLost === null || upPackageLost === void 0 ? void 0 : upPackageLost.toFixed(2)) || null,
	          jitter: (upJitter === null || upJitter === void 0 ? void 0 : upJitter.toFixed(2)) || null,
	          rtt: (upRtt === null || upRtt === void 0 ? void 0 : upRtt.toFixed(2)) || null
	        };
	      }
	    } else if (isDownlink) {
	      // that.logger.log('获取当前流下旬网络情况：', currentReports)
	      // 下旬网络计算
	      if (currentReports['inbound-rtp'] && currentReports['candidate-pair'] && lastReports['inbound-rtp']) {
	        const {
	          jitter,
	          packetsLost,
	          packetsReceived,
	          nackCount,
	          lastPacketReceivedTimestamp
	        } = currentReports['inbound-rtp'];
	        const {
	          packetsLost: lastPacketsLost,
	          packetsReceived: lastPacketsReceived,
	          nackCount: lastNackCount
	        } = lastReports['inbound-rtp'];
	        const {
	          currentRoundTripTime,
	          lastPacketReceivedTimestamp: lastPacketReceivedTimestampDelay,
	          lastPacketSentTimestamp: lastPacketSentTimestampDelay
	        } = currentReports['candidate-pair'];
	        if (!(currentRoundTripTime || lastPacketReceivedTimestampDelay) || !packetsLost && packetsLost !== 0 || !jitter && !lastPacketReceivedTimestamp) return; // 某些时候延迟可能获取不到，如果延迟没有，则不计算得分
	        if (!lastPacketsLost && lastPacketsLost !== 0) return;
	        const diffPacketsLost = packetsLost - lastPacketsLost; // 时间段内丢包数
	        const diffPacketsReceived = packetsReceived - lastPacketsReceived; // 时间段内收包数
	        const diffNackCount = nackCount - lastNackCount; // 时间段内nack数

	        if (diffPacketsReceived === 0) return; // 收包数为0，不计算得分

	        const downPackageLost = (diffPacketsLost + diffNackCount) / (diffPacketsReceived + diffPacketsLost + diffNackCount); // 丢包率
	        const downJitter = (jitter || 0) * 1000; // 抖动 ms，老版本浏览器获取不到jitter，所以默认为0
	        const downRtt = currentRoundTripTime ? currentRoundTripTime * 1000 : Math.abs(lastPacketReceivedTimestampDelay - lastPacketSentTimestampDelay); // 时延 ms （第二种方式兼容火狐浏览器没有currentRoundTripTime，时间上不一定准确）

	        const quality = downPackageLost / 0.1 * 0.3 + downJitter / 100 * 0.5 + downRtt / 50 * 0.2;
	        return {
	          quality: that.qualityLeavel(quality) || 0,
	          packageLost: (downPackageLost === null || downPackageLost === void 0 ? void 0 : downPackageLost.toFixed(2)) || null,
	          jitter: (downJitter === null || downJitter === void 0 ? void 0 : downJitter.toFixed(2)) || null,
	          rtt: (downRtt === null || downRtt === void 0 ? void 0 : downRtt.toFixed(2)) || null
	        };
	      }
	    }
	  }

	  /**
	   * 上报网络质量
	   */
	  reportNetWork() {
	    const that = this;
	    const {
	      uplink,
	      downlink
	    } = this.state.networkQuality;
	    const {
	      quality: upquality,
	      reportedQuality: reportedUpquality,
	      packageLost: upPackageLost,
	      jitter: upJitter,
	      rtt: upRtt
	    } = uplink;
	    const {
	      quality: downquality,
	      reportedQuality: reportedDownquality,
	      packageLost: downPackageLost,
	      jitter: downJitter,
	      rtt: downRtt
	    } = downlink;
	    const body = {
	      "cmdType": "sendnetquality",
	      "upquality": upquality,
	      "downquality": downquality
	    };

	    // 对外上报网络质量
	    if (uplink.quality > 0 || downlink.quality > 0) {
	      this.trigger(_EzRtcCore.EVENT.REPORT_NETWORK_QUALITY, lodashEs.cloneDeep({
	        uplink: uplink.quality > 0 ? uplink : null,
	        downlink: downlink.quality > 0 ? downlink : null
	      }));
	    }
	    if (upquality === reportedUpquality && downquality === reportedDownquality) {
	      // 网络质量没有变化，不上报
	      return;
	    }
	    // 对外上报网络质量（改变）
	    this.trigger(_EzRtcCore.EVENT.REPORT_NETWORK_QUALITY_CHANGE, lodashEs.cloneDeep({
	      uplink,
	      downlink
	    }));
	    this.state.networkQuality.uplink.reportedQuality = upquality;
	    this.state.networkQuality.downlink.reportedQuality = downquality;
	    this.usersInstance.updateUser({
	      id: this.config.customId,
	      networkQuality: {
	        upquality,
	        downquality
	      }
	    });
	    if (this.state.messagePluginHandle) {
	      this.state.messagePluginHandle.send({
	        "message": body,
	        success: () => {
	          that.logger.log("网络质量上报服务器成功：", {
	            uplink,
	            downlink
	          });
	        },
	        error: error => {
	          that.logger.error("网络质量上报服务器失败，原因：", error);
	        }
	      });
	    }
	  }

	  // 网络质量评分 1:优 2: 良 3: 中 4: 差 5: 极差 6: 不可用 0: 未知
	  qualityLeavel(quality) {
	    if (quality <= 1) {
	      return 1;
	    } else if (quality <= 2) {
	      return 2;
	    } else if (quality <= 3) {
	      return 3;
	    } else if (quality <= 4.8) {
	      return 4;
	    } else if (quality <= 8) {
	      return 5;
	    } else if (quality > 8) {
	      return 6;
	    } else {
	      return 0;
	    }
	  }

	  // 重置配置
	  resettingConfig() {
	    var _this$state$messagePl;
	    // 销毁发布/订阅通道
	    this.resettingAttaches();
	    // 重置网络质量
	    this.resettingNetworkQuality();
	    // 重置混音流
	    this.resettingAmixer();
	    // 销毁消息通道
	    (_this$state$messagePl = this.state.messagePluginHandle) === null || _this$state$messagePl === void 0 || _this$state$messagePl.detach();
	    this.state.messagePluginHandle = null;
	    // 关闭重连状态
	  }

	  /**
	   * 重置发布&订阅通道
	   * @param {string} type 重置类型。all：重置所有通道，publish：重置发布通道，subscribe：重置订阅通道
	   * */
	  resettingAttaches() {
	    let type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
	    if (['all', 'publish'].includes(type)) {
	      // 重置发布通道列表
	      const publishAttaches = this.state.publishAttaches;
	      publishAttaches && Object.values(publishAttaches).forEach(item => {
	        if (item !== null && item !== void 0 && item.pluginHandle) {
	          item.pluginHandle.detach();
	          item.pluginHandle = null;
	        }
	      });
	      this.state.publishAttaches = {};
	    }
	    if (['all', 'subscribe'].includes(type)) {
	      // 重置订阅流通道列表
	      const subscribeAttaches = this.state.subscribeAttaches;
	      subscribeAttaches && Object.keys(subscribeAttaches).forEach(userId => {
	        this.destroySubscribeAttach(userId);
	      });
	      this.state.subscribeAttaches = {};
	    }
	  }
	  // 重置混音流
	  resettingAmixer() {
	    var _this$state$roomInfo$;
	    (_this$state$roomInfo$ = this.state.roomInfo.amixer.pluginHandle) === null || _this$state$roomInfo$ === void 0 || _this$state$roomInfo$.detach();
	    this.state.roomInfo.amixer.pluginHandle = null;
	    this.state.roomInfo.amixer.streams = [];
	  }
	  // 重置网络质量
	  resettingNetworkQuality() {
	    this.state.networkQuality = lodashEs.cloneDeep(INIT_NETWORK_QUALITY);
	  }

	  // h5页面监听当前的旋转角度
	  getOrientation() {
	    const that = this;
	    let orientation = 0;
	    // safari 浏览器推出orientation属性
	    window.addEventListener('orientationchange', function (event) {
	      that.logger.log('orientationchange', event);
	      if (event.orientation != undefined) {
	        orientation = event.orientation;
	      } else {
	        // 兼容Android版本，延迟获取到视频宽高
	        let timer = setTimeout(() => {
	          orientation = window.innerWidth > window.innerHeight ? 90 : 0;
	          clearTimeout(timer);
	        }, 100);
	      }
	    });
	    that.logger.log('旋转角度orientation', orientation);
	    return orientation;
	  }

	  // 移除页面监听事件
	  removeOrientation() {
	    const that = this;
	    window.removeEventListener('orientationchange', function (event) {
	      that.logger.log('orientationchange', event);
	    });
	  }

	  // 发布/取消发布队列
	  publishAttachesQueueAwait(deffer) {
	    // 前置逻辑 判断消息队列
	    this.state.publishAttachesQueue.push(deffer);
	    Promise.race([timeoutPromise(2000), deffer.promise]).finally(() => {
	      // 执行完毕或者2秒还执行完，删除队列中的任务
	      this.state.publishAttachesQueue.shift();
	    });
	    // 判断发布队列中是否存在尚未执行完的发布任务，如果存在，则等待上一个发布任务执行完毕
	    if (this.state.publishAttachesQueue.length > 1) {
	      return new Promise(resolve => {
	        this.state.publishAttachesQueue.at(-2).promise.finally(() => {
	          resolve();
	        });
	      });
	    }
	  }

	  // 订阅队列
	  subscribeAttachesQueueAwait(deffer) {
	    // 前置逻辑 判断消息队列
	    this.state.subscribeAttachesQueue.push(deffer);
	    Promise.race([timeoutPromise(2000), deffer.promise]).finally(() => {
	      // 执行完毕或者2秒还执行完，删除队列中的任务
	      this.state.subscribeAttachesQueue.shift();
	    });
	    // 判断发布队列中是否存在尚未执行完的发布任务，如果存在，则等待上一个发布任务执行完毕
	    if (this.state.subscribeAttachesQueue.length > 1) {
	      return new Promise(resolve => {
	        // 避免整个订阅队列中，某一个promise任务失败了，导致后续都不执行。现在实际业务中存在加入房间，会收到stream-removed消息，导致 unsubscribe 报错的情况，从而整个promise队列都不执行了
	        this.state.subscribeAttachesQueue.at(-2).promise.finally(() => {
	          resolve();
	        });
	      });
	    }
	  }

	  // safari浏览器进行屏幕共享通道的建立
	  attachScreenBySafari() {
	    var _Janus$webRTCAdapter2;
	    // 如果是safari浏览器，需要重新建立一个新的屏幕共享流通道，否则无法再次发布屏幕共享流
	    if (((_Janus$webRTCAdapter2 = Janus.webRTCAdapter) === null || _Janus$webRTCAdapter2 === void 0 || (_Janus$webRTCAdapter2 = _Janus$webRTCAdapter2.browserDetails) === null || _Janus$webRTCAdapter2 === void 0 ? void 0 : _Janus$webRTCAdapter2.browser) === "safari") {
	      var _this$state$publishAt2;
	      // 销毁老的屏幕共享流句柄
	      if ((_this$state$publishAt2 = this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE['SCREEN']]]) !== null && _this$state$publishAt2 !== void 0 && _this$state$publishAt2.pluginHandle) {
	        this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE['SCREEN']]].pluginHandle.detach();
	        this.state.publishAttaches[_EzRtcCore.ATTACHES_TYPE[_EzRtcCore.STREAM_TYPE['SCREEN']]].pluginHandle = null;
	      }
	      this.publishStream({
	        type: _EzRtcCore.STREAM_TYPE['SCREEN'],
	        attachOnly: true
	      });
	    }
	  }
	  async startLive(_ref7) {
	    let {
	      accessToken,
	      livePushUrl
	    } = _ref7;
	    return fetchData({
	      url: `${this.domain || "https://open.ys7.com"}/api/service/rtc/live/start`,
	      method: 'POST',
	      data: {
	        appId: this.config.appId,
	        roomId: this.config.strRoomId,
	        livePushUrl: livePushUrl || 'rtmp://rtc-livepush.ys7.com/live/12345?txSecret=27d38948a44f550c8ab49769289ff761&txTime=67445AD9',
	        liveConfig: JSON.stringify({
	          "mediaConfig": {
	            "videoStreamType": 0,
	            "subUserId": ['0', this.config.customId],
	            "subScreenStream": true
	          },
	          "mixConfig": {
	            "video": {
	              "width": 1920,
	              "height": 1080,
	              "fps": 15,
	              "bitRate": 2000,
	              "mixMode": 0
	            },
	            "layout": [{
	              "uid": "0",
	              "position": [0, 0, 1920, 1080],
	              "layer": 1
	            }, {
	              "uid": `${this.config.customId}`,
	              "position": [1280, 0, 640, 360],
	              "layer": 2
	            }
	            // { "uid": "326", "position": [0, 720, 640, 360] }
	            ],
	            "dividingline_config": {
	              "enableMode": 2,
	              "selfConfig": {
	                "c": "0x4B0082",
	                "width": 2
	              }
	            }
	          }
	        })
	      },
	      headerOptions: {
	        accessToken: accessToken || 'at.b3vtqw9r8tiqsxfq0etpobmm6eqoorfv-3k81mibg7y-08ep5b5-4uysa14if'
	      }
	    });
	  }
	}, {
	  e: [_initProto],
	  c: [_EzRtcCore, _initClass]
	} = _applyDecs2305(_EzRtcCore3, [[_publishStreamDecs, 18, "publishStream"], [_unpublishStreamDecs, 18, "unpublishStream"], [_subscribeStreamDecs, 18, "subscribeStream"], [_unsubscribeDecs, 18, "unsubscribe"], [_subscribeMixDecs, 18, "subscribeMix"], [_unsubscribeMixDecs, 18, "unsubscribeMix"], [_controlStreamDecs, 18, "controlStream"], [_resumePullPeerStreamDecs, 18, "resumePullPeerStream"], [_pausePullPeerStreamDecs, 18, "pausePullPeerStream"]], [eventbus, utils]), _EzRtcCore3), _Class = class extends _identity {
	  constructor() {
	    super(_EzRtcCore), _defineProperty(this, "VERSION", "1.4"), _defineProperty(this, "STREAM_TYPE", {
	      VIDEO_ONLY: 1,
	      // 仅视频（大流）
	      AUDIO_ONLY: 2,
	      // 仅音频
	      AUDIO_AND_VIDEO: 3,
	      // 音视频，已经废弃
	      VIDEO_SIMULCAST_LITTLE: 4,
	      // 视频小流,无法单独发布
	      VIDEO_SIMULCAST_LARGE: 5,
	      // 视频大小流,发布的同时会含有小流，接收端可切换
	      SCREEN: 8 // 屏幕共享
	    }), _defineProperty(this, "ATTACHES_TYPE", {
	      [_EzRtcCore.STREAM_TYPE.VIDEO_ONLY]: 'default',
	      [_EzRtcCore.STREAM_TYPE.AUDIO_ONLY]: 'default',
	      [_EzRtcCore.STREAM_TYPE.AUDIO_AND_VIDEO]: 'default',
	      [_EzRtcCore.STREAM_TYPE.VIDEO_SIMULCAST_LITTLE]: 'default',
	      [_EzRtcCore.STREAM_TYPE.VIDEO_SIMULCAST_LARGE]: 'default',
	      [_EzRtcCore.STREAM_TYPE.SCREEN]: 'screen'
	    }), _defineProperty(this, "EVENT", {
	      // 自定义事件
	      ROOM_INFO_CHANGE: 'ROOM_INFO_CHANGE',
	      // 房间信息变化
	      CONNECT_STATE_CHANGE: 'CONNECT_STATE_CHANGE',
	      // sdk连接状态变化
	      USERS_CHANGE: 'EVENT_USERS_CHANGE',
	      // 用户列表变化
	      LOCAL_STREAM_AVAILABLE: 'EVENT_LOCAL_STREAM_AVAILABLE',
	      // 本地流可用
	      REMOTE_STREAM_AVAILABLE: 'EVENT_REMOTE_STREAM_AVAILABLE',
	      // 远端流可用
	      REPORT_NETWORK_QUALITY: 'REPORT_NETWORK_QUALITY',
	      // 网络质量上报
	      REPORT_NETWORK_QUALITY_CHANGE: 'REPORT_NETWORK_QUALITY_CHANGE',
	      // 网络质量改变上报
	      // 消息信令
	      ERROR: 'error',
	      // 报错（包含消息信令、发布信令、订阅信令）
	      VIDEO_ROTATION: 'video-rotation',
	      // 远端视频流旋转角度
	      AUDIOLEVEL: 'audioleve',
	      // 房间内音量变化
	      ENTERROOMACK: 'enterRoomack',
	      // 当前用户加入房间结果
	      EXITROOMACK: 'exitRoomack',
	      CLIENTJOIN: 'clientJoin',
	      // 其他用户加入
	      CLIENTLEAVE: 'clientLeave',
	      // 其他用户离开
	      STREAM_ADDED: 'stream-added',
	      // 房间内其他用户流添加
	      STREAM_REMOVED: 'stream-removed',
	      // 房间内其他用户流删除
	      PUBLISHSCREENSTREAMACK: 'publishscreenstreamack',
	      // 屏幕共享流发布结果
	      NETWORKQUALITY: 'networkquality',
	      // 网络质量通知
	      CLIENT_PERMISSION: 'client-permission',
	      // 客户端发布权限变化
	      SUB_PERMISSION: 'sub-permission',
	      // 订阅权限
	      // 发布信令
	      PUBLISHLOCALSTREAMACK: 'publishlocalstreamack',
	      // 发布本地流结果
	      UNPUBLISHLOCALSTREAMACK: 'unpublishlocalstreamack',
	      // 取消发布本地流结果
	      // 订阅信令
	      SUBREMOTEACK: 'subremoteack',
	      // 订阅结果
	      UNSUBREMOTEACK: 'unsubremoteack',
	      // 取消订阅结果
	      SUBREMOTEMIXACK: 'subremotemixack' // 混音流订阅结果
	    }), _defineProperty(this, "INNER_EVENT", {
	      // 自定义媒体流轨道
	      CUSTOMIZE_AUDIO_TRACK: 'CUSTOMIZE_AUDIO_TRACK'
	    }), _defineProperty(this, "plugins", []), _initClass();
	  }
	}, _defineProperty(_Class, _EzRtcCore2, void 0), _Class)(); // 加载插件

	class EzRtc extends _EzRtcCore {
	  constructor(params) {
	    super(params);
	  }

	  /** 
	   * 摄像头操作 
	   * */
	  // 开启摄像头
	  startLocalVideo() {
	    return super.publishStream({
	      type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	    });
	  }
	  // 关闭摄像头
	  stopLocalVideo() {
	    return super.unpublishStream({
	      type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	    });
	  }
	  // 暂停摄像头
	  pauseLocalVideo() {
	    return super.pausePushStream({
	      type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	    });
	  }
	  // 恢复摄像头
	  resumeLocalVideo() {
	    return super.resumePushStream({
	      type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	    });
	  }

	  /**
	   * 麦克风操作
	   * */
	  // 开启麦克风
	  startLocalAudio() {
	    return super.publishStream({
	      type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	    });
	  }
	  // 关闭麦克风
	  stopLocalAudio() {
	    return super.unpublishStream({
	      type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	    });
	  }
	  // 暂停麦克风
	  pauseLocalAudio() {
	    return super.pausePushStream({
	      type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	    });
	  }
	  // 恢复麦克风
	  resumeLocalAudio() {
	    return super.resumePushStream({
	      type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY
	    });
	  }

	  /**
	   * 屏幕共享操作
	   * */
	  // 开启屏幕共享流
	  startScreenShare(params) {
	    return super.publishStream({
	      type: _EzRtcCore.STREAM_TYPE.SCREEN,
	      ...params
	    });
	  }
	  // 关闭屏幕共享流
	  stopScreenShare() {
	    return super.unpublishStream({
	      type: _EzRtcCore.STREAM_TYPE.SCREEN
	    });
	  }

	  /**
	   * 其他api
	   * */
	  // 获取房间内所有用户
	  getUsers() {
	    var _this$usersInstance;
	    return (_this$usersInstance = this.usersInstance) === null || _this$usersInstance === void 0 ? void 0 : _this$usersInstance.getUsers();
	  }
	  // 获取当前视频参数
	  getVideoSettingParams() {
	    return this.state.videoSettingParams;
	  }
	}

	var $$1 = _export;
	var call = functionCall;
	var aCallable$1 = aCallable$g;
	var newPromiseCapabilityModule = newPromiseCapability$2;
	var perform = perform$4;
	var iterate$1 = iterate$7;
	var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

	// `Promise.allSettled` method
	// https://tc39.es/ecma262/#sec-promise.allsettled
	$$1({
	  target: 'Promise',
	  stat: true,
	  forced: PROMISE_STATICS_INCORRECT_ITERATION
	}, {
	  allSettled: function allSettled(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var promiseResolve = aCallable$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        call(promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = {
	            status: 'fulfilled',
	            value: value
	          };
	          --remaining || resolve(values);
	        }, function (error) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = {
	            status: 'rejected',
	            reason: error
	          };
	          --remaining || resolve(values);
	        });
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	class EzRtcDevice extends EzRtc {
	  constructor(params) {
	    super(params);
	    this.deviceInfo = {
	      deviceSerial: null,
	      // 设备序列号
	      channelNo: null,
	      // 设备通道号
	      token: null,
	      // 设备取流token
	      deviceRtcToken: null,
	      // 设备入会token
	      appKey: null // 开放平台应用appKey
	    };
	    // 绑定事件
	    this.bindMessageEvent();
	  }
	  // 初始化（用来设置数据，创建房间，防止邀请设备进入的时候，没有房间）
	  deviceInit(params) {
	    const timeout = 15; // 用户超时时间
	    const roomId = `${params.deviceSerial}_${params.channelNo}_${params.userId}`; // 生成roomId
	    Object.assign(this.deviceInfo, params);
	    return Promise.all([this.getDeviceToken(params), super.initConfig({
	      ...params,
	      roomId,
	      timeout
	    })]);
	  }
	  // 用户加入房间
	  enterRoom(params) {
	    return super.enterRoom(params || this.config);
	  }
	  // 结束对讲
	  async endTalk() {
	    try {
	      const res = await Promise.allSettled([this.kickoutDevice(), super.leaveRoom()]);
	      if (res[1].status === 'fulfilled') {
	        this.logger.log('结束对讲成功');
	        return Promise.resolve({
	          code: 0,
	          message: "success",
	          data: null
	        });
	      } else {
	        const errMsg = res[1].reason || 'leaveroom error';
	        this.logger.log('结束对讲失败：', errMsg);
	        return Promise.reject(errMsg);
	      }
	    } catch (error) {
	      this.logger.log('结束对讲失败：', error);
	      return Promise.reject(error);
	    }
	  }
	  // 邀请设备入会
	  async inviteDevice(params) {
	    const _deffer = deffer$2();
	    const data = {
	      accessToken: this.config.accessToken,
	      strRoomId: this.config.strRoomId,
	      appId: this.config.appId,
	      deviceSerial: this.deviceInfo.deviceSerial,
	      channelNo: this.deviceInfo.channelNo,
	      streamType: this.deviceInfo.streamType || 1,
	      mode: this.deviceInfo.mode || 2,
	      maxActiveSeconds: this.deviceInfo.maxActiveSeconds || -1,
	      // 入会最长时间
	      devProtocol: this.deviceInfo.devProtocol || 'ysproto',
	      // ysproto 、gb28181
	      authToken: this.deviceInfo.deviceRtcToken,
	      token: this.deviceInfo.token,
	      authType: 23
	    };
	    fetchData({
	      url: `${this.domain || "https://open.ys7.com"}/api/v3/conference/device/invite`,
	      method: 'POST',
	      data
	    }).then(res => {
	      var _res$meta;
	      if (((_res$meta = res.meta) === null || _res$meta === void 0 ? void 0 : _res$meta.code) === 200) {
	        _deffer.resolve({
	          code: 0,
	          message: "success",
	          data: null
	        });
	        this.logger.log('邀请设备入会成功：', res);
	      } else {
	        var _res$meta2;
	        const errMsg = ((_res$meta2 = res.meta) === null || _res$meta2 === void 0 ? void 0 : _res$meta2.message) || res.msg || '未知错误';
	        _deffer.reject(errMsg);
	        this.logger.log('邀请设备入会失败：', errMsg);
	      }
	    }).catch(err => {
	      this.logger.log('邀请设备入会失败：', err);
	      _deffer.reject(err);
	    });
	    return _deffer.promise;
	  }

	  // 强制设备退出
	  kickoutDevice(params) {
	    const _deffer = deffer$2();
	    const data = {
	      accessToken: this.config.accessToken,
	      strRoomId: this.config.strRoomId,
	      appId: this.config.appId,
	      deviceSerial: this.deviceInfo.deviceSerial,
	      channelNo: this.deviceInfo.channelNo,
	      token: this.deviceInfo.token,
	      authToken: this.deviceInfo.deviceRtcToken,
	      authType: 23
	    };
	    const deviceUser = `${data.deviceSerial}_${data.channelNo}`;
	    fetchData({
	      url: `${this.domain || "https://open.ys7.com"}/api/v3/conference/device/kickout`,
	      method: 'POST',
	      data
	    }).then(res => {
	      var _res$meta3;
	      if (((_res$meta3 = res.meta) === null || _res$meta3 === void 0 ? void 0 : _res$meta3.code) === 200) {
	        var _this$state$subscribe;
	        // 取消设备订阅
	        (_this$state$subscribe = this.state.subscribeAttaches[deviceUser]) === null || _this$state$subscribe === void 0 || (_this$state$subscribe = _this$state$subscribe[EzRtc.ATTACHES_TYPE[EzRtc.STREAM_TYPE.AUDIO_ONLY]]) === null || _this$state$subscribe === void 0 || (_this$state$subscribe = _this$state$subscribe.pluginHandle) === null || _this$state$subscribe === void 0 || _this$state$subscribe.detach();
	        this.state.subscribeAttaches[deviceUser] = null;
	        // 取消本地音频流发布
	        super.unpublishStream({
	          type: EzRtc.STREAM_TYPE['AUDIO_ONLY']
	        });
	        _deffer.resolve({
	          code: 0,
	          message: "success",
	          data: null
	        });
	        this.logger.log('强制设备退出成功：', res);
	      } else {
	        var _res$meta4;
	        const errMsg = ((_res$meta4 = res.meta) === null || _res$meta4 === void 0 ? void 0 : _res$meta4.message) || res.msg || '未知错误';
	        _deffer.reject(errMsg);
	        this.logger.log('强制设备退出失败：', errMsg);
	      }
	    }).catch(err => {
	      this.logger.log('强制设备退出失败：', err);
	      _deffer.reject(err);
	    });
	    return _deffer.promise;
	  }
	  // 打开语音
	  openDeviceAudio() {
	    var _this$state$subscribe2, _publishAttach$create;
	    const _deffer = deffer$2(null);
	    const deviceUser = `${this.deviceInfo.deviceSerial}_${this.deviceInfo.channelNo}`;
	    const publishAttach = this.state.publishAttaches[EzRtc.ATTACHES_TYPE[EzRtc.STREAM_TYPE['AUDIO_ONLY']]];
	    (_this$state$subscribe2 = this.state.subscribeAttaches) === null || _this$state$subscribe2 === void 0 || (_this$state$subscribe2 = _this$state$subscribe2[deviceUser]) === null || _this$state$subscribe2 === void 0 ? void 0 : _this$state$subscribe2[EzRtc.ATTACHES_TYPE[EzRtc.STREAM_TYPE['AUDIO_ONLY']]];
	    // 是否有发布流
	    if (publishAttach !== null && publishAttach !== void 0 && (_publishAttach$create = publishAttach.createOfferParams) !== null && _publishAttach$create !== void 0 && (_publishAttach$create = _publishAttach$create.media) !== null && _publishAttach$create !== void 0 && _publishAttach$create.audio) {
	      return super.resumePushStream({
	        type: EzRtc.STREAM_TYPE['AUDIO_ONLY']
	      });
	    } else {
	      super.publishStream({
	        type: EzRtc.STREAM_TYPE['AUDIO_ONLY']
	      }).then(() => {
	        _deffer.resolve({
	          code: 0,
	          message: "success",
	          data: null
	        });
	      }).catch(err => {
	        this.logger.log('打开语音失败：', err);
	        _deffer.reject(err);
	      });
	    }
	    return _deffer.promise;
	  }
	  // 关闭语音
	  closeDeviceAudio(params) {
	    var _publishAttach$create2;
	    const _deffer = deffer$2(null);
	    const publishAttach = this.state.publishAttaches[EzRtc.ATTACHES_TYPE[EzRtc.STREAM_TYPE['AUDIO_ONLY']]];
	    if (publishAttach !== null && publishAttach !== void 0 && (_publishAttach$create2 = publishAttach.createOfferParams) !== null && _publishAttach$create2 !== void 0 && (_publishAttach$create2 = _publishAttach$create2.media) !== null && _publishAttach$create2 !== void 0 && _publishAttach$create2.audio) {
	      return super.pausePushStream({
	        type: EzRtc.STREAM_TYPE['AUDIO_ONLY']
	      });
	    } else {
	      this.logger.log('关闭语音失败：', 'no audio stream');
	      _deffer.reject("no audio stream");
	    }
	    return _deffer.promise;
	  }

	  // 获取设备取流token
	  getDeviceToken(params) {
	    const _deffer = deffer$2();
	    fetchData({
	      url: `${this.domain || "https://open.ys7.com"}/api/user/token`,
	      method: 'POST',
	      data: {
	        accessToken: params.accessToken || this.config.accessToken,
	        appKey: params.appKey || this.deviceInfo.appKey,
	        clientType: '0',
	        osVersion: 'wins',
	        sdkVersion: 'v2.2.0.20230602',
	        count: 1,
	        featureCode: 'f24940e782454a0ca7cbf7c2a292a6c7',
	        netType: 'UNKNOWN'
	      }
	    }).then(res => {
	      if (res.resultCode === '200') {
	        this.logger.log('获取设备取流token成功：', res);
	        this.deviceInfo.token = res.tokenArray[0];
	        _deffer.resolve(res.tokenArray[0]);
	      } else {
	        this.logger.log('获取设备取流token失败，接口报错：', res);
	        _deffer.reject(res.resultMsg || res.msg || '未知错误');
	      }
	    }).catch(err => {
	      this.logger.log('获取设备取流token失败：', err);
	      _deffer.reject(err);
	    });
	    return _deffer.promise;
	  }

	  // 一键开启语音对讲
	  async startDeviceTalk(params) {
	    var _this$state$subscribe3, _this$usersInstance;
	    const deviceUser = `${params.deviceSerial}_${params.channelNo}`;
	    const subscribeAttach = (_this$state$subscribe3 = this.state.subscribeAttaches) === null || _this$state$subscribe3 === void 0 || (_this$state$subscribe3 = _this$state$subscribe3[deviceUser]) === null || _this$state$subscribe3 === void 0 ? void 0 : _this$state$subscribe3[EzRtc.ATTACHES_TYPE[EzRtc.STREAM_TYPE['AUDIO_ONLY']]];
	    const isSameDevice = params.deviceSerial === this.deviceInfo.deviceSerial && params.channelNo === this.deviceInfo.channelNo;
	    // 如果设备序列号、通道号、订阅流存在，则证明已经建立过一次连接了，并且房间内用户数量大于1，则直接开启对讲
	    if (isSameDevice && subscribeAttach !== null && subscribeAttach !== void 0 && subscribeAttach.pluginHandle && ((_this$usersInstance = this.usersInstance) === null || _this$usersInstance === void 0 || (_this$usersInstance = _this$usersInstance.getUsers()) === null || _this$usersInstance === void 0 ? void 0 : _this$usersInstance.length) > 1) {
	      return this.openDeviceAudio();
	    } else {
	      // 如果设备序列号、通道号、订阅流不存在，则证明没有建立过连接，需要重新初始化
	      try {
	        var _this$janusInstance, _this$janusInstance2;
	        if (!(isSameDevice && (_this$janusInstance = this.janusInstance) !== null && _this$janusInstance !== void 0 && _this$janusInstance.isConnected())) {
	          // 非同一个设备或者websocket未连接，则重新初始化
	          await this.deviceInit(params);
	        }
	        // 建立websocket连接
	        if (!((_this$janusInstance2 = this.janusInstance) !== null && _this$janusInstance2 !== void 0 && _this$janusInstance2.isConnected())) {
	          // websocket未连接，则重新连接
	          await super.connectWebsocket();
	        }
	        await this.inviteDevice();
	        // 加入房间
	        if (!this.state.messagePluginHandle) {
	          // 如果没有消息句柄，则证明没有加入房间，需要重新加入房间
	          await super.attachRoom();
	        }
	        await this.waitStreamAdded();
	        await this.openDeviceAudio();
	        return Promise.resolve({
	          code: 0,
	          message: "success",
	          data: null
	        });
	      } catch (error) {
	        return Promise.reject(error);
	      }
	    }
	  }

	  // 等待流加入
	  waitStreamAdded() {
	    return new Promise(resolved => {
	      var _this$state$messagePl;
	      // 等待stream-added事件
	      (_this$state$messagePl = this.state.messagePluginHandle) === null || _this$state$messagePl === void 0 || _this$state$messagePl.messageListen('stream-added', msg => {
	        resolved(msg);
	      });
	      // 或者等待500ms直接退出
	      // setTimeout(resolved, 500);
	    });
	  }
	  bindMessageEvent() {
	    // 自动订阅设备音频流
	    super.on(EzRtc.EVENT.STREAM_ADDED, msg => {
	      const {
	        customId,
	        streamtype
	      } = msg;
	      const deviceUser = `${this.deviceInfo.deviceSerial}_${this.deviceInfo.channelNo}`;
	      if (customId === deviceUser && streamtype === EzRtc.STREAM_TYPE['AUDIO_ONLY']) {
	        this.subscribeStream({
	          userId: customId,
	          type: EzRtc.STREAM_TYPE['AUDIO_ONLY']
	        });
	      }
	    });

	    // // 监听设备离开房间，理论上不需要了，因为设备离开房间，会自动触发销毁
	    // super.on('clientLeave', (msg) => {
	    //   const { customId } = msg;
	    //   const deviceUser = `${this.deviceInfo.deviceSerial}_${this.deviceInfo.channelNo}`;
	    //   if (customId === deviceUser) {
	    //     super.resettingAttaches('subscribe')
	    //   }
	    // })
	  }
	}
	// sdk版本
	_defineProperty(EzRtcDevice, "VERSION", '1.0');

	// import { commonFun } from '../decorators/index.js'

	// export { Packet } from '../lib/ertc-sdk-mp.js' // 兼容易会引用风远的其他属性
	const deffer$1 = function () {
	  // 创建新的对象实例
	  let deferred = {};

	  // 构造 promise 对象
	  deferred.promise = new Promise((resolve, reject) => {
	    deferred.resolve = resolve;
	    deferred.reject = reject;
	  });

	  // 不加超时时间，避免影响其他逻辑
	  // if (timeout) {
	  //   setTimeout(() => {
	  //     deferred.reject(errorCode({ key: 'ERR_TIMEOUT', msg: 'timeout' }))
	  //   }, timeout)
	  // }

	  // 返回包含了 promise 的对象
	  return deferred;
	};
	class E_MRTC {
	  /**
	   * @description 构造函数
	   * @param {Object} params
	   * @param {Object} params.vcsIns // 风远sdk实例
	   * @param {Object} params.vcsTypes // 风远sdk的常量枚举值
	   * @param {boolean} [params.debug] // 是否开启调试模式，日志打印
	   * @param {boolean} [params.exportLogs] // 是否支持日志导出
	   * @param {string} [params.domain] // api域名前缀
	   * */
	  constructor(params) {
	    // 否则走后续初始化逻辑
	    this._ertcIns = new _EzRtcCore({
	      ...params
	    });
	    this._vcsIns = params.vcsIns;

	    // 初始变量
	    this._rtcType = localStorage.getItem('mrtc-rtcType') || null; // 当前sdk rtc接入类型 vcs | ertc，在加入房间接口获取
	    this._globalParams = params; // 初始化的全局参数
	    this._transactions = {}; // 事务队列，用来处理异步操作
	    this._vcsBeforeEnterRoomEventTransactions = {}; // 进入房间前的事务列表
	    this._vcsConnectIdMapErtcPluginHandle = {}; // 风远连接id和ertc插件句柄的映射
	    this._mqttNetworkState = null; // 风远mqtt网络状态

	    // 初始化函数
	    this._initFunction();

	    // 重写 vcsIns 的内部方法
	    // this._resetVcsFunction()

	    // 初始化监听事件
	    this._initVcsEvent();
	    this._initErtcEvent();

	    // // 开发环境绑定实例到window，方便调试
	    // if ("prod" === 'dev') {
	    //   window._MRTC = this
	    // }

	    // 返回proxy,捕获未定义函数和_rtcType为vcs时，代理到vcsIns
	    return new Proxy(this, {
	      get: function (target, prop) {
	        const isUndefinedPros = !(prop in target);
	        const isVcs = target._rtcType === 'vcs';
	        const isSelfProperty = ['_ertcIns', '_vcsIns', '_globalParams', '_rtcType', '_transactions', '_vcsBeforeEnterRoomEventTransactions', '_vcsConnectIdMapErtcPluginHandle', '_mqttNetworkState'].includes(prop); // 是否是私有变量，主要是两个实例对象，避免 _rtcType 是 vcs的时候，从 _vcsIns里去找 mrtc的函数和变量
	        const isSelfFun = ['_listenVcsBeforeEnterRoomEvent'].includes(prop); // 是否是私有函数
	        const isRebuild = ['enterRoom'].includes(prop); // 是否在业务层已改造传参的函数
	        const isExtend = ['getRtcType'].includes(prop); // 是否是扩展函数，无论是vcs还是ertc都对外暴露，可以调用
	        if (!isSelfProperty && !isSelfFun && !isRebuild && !isExtend && (isUndefinedPros || isVcs)) {
	          if (typeof target._vcsIns[prop] === 'function') {
	            return target._vcsIns[prop].bind(target._vcsIns);
	          } else {
	            return target._vcsIns[prop];
	          }
	        }
	        return target[prop];
	      },
	      set: function (target, prop, value) {
	        // 在业务层调用赋值的时候，避免直接赋值到当前实例上，而取值却到_vcsIns上，导致获取不到的情况，统一赋值取值都去_vcsIns上
	        const isUndefinedPros = !(prop in target);
	        if (isUndefinedPros) {
	          target._vcsIns[prop] = value;
	        } else {
	          target[prop] = value;
	        }
	        return true;
	      }
	    });
	  }
	  /**
	   *  @description 初始化函数
	  */
	  _initFunction() {
	    // 发布流函数添加节流
	    // this.setCameraEnableThrottle = throttle(this._setCameraEnable.bind(this), 300, { trailing: false })
	    // this.setMicroEnableThrottle = throttle(this._setMicroEnable.bind(this), 300, { trailing: false })
	  }
	  /**
	   * @description 重写vcsIns的内部方法
	   * */
	  _resetVcsFunction() {
	    var _this = this;
	    // 重写 onMqttState 方法，补充断网情况下的逻辑
	    const originFn = this._vcsIns.onMqttState.bind(this._vcsIns);
	    this._vcsIns.onMqttState = function () {
	      // action, command, result
	      if ((arguments.length <= 0 ? undefined : arguments[0]) === 'mqtt' && (arguments.length <= 1 ? undefined : arguments[1]) === 'network' && (arguments.length <= 2 ? undefined : arguments[2]) === false) {
	        // 识别到断网
	        _this._mqttNetworkState = 'offline';
	      }
	      if ((arguments.length <= 0 ? undefined : arguments[0]) === 'mqtt' && (arguments.length <= 1 ? undefined : arguments[1]) === 'network' && (arguments.length <= 2 ? undefined : arguments[2])) {
	        // 判断条件遵循vcsIns中的逻辑
	        _this._mqttNetworkState = 'online';
	        // 识别到是mqtt重连，且ertc已经重连成功，且收集了了ertc的stream-add等流相关事件推送 
	        // （这块逻辑应该没什么实际作用了，因为监听了onRoomInfoChange方法，实时会同步vstate和astate的状态，但是屏幕共享的还不确定，可能还是有用的，所以先放着，以后万一有其他地方可能需要用到这块）
	        if (_this._transactions['ertc_reconnect']) {
	          // 延迟500ms执行，让originFn先执行
	          setTimeout(() => {
	            _this._ertcIns.logger.log('mqtt重连成功，执行ertc重连事务');
	            _this._transactions['ertc_reconnect']();
	            delete _this._transactions['ertc_reconnect'];
	          }, 500);
	          // return originFn(...args)
	        }
	      }
	      return originFn(...arguments);
	    };
	  }
	  /**
	   * @description 初始化vcs事件监听
	   * */
	  _initVcsEvent() {}
	  /**
	   * @description 初始化ertc事件监听
	   * */
	  _initErtcEvent() {
	    Object.values(_EzRtcCore.EVENT).forEach(value => {
	      let fn = null;

	      // 其他用户推流
	      // 每次自研的视频流和音频流更新，手动更新风远的房间信息，并上报到上层（兼容ios/安卓/pc端推流或取消后，房间消息更新重置，状态不同步的问题）（屏幕共享流倒不影响）
	      if ([_EzRtcCore.EVENT.STREAM_ADDED, _EzRtcCore.EVENT.STREAM_REMOVED].includes(value)) {
	        fn = msg => {
	          // 音视频流
	          if ([_EzRtcCore.STREAM_TYPE.VIDEO_ONLY, _EzRtcCore.STREAM_TYPE.AUDIO_ONLY].includes(msg['streamtype'])) {
	            var _vcsRoomInfo$persons;
	            const vcsRoomInfo = lodashEs.cloneDeep(this._vcsIns.getRoom());
	            (_vcsRoomInfo$persons = vcsRoomInfo.persons) === null || _vcsRoomInfo$persons === void 0 || _vcsRoomInfo$persons.forEach(person => {
	              if (person.id === msg['customId']) {
	                const ertcPerson = this._ertcIns.usersInstance.query({
	                  id: msg['customId']
	                });
	                this._ertcIns.logger.log('mrtc接收到ertc的stream-add/remove事件后，要替换的用户信息id：', msg['customId']);
	                this._ertcIns.logger.log(`person.vstate：${person.vstate} person.astate：${person.astate}`);
	                this._ertcIns.logger.log(`ertcPerson.vstate：${ertcPerson.vstate} ertcPerson.astate：${ertcPerson.astate}`);
	                if (ertcPerson) {
	                  person.vstate = !!ertcPerson.vstate ? 0 : 1;
	                  person.astate = !!ertcPerson.astate ? 0 : 1;
	                  this._vcsIns.roomInfo.setVideoState(person.id.toString(), person.vstate);
	                  this._vcsIns.roomInfo.setAudioState(person.id.toString(), person.astate);
	                }
	              }
	            });
	            // this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.throwRoomMemberInfo, vcsRoomInfo);
	            const waitFn = () => {
	              this._ertcIns.logger.log('mrtc触发vcs音视频流更新');
	              this._vcsIns.roomInfo.event_roomMemberInfoNotice(vcsRoomInfo);
	            };
	            if (this._mqttNetworkState === 'offline') {
	              this._addErtcReconnect(waitFn);
	            } else {
	              waitFn();
	            }
	          }

	          // // // // 暂时不去拦截了，还是会有问题，web端发送屏幕共享的时候，stream-added快于风远房间内部信息更新，导致 index 和 type 都获取到老的，现在还无法确定 index的具体作用，所以在on拦截函数中，增加1秒的延迟执行
	          // 屏幕共享流，拦截
	          if ([_EzRtcCore.STREAM_TYPE.SCREEN].includes(msg['streamtype'])) {
	            if ([_EzRtcCore.EVENT.STREAM_ADDED].includes(value)) {
	              const waitFn = () => {
	                // 在on的时候，已经拦截了屏幕共享流开启的上报，统一在stream-added事件中上报
	                // mrtc触发vcs屏幕共享
	                this._ertcIns.logger.log('mrtc触发vcs屏幕共享');
	                this._vcsIns.roomInfo.event_startSharingScreen({
	                  id: msg.customId,
	                  // index: this._vcsIns.roomInfo._room.sharingScreenIndex, // 需要找苏鹤工确认一下这个index的作用
	                  index: null,
	                  type: 3,
	                  isFromStreamAdded: true // 标识是否是stream-added事件触发的，并非原先的 event_startSharingScreen 必须参数，而是额外添加的，在on的拦截函数中会判断，并删除。
	                });
	              };
	              if (this._mqttNetworkState === 'offline') {
	                this._addErtcReconnect(waitFn);
	              } else {
	                waitFn();
	              }
	            }
	          }
	        };
	      }

	      // 远端流可用
	      if (value === _EzRtcCore.EVENT.REMOTE_STREAM_AVAILABLE) {
	        fn = msg => {
	          let transaction = msg.streamtype === 'amixer' ? 'amixer' : `${msg.userId}-${msg.streamtype}`;
	          // 调用事务队列
	          if (transaction !== null && transaction !== undefined) {
	            var reportSuccess = this._transactions[transaction];
	            if (reportSuccess !== null && reportSuccess !== undefined) {
	              this._transactions[transaction](msg);
	            }
	            delete this._transactions[transaction];
	          }
	        };
	      }

	      // 视频角度变化
	      if (value === _EzRtcCore.EVENT.VIDEO_ROTATION) {
	        fn = msg => {
	          var _vcsRoomInfo$persons2;
	          const {
	            rotate,
	            customId
	          } = msg;
	          const rotateMap = {
	            // 不做映射了，ertc的初始角度和风远的角度不一样，风远默认初始角度为横屏，ertc默认为竖屏。
	            0: 0,
	            90: 90,
	            // 手机向左转90度，这个角度在风远的枚举值没有，所以不做映射
	            // 180: 1129136433, // 手机向左转180度，不存在这种情况
	            270: 270 // 手机向左转270度
	          };
	          const angle = rotateMap[rotate]; // 映射到风远的角度
	          const vcsRoomInfo = this._vcsIns.getRoom();
	          (_vcsRoomInfo$persons2 = vcsRoomInfo.persons) === null || _vcsRoomInfo$persons2 === void 0 || _vcsRoomInfo$persons2.forEach(person => {
	            if (person.id === customId) {
	              person.streams.forEach(stream => {
	                stream.angle = angle;
	              });
	            }
	          });
	          // 手动触发vcs的onRoomMemberInfoChange事件，更新房间信息
	          this._ertcIns.logger.log('屏幕转动，mrtc触发vcs房间信息更新');
	          this._vcsIns.roomInfo.event_roomMemberInfoNotice(vcsRoomInfo);
	        };
	      }

	      // websocket连接状态变化
	      if (value === _EzRtcCore.EVENT.CONNECT_STATE_CHANGE) {
	        fn = msg => {
	          if (msg.msg === 'reconnect success') ; else if (msg.msg === 'reconnecting') {
	            // 网络重连开始，将 personsNewStreamMap 重置，避免上层业务在重连后，不去重新订阅视频
	            this._vcsIns.personsNewStreamMap = {};
	          }
	        };
	      }
	      fn && this._ertcIns.on(value, fn);
	    });
	  }

	  /**
	   * @description 加入房间
	   * @param {Object} params
	   * @param {Object} params.vcsParams
	   * @param {Object} params.vcsParams.roomOption
	   * @param {string} params.vcsParams.roomOption.room_no // 会议ID
	   * @param {string} [params.vcsParams.roomOption.password] // 会议密码
	   * @param {string} [params.vcsParams.roomOption.device_id] // 设备id
	   * @param {string} [params.vcsParams.roomOption.upload_id] // ？
	   * @param {string} [params.vcsParams.roomOption.lineID] // 线路id
	   * @param {boolean} params.vcsParams.amixer // 是否混音
	   * @param {Object} params.vcsParams.accountData
	   * @param {string} params.vcsParams.accountData.audio_state // 入会是否开启音频
	   * @param {string} params.vcsParams.accountData.video_state // 入会是否开启视频
	   * @param {string} params.vcsParams.accountData.nickname // 入会昵称
	   * @param {string} [params.vcsParams.inviterUid] // 邀请人uid
	   * @param {string} [params.vcsParams.webinar_invitation_link_code] // ？
	   * @param {string} [params.vcsParams.test] // ？
	   * @param {Object} params.ertcParams
	   * @param {string} params.ertcParams.appId // 控制台应用id
	   * @param {string} params.ertcParams.roomId // 房间id
	   * @param {string} params.ertcParams.userId // 用户id
	   * @param {string} params.ertcParams.accessToken // 用户资源token
	   * @param {string} params.ertcParams.domain // 域名前缀，会覆盖实例化时候的入参domain
	   * */
	  enterRoom(params) {
	    const deffered = deffer$1();
	    this._listenVcsBeforeEnterRoomEvent();
	    // 风远加入房间（透传）
	    const vcsPromise = this._vcsIns.enterRoom(params.vcsParams.roomOption, params.vcsParams.amixer, params.vcsParams.accountData, params.vcsParams.inviterUid, params.vcsParams.webinar_invitation_link_code);
	    vcsPromise.then(res => {
	      const enterRoomData = this._vcsIns.getEnterRoomData();
	      this._ertcIns.logger.log('风远加入房间成功：', res);
	      if ((enterRoomData === null || enterRoomData === void 0 ? void 0 : enterRoomData.rtc_mode) === 1) {
	        // 萤石自研rtc 会议
	        this._rtcType = 'ertc';
	        if (params.ertcParams.domain) {
	          // 更新ertc实例的domain
	          this._ertcIns.domain = params.ertcParams.domain;
	        }
	        // ertc加入房间
	        this._ertcIns.enterRoom(params.ertcParams).then(async res2 => {
	          // 本地缓存mrtc入房信息
	          localStorage.setItem('mrtc-enterRoomParams', JSON.stringify(params));
	          if (res2.code === 0) {
	            const resClone = lodashEs.cloneDeep(res);
	            // this._vcsRoomInfo = resClone
	            deffered.resolve(resClone);
	            setTimeout(() => {
	              this._triggerVcsBeforeEnterRoomEvent();
	              lodashEs.cloneDeep(this._vcsIns.roomInfo._room);
	              // if (cloneRoom.sharing_type) {
	              //   this._ertcIns.logger.log('ertc加入房间后，手动触发一次setRoom，保证如果有屏幕共享的信息，能够获取到')
	              //   // 如果有屏幕共享的信息，手动触发一次 setRoom 事件，修复如下问题
	              //   // 1、一端开启屏幕共享后，另一端加入房间，屏幕共享未显示。原因：风远sdk进入房间后，会触发一次setRoom事件，里面有屏幕共享的信息，但是此时ertc还在加入房间中，导致应用层还没执行到监听 onPeerSharingScreenStart 事件，从而屏幕共享获取不到。如果把监听事件前置，也不一定能解决，因为会调用订阅屏幕共享的接口，但是此时ertc还没加入房间，会报错。
	              //   this._vcsIns.roomInfo._room.sharing_type = null // 强制更新私有变量，不规范，但是解决问题
	              //   this._vcsIns.roomInfo.setRoom(cloneRoom, cloneRoom.sharingScreenID)
	              // }
	            }, 1000);
	          } else {
	            // ertc加入房间失败，退出风远和自研房间，光退出风远房间不行，其他端的用户列表好像是匹配自研的入房信息。
	            this.leave();
	            deffered.reject({
	              code: '100001',
	              msg: res2.msg
	            });
	          }
	        }).catch(err => {
	          // ertc加入房间失败，退出风远和自研房间，光退出风远房间不行，其他端的用户列表好像是匹配自研的入房信息。
	          this.leave();
	          deffered.reject({
	            code: '100001',
	            msg: err
	          });
	        });
	      } else {
	        // 风远rtc 会议
	        this._rtcType = 'vcs';
	        deffered.resolve(res);
	      }
	      localStorage.setItem('mrtc-rtcType', this._rtcType);
	      this._ertcIns.logger.log(`当前会议类型：${this._rtcType}`, enterRoomData === null || enterRoomData === void 0 ? void 0 : enterRoomData.rtc_mode);
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description 离开房间
	   * */
	  leave() {
	    const deffered = deffer$1();
	    // 风远离开房间（透传）
	    const vcsPromise = this._vcsIns.leave();
	    // ertc离开房间
	    const ertcPromise = this._ertcIns.leaveRoom();
	    // 重置实例状态
	    this._resetRoomStatus();
	    Promise.all([vcsPromise, ertcPromise]).then(res => {
	      res[1] && deffered.resolve(true);
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description 刷新房间
	   * */
	  refreshRoom() {
	    const deffered = deffer$1();
	    // 风远刷新房间
	    const vcsPromise = this._vcsIns.refreshRoom();
	    const hasEnterRoom = this._vcsIns.enterRoomLoading || this._vcsIns.enterRoomData && this._vcsIns.enterRoomData.room;
	    vcsPromise.then(res => {
	      // 如果有数据，说明不是刷新页面，而是首次进入房间，直接返回，避免ertc重复进入房间（放在promise请求之前就获取数据，是避免到这一步的时候，数据已经有了，导致判断出错）
	      if (hasEnterRoom) {
	        deffered.resolve(res);
	        return;
	      }
	      const mrtcEnterRoomParams = JSON.parse(localStorage.getItem('mrtc-enterRoomParams'));
	      if (mrtcEnterRoomParams.ertcParams.domain) {
	        // 更新ertc实例的domain
	        this._ertcIns.domain = mrtcEnterRoomParams.ertcParams.domain;
	      }
	      // ertc加入房间
	      this._ertcIns.enterRoom(mrtcEnterRoomParams.ertcParams).then(async res2 => {
	        if (res2.code === 0) {
	          deffered.resolve(res);
	        } else {
	          // ertc加入房间失败，退出风远和自研房间，光退出风远房间不行，其他端的用户列表好像是匹配自研的入房信息。
	          this.leave();
	          deffered.reject({
	            code: '100001',
	            msg: `自研入房失败：${res2.msg}`
	          });
	        }
	      }).catch(err => {
	        // ertc加入房间失败，退出风远和自研房间，光退出风远房间不行，其他端的用户列表好像是匹配自研的入房信息。
	        this.leave();
	        deffered.reject({
	          code: '100001',
	          msg: `自研入房失败：${err}`
	        });
	      });
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description 推送视频流，流数据来源于vcsIns.setVideoEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  publishSelfVideo() {
	    var _this$_vcsIns$videoSt;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    this._ertcIns.logger.log('进入 publishSelfVideo 函数');
	    const deffered = deffer$1();
	    // 复用易会项目中的权限判断
	    // 1. 会控状态
	    if (this._vcsIns.controlsAccount.video_state == 2) {
	      const error = this._vcsIns.vcsErr.throwErr(707, `推流失败${index}：视频权限被主持人禁用。`, "publishSelfVideo");
	      return Promise.reject(error);
	    }
	    // 2. 获取流
	    const streamID = this._vcsIns.videoStreams[index] ? (_this$_vcsIns$videoSt = this._vcsIns.videoStreams[index]) === null || _this$_vcsIns$videoSt === void 0 ? void 0 : _this$_vcsIns$videoSt.streamID : undefined;
	    if (!streamID) {
	      const error = this._vcsIns.vcsErr.throwErr(9001, `推流失败${index}：流编号错误。`, "publishSelfVideo");
	      return Promise.reject(error);
	    }
	    this._vcsIns.media.getStream(streamID).then(stream => {
	      this._ertcIns.publishStream({
	        type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY,
	        stream,
	        simulcast: true,
	        isSingleConnect: true
	      }).then(res => {
	        if (res.code === 0) {
	          const pcID = Janus.randomString(12);
	          // 复用易会的更新状态逻辑 4. 更新状态信息
	          this._vcsIns.videoStreams[index] && (this._vcsIns.videoStreams[index].connectID = pcID);
	          this._vcsIns._updateSocket_addVideoTrack(index);
	          this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.peerPublish, {
	            account: this._vcsIns.account,
	            srcObject: stream
	          });
	          if (!this._vcsIns.controlsAccount["connections"]) {
	            this._vcsIns.controlsAccount["connections"] = new Array();
	          }
	          this._vcsIns.controlsAccount["connections"].push({
	            connectID: pcID,
	            streamID: streamID,
	            index: index,
	            type: 1,
	            stream: stream
	          });

	          // todo 
	          if (this._vcsIns.roomClient) {
	            setTimeout(() => {
	              this._vcsIns.roomClient.heartbeat();
	            }, 500);
	          }
	          deffered.resolve(stream);
	        } else {
	          deffered.reject(res);
	        }
	      });
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 停止推送视频流，流数据来源于vcsIns.setVideoEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  stopPublishSelfVideo() {
	    var _this$_vcsIns$videoSt2;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    this._ertcIns.logger.log('进入 stopPublishSelfVideo 函数');
	    const deffered = deffer$1();
	    // 复用易会中的状态变更
	    if (this._vcsIns.controlsAccount) {
	      this._vcsIns.controlsAccount.video_state = 1;
	    }
	    const pcID = (_this$_vcsIns$videoSt2 = this._vcsIns.videoStreams[index]) === null || _this$_vcsIns$videoSt2 === void 0 ? void 0 : _this$_vcsIns$videoSt2.connectID;
	    if (!pcID) {
	      console.error(`停止推流视频${index}出错：没有相应的连接ID。stopPublishSelfVideo`);
	      // const error = vcsErr.throwErr(
	      //   1002,
	      //   `停止推流视频${index}出错：没有相应的连接ID。`,
	      //   "stopPublishSelfVideo"
	      // );
	      // return reject(`停止推流视频${index}出错：没有相应的连接ID。`);
	      return Promise.resolve();
	    }
	    this._ertcIns.unpublishStream({
	      type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY,
	      isSingleConnect: true
	    }).then(res => {
	      if (res.code === 0) {
	        // 2. socket更新
	        this._vcsIns._updateSocket_removeVideoTrack(index);
	        // 3. 删除流连接信息
	        this._vcsIns.videoStreams[index] && (this._vcsIns.videoStreams[index].connectID = undefined);
	        this._vcsIns.controlsAccount["connections"] = this._vcsIns.controlsAccount["connections"].filter(connection => {
	          return connection.connectID !== pcID;
	        });
	        deffered.resolve();
	      } else {
	        deffered.reject(res);
	      }
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 推送音频流，流数据来源于vcsIns.setAudioEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  publishSelfAudio() {
	    var _this$_vcsIns$audioSt;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    this._ertcIns.logger.log('进入 publishSelfAudio 函数');
	    const deffered = deffer$1();
	    // 复用易会权限逻辑
	    // 1. 会控状态
	    if (this._vcsIns.controlsAccount.audio_state == 2) {
	      const error = this._vcsIns.vcsErr.throwErr(707, `推流失败${index}：音频权限被主持人禁用。`, "publishSelfAudio");
	      return Promise.reject(error);
	    }

	    // 2. 获取流
	    const streamID = this._vcsIns.audioStreams[index] ? (_this$_vcsIns$audioSt = this._vcsIns.audioStreams[index]) === null || _this$_vcsIns$audioSt === void 0 ? void 0 : _this$_vcsIns$audioSt.streamID : undefined;
	    if (!streamID) {
	      const error = this._vcsIns.vcsErr.throwErr(9001, `推流失败${index}：流编号错误。`, "publishSelfAudio");
	      return Promise.reject(error);
	    }
	    this._vcsIns.media.getStream(streamID).then(stream => {
	      this._ertcIns.publishStream({
	        type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY,
	        stream,
	        isSingleConnect: true
	      }).then(res => {
	        if (res.code === 0) {
	          const pcID = Janus.randomString(12);
	          // 复用易会逻辑
	          // 4. 更新状态信息
	          this._vcsIns.audioStreams[index] && (this._vcsIns.audioStreams[index].connectID = pcID);
	          this._vcsIns._updateSocket_addAudioTrack();
	          this._ertcIns.logger.log(`推送音频流${index}成功。`);
	          if (!this._vcsIns.controlsAccount["connections"]) {
	            this._vcsIns.controlsAccount["connections"] = new Array();
	          }
	          this._vcsIns.controlsAccount["connections"].push({
	            connectID: pcID,
	            streamID: streamID,
	            index: index,
	            type: 0
	          });
	          deffered.resolve(stream);
	        } else {
	          deffered.reject(res);
	        }
	      }).catch(err => {
	        console.error(`推送音频流${index}错误：SDP协商出错。`);
	        deffered.reject(err);
	      });
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 停止推送音频流，流数据来源于vcsIns.setAudioEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  stopPublishSelfAudio() {
	    var _this$_vcsIns$audioSt2;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    const deffered = deffer$1();
	    // 复用易会中的状态变更
	    if (this._vcsIns.controlsAccount) {
	      this._vcsIns.controlsAccount.audio_state = 1;
	    }
	    const pcID = (_this$_vcsIns$audioSt2 = this._vcsIns.audioStreams[index]) === null || _this$_vcsIns$audioSt2 === void 0 ? void 0 : _this$_vcsIns$audioSt2.connectID;
	    if (!pcID) {
	      console.error(`停止推流音频${index}出错：没有相应的连接ID。stopPublishSelfAudio`);
	      return Promise.resolve();
	    }
	    this._ertcIns.unpublishStream({
	      type: _EzRtcCore.STREAM_TYPE.AUDIO_ONLY,
	      isSingleConnect: true
	    }).then(res => {
	      if (res.code === 0) {
	        // 2. socket更新
	        this._vcsIns._updateSocket_removeAudioTrack(index);
	        // 3. 删除流连接信息
	        this._vcsIns.audioStreams[index] && (this._vcsIns.audioStreams[index].connectID = undefined);
	        this._vcsIns.controlsAccount["connections"] = this._vcsIns.controlsAccount["connections"].filter(connection => {
	          return connection.connectID !== pcID;
	        });
	        deffered.resolve();
	      } else {
	        deffered.reject(res);
	      }
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 推送屏幕共享流
	   * */
	  publishSelfScreen(index) {
	    var _this$_vcsIns$screenS;
	    const deffered = deffer$1();

	    // 复用易会项目中的逻辑
	    // 1. 获取流
	    const streamID = this._vcsIns.screenStreams[index] ? (_this$_vcsIns$screenS = this._vcsIns.screenStreams[index]) === null || _this$_vcsIns$screenS === void 0 ? void 0 : _this$_vcsIns$screenS.streamID : undefined;
	    if (!streamID) {
	      const error = this._vcsIns.vcsErr.throwErr(9002, `推流失败${index}：流编号错误。`, "publishSelfScreen");
	      return Promise.reject(error);
	    }
	    this._vcsIns.media.getStream(streamID).then(stream => {
	      // 3. SDP协商
	      this._ertcIns.publishStream({
	        type: _EzRtcCore.STREAM_TYPE.SCREEN,
	        stream
	      }).then(() => {
	        const pcID = Janus.randomString(12);
	        // 4. 更新状态信息
	        this._vcsIns.screenStreams[index] && (this._vcsIns.screenStreams[index].connectID = pcID);
	        this._vcsIns._updateSocket_addScreenTrack(index);
	        if (!this._vcsIns.controlsAccount["connections"]) {
	          this._vcsIns.controlsAccount["connections"] = new Array();
	        }
	        this._vcsIns.controlsAccount["connections"].push({
	          connectID: pcID,
	          streamID: streamID,
	          index: index,
	          type: 2
	        });
	        deffered.resolve(stream);
	      }).catch(err => {
	        deffered.reject(err);
	      });
	    });
	    return deffered.promise;
	  }

	  /**
	   * @description 停止推送屏幕共享流
	   * */
	  stopPublishSelfScreen(index) {
	    var _this$_vcsIns$screenS2;
	    const deffered = deffer$1();

	    // 复用易会中的逻辑
	    // 1. 信令断开
	    const pcID = (_this$_vcsIns$screenS2 = this._vcsIns.screenStreams[index]) === null || _this$_vcsIns$screenS2 === void 0 ? void 0 : _this$_vcsIns$screenS2.connectID;
	    if (!pcID) {
	      this._vcsIns.vcsErr.throwErr(1003, `停止推流桌面${index}出错：没有相应的连接ID。`, "stopPublishSelfScreen");
	      // return reject(error);
	      return Promise.resolve();
	    }
	    this._vcsIns.screenStreams[index] && (this._vcsIns.screenStreams[index].connectID = undefined);
	    this._vcsIns._updateSocket_removeScreenTrack(index);
	    this._ertcIns.unpublishStream({
	      type: _EzRtcCore.STREAM_TYPE.SCREEN
	    }).then(res => {
	      // 2. socket更新
	      // 3. 删除流连接信息
	      this._vcsIns.controlsAccount["connections"] = this._vcsIns.controlsAccount["connections"].filter(connection => {
	        return connection.connectID !== pcID;
	      });

	      // this.roomInfo.setRoomState("", 0, 0);
	      deffered.resolve();
	    });
	    return deffered.promise;
	  }

	  // 订阅逻辑
	  /**
	   * @description 订阅混音流
	   * @param {Object} params
	   * @param {string} params.view // 绑定的dom元素
	   * */
	  pullPeerMixerAudioStream(params) {
	    const deffered = deffer$1();
	    let subscribeSuccess = false;
	    let streamSuccess = false;
	    this._ertcIns.subscribeMix(params).then(res => {
	      if (res.code === 0) {
	        subscribeSuccess = true;
	        streamSuccess && deffered.resolve(streamSuccess);
	      } else {
	        deffered.reject(res);
	      }
	    });
	    // 存储到事务队列中
	    this._transactions['amixer'] = msg => {
	      streamSuccess = msg;
	      subscribeSuccess && deffered.resolve({
	        connectID: null,
	        stream: msg.stream
	      });
	    };
	    return deffered.promise;
	  }

	  /**
	   * @description 取消订阅混音流
	   * */
	  stopPullPeerMixerAudioStream() {
	    return this._ertcIns.unsubscribeMix();
	  }

	  /**
	   * @description 订阅视频
	   * @param {string} id // 用户ID
	   * @param {string} option
	   * */
	  pullPeerVideoStream(id, option) {
	    const deffered = deffer$1();
	    // 风远订阅视频（透传）（当做会控消息处理）
	    const vcsPromise = this._vcsIns.pullPeerVideoStream(id, option);
	    // ertc订阅视频
	    const ertcPromise = this._ertcIns.subscribeStream({
	      userId: id,
	      type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	    });
	    let subscribeSuccess = false;
	    let streamSuccess = false;
	    let connectID = null;
	    Promise.all([vcsPromise, ertcPromise]).then(res => {
	      var _res$;
	      if (((_res$ = res[1]) === null || _res$ === void 0 ? void 0 : _res$.code) === 0) {
	        subscribeSuccess = true;
	        connectID = res[0].connectID;
	        // 存储vcs连接id和ertc插件句柄，用来替换peerconnection的stats报告信息
	        this._vcsConnectIdMapErtcPluginHandle[connectID] = {
	          userId: id,
	          pluginHandle: this._ertcIns.state.subscribeAttaches[id]['default'].pluginHandle
	        };
	        streamSuccess && deffered.resolve({
	          connectID,
	          stream: streamSuccess.stream
	        });
	      } else {
	        deffered.reject(res[1]);
	      }
	    }).catch(deffered.reject);

	    // 存储到事务队列中
	    this._transactions[`${id}-${_EzRtcCore.STREAM_TYPE.VIDEO_ONLY}`] = msg => {
	      streamSuccess = msg;
	      subscribeSuccess && deffered.resolve({
	        connectID,
	        stream: msg.stream
	      });
	    };
	    return deffered.promise;
	  }
	  /**
	   * @description 取消订阅视频（根据用户id）
	   * @param {string} id // 用户id
	   * @param {number} index // 下标
	   * */
	  stopPullPeerVideoStreamByPersonId(id, index) {
	    const deffered = deffer$1();
	    // 风远取消订阅视频（透传）（当做会控消息处理）
	    const vcsPromise = this._vcsIns.stopPullPeerVideoStreamByPersonId(id, index);
	    // ertc取消订阅视频
	    const ertcPromise = this._ertcIns.unsubscribe({
	      userId: id,
	      type: _EzRtcCore.STREAM_TYPE.VIDEO_ONLY
	    });
	    Promise.all([vcsPromise, ertcPromise]).then(res => {
	      var _res$2;
	      if (((_res$2 = res[1]) === null || _res$2 === void 0 ? void 0 : _res$2.code) === 0) {
	        deffered.resolve();
	      } else {
	        deffered.reject(res[1]);
	      }
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description 取消订阅视频
	   * @param {string} connectID // 连接id
	   * */
	  stopPullPeerVideoStream(connectID) {
	    const personID = this._vcsIns.roomInfo.getIDByConnectID(connectID);
	    return this.stopPullPeerVideoStreamByPersonId(personID);
	  }
	  /**
	   * @description 订阅屏幕共享流
	   * @param {string} id // 用户id
	   * @param {number} index // 下标
	   * */
	  pullPeerScreenStream(id, index) {
	    const deffered = deffer$1();
	    // 风远订阅屏幕共享流（透传）（当做会控消息处理）
	    const vcsPromise = this._vcsIns.pullPeerScreenStream(id, index);
	    // ertc订阅视频
	    const ertcPromise = this._ertcIns.subscribeStream({
	      userId: id,
	      type: _EzRtcCore.STREAM_TYPE.SCREEN
	    });
	    let subscribeSuccess = false;
	    let streamSuccess = false;
	    let connectID = null;
	    Promise.all([vcsPromise, ertcPromise]).then(res => {
	      var _res$3;
	      if (((_res$3 = res[1]) === null || _res$3 === void 0 ? void 0 : _res$3.code) === 0) {
	        subscribeSuccess = true;
	        connectID = res[0].connectID;
	        streamSuccess && deffered.resolve({
	          connectID,
	          stream: streamSuccess.stream
	        });
	      } else {
	        deffered.reject(res[1]);
	      }
	    }).catch(deffered.reject);

	    // 存储到事务队列中
	    this._transactions[`${id}-${_EzRtcCore.STREAM_TYPE.SCREEN}`] = msg => {
	      streamSuccess = msg;
	      subscribeSuccess && deffered.resolve({
	        connectID,
	        stream: msg.stream
	      });
	    };
	    return deffered.promise;
	  }
	  /**
	   * @description 取消订阅屏幕共享流
	   * @param {string} connectID // 连接id
	   * */
	  stopPullPeerScreenStream(connectID) {
	    const deffered = deffer$1();
	    const id = this._vcsIns.roomInfo.getIDByConnectID(connectID);
	    // 风远取消订阅视频（透传）（当做会控消息处理）
	    const vcsPromise = this._vcsIns.stopPullPeerScreenStream(connectID);
	    // ertc取消订阅视频
	    const ertcPromise = this._ertcIns.unsubscribe({
	      userId: id,
	      type: _EzRtcCore.STREAM_TYPE.SCREEN
	    });
	    Promise.all([vcsPromise, ertcPromise]).then(res => {
	      var _res$4;
	      if (((_res$4 = res[1]) === null || _res$4 === void 0 ? void 0 : _res$4.code) === 0) {
	        deffered.resolve();
	      } else {
	        deffered.reject(res[1]);
	      }
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description 获取当前rtcType
	   * @returns {string} // vcs | ertc
	   * */
	  getRtcType() {
	    return this._rtcType;
	  }
	  /**
	   * @description 劫持vcs的事件监听
	   * */
	  on(event, fn) {
	    let fnNew = fn;
	    if (this._rtcType === 'ertc') {
	      // 拦截网络质量状态变化
	      if (event === 'throwStreamNetworkState') {
	        fnNew = async state => {
	          var _this$_vcsConnectIdMa;
	          let newState = state;
	          if (!newState.closed && (_this$_vcsConnectIdMa = this._vcsConnectIdMapErtcPluginHandle) !== null && _this$_vcsConnectIdMa !== void 0 && _this$_vcsConnectIdMa[newState.id]) {
	            newState = await this._replaceConnectionStateState(newState, this._vcsConnectIdMapErtcPluginHandle[newState.id]);
	          }
	          return fn(newState);
	        };
	      }
	      // 拦截屏幕共享开启事件，因为vcs屏幕共享通知和 ertc的通知事件，会出现不同步，ertc 的 stream-added，可能会延迟1-2s，导致stream-added事件还没触发，但已经调用了订阅屏幕共享的接口，导致获取不到报错，所以统一在stream-added的时候向上层通知屏幕共享开启
	      if (event === 'onPeerSharingScreenStart') {
	        fnNew = target => {
	          // 1、如果是stream-added触发的
	          // 2、如果是当前用户开启的屏幕共享，也会触发，为了兼容上层当前用户开启屏幕共享后，会在onPeerSharingScreenStart的回调函数中执行关闭摄像头操作
	          if (target !== null && target !== void 0 && target.isFromStreamAdded || target.id === this._vcsIns.getAccount().id) {
	            // 考虑到上层应用可能会监听多个 onPeerSharingScreenStart 事件，所以这里不做delete，避免逻辑出现错误
	            // delete target.isFromStreamAdded
	            return fn(target);
	          }
	          this._ertcIns.logger.log('onPeerSharingScreenStart 事件被拦截，此次事件不是由stream-added触发');
	        };
	      }
	      // 拦截 onRoomMemberInfoChange 事件，同步音视频状态
	      if (event === 'onRoomMemberInfoChange') {
	        fnNew = target => {
	          // 同步音视频状态
	          target.persons = this._replacePersons(target.persons);
	          return fn(target);
	        };
	      }
	      this._vcsIns.on(event, fnNew);
	    } else {
	      this._vcsIns.on(event, fnNew);
	    }
	  }
	  /**
	   * @description 监听vcs加入房间前事件，避免因为异步问题，导致vcs入房后 到 ertc入房后的这段时间，业务层的监听事件不生效
	   * */
	  _listenVcsBeforeEnterRoomEvent() {
	    var _this2 = this;
	    this._vcsIns.once('onSelfAccountChange', function () {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	      _this2._vcsBeforeEnterRoomEventTransactions['onSelfAccountChange'] = args;
	    });
	  }
	  _triggerVcsBeforeEnterRoomEvent() {
	    Object.entries(this._vcsBeforeEnterRoomEventTransactions).forEach(_ref => {
	      let [key, args] = _ref;
	      this._vcsIns.eventBus.emit(key, ...args);
	      // 删除
	      delete this._vcsBeforeEnterRoomEventTransactions[key];
	    });
	  }

	  /**
	   * @description 更新批量person信息
	   * */
	  _replacePersons(vcsPersons) {
	    this._ertcIns.logger.log('vcsPersons转换前数据：', vcsPersons);
	    const vcsPersonsClone = lodashEs.cloneDeep(vcsPersons);
	    vcsPersonsClone === null || vcsPersonsClone === void 0 || vcsPersonsClone.forEach(vcsPerson => {
	      var _this$_ertcIns$usersI;
	      const ertcPersonMatched = (_this$_ertcIns$usersI = this._ertcIns.usersInstance) === null || _this$_ertcIns$usersI === void 0 ? void 0 : _this$_ertcIns$usersI.query({
	        id: vcsPerson.id
	      });
	      ertcPersonMatched && this._replacePerson(vcsPerson, ertcPersonMatched);
	    });
	    return vcsPersonsClone;
	  }
	  /**
	   * @description 更新单个person信息
	   * */
	  _replacePerson(vcsPerson, ertcPerson) {
	    // 更新媒体状态
	    // 不更新自己，因为有滞后性，导致状态不及时
	    if (vcsPerson.id !== this._vcsIns.getAccount().id) {
	      vcsPerson.vstate = !!(ertcPerson !== null && ertcPerson !== void 0 && ertcPerson.vstate) ? 0 : 1;
	      vcsPerson.astate = !!(ertcPerson !== null && ertcPerson !== void 0 && ertcPerson.astate) ? 0 : 1;
	      if (this._vcsIns.roomInfo.checkPeer(vcsPerson.id) && this._vcsIns.roomInfo.getVideoState(vcsPerson.id) !== vcsPerson.vstate) {
	        this._vcsIns.roomInfo.setVideoState(vcsPerson.id.toString(), vcsPerson.vstate);
	      }
	      if (this._vcsIns.roomInfo.checkPeer(vcsPerson.id) && this._vcsIns.roomInfo.getAudioState(vcsPerson.id) !== vcsPerson.astate) {
	        this._vcsIns.roomInfo.setAudioState(vcsPerson.id.toString(), vcsPerson.astate);
	      }
	    }

	    // // 暂时不涉及到stream更新
	    // // 更新媒体流地址
	    // vcsPerson.streams = []
	    // const descMap = { 1: 'big', 4: 'small', 8: 'share' }
	    // ertcPerson?.streams?.forEach(ertcStream => {
	    //   const stream = {
	    //     id: ertcStream.stream_type, /** 码流ID，1，2，4，暂时先设置为stream_type */
	    //     track: null, /** 轨道号  易会业务层貌似没有使用到，暂时设置为null*/
	    //     rtmp: ertcStream.rtmp,
	    //     angle: ertcPerson?.videoRotation || null, /** 视频流角度 */
	    //     width: null, /** 视频流宽 自研没有这个参数*/
	    //     height: null, /** 视频流高 自研没有这个参数*/
	    //     desc: descMap[ertcStream.stream_type], /** 描述 */
	    //     type: ertcStream.stream_type === 4 ? 1 : 0, /** 0-主流；1-辅流 */
	    //     channel_type: ertcStream.stream_type === 8 ? 5 : null /** 通道类型，目前只知道共享流为5，在易会业务层会使用 */
	    //   }
	    //   if (stream.desc) {
	    //     vcsPerson.streams.push(stream)
	    //   }
	    // })
	    return vcsPerson;
	  }
	  /**
	   * @description 替换vcs的媒体流链接状态数据
	   * */
	  _replaceConnectionStateState(state, pluginObj) {
	    return new Promise(resolve => {
	      var _pluginObj$pluginHand;
	      const connectionState = state;
	      // 复制易会计算的逻辑
	      (_pluginObj$pluginHand = pluginObj.pluginHandle) === null || _pluginObj$pluginHand === void 0 || (_pluginObj$pluginHand = _pluginObj$pluginHand.webrtcStuff) === null || _pluginObj$pluginHand === void 0 || (_pluginObj$pluginHand = _pluginObj$pluginHand.pc) === null || _pluginObj$pluginHand === void 0 || _pluginObj$pluginHand.getStats().then(data => {
	        data.forEach(item => {
	          if (item.type === "candidate-pair") {
	            // this._ertcIns.logger.log("???", item);
	            connectionState.candidateState = item.state;
	          }
	          if (item.type === "transport") {
	            connectionState.dtlsState = item.dtlsState;
	          }
	          if (item.type === "media-source") {
	            if (item.audioLevel && item.audioLevel != -1) {
	              connectionState.audioLevel = item.audioLevel;
	            }
	          }
	          if (item.audioLevel && item.audioLevel != -1) {
	            connectionState.audioLevel = item.audioLevel;
	          }
	          if (item.type === "inbound-rtp") {
	            connectionState.type = item.mediaType;
	            connectionState.keyFramesDecoded = item.keyFramesDecoded;
	            const currentPacketsReceived = item.packetsReceived - pluginObj.packetsReceived;
	            const diffNackPackages = item.nackCount - pluginObj.nackCount;
	            const totalPackages = currentPacketsReceived + diffNackPackages;
	            const packersLost = item.packetsLost - pluginObj.packersLost;
	            const packetLoss = diffNackPackages / totalPackages;
	            const packetLossAfter = packersLost / currentPacketsReceived;
	            const bytesReceived = item.bytesReceived - pluginObj.bytesReceived;
	            connectionState.keyFramesDecodedGap = item.keyFramesDecoded - pluginObj.keyFramesDecoded;
	            connectionState.afterPackersLost = packetLossAfter || 0;
	            connectionState.beforePackersLost = packetLoss || 0;
	            connectionState.packetsReceived = item.packetsReceived;
	            connectionState["bytesReceived/s"] = bytesReceived / 1024 / 2;
	            // connectionState["packetsReceived/s"] = currentPacketsReceived / 2;

	            pluginObj.keyFramesDecoded = item.keyFramesDecoded;
	            pluginObj.nackCount = item.nackCount;
	            pluginObj.packetsReceived = item.packetsReceived;
	            pluginObj.packersLost = item.packetsLost;
	            pluginObj.bytesReceived = item.bytesReceived;
	          }
	          // if (item.type === "remote-candidate") {
	          //   this._ertcIns.logger.log('远端端口信息:', item.port, "服务地址", item.address);
	          // }
	          // this._ertcIns.logger.log("item", item);
	          if (item.type === "outbound-rtp") {
	            // 计算上行的网络状态
	            // this._ertcIns.logger.log("关键帧编码数量：",item.keyFramesEncoded);
	            connectionState.keyFramesEncoded = item.keyFramesEncoded;
	            connectionState.packetsSent = item.packetsSent;
	            const bytesSent = item.bytesSent - pluginObj.bytesSent;
	            connectionState["bytesSent/s"] = bytesSent / 1024 / 2 * 8;
	            pluginObj.packetsSent = item.packetsSent;
	            pluginObj.bytesSent = item.bytesSent;
	          }
	        });
	        resolve(connectionState);
	      });
	    });
	  }
	  /**
	   * @description 重置房间内状态
	   * */
	  _resetRoomStatus() {
	    this._rtcType = null;
	    this._transactions = {};
	  }
	  /**
	   * @description 添加ertc重连待执行函数，在mqtt重连后触发
	   * */
	  _addErtcReconnect(fn) {
	    this._ertcIns.logger.log('add ertc reconnect');
	    if (this._transactions['ertc_reconnect']) {
	      const oldTransaction = this._transactions['ertc_reconnect'].bind(this);
	      this._transactions['ertc_reconnect'] = () => {
	        oldTransaction();
	        fn();
	      };
	    } else {
	      this._transactions['ertc_reconnect'] = fn.bind(this);
	    }
	  }
	}
	_defineProperty(E_MRTC, "EVENT", {
	  // REMOTE_STREAM_AVAILABLE_AMIXER: 'REMOTE_STREAM_AVAILABLE_AMIXER', // 远端混音流可用
	});

	var $ = _export;
	var iterate = iterate$7;
	var aCallable = aCallable$g;
	var anObject = anObject$l;
	var getIteratorDirect = getIteratorDirect$6;
	var iteratorClose = iteratorClose$b;
	var iteratorHelperWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$6;
	var apply = functionApply;
	var fails = fails$w;
	var $TypeError = TypeError;

	// https://bugs.webkit.org/show_bug.cgi?id=291651
	var FAILS_ON_INITIAL_UNDEFINED = fails(function () {
	  // eslint-disable-next-line es/no-iterator-prototype-reduce, es/no-array-prototype-keys, array-callback-return -- required for testing
	  [].keys().reduce(function () {/* empty */}, undefined);
	});
	var reduceWithoutClosingOnEarlyError = !FAILS_ON_INITIAL_UNDEFINED && iteratorHelperWithoutClosingOnEarlyError('reduce', $TypeError);

	// `Iterator.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.reduce
	$({
	  target: 'Iterator',
	  proto: true,
	  real: true,
	  forced: FAILS_ON_INITIAL_UNDEFINED || reduceWithoutClosingOnEarlyError
	}, {
	  reduce: function reduce(reducer /* , initialValue */) {
	    anObject(this);
	    try {
	      aCallable(reducer);
	    } catch (error) {
	      iteratorClose(this, 'throw', error);
	    }
	    var noInitial = arguments.length < 2;
	    var accumulator = noInitial ? undefined : arguments[1];
	    if (reduceWithoutClosingOnEarlyError) {
	      return apply(reduceWithoutClosingOnEarlyError, this, noInitial ? [reducer] : [reducer, accumulator]);
	    }
	    var record = getIteratorDirect(this);
	    var counter = 0;
	    iterate(record, function (value) {
	      if (noInitial) {
	        noInitial = false;
	        accumulator = value;
	      } else {
	        accumulator = reducer(accumulator, value, counter);
	      }
	      counter++;
	    }, {
	      IS_RECORD: true
	    });
	    if (noInitial) throw new $TypeError('Reduce of empty iterator with no initial value');
	    return accumulator;
	  }
	});

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise */

	function __awaiter(thisArg, _arguments, P, generator) {
	  function adopt(value) {
	    return value instanceof P ? value : new P(function (resolve) {
	      resolve(value);
	    });
	  }
	  return new (P || (P = Promise))(function (resolve, reject) {
	    function fulfilled(value) {
	      try {
	        step(generator.next(value));
	      } catch (e) {
	        reject(e);
	      }
	    }
	    function rejected(value) {
	      try {
	        step(generator["throw"](value));
	      } catch (e) {
	        reject(e);
	      }
	    }
	    function step(result) {
	      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
	    }
	    step((generator = generator.apply(thisArg, _arguments || [])).next());
	  });
	}

	class Logger {
	    constructor(sign) {
	        this.sign = '';
	        this.sign = sign || 'Finger';
	    }
	    success(title, message) {
	        return this.print('success', title, message);
	    }
	    info(title, message) {
	        return this.print('info', title, message);
	    }
	    warn(title, message) {
	        return this.print('warn', title, message);
	    }
	    error(title, message) {
	        return this.print('error', title, message);
	    }
	    wsSignalError(code, message, fileName, methodName, autoPrint = true) {
	        if (autoPrint) {
	            this.error('code: ' + code + '\n'
	                + 'message: ' + message + '\n'
	                + 'fileName: ' + fileName + '\n'
	                + 'methodName: ' + methodName);
	        }
	        const error = { code: code, message: message, fileName: fileName, methodName: methodName };
	        return error;
	    }
	    ;
	    print(level, title, message) {
	        if (message) {
	            if (this.debug) {
	                window.log(`[${this.sign}]`, message);
	            }
	        }
	        else {
	            if (this.debug) ;
	        }
	    }
	}

	const log$2 = new Logger("WSSignalingRequest");
	log$2.debug = true;
	/** 信令请求状态 */
	let RequestState = {
	    // 请求域名或IP地址
	    prefix: "",
	    // 重连需要的属性
	    reRequestQuery: {
	        userID: "",
	        serv: "",
	        conf: "",
	        token: "",
	        amixer: false,
	    },
	};
	/** 发送请求 */
	function request(options, reRequestQuery, prefix) {
	    // 0. 检查是否有域名，有则绑定（只有首次请求会触发）
	    RequestState.prefix = options.prefix ? options.prefix : RequestState.prefix;
	    if (prefix) {
	        RequestState.prefix = prefix;
	    }
	    // 设置重连参数
	    if (reRequestQuery) {
	        RequestState.reRequestQuery.userID = reRequestQuery.userID;
	        RequestState.reRequestQuery.serv = reRequestQuery.serv;
	        RequestState.reRequestQuery.conf = reRequestQuery.conf;
	        RequestState.reRequestQuery.token = reRequestQuery.token;
	        RequestState.reRequestQuery.amixer = reRequestQuery.amixer;
	    }
	    // 1. 转化body参数为字符串
	    let body = "";
	    if (options.data && typeof options.data === "object") {
	        let dataK_Array = Object.keys(options.data);
	        body = dataK_Array.reduce((prev, cur) => {
	            //  总值（换行）当前值
	            if (cur === "amixer") {
	                return `${prev}${cur}=${options.data[cur] ? 1 : 0}\r\n`;
	            }
	            else {
	                return `${prev}${cur}=${options.data[cur]}\r\n`;
	            }
	        }, "");
	    }
	    else {
	        body = options.data;
	    }
	    // 2. 转化params参数为字符串
	    let paramsStr = "";
	    if (options.params) {
	        let paramsKV_array = Object.keys(options.params);
	        let paramsKV_array_noNullnoUndefined = paramsKV_array.filter((key) => {
	            // 去除null和undefined
	            return options.params[key] !== null && options.params[key] !== undefined;
	        });
	        // 拼接
	        paramsStr = paramsKV_array_noNullnoUndefined
	            .map((key) => {
	            return `${key}=${options.params[key]}`;
	        })
	            .join("&");
	    }
	    // 3. 发送请求
	    return new Promise((resolve, reject) => {
	        // 发送请求
	        try {
	            fetch(`${RequestState.prefix}${options.path}${paramsStr ? "?" + paramsStr : ""}`, {
	                headers: Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers),
	                method: options.method,
	                body: body,
	            })
	                .then((response) => response.json())
	                .then((response_JSON) => {
	                if (response_JSON.code !== 0) {
	                    console.error("信令请求失败:", `${RequestState.prefix}${options.path}${paramsStr ? "?" + paramsStr : ""}`, response_JSON);
	                }
	                // console.log("response_JSON", response_JSON);
	                if (response_JSON.code == -2002 &&
	                    !(options.path.includes("hangup") || options.path.includes("free"))) {
	                    // 重连
	                    request({
	                        path: `/create/${RequestState.reRequestQuery.userID}`,
	                        method: "POST",
	                        data: {
	                            serv: RequestState.reRequestQuery.serv,
	                            conf: RequestState.reRequestQuery.conf,
	                            token: RequestState.reRequestQuery.token,
	                            amixer: RequestState.reRequestQuery.amixer && 1,
	                        },
	                        prefix: options.prefix,
	                    })
	                        .then(() => __awaiter(this, void 0, void 0, function* () {
	                        const rRes = yield request(options);
	                        resolve(rRes);
	                    }))
	                        .catch((err) => {
	                        reject(err);
	                    });
	                }
	                else {
	                    resolve(response_JSON);
	                }
	            })
	                .catch((err) => {
	                const error = log$2.wsSignalError(1, "request error: " + err, "WSSignalingRequest", "request");
	                reject(error);
	            });
	        }
	        catch (err) {
	            reject(err);
	        }
	    });
	}

	/** 请求封装 */
	/** 自己的ID（首次请求时保存） */
	let SignalingState = {
	    userID: ''
	};
	/**
	 * @description 提供信令服务器API访问
	 */
	class WSSignalingAPI {
	    /** 构造器 */
	    constructor() { }
	    ;
	    //   _______             __        __  __
	    //  |       \           |  \      |  \|  \
	    //  | $$$$$$$\ __    __ | $$____  | $$ \$$  _______
	    //  | $$__/ $$|  \  |  \| $$    \ | $$|  \ /       \
	    //  | $$    $$| $$  | $$| $$$$$$$\| $$| $$|  $$$$$$$
	    //  | $$$$$$$ | $$  | $$| $$  | $$| $$| $$| $$
	    //  | $$      | $$__/ $$| $$__/ $$| $$| $$| $$_____
	    //  | $$       \$$    $$| $$    $$| $$| $$ \$$     \
	    //   \$$        \$$$$$$  \$$$$$$$  \$$ \$$  \$$$$$$$
	    /** 创建ICE代理 */
	    static createIceProxy(options) {
	        return new Promise((resolve) => {
	            SignalingState.userID = options.userID;
	            // 1. 先释放ICE代理，防止上次ICE代理占用
	            const freePath = `/free/${SignalingState.userID}`;
	            fetch(`${options.prefix}${freePath}`, {
	                headers: {
	                    'Content-Type': 'application/json',
	                },
	                method: 'POST'
	            }).finally(() => {
	                // 2. 发送create请求
	                const result = request({
	                    path: `/create/${SignalingState.userID}`,
	                    method: 'POST',
	                    data: {
	                        serv: options.serv,
	                        conf: options.conf,
	                        token: options.token,
	                        amixer: options.amixer
	                    },
	                    prefix: options.prefix
	                }, {
	                    userID: options.userID,
	                    serv: options.serv,
	                    conf: options.conf,
	                    token: options.token,
	                    amixer: options.amixer
	                });
	                resolve(result);
	            });
	        });
	    }
	    /** 释放ICE代理 */
	    static freeIceProxy(reRequestQuery, prefix) {
	        return request({
	            path: `/free/${SignalingState.userID}`,
	            method: 'POST'
	        }, reRequestQuery, prefix);
	    }
	    /** 请求Offer */
	    static requestOffer(peerID, track = 0, offerType = 0, session = 'error') {
	        const typesString = ['video', 'audio', undefined, 'multi_audio'];
	        const type = typesString[offerType];
	        const data = {
	            mode: peerID ? 'sendonly' : 'recvonly'
	        };
	        if (type) {
	            data['type'] = type;
	        }
	        console.log("请求Offer", "SignalingState.userID", SignalingState.userID, "session", session);
	        return request({
	            path: `/offer/${SignalingState.userID}`,
	            method: 'POST',
	            params: {
	                peer: peerID,
	                track: track,
	                session: session
	            },
	            data,
	        });
	    }
	    /** 发送Answer */
	    static sendAnswer(peerID, answerSdp, session = 'error') {
	        // const typesString = [ 'video', 'audio', undefined, 'multi_audio'];
	        // const type = typesString[offerType];
	        const params = {
	            peer: peerID,
	            // track: track
	            session: session
	        };
	        // if(type) {
	        //   params['type'] = type;
	        // }
	        return request({
	            path: `/answer/${SignalingState.userID}`,
	            method: 'POST',
	            params,
	            data: answerSdp,
	        });
	    }
	    /** 挂断 */
	    static hangup(peerID = 0, session = 'error') {
	        // const typesString = [ 'video', 'audio', undefined, 'multi_audio'];
	        // const type = typesString[offerType];
	        const data = {
	            peer: peerID,
	            // type: type
	        };
	        return request({
	            path: `/hangup/${SignalingState.userID}`,
	            method: 'POST',
	            params: {
	                // track: track
	                session: session
	            },
	            data,
	        });
	    }
	    /** 切换轨道 */
	    static switchTrack(peerID = 0, track, session = 'error') {
	        return request({
	            path: `/setting/${SignalingState.userID}`,
	            method: 'POST',
	            params: {
	                peer: peerID,
	                session: session
	            },
	            data: JSON.stringify({
	                type: 'track',
	                setting: {
	                    track: track,
	                },
	            }),
	        });
	    }
	    static settingMCU(peerID = 0, track, session = 'error') {
	        // let t = "0x02";
	        let t;
	        if (track === 0) {
	            t = "0x01";
	        }
	        else if (track === 1) {
	            t = "0x02";
	        }
	        else {
	            t = "0x04";
	        }
	        // let t = track.toString(16);
	        // console.log("settingMCU", t);
	        return request({
	            path: `/setting/${SignalingState.userID}`,
	            method: 'POST',
	            params: {
	                peer: SignalingState.userID,
	                session: session
	            },
	            data: JSON.stringify({
	                type: 'deftrack',
	                setting: {
	                    mmask: t,
	                },
	            }),
	        });
	    }
	    /** 媒体状态变更 */
	    static mediaStateChange2(audioState, videoState, session = 'error') {
	        const setting = {};
	        if (audioState > -1) {
	            setting.audio = audioState;
	        }
	        if (videoState > -1) {
	            setting.video = videoState;
	        }
	        console.log("媒体状态变更", setting);
	        return request({
	            path: `/setting/${SignalingState.userID}`,
	            method: 'POST',
	            params: {
	                peer: SignalingState.userID,
	                session: session
	            },
	            data: JSON.stringify({
	                type: 'media',
	                setting: Object.assign({}, setting)
	            })
	        });
	    }
	    static mediaStateChange(audioState, videoState, session = 'error') {
	        return request({
	            path: `/setting/${SignalingState.userID}`,
	            method: 'POST',
	            params: {
	                peer: SignalingState.userID,
	                session: session
	            },
	            data: JSON.stringify({
	                type: 'media',
	                setting: {
	                    audio: audioState,
	                    video: videoState
	                }
	            })
	        });
	    }
	    /** 获取UserID */
	    static getUserID() {
	        return SignalingState.userID;
	    }
	    // 获取观众拉流的cdn地址
	    static getCdnUrl(params) {
	        return fetchData({
	            url: `${RequestState.prefix}/api/v3/ertc/live/audience/info`,
	            method: 'POST',
	            data: {
	                customId: params.customId,
	                subCustomIds: params.subCustomIds,
	                appId: params.appId,
	                strRoomId: params.strRoomId,
	                cdnStreamTypes: params.cdnStreamTypes,
	                cdnPlatformAbility: 1, // 网宿:1,腾讯:2, 网宿+腾讯:3
	            },
	            headerOptions: {
	                accessToken: params.accessToken,
	            }
	        });
	    }
	}

	const log$1 = new Logger("WSPeerConnection");
	log$1.debug = true;
	// let packetsLost = 0;
	// let packetsReceived = 0;
	/** offer类型 */
	var OfferType$1;
	(function (OfferType) {
	    OfferType[OfferType["Video"] = 0] = "Video";
	    OfferType[OfferType["Audio"] = 1] = "Audio";
	    OfferType[OfferType["Audio_Video"] = 2] = "Audio_Video";
	    OfferType[OfferType["Multi_Audio"] = 3] = "Multi_Audio";
	    OfferType[OfferType["Screen_Video"] = 4] = "Screen_Video";
	})(OfferType$1 || (OfferType$1 = {}));
	class WSPeerConnection {
	    /** 构造器 */
	    constructor(peerID, descOption, track = 0, offerType, stream, connectionID, SDKNO, cdnPrefix, stateCallback, networkCallback, person, ertcParams, cdnStreamTypes) {
	        this.descOption = descOption;
	        this._id = connectionID;
	        this._peerID = peerID;
	        // console.log("this._stream ", stream);
	        this._stream = stream;
	        this._trackID = track;
	        this._preTrackId = null; //用来在切换大小流的时候去更新cdn取流地址
	        this._offerType = offerType;
	        this.SDKNO = SDKNO;
	        this.cdnPrefix = cdnPrefix;
	        this.cdnUrl = null;
	        this.packetsReceived = 0;
	        this.nackCount = 0;
	        this.packersLost = 0;
	        this.keyFramesDecoded = 0;
	        this.QosValue = 0;
	        this.bytesReceived = 0;
	        // this._reConnectHandle = reConnectHandle;
	        this._event_signaling_change = stateCallback;
	        this._event_network_change = networkCallback;
	        this.person = person;
	        this.createTime = new Date();
	        this.ertcParams = ertcParams;
	        this.cdnStreamTypes = cdnStreamTypes;
	    }
	    setReconnectCb(cb) {
	        this.reconnectCb = cb;
	    }
	    setGetAccount(cb) {
	        this.getAccount = cb;
	    }
	    setDisconnectCb(cb) {
	        this.disconnectCb = cb;
	    }
	    setUserStreamTrackCb(cb) {
	        this.userStreamTrackCb = cb;
	    }
	    //   _______             __        __  __
	    //  |       \           |  \      |  \|  \
	    //  | $$$$$$$\ __    __ | $$____  | $$ \$$  _______
	    //  | $$__/ $$|  \  |  \| $$    \ | $$|  \ /       \
	    //  | $$    $$| $$  | $$| $$$$$$$\| $$| $$|  $$$$$$$
	    //  | $$$$$$$ | $$  | $$| $$  | $$| $$| $$| $$
	    //  | $$      | $$__/ $$| $$__/ $$| $$| $$| $$_____
	    //  | $$       \$$    $$| $$    $$| $$| $$ \$$     \
	    //   \$$        \$$$$$$  \$$$$$$$  \$$ \$$  \$$$$$$$
	    /** 连接对等端 */
	    connect(progress) {
	        // 1) 生成RTCPeerConnection
	        this._peerConnection = this._createPeerConnection(this._peerID);
	        // console.log("0连接对等端", this.descOption.desc, this.person ? this.person.nickname : "");
	        this.userStreamTrackCb(this.person, this._offerType, {
	            text: `连接对等端 `,
	            desc: `连接对等端`
	        });
	        // 2) 绑定事件或流
	        if (!this._peerID) {
	            // 如果是自己的RTCPeerConnection, 则绑定stream
	            if (this._peerConnection && this._stream) {
	                this._bindStream(this._stream);
	            }
	            else {
	                throw log$1.wsSignalError(2, "create RTCPeerConnection error: no RTCPeerConnection or MediaStream.", "WSPeerConnection", "constructor");
	            }
	        }
	        else {
	            // 如果是对等方的PeerConnection, 设置流绑定事件
	            this._peerConnection.ontrack = (e) => {
	                // console.log("this._peerConnection --- evt", e);
	                this.userStreamTrackCb(this.person, this._offerType, {
	                    text: `PeerConnection绑定轨道`,
	                    desc: `PeerConnection绑定轨道：${this._stream.id}`
	                });
	                this._stream.addTrack(e.track);
	            };
	        }
	        // 3) 协商
	        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
	            if (progress && progress.state === "closed") {
	                return reject("4 已经停止拉流");
	            }
	            else if (progress && progress.state === "normal") {
	                progress.setTask(true, "beforeRequestOffer");
	            }
	            this.userStreamTrackCb(this.person, this._offerType, {
	                text: `请求offer`,
	                desc: ` 请求offer`
	            });
	            this._peerConnection.onicecandidate = (e) => {
	                if (e) {
	                    try {
	                        console.log("this._peerConnection.onicecandidate", this.descOption.desc, this.person ? this.person.nickname : "没有person", "本地端口", e.candidate.port);
	                    }
	                    catch (error) {
	                        // console.error("onicecandidateerror", error);
	                    }
	                }
	            };
	            console.log("请求offer, ", this.descOption.desc, this.person ? this.person.nickname : "没有person");
	            return WSSignalingAPI.requestOffer(this._peerID, this._trackID, this._offerType, this._id)
	                .then((data) => __awaiter(this, void 0, void 0, function* () {
	                console.log("请求offer返回, ", this._offerType, this.descOption.desc, data);
	                this.userStreamTrackCb(this.person, this._offerType, {
	                    text: `请求offer返回`,
	                    desc: ` 请求offer返回, ${data.sdp}`
	                });
	                const sdp = data.sdp;
	                if (this._offerType === OfferType$1.Audio_Video || this._offerType === OfferType$1.Video || this._offerType === OfferType$1.Screen_Video) {
	                    yield WSSignalingAPI.settingMCU(this._peerID, this._trackID, this._id);
	                }
	                // 这个地方 有问题 ----
	                if (!sdp || !sdp.startsWith("v=")) {
	                    setTimeout(() => {
	                        // if (this.descOption.desc === "publishSelfVideo" ||this.descOption.desc === "publishSelfScreen" ) {
	                        //   // 推流断开连接
	                        //   console.log("是因为走到了这里吧？？？？！！！2222");
	                        //   if (this.disconnectCb) {
	                        //     this.disconnectCb(this);
	                        //   }
	                        //   return reject(data.msg);
	                        // } else {
	                        //   // 拉流触发重连
	                        // }
	                        return this._reconnect(resolve, reject);
	                    }, 300);
	                    // return reject(data.msg);
	                    return;
	                }
	                // if (!sdp.startsWith("v=")) {
	                //   log.error("requestOffer error: repetitive sdp.", sdp);
	                //   return reject({ message: "repetitive sdp.", sdp });
	                // }
	                const desc = new RTCSessionDescription({
	                    sdp: sdp,
	                    type: "offer",
	                });
	                // 2. sdp 协商
	                if (progress && progress.state === "closed") {
	                    return reject("5已经调用停止推流");
	                }
	                else if (progress && progress.state === "normal") {
	                    progress.setTask(true, "beforeSetRemoteDescription");
	                }
	                this._peerConnection
	                    .setRemoteDescription(desc)
	                    .then(() => __awaiter(this, void 0, void 0, function* () {
	                    if (progress && progress.state === "closed") {
	                        return reject("6已经调用停止推流");
	                    }
	                    else if (progress && progress.state === "normal") {
	                        progress.setTask(true, "beforeCreateAnswer");
	                    }
	                    return yield this._peerConnection.createAnswer();
	                }))
	                    .then((data) => {
	                    this.userStreamTrackCb(this.person, this._offerType, {
	                        text: `设置本地description`,
	                        desc: ` 设置本地description, ${data}`
	                    });
	                    if (progress && progress.state === "closed") {
	                        return reject("7已经调用停止推流");
	                    }
	                    else if (progress && progress.state === "normal") {
	                        progress.setTask(true, "beforeSetLocalDescription");
	                    }
	                    return this._peerConnection.setLocalDescription(data);
	                })
	                    .then(() => {
	                    if (progress && progress.state === "closed") {
	                        return reject("8已经调用停止推流");
	                    }
	                    else if (progress && progress.state === "normal") {
	                        progress.setTask(true, "beforeOniceconnectionstatechange");
	                    }
	                    if (this._peerConnection) {
	                        // 2. 绑定事件
	                        console.log("绑定事件", this.descOption.desc);
	                        this.userStreamTrackCb(this.person, this._offerType, {
	                            text: `注册事件监听`,
	                            desc: ` 注册事件监听`
	                        });
	                        this._peerConnection.oniceconnectionstatechange = (e) => {
	                            var _a;
	                            if (this._peerConnection) {
	                                this.userStreamTrackCb(this.person, this._offerType, {
	                                    text: `触发oniceconnectionstatechange事件，iceConnectionState: ${this._peerConnection.iceConnectionState}`,
	                                    desc: `触发oniceconnectionstatechange事件，iceConnectionState: ${this._peerConnection.iceConnectionState}`
	                                });
	                            }
	                            else {
	                                this.userStreamTrackCb(this.person, this._offerType, {
	                                    text: `触发oniceconnectionstatechange事件，this._peerConnection不存在了`,
	                                    desc: `触发oniceconnectionstatechange事件，this._peerConnection不存在了`
	                                });
	                            }
	                            if (!this._peerConnection) {
	                                return reject("this._peerConnection不存在");
	                            }
	                            if (progress && progress.state === "closed") {
	                                return reject("9已经调用停止推流");
	                            }
	                            else if (progress && progress.state === "normal") {
	                                progress.setTask(true, "oniceconnectionstatechangeing");
	                            }
	                            log$1.info(`connectionID: ${this._id} stream_id: ${this._peerID ? this._peerID : "self"} ice connection state chanage`, this._peerConnection.iceConnectionState);
	                            if (this._peerConnection.iceConnectionState == "disconnected" ||
	                                this._peerConnection.iceConnectionState == "closed" ||
	                                this._peerConnection.iceConnectionState == "failed" ||
	                                this._peerConnection.iceConnectionState == "new") {
	                                // 连接异常
	                                console.log("流媒体连接断开", this.person ? this.person.nickname : "", this.descOption.desc, this._peerConnection.iceConnectionState);
	                                if (this.disconnectCb) {
	                                    this.disconnectCb(this);
	                                }
	                                // 开启重连定时器
	                                log$1.warn(`开启重连倒计时。${this._peerID}`);
	                                this._clearReconnectTimer();
	                                this._reconnectTimer = setTimeout(() => {
	                                    // console.log("this._reconnectTimer 调用重连");
	                                    console.log("调用重连 this._peerConnection.iceConnectionState", this._peerConnection.iceConnectionState);
	                                    this._reconnect(resolve, reject);
	                                }, 5000);
	                            }
	                            if (this._peerConnection.iceConnectionState == "connected") {
	                                // 关闭重连定时器
	                                // 重连成功
	                                if (this.reconnectCb) {
	                                    this.reconnectCb(this);
	                                }
	                                this._clearReconnectTimer();
	                                if (progress && progress.state === "closed") {
	                                    // console.log("连接上了，也关闭");
	                                    progress.setTask(false, "close");
	                                    return reject("10已经调用停止推流");
	                                }
	                                else if (progress && progress.state === "normal") {
	                                    progress.setTask(true, "beforeOniceconnectionstatechange");
	                                }
	                                this.startConnectTime = new Date().getTime();
	                                WSSignalingAPI.sendAnswer(this._peerID, (_a = this._peerConnection.localDescription) === null || _a === void 0 ? void 0 : _a.sdp, this._id)
	                                    .then(() => {
	                                    this.userStreamTrackCb(this.person, this._offerType, {
	                                        text: `发送Answer`,
	                                        desc: ` 发送Answer`
	                                    });
	                                    // 4. 绑定信令状态获取事件
	                                    if (this._signaling_change_Timer) {
	                                        clearInterval(this._signaling_change_Timer);
	                                    }
	                                    this._signaling_change_Timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
	                                        // console.log("信令状态打印", this._peerConnection.connectionState, this._peerConnection.iceConnectionState);
	                                        if (this._peerConnection) {
	                                            this._peerConnection.iceConnectionState;
	                                        }
	                                        this._getSignalingState();
	                                    }), 2000);
	                                    setTimeout(() => {
	                                        if (this._peerConnection) {
	                                            this._peerConnection.getStats().then((data) => {
	                                                data.forEach((item) => {
	                                                    if (item.type === "remote-candidate") {
	                                                        console.log(this.descOption.desc, '远端端口信息:', item.port, "服务地址", item.address);
	                                                    }
	                                                });
	                                            });
	                                        }
	                                    }, 2000);
	                                    if (this.QosTimer) {
	                                        console.log("清理Qostimer333", this.descOption);
	                                        clearInterval(this.QosTimer);
	                                        this.QosTimer = null;
	                                        console.log("修改了QosValue值 1");
	                                        this.QosValue = 0;
	                                    }
	                                    const that = this;
	                                    this.QosTimer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
	                                        getQoSValue(this.descOption.desc, this._peerConnection).then(value => {
	                                            if (that.descOption.desc === "pullPeerVideoStream") ;
	                                            if (that.QosValue === value) {
	                                                if (that.descOption.desc === "pullPeerMixerAudioStream" || that.descOption.desc === "pullPeerScreenStream" || that.descOption.desc === "pullPeerVideoStream") ;
	                                                else if (that.descOption.desc === "publishSelfVideo" || that.descOption.desc === "publishSelfScreen") {
	                                                    // 推流
	                                                    that._stream.getTracks().forEach((track) => {
	                                                        // console.log("调用track 的end", this.descOption);
	                                                        that.userStreamTrackCb(that.person, that._offerType, {
	                                                            text: `调用轨道关闭`,
	                                                            desc: `调用轨道关闭: track.onended:${track.onended}`
	                                                        });
	                                                        track.stop();
	                                                        if (track.onended) {
	                                                            track.onended({ customerType: "noFrame" });
	                                                            console.log("清理Qostimer", this.descOption, this.person);
	                                                            clearInterval(that.QosTimer);
	                                                            that.QosTimer = null;
	                                                            that.QosValue = 0;
	                                                        }
	                                                    });
	                                                }
	                                            }
	                                            else {
	                                                // console.log("that.QosValue", that.descOption.desc,value);
	                                                if (value >= 0) {
	                                                    that.QosValue = value;
	                                                }
	                                            }
	                                        });
	                                    }), 60 * 1000);
	                                    if (this.descOption.desc === "publishSelfAudio") {
	                                        // 音频流:
	                                        //  上行 sender
	                                        this._peerConnection.getSenders().forEach((sender) => {
	                                            try {
	                                                const parameters = sender.getParameters();
	                                                if (!parameters.encodings || parameters.encodings.length === 0) {
	                                                    parameters.encodings = [{}];
	                                                }
	                                                parameters.encodings[0].priority = 'high'; // 可以是 'high', 'medium', 'low'
	                                                sender.setParameters(parameters);
	                                                console.log("设置发音频优先级成功, ", parameters);
	                                            }
	                                            catch (error) {
	                                                console.error("设置发音频优先级失败, ", error);
	                                            }
	                                        });
	                                        // const sender = this._peerConnection.addTrack(track);
	                                    }
	                                    setTimeout(() => {
	                                        // 延迟500毫秒，增加音频优先级
	                                    }, 500);
	                                    return resolve();
	                                })
	                                    .catch((err) => {
	                                    const error = log$1.wsSignalError(3, "SDP协商错误 : " + err, "WSPeerConnection", "connect");
	                                    return reject(error);
	                                });
	                            }
	                        };
	                    }
	                    else {
	                        return reject("this._peerConnection不存在");
	                    }
	                })
	                    .catch((err) => {
	                    console.error("拉流失败", err);
	                    throw err;
	                    // reject(err);
	                });
	            }))
	                .catch((err) => {
	                console.error("-------ws--peer---", err);
	                setTimeout(() => {
	                    // if (this.descOption.desc === "publishSelfVideo" ||this.descOption.desc === "publishSelfScreen" ) {
	                    //   // 推流断开连接
	                    //   console.log("是因为走到了这里吧？？？？！！！11111");
	                    //   if (this.disconnectCb) {
	                    //     this.disconnectCb(this);
	                    //   }
	                    //   reject(err);
	                    //     return
	                    // } else {
	                    //   // 拉流触发重连
	                    // }
	                    this._reconnect(resolve, reject);
	                }, 300);
	                resolve();
	                // reject(err);
	            });
	            // }, 1500);
	        }));
	    } // connect end
	    connectCDN() {
	        return __awaiter(this, void 0, void 0, function* () {
	            const type = this._offerType === 1 ? "audio" : "video";
	            // 声音是房间的，视频是针对个人的
	            let streamName;
	            if (type === "audio") {
	                streamName = `vcs_a_room_${this.SDKNO}`;
	            }
	            else {
	                // console.log("SDKNO", this.SDKNO, "person", this.person);
	                streamName = `vcs_v_user_${this.SDKNO}_${this._peerID}_${this._trackID}`;
	            }
	            // console.log("拉取流名称：", streamName);
	            this._peerConnection = this._createPeerConnection(this._peerID);
	            // 2) 绑定事件或流
	            if (!this._peerID) {
	                console.log("根本走不进来吧");
	                // 如果是自己的RTCPeerConnection, 则绑定stream
	                if (this._peerConnection && this._stream) {
	                    this._bindStream(this._stream);
	                }
	                else {
	                    throw log$1.wsSignalError(2, "create RTCPeerConnection error: no RTCPeerConnection or MediaStream.", "WSPeerConnection", "constructor");
	                }
	            }
	            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
	                this._peerConnection.addTransceiver(type, { direction: "recvonly" });
	                this._peerConnection.addEventListener("negotiationneeded", () => {
	                    this.connectPC(streamName).catch((e) => {
	                        // console.log("------------this.connectPC", e);
	                        reject(e);
	                    });
	                });
	                const peerConnection = this._peerConnection;
	                // this._peerConnection.addEventListener("icecandidate", function(evt) {
	                //   // console.info("拉流icecandidate: ", streamName, "_type", "icecandidate", evt.candidate);
	                // });
	                // this._peerConnection.addEventListener("iceconnectionstatechange", function(evt) {
	                //     console.info("拉流CDN：iceconnectionstatechange: ", streamName,"_type", "ICE connection state change", peerConnection.iceConnectionState);
	                // });
	                // this._peerConnection.oniceconnectionstatechange = () => {
	                //   console.info("拉流CDN：iceconnectionstatechange: ", streamName,"_type", "ICE connection state change", peerConnection.iceConnectionState);
	                // }
	                // 有流
	                const stm = this._stream;
	                this._peerConnection.ontrack = (evt) => {
	                    if (!stm) {
	                        return;
	                    }
	                    stm.addTrack(evt.track);
	                    // evt.track.onended = (event) => {
	                    //   // console.log("轨道 onended, 调用重连 ", this.descOption);
	                    //   // cdn轨道连接断开，走到这里
	                    //     console.info(`${evt.track.kind} ${evt.track.id} ${evt.track.label} track ended`, event.target);
	                    //     this.userStreamTrackCb(this.person, this._offerType, {
	                    //       text: `调用轨道关闭`,
	                    //       desc: `调用轨道关闭: track.onended:${evt.track.onended}`
	                    //     })
	                    // };
	                    // console.info(`${evt.track.kind} track got`, evt.track, evt.streams);
	                    evt.streams[0].onremovetrack = (event) => {
	                        console.info(`onremovetrack: ${event.track.kind} track removed`, event.track, stm);
	                        stm.removeTrack(event.track);
	                    };
	                };
	                // 断开
	                const that = this;
	                // this._peerConnection.addEventListener("connectionstatechange", function(evt) {
	                this._peerConnection.onconnectionstatechange = (evt) => {
	                    // console.info("cdn拉流 connection state: connectionstatechange", peerConnection.connectionState);
	                    switch (peerConnection.connectionState) {
	                        case "disconnected":
	                        case "failed":
	                        case "closed":
	                            console.info(`拉流${streamName} 断开`);
	                            // 自动重新拉流
	                            console.log(`ICE connection error:`, peerConnection);
	                            // 就是这里
	                            that._clearReconnectTimer();
	                            that._reconnectTimer = setTimeout(() => {
	                                console.log("触发 重连---");
	                                that._reconnect(resolve, reject);
	                            }, 5000);
	                            // peerConnection.restartIce();
	                            break;
	                        case "connected":
	                            console.info(`cdn拉流----${streamName} 已连接`);
	                            // console.log("注册了多少个？？？？？？？？", that.descOption.desc);
	                            if (that.descOption) {
	                                if (that._signaling_change_Timer) {
	                                    clearInterval(that._signaling_change_Timer);
	                                }
	                                // console.log("cdn注册了， 开始注册定时器_getSignalingState", that.descOption);
	                                that._signaling_change_Timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
	                                    that._getSignalingState();
	                                }), 2000);
	                            }
	                            // qos
	                            if (that.QosTimer) {
	                                console.log("清理Qostimer333", that.descOption);
	                                clearInterval(that.QosTimer);
	                                that.QosTimer = null;
	                                console.log("修改了QosValue值2");
	                                that.QosValue = 0;
	                            }
	                            that.QosTimer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
	                                getQoSValue(that.descOption.desc, that._peerConnection).then(value => {
	                                    // console.log("getQoSValue", that.descOption.desc, value);
	                                    if (that.QosValue === value) {
	                                        if (that.descOption.desc === "pullPeerMixerAudioStream" || that.descOption.desc === "pullPeerVideoStream") {
	                                            // 拉流
	                                            console.log("拉流时，10秒，无数据，触发重连", that.descOption, that.person);
	                                            // setTimeout(() => {
	                                            //   console.log("拉流时，10秒，无数据，触发重连22222222", that.descOption, that.person);
	                                            //   that._reconnect(()=> {}, ()=> {});
	                                            // }, 10 * 1000);
	                                        }
	                                        else if (that.descOption.desc === "publishSelfAudio" || that.descOption.desc === "publishSelfVideo" || that.descOption.desc === "publishSelfScreen") {
	                                            // 推流
	                                            that._stream.getTracks().forEach((track) => {
	                                                console.log("调用track 的end", that.descOption);
	                                                track.stop();
	                                                if (track.onended) {
	                                                    that.userStreamTrackCb(that.person, that._offerType, {
	                                                        text: `调用轨道关闭`,
	                                                        desc: `调用轨道关闭: track.onended:${track.onended}`
	                                                    });
	                                                    track.onended({ customerType: "noFrame" });
	                                                    console.log("清理Qostimer", that.descOption, that.person);
	                                                    clearInterval(that.QosTimer);
	                                                    that.QosTimer = null;
	                                                }
	                                            });
	                                        }
	                                    }
	                                    else {
	                                        // console.log("that.QosValue", that.descOption.desc,value);
	                                        that.QosValue = value;
	                                    }
	                                });
	                            }), 60 * 1000);
	                            resolve();
	                            break;
	                    }
	                };
	            }));
	        });
	    }
	    /** 断连对等端 */
	    disconnect(tentative = false) {
	        console.log("断连对等端 ", this.descOption.desc, this.person ? this.person.nickname : "");
	        this.userStreamTrackCb(this.person, this._offerType, {
	            text: `断连对等端`,
	            desc: `断连对等端`
	        });
	        new Date().getTime();
	        if (this.keyframeTimer) {
	            clearTimeout(this.keyframeTimer);
	            this.keyframeTimer = null;
	        }
	        if (this.QosTimer) {
	            console.log("清理Qostimer222", this.descOption, this.person);
	            clearTimeout(this.QosTimer);
	            this.QosTimer = null;
	            console.log("修改了QosValue值 3");
	            this.QosValue = 0;
	        }
	        if (this._event_signaling_change) {
	            const connectionState = {
	                id: this._id,
	                closed: true,
	            };
	            this._event_signaling_change(connectionState);
	        }
	        if (this.cdnPrefix) {
	            // 关闭cdn流，不用发送请求
	            return new Promise((resolve) => {
	                clearInterval(this._signaling_change_Timer);
	                this._clearStream(tentative);
	                if (!this._peerConnection) {
	                    return resolve();
	                }
	                this._peerConnection.close();
	                this._peerConnection = undefined;
	                this._senders = undefined;
	                return resolve();
	            });
	        }
	        return new Promise((resolve) => {
	            WSSignalingAPI.hangup(this._peerID, this._id).then(() => {
	                this.userStreamTrackCb(this.person, this._offerType, {
	                    text: `断连对等端成功`,
	                    desc: `断连对等端成功`
	                });
	            }).finally(() => {
	                // console.log(printCurrentTime(), "清理了 this._signaling_change_Timer", this.descOption);
	                clearInterval(this._signaling_change_Timer);
	                // this._signaling_change_Timer = null;
	                this._clearStream(tentative);
	                if (!this._peerConnection) {
	                    return resolve();
	                }
	                //
	                this._peerConnection.close();
	                this._peerConnection = undefined;
	                this._senders = undefined;
	                this.userStreamTrackCb(this.person, this._offerType, {
	                    text: `断连对等端成功后，清理流，关闭peerConnection， this._peerConnection ${this._peerConnection}`,
	                    desc: `断连对等端成功后，清理流，关闭peerConnection， this._peerConnection ${this._peerConnection}`
	                });
	                log$1.info(`销毁一个PeerConnection connectionID: ${this._id} stream_id: ${this._peerID ? this._peerID : "self"}`);
	                return resolve();
	            });
	        });
	    } // disconnect end
	    /** 切流 */
	    switchTrack(track) {
	        return __awaiter(this, void 0, void 0, function* () {
	            console.log("切流switchTrack", track);
	            // todo， 区分cdn
	            this.userStreamTrackCb(this.person, this._offerType, {
	                text: `切换轨道 轨道：${track}`,
	                desc: `切换轨道 轨道：${track}`
	            });
	            if (this.cdnPrefix) {
	                // 先关闭流，根据轨道号，重新拉流
	                yield this.disconnect(true);
	                // 这块风远原先的trackId值有点问题，大流传进来2，小流传进来1，导致trackId都被转换成1，cdn取流都取的大流。
	                // 由于我只涉及到cdn拉流，我这边统一校验track=1时为大流，track=0时为小流
	                if (track > 0) {
	                    this._trackID = 1;
	                }
	                else {
	                    this._trackID = track;
	                }
	                yield this.connectCDN();
	                return;
	            }
	            return new Promise((resolve, reject) => {
	                WSSignalingAPI.switchTrack(this._peerID, track, this._id)
	                    .then(() => {
	                    this.userStreamTrackCb(this.person, this._offerType, {
	                        text: `切换轨道成功 轨道：${track}`,
	                        desc: `切换轨道成功 轨道：${track}`
	                    });
	                    // 将信息改变
	                    this._trackID = track;
	                    return resolve();
	                })
	                    .catch((err) => {
	                    return reject(err);
	                });
	            });
	        });
	    }
	    /** 通知信令媒体状态 */
	    mediaStateChange(audioState, videoState) {
	        this.userStreamTrackCb(this.person, this._offerType, {
	            text: `通知信令媒体状态 audioState: ${audioState}, videoState: ${videoState}`,
	            desc: `通知信令媒体状态 audioState: ${audioState}, videoState: ${videoState}`
	        });
	        return WSSignalingAPI.mediaStateChange(audioState, videoState, this._id);
	    }
	    /** 获取PeerConnectionID */
	    getPeerConnectionID() {
	        return this._id;
	    } // getPeerConnectionID end
	    /** 获取连接的stream_id */
	    getPeerID() {
	        return this._peerID;
	    }
	    //  ______             __                                              __
	    // |      \           |  \                                            |  \
	    //  \$$$$$$ _______  _| $$_     ______    ______   _______    ______  | $$
	    //   | $$  |       \|   $$ \   /      \  /      \ |       \  |      \ | $$
	    //   | $$  | $$$$$$$\\$$$$$$  |  $$$$$$\|  $$$$$$\| $$$$$$$\  \$$$$$$\| $$
	    //   | $$  | $$  | $$ | $$ __ | $$    $$| $$   \$$| $$  | $$ /      $$| $$
	    //  _| $$_ | $$  | $$ | $$|  \| $$$$$$$$| $$      | $$  | $$|  $$$$$$$| $$
	    // |   $$ \| $$  | $$  \$$  $$ \$$     \| $$      | $$  | $$ \$$    $$| $$
	    //  \$$$$$$ \$$   \$$   \$$$$   \$$$$$$$ \$$       \$$   \$$  \$$$$$$$ \$$
	    //  todo 重连有问题
	    /** 创建RTCPeerConnection */
	    _createPeerConnection(id) {
	        // 1. 生成peerConnection对象并保存
	        if (this._peerConnection) {
	            return this._peerConnection;
	        }
	        let peerConnection = new RTCPeerConnection({
	        // iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
	        });
	        log$1.info(`创建一个PeerConnection: connectionID: ${this._id} stream_id: ${this._peerID ? this._peerID : "self"},类型：${this.descOption.desc}`);
	        return peerConnection;
	    }
	    /** 自动重连 */
	    _reconnect(resolveCb, rejectCb) {
	        // console.trace();
	        console.log("触发重连", this.descOption.desc, new Date(), this.person ? this.person.nickname : "");
	        this.userStreamTrackCb(this.person, this._offerType, {
	            text: `触发重连`,
	            desc: `触发重连`
	        });
	        // 判断下，是不是从外面关闭了，如果从外面关闭了，则不重连了
	        if (this.QosTimer) {
	            console.log("触发重连,关闭质量监测的时间函数", this.descOption);
	            clearInterval(this.QosTimer);
	            this.QosTimer = null;
	            this.QosValue = 0;
	        }
	        if (!this._peerConnection) {
	            console.log("当前流不存在peerConnection，认为已经调用关闭了");
	            return;
	        }
	        // 触发重连后，应该关闭质量监测的时间函数，防止重复调用重连
	        this.disconnect(true).finally(() => __awaiter(this, void 0, void 0, function* () {
	            const connect = this.cdnPrefix ? this.connectCDN.bind(this) : this.connect.bind(this);
	            connect()
	                .then(() => {
	                console.log("this.descOption.desc", this.descOption.desc);
	                // 问题再这里
	                if (this.descOption.desc === "publishSelfAudio" || this.descOption.desc === "publishSelfVideo" || this.descOption.desc === "publishSelfScreen") {
	                    console.log("获取account信息", this.getAccount());
	                    const { vstate, astate } = this.getAccount();
	                    // 1是上传  0 是不上传
	                    this.mediaStateChange(astate, vstate);
	                }
	                // 这行代码 我觉得有问题，但是不敢改
	                if (this._trackID != 0 && this.descOption.desc !== "pullPeerScreenStream") {
	                    this.switchTrack(this._trackID);
	                }
	                // 清除重连定时器
	                this._clearReconnectTimer();
	                console.log("重连成功 执行 , this.reconnectCb", this);
	                if (this.reconnectCb) {
	                    // console.log("真的执行了么");
	                    this.reconnectCb(this);
	                }
	                log$1.success(`重连成功 peerID: ${this._peerID} , 类型: ${this.descOption.desc}`, this.person);
	                resolveCb();
	            })
	                .catch((err) => {
	                console.error("重连失败", err);
	                this.userStreamTrackCb(this.person, this._offerType, {
	                    text: `触发重连失败`,
	                    desc: `触发重连失败`
	                });
	                console.error(`重连失败 peerID: ${this._peerID}`, this.person);
	                this._clearReconnectTimer();
	                this._reconnectTimer = setTimeout(() => {
	                    console.log(`重连失败 peerID: ${this._peerID}`, this.person);
	                    this._reconnect(resolveCb, rejectCb);
	                }, 5000);
	                rejectCb();
	            });
	        }));
	    }
	    /** 绑定流 */
	    _bindStream(stream) {
	        this._senders = new Array();
	        stream.getTracks().forEach((track) => {
	            const sender = this._peerConnection.addTrack(track);
	            this._senders.push(sender);
	        });
	    }
	    /** 清空流 */
	    _clearStream(tentative = false) {
	        if (this._senders) {
	            let length = this._senders.length;
	            for (let i = 0; i < length; i++) {
	                let sender = this._senders.shift();
	                if (sender) {
	                    try {
	                        this._peerConnection.removeTrack(sender);
	                    }
	                    catch (error) {
	                        console.log("清空流报错", error);
	                    }
	                }
	            }
	        }
	        if (this._peerID && this._stream) {
	            this._stream.getTracks().forEach((track) => {
	                this._stream.removeTrack(track);
	            });
	        }
	        if (!tentative && this._stream) {
	            this._stream = undefined; // 将流置空
	            this._clearReconnectTimer();
	        }
	    }
	    /** 清除重连定时器 */
	    _clearReconnectTimer() {
	        if (this._reconnectTimer) {
	            clearTimeout(this._reconnectTimer);
	            console.log("清除重连定时器", this.descOption.desc);
	        }
	        this._reconnectTimer = undefined;
	    }
	    connectPC(streamName) {
	        return __awaiter(this, void 0, void 0, function* () {
	            var _a, _b, _c;
	            // console.log("触发connectPC", new Date());
	            let offer = yield this._peerConnection.createOffer();
	            yield this._peerConnection.setLocalDescription(offer);
	            if (this.cdnPrefix && (!this.cdnUrl || this._trackID !== this._preTrackId)) {
	                console.log('是cdn拉流，获取cdn拉流地址');
	                const isVideoStream = this.cdnStreamTypes === 1 || this.cdnStreamTypes === 2;
	                const videoStreamType = this._trackID === 1 ? 2 : 1;
	                const cdnStreamTypes = isVideoStream ? videoStreamType : this.cdnStreamTypes;
	                const res = yield WSSignalingAPI.getCdnUrl({
	                    customId: this.ertcParams.userId,
	                    subCustomIds: this._peerID || null,
	                    appId: this.ertcParams.appId,
	                    strRoomId: this.ertcParams.roomId,
	                    cdnStreamTypes: cdnStreamTypes,
	                    cdnPlatformAbility: 1, // 网宿:1,腾讯:2, 网宿+腾讯:3
	                    accessToken: this.ertcParams.accessToken
	                });
	                if (((_a = res === null || res === void 0 ? void 0 : res.meta) === null || _a === void 0 ? void 0 : _a.code) === 200) {
	                    const cdnEndpoint = res.data.cdnEndpoint;
	                    const streamUrls = (_c = (_b = res.data.streamInfos) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.streamUrls;
	                    streamUrls && Object.keys(streamUrls).forEach((key) => {
	                        this.cdnUrl = `${cdnEndpoint}${streamUrls[key]}`;
	                    });
	                    this._preTrackId = this._trackID;
	                }
	            }
	            // url拼上?wsSecret=xx&wsTime=yy
	            let rsp = yield fetch(`${this.cdnUrl}`, {
	                method: "POST",
	                headers: {
	                // "Content-Type": "application/json",
	                },
	                body: JSON.stringify({
	                    version: "v1.0",
	                    sessionId: "sidtest",
	                    localSdp: offer,
	                }),
	                mode: "cors",
	            });
	            let rspJson = yield rsp.json();
	            // console.log("rspJson", new Date(),rspJson);
	            if (rspJson.code != 200) {
	                throw rsp;
	            }
	            else {
	                // console.error("拉流失败", "cdn answer sdp", rspJson);
	                if (this._peerConnection) {
	                    return this._peerConnection.setRemoteDescription(rspJson.remoteSdp);
	                }
	            }
	        });
	    }
	    /** 获取信令状态 */
	    _getSignalingState() {
	        if (!this._peerConnection) {
	            return;
	        }
	        // console.log("获取信令状态");
	        this._peerConnection.getStats().then((data) => {
	            if (!this._peerConnection) {
	                console.log("调用this._peerConnection.getStats()失败, 没有this._peerConnection", this.descOption.desc, this.person ? this.person.nickname : "");
	                return;
	            }
	            const pcs = this._peerConnection.connectionState;
	            const pics = this._peerConnection.iceConnectionState;
	            // console.log("获取信令状态---getStats", pcs, pics);
	            if (pcs === "closed" || pcs === "failed" || pcs === "disconnected" || pics === "closed" || pics === "disconnected" || pics === "failed") {
	                // 都是连接失败
	                if (this._peerConnection.oniceconnectionstatechange) {
	                    // console.log("执行this._peerConnection.oniceconnectionstatechange");
	                    this._peerConnection.oniceconnectionstatechange({});
	                    clearInterval(this._signaling_change_Timer);
	                    this._signaling_change_Timer = null;
	                }
	                else if (this._peerConnection.onconnectionstatechange) {
	                    // console.log("执行this._peerConnection.onconnectionstatechange");
	                    this._peerConnection.onconnectionstatechange({});
	                    clearInterval(this._signaling_change_Timer);
	                    this._signaling_change_Timer = null;
	                }
	                else {
	                    //
	                    console.log("没有注册oniceconnectionstatechange 函数", this.descOption.desc);
	                }
	            }
	            const connectionState = {
	                id: this._id,
	                customType: this.descOption.desc,
	                time: new Date().getTime(),
	                startConnectTime: this.startConnectTime,
	                connectionState: this._peerConnection.connectionState,
	                iceConnectionState: this._peerConnection.iceConnectionState,
	                person: this.person
	            };
	            data.forEach((item) => {
	                if (item.type === "candidate-pair") {
	                    // console.log("???", item);
	                    connectionState.candidateState = item.state;
	                }
	                if (item.type === "transport") {
	                    connectionState.dtlsState = item.dtlsState;
	                }
	                if (item.type === "media-source") {
	                    if (item.audioLevel && item.audioLevel != -1) {
	                        connectionState.audioLevel = item.audioLevel;
	                    }
	                }
	                if (item.audioLevel && item.audioLevel != -1) {
	                    connectionState.audioLevel = item.audioLevel;
	                }
	                if (item.type === "inbound-rtp") {
	                    if (!this.descOption) {
	                        return;
	                    }
	                    connectionState.type = item.mediaType;
	                    connectionState.keyFramesDecoded = item.keyFramesDecoded;
	                    const currentPacketsReceived = item.packetsReceived - this.packetsReceived;
	                    const diffNackPackages = item.nackCount - this.nackCount;
	                    const totalPackages = currentPacketsReceived + diffNackPackages;
	                    const packersLost = item.packetsLost - this.packersLost;
	                    const packetLoss = diffNackPackages / totalPackages;
	                    const packetLossAfter = packersLost / currentPacketsReceived;
	                    const bytesReceived = item.bytesReceived - this.bytesReceived;
	                    connectionState.keyFramesDecodedGap = item.keyFramesDecoded - this.keyFramesDecoded;
	                    connectionState.afterPackersLost = packetLossAfter || 0;
	                    connectionState.beforePackersLost = packetLoss || 0;
	                    connectionState.packetsReceived = item.packetsReceived;
	                    connectionState["bytesReceived/s"] = bytesReceived / 1024 / 2;
	                    // connectionState["packetsReceived/s"] = currentPacketsReceived / 2;
	                    this.keyFramesDecoded = item.keyFramesDecoded;
	                    this.nackCount = item.nackCount;
	                    this.packetsReceived = item.packetsReceived;
	                    this.packersLost = item.packetsLost;
	                    this.bytesReceived = item.bytesReceived;
	                    if (this.descOption.desc !== "pullPeerScreenStream") {
	                        // 共享
	                        return;
	                    }
	                }
	                // if (item.type === "remote-candidate") {
	                //   console.log('远端端口信息:', item.port, "服务地址", item.address);
	                // }
	                // console.log("item", item);
	                if (item.type === "outbound-rtp") {
	                    // 计算上行的网络状态
	                    // console.log("关键帧编码数量：",item.keyFramesEncoded);
	                    connectionState.keyFramesEncoded = item.keyFramesEncoded;
	                    connectionState.packetsSent = item.packetsSent;
	                    const bytesSent = item.bytesSent - this.bytesSent;
	                    connectionState["bytesSent/s"] = bytesSent / 1024 / 2 * 8;
	                    // console.log("connectionState",item.bytesSent, this.bytesSent, bytesSent, connectionState);
	                    this.packetsSent = item.packetsSent;
	                    this.bytesSent = item.bytesSent;
	                    // keyFramesEncoded 关键帧编码数量
	                    // packetsSent 已发送的数据包数量
	                    //
	                }
	            });
	            this.userStreamTrackCb(this.person, this._offerType, {
	                text: `传输信息`,
	                desc: `${JSON.stringify({
                    pcCandidateState: this._peerConnection ? this._peerConnection.connectionState : "未连接",
                    pcIceCandidateState: this._peerConnection ? this._peerConnection.iceConnectionState : "未连接",
                    candidateState: connectionState.candidateState,
                    dtlsState: connectionState.dtlsState,
                    icecandidateState: connectionState.icecandidateState
                })}`
	            });
	            this._event_signaling_change(connectionState);
	        });
	    }
	}
	function getQoSValue(type, peerConnection) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (!peerConnection) {
	            console.log(type, "getQoSValue---- 不存在peerConnection 返回了0");
	            return -1;
	        }
	        const streamType = (type === "pullPeerMixerAudioStream" || type === "pullPeerVideoStream" || type === "pullPeerScreenStream") ? "inbound-rtp" : "outbound-rtp";
	        const packetType = {
	            "publishSelfAudio": "packetsSent",
	            "publishSelfScreen": "keyFramesEncoded",
	            "pullPeerMixerAudioStream": "packetsReceived",
	            "pullPeerVideoStream": "keyFramesDecoded",
	            "publishSelfVideo": "keyFramesEncoded",
	            "pullPeerScreenStream": "keyFramesDecoded"
	        };
	        return new Promise((resolve, reject) => {
	            // console.log("peerConnection.state", peerConnection.iceConnectionState,peerConnection );
	            // if (peerConnection.connectionState === "closed") {
	            //   console.log("执行了， peerConnection.onconnectionstatechange()");
	            //   peerConnection.onconnectionstatechange({} as any);
	            // }
	            // if (peerConnection.iceConnectionState === "closed") {
	            //   peerConnection.oniceconnectionstatechange({} as any);
	            // }
	            peerConnection.getStats().then((data) => {
	                let value = -1;
	                let n = 0;
	                data.forEach(item => {
	                    if (item.type === streamType) {
	                        n++;
	                        // console.log("data", type, packetType[type], item[packetType[type]]);
	                        value = item[packetType[type]];
	                    }
	                });
	                if (n === 0) {
	                    console.log("getQoSValue---- 没有取导数据，返回了0");
	                }
	                return resolve(value);
	            });
	        });
	    });
	}

	const log = new Logger('WSSignaling');
	// import { getCDN } from "../api/controls";
	log.debug = true;
	/** offer类型 */
	var OfferType;
	(function (OfferType) {
	    OfferType[OfferType["Video"] = 0] = "Video";
	    OfferType[OfferType["Audio"] = 1] = "Audio";
	    OfferType[OfferType["Audio_Video"] = 2] = "Audio_Video";
	    OfferType[OfferType["Multi_Audio"] = 3] = "Multi_Audio";
	    OfferType[OfferType["Screen_Video"] = 4] = "Screen_Video";
	})(OfferType || (OfferType = {}));
	class WSSignaling {
	    /** 构造函数 */
	    constructor(options, test) {
	        this.smallScreenPersons = [];
	        // public controlsApiIns: ControlsApi;
	        /** 连接集合 */
	        this.connections = {};
	        String.prototype.hashCode = function () {
	            if (Array.prototype.reduce) {
	                return this.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
	            }
	            var hash = 0;
	            if (this.length === 0)
	                return hash;
	            for (var i = 0; i < this.length; i++) {
	                var character = this.charCodeAt(i);
	                hash = ((hash << 5) - hash) + character;
	                hash = hash & hash; // Convert to 32bit integer
	            }
	            return hash;
	        };
	        if (!test) ;
	        else {
	            console.log("未启用代理");
	        }
	        const uuid$1 = uuid.v4();
	        const userID = options.userID;
	        const conf = options.conf;
	        this.roomNo = options.roomNo;
	        this.SDKNO = options.conf;
	        this.cdnPrefix = options.cdnPrefix;
	        // this.controlsApiIns = options.controlsApiIns;
	        // console.log("????ooptions.conf----------ooptions.conf", options.conf);
	        const amixer = options.amixer;
	        this._confuuid = uuid$1 + userID + conf + amixer;
	        RequestState.prefix = options.prefix;
	        this.smallScreenPersons = [];
	        this.ertcParams = options.ertcParams;
	    }
	    ;
	    //   _______             __        __  __
	    //  |       \           |  \      |  \|  \
	    //  | $$$$$$$\ __    __ | $$____  | $$ \$$  _______
	    //  | $$__/ $$|  \  |  \| $$    \ | $$|  \ /       \
	    //  | $$    $$| $$  | $$| $$$$$$$\| $$| $$|  $$$$$$$
	    //  | $$$$$$$ | $$  | $$| $$  | $$| $$| $$| $$
	    //  | $$      | $$__/ $$| $$__/ $$| $$| $$| $$_____
	    //  | $$       \$$    $$| $$    $$| $$| $$ \$$     \
	    //   \$$        \$$$$$$  \$$$$$$$  \$$ \$$  \$$$$$$$
	    /** 初始化 */
	    // public init(options: CreateIceProxy_Options): Promise<WSSignaling> {
	    //   return new Promise((resolve , reject) => {
	    //   });
	    // }
	    syncStream(smallScreenPersons) {
	        this.smallScreenPersons = smallScreenPersons;
	        // 同步流媒体
	    }
	    /** 连接 */
	    connect(_a) {
	        return __awaiter(this, arguments, void 0, function* ({ peerID, track = 0, offerType, stream, isScreen = false, descOption = { desc: '' }, person, progress, cdnStreamTypes }) {
	            // console.log("???? 获取account   ---", WSSignaling.event_get_account());
	            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
	                offerType == OfferType.Video || offerType == OfferType.Screen_Video ? 'video' : 'mixAudio';
	                /** connection 唯一ID */
	                const connectionID = String(Math.abs((String(peerID) + String(track) + String(offerType) + this._confuuid + (String(isScreen ? 'screen' : 'normal'))).hashCode()));
	                // 1. 生成WSPeerConnection
	                WSSignaling.event_user_stream_track(person, offerType, {
	                    desc: `调用信令连接: peerID:${peerID} track: ${track}, connectionID:${connectionID}, 连接方式${descOption.desc}, cdn: ${this.cdnPrefix}, SDKNO:${this.SDKNO}`,
	                    text: `调用信令连接`
	                });
	                let peerConnection = new WSPeerConnection(peerID, descOption, track, offerType, stream, connectionID, this.SDKNO, this.cdnPrefix, WSSignaling.event_signaling_change, () => { }, person, this.ertcParams, cdnStreamTypes);
	                /** 先断连上一次的连接 */
	                peerConnection.setReconnectCb(WSSignaling.event_reconnect_signaling);
	                peerConnection.setDisconnectCb(WSSignaling.event_disconnect_signaling);
	                peerConnection.setGetAccount(WSSignaling.event_get_account);
	                peerConnection.setUserStreamTrackCb(WSSignaling.event_user_stream_track);
	                if (progress && progress.state === "closed") {
	                    // 任务被结束
	                    return resolve("3.1已经停止拉流");
	                }
	                else if (progress && progress.state === "normal") {
	                    progress.setTask(true, "beforeSignalingInsDisConnect", {
	                        connectionID: connectionID
	                    });
	                }
	                this.disconnect(connectionID, true)
	                    .then((e) => {
	                })
	                    .catch(err => {
	                })
	                    .finally(() => {
	                    if (progress && progress.state === "closed") {
	                        return resolve("3已经停止拉流");
	                    }
	                    else if (progress && progress.state === "normal") {
	                        progress.setTask(true, "beforeConnect");
	                    }
	                    // 2. 连接信令服务器取流
	                    // 改成连接前，就将连接，放进连接池里
	                    const pcID = peerConnection.getPeerConnectionID();
	                    this.connections[pcID] = peerConnection;
	                    if (this.cdnPrefix) {
	                        peerConnection.connectCDN()
	                            .then(() => {
	                            // console.log("connectCDN完成", stream);
	                            // 获取连接ID
	                            // const pcID = peerConnection.getPeerConnectionID();
	                            // 保存连接
	                            // this.connections[pcID] = peerConnection;
	                            return resolve(pcID);
	                        }).catch((err) => {
	                            peerConnection.disconnect();
	                            return reject(err);
	                        });
	                    }
	                    else {
	                        peerConnection.connect(progress)
	                            .then(() => {
	                            // 获取连接ID
	                            // const pcID = peerConnection.getPeerConnectionID();
	                            // 保存连接
	                            // this.connections[pcID] = peerConnection;
	                            return resolve(pcID);
	                        }).catch((err) => {
	                            WSSignaling.event_user_stream_track(person, offerType, {
	                                desc: `调用信令连接失败: error:${err}`,
	                                text: `调用信令连接失败: peerID:${peerID} track: ${track}, connectionID:${connectionID}, 连接方式${descOption.desc}, cdn: ${this.cdnPrefix}, SDKNO:${this.SDKNO}`,
	                            });
	                            peerConnection.disconnect();
	                            return reject(err);
	                        });
	                    }
	                });
	            }));
	        });
	    }
	    ;
	    // --------断了 要清除
	    /** 断连 */
	    disconnect(cpID, isRemoveTimer) {
	        return new Promise((resolve, reject) => {
	            const peerConnection = this.connections[cpID];
	            // 过滤不存在的ID
	            if (!peerConnection) {
	                // const error = log.wsSignalError( 4, `search connection error: connection id is error. ${cpID}`, 'WSSignaling', 'disconnect', false);
	                // console.error(`search connection error: connection id is error. ${cpID}`, 'WSSignaling', 'disconnect');
	                // return reject(error);
	                return resolve();
	            }
	            // 断连
	            console.log("断开连接,id:", cpID, "类型", peerConnection.descOption.desc, "关闭用户：", peerConnection.person ? peerConnection.person.nickname : "self");
	            peerConnection.disconnect()
	                .then(() => {
	                // 清除对象
	                console.log("delete this.connections[cpID]; ", this.connections, cpID);
	                // 是否清除重连定时器
	                if (isRemoveTimer && peerConnection && peerConnection._reconnectTimer) {
	                    clearTimeout(peerConnection._reconnectTimer);
	                    peerConnection._reconnectTimer = null;
	                }
	                delete this.connections[cpID];
	                return resolve();
	            }).catch(err => {
	                console.error("peerConnection.disconnect() error: ", err);
	            });
	        });
	    }
	    ;
	    /** 释放ICE代理 */
	    freeSignaling() {
	        console.log("释放ICE代理", this.connections);
	        // 获取所有的PeerConnectionID
	        const keys = Object.keys(this.connections);
	        // 清空所有的ICE代理
	        for (let ID of keys) {
	            this.disconnect(ID, true);
	        }
	        if (this.timer) {
	            this.smallScreenPersons = [];
	            clearImmediate(this.timer);
	        }
	        // 释放ICE代理
	        setTimeout(() => {
	            WSSignalingAPI.freeIceProxy();
	        }, 800);
	    }
	    /** 切换轨道 */
	    switchTrack(connectID, track) {
	        return new Promise((resolve, reject) => {
	            if (this.connections[connectID]) {
	                this.connections[connectID].switchTrack(track)
	                    .then(() => {
	                    resolve();
	                }).catch(err => {
	                    reject(err);
	                });
	            }
	            else {
	                const error = log.wsSignalError(8, 'switch track is not connect.', 'WSSignaling', 'disconnect');
	                return reject(error);
	            }
	        });
	    }
	    /** 获取UserID */
	    getUserID() {
	        return WSSignalingAPI.getUserID();
	    }
	    /** 媒体状态变更 */
	    mediaStateChange(peerID = 0, audioState, videoState) {
	        for (let connect in this.connections) {
	            if (!this.connections[connect].getPeerID()) {
	                this.connections[connect].mediaStateChange(audioState ? 1 : 0, videoState ? 1 : 0);
	            }
	        }
	    }
	    /** 媒体状态变更 */
	    mediaStateChangeByPeerID(peerID = 0, audioState, videoState) {
	        // console.log("媒体状态变更", peerID, this.connections);
	        const connect = this.connections[peerID];
	        if (!connect || connect.getPeerID()) {
	            return;
	        }
	        // console.log("媒体状态变更 ", connect);
	        return connect.mediaStateChange(audioState ? 1 : 0, videoState ? 1 : 0);
	    }
	    // 获取所有链接
	    getConnections() {
	        return this.connections;
	    }
	}

	// import { commonFun } from '../decorators/index.js'

	const loggerMrtc = logger.proxy({
	  name: 'MRTC'
	});
	const deffer = function () {
	  // 创建新的对象实例
	  let deferred = {};

	  // 构造 promise 对象
	  deferred.promise = new Promise((resolve, reject) => {
	    deferred.resolve = resolve;
	    deferred.reject = reject;
	  });

	  // 不加超时时间，避免影响其他逻辑
	  // if (timeout) {
	  //   setTimeout(() => {
	  //     deferred.reject(errorCode({ key: 'ERR_TIMEOUT', msg: 'timeout' }))
	  //   }, timeout)
	  // }

	  // 返回包含了 promise 的对象
	  return deferred;
	};
	class D_MRTC {
	  /**
	   * @description 构造函数
	   * @param {Object} params
	   * @param {Object} params.vcsIns // 风远sdk实例
	   * @param {Object} params.vcsTypes // 风远sdk的常量枚举值
	   * @param {boolean} [params.debug] // 是否开启调试模式，日志打印
	   * @param {boolean} [params.exportLogs] // 是否支持日志导出
	   * @param {string} [params.domain] // api域名前缀
	   * */
	  constructor(params) {
	    // 否则走后续初始化逻辑
	    // 钉钉rtc初始化
	    // const RTCEngine = DingRTC;
	    this._drtcIns = DingRTC.createClient();
	    this._vcsIns = params.vcsIns;

	    // 初始变量
	    this._rtcType = localStorage.getItem('mrtc-rtcType') || null; // 当前sdk rtc接入类型 vcs | ertc，在加入房间接口获取
	    this._globalParams = params; // 初始化的全局参数
	    this._enterRoomParams = {}; // 入会参数
	    this._transactions = {}; // 事务队列，用来处理异步操作
	    this._role = null; // 当前用户角色，默认为普通用户

	    this._vcsBeforeEnterRoomEventTransactions = {}; // 进入房间前的事务列表
	    this._mqttNetworkState = null; // 风远mqtt网络状态
	    this._drtcNetworkState = null; // 钉钉rtc sdk网络连接状态
	    this._localVideoTrack = null; // 本地采集的视频轨道
	    this._localAudioTrack = null; // 本地采集的音频轨道
	    this._localScreenVideoTrack = null; // 本地采集的屏幕轨道

	    this._remoteMixAudioStream = null; // 混音音频流
	    this._remoteMixAudioTrack = null; // 混音音频轨道
	    this._remoteScreenStream = null; // 远端用户的屏幕流
	    this._remoteScreenTrack = null; // 远端用户的屏幕轨道
	    this._remoteUserStreams = {}; // 远端用户的视频流
	    this._remoteUserTracks = {}; // 远端用户的视频轨道
	    // this._remoteUserMicMuted = {} // 远端用户音频是否静音（兼容native sdk）

	    this._drtcMediaReconnectFailTrackIds = []; // drtc媒体流重连失败的trackIds

	    this._remoteVideoStatsIntervalId = null; // 远端视频流统计信息定时器id
	    this._remoteVidioStats = null; // 远端视频流统计信息

	    // 初始化函数
	    this._initFunction();

	    // 重写 vcsIns 的内部方法
	    this._resetVcsFunction();

	    // 初始化监听事件
	    this._initDrtcEvent();

	    // audioSFU：从sub audio 结果中 getMediaStreamTrack 无法在自定义的audio元素播放的问题，join 之前调用设置DingRTC.setClientConfig({audioSFU: false}) 
	    // disableTransportCC：网络优化，切换成REMB模式
	    DingRTC.setClientConfig({
	      audioSFU: false
	    });
	    // 默认订阅小流，会影响到屏幕共享流订阅，在屏幕共享流订阅后要调用setRemoteVideoStreamType转成高清
	    this._drtcIns.setRemoteDefaultVideoStreamType('low');

	    // 返回proxy,捕获未定义函数和_rtcType为vcs时，代理到vcsIns
	    return new Proxy(this, {
	      get: function (target, prop) {
	        const isUndefinedPros = !(prop in target);
	        const isVcs = target._rtcType === 'vcs';
	        const isSelfProperty = ['_drtcIns', '_vcsIns', '_globalParams', '_rtcType', '_transactions', '_vcsBeforeEnterRoomEventTransactions', '_mqttNetworkState'].includes(prop); // 是否是私有变量，主要是两个实例对象，避免 _rtcType 是 vcs的时候，从 _vcsIns里去找 mrtc的函数和变量
	        const isSelfFun = ['_listenVcsBeforeEnterRoomEvent'].includes(prop); // 是否是私有函数
	        const isRebuild = ['enterRoom'].includes(prop); // 是否在业务层已改造传参的函数
	        const isExtend = ['getRtcType'].includes(prop); // 是否是扩展函数，无论是vcs还是ertc都对外暴露，可以调用
	        if (!isSelfProperty && !isSelfFun && !isRebuild && !isExtend && (isUndefinedPros || isVcs)) {
	          if (typeof target._vcsIns[prop] === 'function') {
	            return target._vcsIns[prop].bind(target._vcsIns);
	          } else {
	            return target._vcsIns[prop];
	          }
	        }
	        return target[prop];
	      },
	      set: function (target, prop, value) {
	        // 在业务层调用赋值的时候，避免直接赋值到当前实例上，而取值却到_vcsIns上，导致获取不到的情况，统一赋值取值都去_vcsIns上
	        const isUndefinedPros = !(prop in target);
	        if (isUndefinedPros) {
	          target._vcsIns[prop] = value;
	        } else {
	          target[prop] = value;
	        }
	        return true;
	      }
	    });
	  }
	  /**
	   *  @description 初始化函数
	  */
	  _initFunction() {
	    // 发布流函数添加节流
	    // this.setCameraEnableThrottle = throttle(this._setCameraEnable.bind(this), 300, { trailing: false })
	    // this.setMicroEnableThrottle = throttle(this._setMicroEnable.bind(this), 300, { trailing: false })
	  }
	  /**
	   * @description 重写vcsIns的内部方法
	   * */
	  _resetVcsFunction() {
	    var _this = this;
	    // 重写 onMqttState 方法，补充断网情况下的逻辑
	    const originFn = this._vcsIns.onMqttState.bind(this._vcsIns);
	    this._vcsIns.onMqttState = function () {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	      // action, command, result
	      loggerMrtc.log('mqtt状态变化：', args);
	      if (args[0] === 'mqtt' && args[1] === 'network' && args[2] === false) {
	        // 识别到断网
	        _this._mqttNetworkState = 'offline';
	      }
	      if (args[0] === 'mqtt' && args[1] === 'network' && args[2] && _this._mqttNetworkState === 'offline') {
	        // 判断条件遵循vcsIns中的逻辑
	        _this._mqttNetworkState = 'online';

	        // 如果drtc已经断开连接，手动重新入会
	        if (_this._drtcNetworkState === 'disconnected') {
	          // 直接抛出异常，退出
	          loggerMrtc.log('mqtt重连成功，检测到drtc已经disconnected, 直接报错退出');
	          _this._vcsIns.notice(_this._globalParams.vcsTypes.NoticeType.imposedExit, '网络连接超时，自动退出');
	          // drtc重新入会
	          // loggerMrtc.log('mqtt重连成功，检测到drtc已经disconnected, 触发drtc重新入会')
	          // this._rejoin()

	          return originFn(...args);
	        }
	        if (_this._drtcNetworkState && _this._drtcNetworkState !== 'connected') {
	          // 如果drtc还处于重连中，则将vcs的重连待执行逻辑放到队列中，等drtc重连成功后再执行
	          loggerMrtc.log('mqtt重连成功，添加待执行函数，等待drtc重连后执行');
	          _this._transactions['mqtt_reconnect'] = () => {
	            originFn && originFn(...args);
	          };
	          return;
	        } else {
	          // 如果drtc已经连接，则执行drtc的重连副作用函数
	          loggerMrtc.log('mqtt重连成功，执行drtc重连事务');
	          setTimeout(_this._transactions['drtc_reconnect'], 500);
	        }
	      }
	      return originFn(...args);
	    };
	  }
	  /**
	   * @description 初始化drtc事件监听
	   * */
	  _initDrtcEvent() {
	    var _this2 = this;
	    ['user-joined', 'user-published', 'user-unpublished', 'user-info-updated', "connection-state-change", 'sub-media-reconnect-started', "sub-media-reconnect-succeeded", 'sub-media-reconnect-failed', 'pub-media-reconnect-started', 'pub-media-reconnect-succeeded', 'pub-media-reconnect-failed', 'user-mic-audio-muted', "network-quality"].forEach(value => {
	      let fn = null;
	      // 用户入会，触发风远的通知，兼容人数一致的问题
	      if (['user-joined'].includes(value)) {
	        fn = user => {
	          this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.throwRoomMemberInfo, this._vcsIns.getRoom());
	        };
	      }
	      // 视频推送通知(为了兼容小程序端，要通过判断mute/unmute消息来触发订阅，而不是publish/unpublish)
	      if (['user-info-updated'].includes(value)) {
	        fn = (uid, msg, auxiliary) => {
	          if (['mute-video', 'unmute-video'].includes(msg) && this._vcsIns.getAccount().stream_id != uid && !auxiliary) {
	            var _vcsRoomInfo$persons, _this$_drtcIns$remote;
	            loggerMrtc.log('mrtc接收到drtc的user-info-updated事件后，要替换视频的用户id：', uid);
	            // 这里只更新视频流，音频流放在user-mic-audio-muted中更新，为了兼容native sdk
	            // 视频流
	            const vcsRoomInfo = lodashEs.cloneDeep(this._vcsIns.getRoom());
	            const vcsPerson = (_vcsRoomInfo$persons = vcsRoomInfo.persons) === null || _vcsRoomInfo$persons === void 0 ? void 0 : _vcsRoomInfo$persons.find(person => person.stream_id === uid);
	            const drtcPerson = (_this$_drtcIns$remote = this._drtcIns.remoteUsers) === null || _this$_drtcIns$remote === void 0 ? void 0 : _this$_drtcIns$remote.find(item => item.userId === uid);
	            loggerMrtc.log(`vcs person.vstate：${vcsPerson.vstate}`);
	            loggerMrtc.log(`remoteUser.hasVideo：${drtcPerson.hasVideo} remoteUser.videoMuted：${drtcPerson.videoMuted}`);

	            // 这里不去触发onNotifyRoomEvent，媒体状态完全依赖风远会控状态更新
	            // loggerMrtc.log('mrtc触发vcs视频更新')
	            // this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.throwRoomMemberInfo, vcsRoomInfo);
	          }
	        };
	      }
	      if (['user-published', 'user-unpublished'].includes(value)) {
	        fn = (user, mediaType, auxiliary) => {
	          // 远程发布信息
	          loggerMrtc.log(value, `user：${JSON.stringify(user)}, mediaType：${mediaType}, auxiliary：${auxiliary}`);

	          // 屏幕共享流，拦截
	          if (mediaType === 'video' && auxiliary) {
	            if (['user-published'].includes(value)) {
	              var _this$_vcsIns$getRoom;
	              const person = (_this$_vcsIns$getRoom = this._vcsIns.getRoom().persons) === null || _this$_vcsIns$getRoom === void 0 ? void 0 : _this$_vcsIns$getRoom.find(item => item.stream_id === user.userId);
	              // 在on的时候，已经拦截了屏幕共享流开启的上报，统一在stream-added事件中上报
	              // mrtc触发vcs屏幕共享
	              loggerMrtc.log('mrtc触发vcs屏幕共享');
	              this._vcsIns.roomInfo.event_startSharingScreen({
	                id: person.id,
	                // 这里要传personId
	                // index: this._vcsIns.roomInfo._room.sharingScreenIndex, // 需要找苏鹤工确认一下这个index的作用
	                index: null,
	                type: 3,
	                isFromMrtc: true // 标识是否是stream-added事件触发的，并非原先的 event_startSharingScreen 必须参数，而是额外添加的，在on的拦截函数中会判断，并删除。
	              });
	            }
	          }
	        };
	      }

	      // 音频推送通知（兼容native sdk） // 不走这边的逻辑了，用风远的会控媒体状态来判断音频
	      // if (['user-mic-audio-muted'].includes(value)) {
	      //   fn = (uid, muted) => {
	      //     if (this._vcsIns.getAccount().stream_id != uid) { // 字符串与数字比较
	      //       loggerMrtc.log(value, `uid：${uid}, muted：${muted}`)
	      //       this._remoteUserMicMuted[uid] = muted
	      //       const vcsRoomInfo = cloneDeep(this._vcsIns.getRoom())
	      //       vcsRoomInfo.persons?.forEach(person => {
	      //         if (person.stream_id === uid) {
	      //           const remoteUser = this._drtcIns.remoteUsers?.find((item) => item.userId === uid)

	      //           if (remoteUser) {
	      //             loggerMrtc.log(`vcs person.astate：${person.astate}`)
	      //             loggerMrtc.log(`remoteUser muted:${muted}`)
	      //             person.astate = !muted ? 0 : 1
	      //             this._vcsIns.roomInfo.setAudioState(person.id.toString(), person.astate)
	      //           }
	      //         }
	      //       })
	      //       loggerMrtc.log('mrtc触发vcs音频更新')
	      //       this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.throwRoomMemberInfo, vcsRoomInfo);
	      //     }
	      //   }
	      // }

	      // drtc媒体重连更新变化
	      if (['sub-media-reconnect-started', "sub-media-reconnect-succeeded", 'sub-media-reconnect-failed'].includes(value)) {
	        fn = function () {
	          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	          }
	          loggerMrtc.log(`drtc监听${value}事件：`, args);
	          if (["sub-media-reconnect-succeeded", "sub-media-reconnect-started"].includes(value)) {
	            try {
	              // drtc媒体更新完毕
	              const trackId = args[0];
	              // 混音流
	              if (trackId === _this2._remoteMixAudioTrack.trackId) {
	                var _this2$_remoteMixAudi;
	                // 混音流由于不会重新订阅，所以需要在这边进行重新赋值
	                loggerMrtc.log('drtc 混音流重连，重新对混音流进行赋值', _this2._remoteMixAudioTrack.getMediaStreamTrack());
	                _this2._updateStreamTrack(_this2._remoteMixAudioStream, (_this2$_remoteMixAudi = _this2._remoteMixAudioStream.getAudioTracks()) === null || _this2$_remoteMixAudi === void 0 ? void 0 : _this2$_remoteMixAudi[0], value === "sub-media-reconnect-succeeded" && _this2._remoteMixAudioTrack.getMediaStreamTrack());
	                if (value === "sub-media-reconnect-started") {
	                  // 通知vcs媒体流连接断开
	                  _this2._vcsIns._signaling_disconnect({
	                    descOption: {
	                      desc: 'pullPeerMixerAudioStream'
	                    }
	                  });
	                }
	                return;
	              }
	              // 视频、屏幕共享流
	              const screenUser = _this2._drtcIns.remoteUsers.find(item => item.hasAuxiliary && item.auxiliaryTrack && item.auxiliaryTrack.trackId === trackId); // 是否是屏幕分享
	              const videoUser = _this2._drtcIns.remoteUsers.find(item => item.hasVideo && item.videoTrack && item.videoTrack.trackId === trackId); // 是否是视频流
	              // 更新屏幕共享流
	              if (screenUser) {
	                var _this2$_remoteScreenS;
	                loggerMrtc.log('远端有屏幕流，drtc重新对屏幕流进行赋值', screenUser.auxiliaryTrack.getMediaStreamTrack());
	                _this2._updateStreamTrack(_this2._remoteScreenStream, (_this2$_remoteScreenS = _this2._remoteScreenStream.getVideoTracks()) === null || _this2$_remoteScreenS === void 0 ? void 0 : _this2$_remoteScreenS[0], value === "sub-media-reconnect-succeeded" && screenUser.auxiliaryTrack.getMediaStreamTrack());
	                // this._remoteScreenTrack = screenUser.auxiliaryTrack // 忘记注释的原因是什么了，应该是重连后trackId也不会变，不需要重新赋值。
	              }
	              // 更新视频流
	              if (videoUser) {
	                var _this2$_remoteUserStr;
	                loggerMrtc.log(`更新用户${videoUser.userId}的视频流`);
	                _this2._updateStreamTrack(_this2._remoteUserStreams[videoUser.userId], (_this2$_remoteUserStr = _this2._remoteUserStreams[videoUser.userId].getVideoTracks()) === null || _this2$_remoteUserStr === void 0 ? void 0 : _this2$_remoteUserStr[0], value === "sub-media-reconnect-succeeded" && videoUser.videoTrack.getMediaStreamTrack());
	                // this._remoteUserTracks[videoUser.userId] = videoUser.videoTrack
	              }
	              if ((screenUser || videoUser) && value === "sub-media-reconnect-succeeded") {
	                // 通知vcs媒体流重连成功
	                const id = _this2._vcsIns.roomInfo.getID((screenUser === null || screenUser === void 0 ? void 0 : screenUser.userId) || (videoUser === null || videoUser === void 0 ? void 0 : videoUser.userId));
	                const person = _this2._vcsIns.roomInfo.getPeer(id);
	                loggerMrtc.log(`通知vcs，用户${person.nickname}媒体流重连成功`, person, id);
	                _this2._vcsIns._signaling_reconnect({
	                  person
	                });
	              }
	            } catch (error) {
	              loggerMrtc.log('sub-media-reconnect-succeeded/started 报错：', error);
	            }
	          }
	          if (["sub-media-reconnect-failed"].includes(value)) {
	            // drtc媒体重连失败,记录下失败的trackId，在信令服务reconnected之后，进行重新拉流
	            const trackId = args[0];
	            _this2._drtcMediaReconnectFailTrackIds.push(trackId);
	          }
	        };
	      }

	      // drtc 与服务器的连接状态发生改变回调。
	      if (["connection-state-change"].includes(value)) {
	        fn = (curState, prevState, reason) => {
	          loggerMrtc.log(`drtc连接状态变化，curState：${curState} prevState：${prevState} reason：${reason}`);
	          this._drtcNetworkState = curState;
	          if (curState === 'connected' && prevState === 'reconnecting') {
	            // drtc重连上了
	            if (this._mqttNetworkState === 'online' && this._transactions['mqtt_reconnect']) {
	              // 如果mqtt先重连的，则执行mqtt的队列事务
	              loggerMrtc.log('drtc重连成功，执行mqtt重连事务');
	              this._transactions['mqtt_reconnect']();
	              delete this._transactions['mqtt_reconnect'];
	              setTimeout(this._reconnectEffect.bind(this), 500);
	            } else {
	              loggerMrtc.log('drtc重连成功，添加待执行函数，等待mqtt重连后执行');
	              // 如果drtc先重连，则将drtc的重连待执行逻辑放到队列中，等mqtt重连后再执行
	              this._transactions['drtc_reconnect'] = () => this._reconnectEffect();
	            }
	          }
	          if (curState === 'disconnected' && this._transactions['mqtt_reconnect']) {
	            // 方案1：直接抛出异常，退出
	            loggerMrtc.log('drtc disconnected，且mqtt也已重连，执行报错退出操作');
	            this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.imposedExit, '网络连接超时，自动退出');
	            // 方案2：mqtt已经重连成功，而drtc才disconnected，则执行drtc的rejoin以及mqtt的队列事务
	            // loggerMrtc.log('drtc disconnected，执行mqtt重连事务，且drtc重新入会')
	            // this._rejoin()
	            this._transactions['mqtt_reconnect']();
	            delete this._transactions['mqtt_reconnect'];
	          }
	        };
	      }

	      // 监听本地上下行网络质量变化（每2s触发一次）
	      if (['network-quality'].includes(value)) {
	        fn = (uplinkNetworkQuality, downlinkNetworkQuality) => {
	          // drtc 0：网络状态未知，1 网络极佳 2 网络较好 3 网络一般 4 网络较差 5 网络极差 6 网络已断开
	          // 风远 0:unkown, 1:网络极差， 2:网络差 3：网络一般， 4：网络好
	          const networkMap = {
	            0: 0,
	            1: 4,
	            2: 4,
	            3: 3,
	            4: 2,
	            5: 1,
	            6: 1
	          };
	          // 比较网络质量是否变化
	          if (networkMap[uplinkNetworkQuality] !== this._lastUplinkNetworkQuality) {
	            loggerMrtc.log('netwrok有变化，触发extend_info更新');
	            this._lastUplinkNetworkQuality = networkMap[uplinkNetworkQuality];
	            this._vcsIns.setControlsAccount({
	              net_level: networkMap[uplinkNetworkQuality] || 0
	            });
	            this._vcsIns.roomClient.heartbeat();
	          }
	        };
	      }
	      fn && this._drtcIns.on(value, fn);
	    });
	  }

	  /**
	   * @description 加入房间
	   * @param {Object} params
	   * @param {Object} params.vcsParams
	   * @param {Object} params.vcsParams.roomOption
	   * @param {string} params.vcsParams.roomOption.room_no // 会议ID
	   * @param {string} [params.vcsParams.roomOption.password] // 会议密码
	   * @param {string} [params.vcsParams.roomOption.device_id] // 设备id
	   * @param {string} [params.vcsParams.roomOption.upload_id] // ？
	   * @param {string} [params.vcsParams.roomOption.lineID] // 线路id
	   * @param {boolean} params.vcsParams.amixer // 是否混音
	   * @param {Object} params.vcsParams.accountData
	   * @param {string} params.vcsParams.accountData.audio_state // 入会是否开启音频
	   * @param {string} params.vcsParams.accountData.video_state // 入会是否开启视频
	   * @param {string} params.vcsParams.accountData.nickname // 入会昵称
	   * @param {string} [params.vcsParams.inviterUid] // 邀请人uid
	   * @param {string} [params.vcsParams.webinar_invitation_link_code] // ？
	   * @param {string} [params.vcsParams.test] // ？
	   * @param {Object} params.ertcParams
	   * @param {string} params.ertcParams.appId // 控制台应用id
	   * @param {string} params.ertcParams.roomId // 房间id
	   * @param {string} params.ertcParams.userId // 用户id
	   * @param {string} params.ertcParams.accessToken // 用户资源token
	   * @param {string} params.ertcParams.domain // 域名前缀，会覆盖实例化时候的入参domain
	   * @param {Object} params.drtcParams
	   * @param {string} params.drtcParams.appId // 钉钉rtc控制台应用id
	   * @param {string} params.drtcParams.channel // 房间id
	   * @param {string} params.drtcParams.uid // 用户id（stream_id）
	   * @param {string} params.drtcParams.userName // 用户名称
	   * @param {string} params.drtcParams.token // 用户token
	   * @param {boolean} params.drtcParams.initMicMuted // 音频静音状态初始值
	   * */
	  enterRoom(params) {
	    const deffered = deffer();
	    this._listenVcsBeforeEnterRoomEvent();
	    // 风远加入房间（透传）
	    const vcsPromise = this._vcsIns.enterRoom(params.vcsParams.roomOption, params.vcsParams.amixer, params.vcsParams.accountData, params.vcsParams.inviterUid, params.vcsParams.webinar_invitation_link_code);
	    vcsPromise.then(res => {
	      const enterRoomData = this._vcsIns.getEnterRoomData();
	      loggerMrtc.log('风远加入房间成功：', res);
	      if ((enterRoomData === null || enterRoomData === void 0 ? void 0 : enterRoomData.rtc_mode) === 1) {
	        // 钉钉rtc 会议
	        this._rtcType = 'drtc';
	        this._enterRoomParams = params;
	        // drtc加入房间
	        loggerMrtc.log('drtc加入房间信息：', params.drtcParams);
	        // 调用vcsIns的发送心跳，将初始的麦克风/摄像头状态传给服务端。由于mqtt连接后，业务层还未绑定networkStateChange，导致入会后无法第一时间触发 networkStateChange、在业务层触发 syncSelfState，从而发送首个心跳包，导致无法将初始的麦克风/摄像头状态传给服务端，在设置了全员静音的情况下会有bug，所以这边兼容
	        //  后续优化方案：1.将觅讯业务层http入会接口和sdk入会拆开来，先拿到会议类型，优先让drtc入会，drtc的监听事件先缓存起来，等风远入会后再执行。
	        this._vcsIns.roomClient.heartbeat();

	        // 本地缓存mrtc入房信息
	        localStorage.setItem('mrtc-enterRoomParams', JSON.stringify(params));
	        if (enterRoomData.conf.type === 5 && enterRoomData.role === 6) {
	          // 研讨会，且身份是观众
	          loggerMrtc.log('检测到当前为研讨会，身份是观众，不执行drtc入会');
	          this._role = 'audience';
	          this._createSiganling();
	          deffered.resolve(res);
	        } else {
	          // 常规会议或者研讨会嘉宾，则执行drtc入会
	          this._drtcIns.join(params.drtcParams).then(async res2 => {
	            // this._vcsRoomInfo = resClone
	            deffered.resolve(res);

	            // 等待1000ms后执行，避免页面还没添加监听事件，导致vcs触发的事件无法触发
	            setTimeout(() => {
	              this._triggerVcsBeforeEnterRoomEvent();
	              this._connectEffect();
	              this._joinEffect();
	            }, 1000);
	            loggerMrtc.log('drtc加入房间成功', this._drtcIns);
	          }).catch(err => {
	            // ertc加入房间失败，退出风远和自研房间，光退出风远房间不行，其他端的用户列表好像是匹配自研的入房信息。
	            this.leave();
	            deffered.reject({
	              code: '100001',
	              msg: err.message || err
	            });
	          });
	        }
	      } else {
	        // 风远rtc 会议
	        this._rtcType = 'vcs';
	        deffered.resolve(res);
	      }
	      localStorage.setItem('mrtc-rtcType', this._rtcType);
	      loggerMrtc.log(`当前会议类型：${this._rtcType}`, enterRoomData);
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description 离开房间
	   * */
	  leave() {
	    const deffered = deffer();
	    // 风远离开房间（透传）
	    const vcsPromise = this._vcsIns.leave();
	    // ertc离开房间
	    const drtcPromise = this._drtcIns.leave();
	    // 重置实例状态
	    this._resetRoomStatus();
	    Promise.all([vcsPromise, drtcPromise]).then(res => {
	      deffered.resolve(true);
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description 刷新房间
	   * */
	  refreshRoom() {
	    loggerMrtc.log('进入 refreshRoom 函数');
	    const deffered = deffer();
	    // 风远刷新房间
	    const vcsPromise = this._vcsIns.refreshRoom();
	    const hasEnterRoom = this._vcsIns.enterRoomLoading || this._vcsIns.enterRoomData && this._vcsIns.enterRoomData.room;
	    vcsPromise.then(res => {
	      // 如果有数据，说明不是刷新页面，而是首次进入房间，直接返回，避免drtc重复进入房间（放在promise请求之前就获取数据，是避免到这一步的时候，数据已经有了，导致判断出错）
	      if (hasEnterRoom) {
	        deffered.resolve(res);
	        return;
	      }
	      const mrtcEnterRoomParams = JSON.parse(localStorage.getItem('mrtc-enterRoomParams'));
	      const enterRoomData = this._vcsIns.getEnterRoomData();
	      this._enterRoomParams = mrtcEnterRoomParams;
	      if (enterRoomData.conf.type === 5 && enterRoomData.role === 6) {
	        // 研讨会 & 观众，不执行drtc入会
	        loggerMrtc.log('研讨会 & 观众，refreshRoom之后不执行drtc入会');
	        this._role = 'audience';
	        this._createSiganling();
	        deffered.resolve(res);
	        return;
	      }
	      loggerMrtc.log('refreshRoom刷新房间，drtc重新入会，参数：', mrtcEnterRoomParams.drtcParams);
	      // drtc加入房间
	      this._drtcIns.join(mrtcEnterRoomParams.drtcParams).then(async res2 => {
	        deffered.resolve(res);

	        // 延迟500ms执行，避免业务层一些事件还没绑定
	        setTimeout(() => {
	          this._connectEffect();
	          this._joinEffect();
	        }, 500);
	      }).catch(err => {
	        // ertc加入房间失败，退出风远和自研房间，光退出风远房间不行，其他端的用户列表好像是匹配自研的入房信息。
	        this.leave();
	        deffered.reject({
	          code: '100001',
	          msg: `drtc入会失败：${err.message || err}`
	        });
	      });
	    }).catch(deffered.reject);
	    return deffered.promise;
	  }
	  /**
	   * @description drtc重新入会
	   * */
	  _rejoin() {
	    // drtc重新加入房间
	    const mrtcEnterRoomParams = JSON.parse(localStorage.getItem('mrtc-enterRoomParams'));
	    // 特殊处理：重新入会，重置本地屏幕共享状态，兼容断网重连超过30秒的情况下，drtc重新入会，上层调用 stopPublishSelfScreen，drtc unpublish失败，导致本地屏幕流无法被清理。
	    if (this._localScreenVideoTrack) {
	      this._localScreenVideoTrack.close();
	      this._localScreenVideoTrack = null;
	      this._vcsIns.setScreenEnable(false, 2);
	    }
	    this._drtcIns.join(mrtcEnterRoomParams.drtcParams).then(async res2 => {
	      this._connectEffect();
	      this._rejoinEffect();
	    }).catch(err => {
	      // ertc加入房间失败，退出风远和自研房间，光退出风远房间不行，其他端的用户列表好像是匹配自研的入房信息。
	      this.leave();
	    });
	  }
	  /**
	   * @description 推送视频流，流数据来源于vcsIns.setVideoEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  publishSelfVideo() {
	    var _this$_vcsIns$videoSt;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    loggerMrtc.log('进入 publishSelfVideo 函数');
	    const deffered = deffer();
	    // 复用易会项目中的权限判断
	    // 1. 会控状态
	    if (this._vcsIns.controlsAccount.video_state == 2) {
	      const error = this._vcsIns.vcsErr.throwErr(707, `推流失败${index}：视频权限被主持人禁用。`, "publishSelfVideo");
	      return Promise.reject(error);
	    }
	    // 2. 获取流
	    const streamID = this._vcsIns.videoStreams[index] ? (_this$_vcsIns$videoSt = this._vcsIns.videoStreams[index]) === null || _this$_vcsIns$videoSt === void 0 ? void 0 : _this$_vcsIns$videoSt.streamID : undefined;
	    if (!streamID) {
	      const error = this._vcsIns.vcsErr.throwErr(9001, `推流失败${index}：流编号错误。`, "publishSelfVideo");
	      return Promise.reject(error);
	    }
	    this._vcsIns.media.getStream(streamID).then(async stream => {
	      try {
	        var _this$_drtcIns$localT;
	        // 判断一下已经存在推流（兼容业务上有时候会出现publish already的报错，drtc不支持重复推流）
	        const _localVideoTrack = (_this$_drtcIns$localT = this._drtcIns.localTracks) === null || _this$_drtcIns$localT === void 0 ? void 0 : _this$_drtcIns$localT.find(item => item.source === 'camera');
	        if (_localVideoTrack) {
	          loggerMrtc.log('drtc已经存在视频推流，调用unpublish先取消推流');
	          await this._drtcIns.unpublish(_localVideoTrack);
	        }
	      } catch (error) {
	        loggerMrtc.error('判断drtc是否存在视频推流报错：', error);
	      }
	      this._localVideoTrack = await DingRTC.createCustomVideoTrack({
	        mediaStreamTrack: stream.getVideoTracks()[0]
	      });
	      this._drtcIns.publish(this._localVideoTrack).then(res => {
	        // this._localVideoTrack.setMuted(false) // publish之后不用unmute，其他端在收到published之后会检测mute状态，进行补发
	        const pcID = randomString(12);
	        // 复用易会的更新状态逻辑 4. 更新状态信息
	        this._vcsIns.videoStreams[index] && (this._vcsIns.videoStreams[index].connectID = pcID);
	        this._vcsIns._updateSocket_addVideoTrack(index);
	        this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.peerPublish, {
	          account: this._vcsIns.account,
	          srcObject: stream
	        });
	        if (!this._vcsIns.controlsAccount["connections"]) {
	          this._vcsIns.controlsAccount["connections"] = new Array();
	        }
	        this._vcsIns.controlsAccount["connections"].push({
	          connectID: pcID,
	          streamID: streamID,
	          index: index,
	          type: this._globalParams.vcsTypes.IFConnectionType.Video,
	          stream: stream
	        });

	        // todo 
	        if (this._vcsIns.roomClient) {
	          setTimeout(() => {
	            this._vcsIns.roomClient.heartbeat();
	          }, 500);
	        }
	        deffered.resolve(stream);
	      }).catch(err => {
	        deffered.reject(err.message || err);
	      });
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 停止推送视频流，流数据来源于vcsIns.setVideoEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  stopPublishSelfVideo() {
	    var _this$_vcsIns$videoSt2;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    loggerMrtc.log('进入 stopPublishSelfVideo 函数');
	    const deffered = deffer();
	    // 复用易会中的状态变更
	    if (this._vcsIns.controlsAccount) {
	      this._vcsIns.controlsAccount.video_state = 1;
	    }
	    const pcID = (_this$_vcsIns$videoSt2 = this._vcsIns.videoStreams[index]) === null || _this$_vcsIns$videoSt2 === void 0 ? void 0 : _this$_vcsIns$videoSt2.connectID;
	    if (!pcID) {
	      console.error(`停止推流视频${index}出错：没有相应的连接ID。stopPublishSelfVideo`);
	      // const error = vcsErr.throwErr(
	      //   1002,
	      //   `停止推流视频${index}出错：没有相应的连接ID。`,
	      //   "stopPublishSelfVideo"
	      // );
	      // return reject(`停止推流视频${index}出错：没有相应的连接ID。`);
	      return Promise.resolve();
	    }
	    this._localVideoTrack.setMuted(true);
	    this._drtcIns.unpublish(this._localVideoTrack).then(res => {
	      var _this$_localVideoTrac;
	      (_this$_localVideoTrac = this._localVideoTrack) === null || _this$_localVideoTrac === void 0 || _this$_localVideoTrac.close();
	      this._localVideoTrack = null;
	      // 2. socket更新
	      this._vcsIns._updateSocket_removeVideoTrack(index);
	      // 3. 删除流连接信息
	      this._vcsIns.videoStreams[index] && (this._vcsIns.videoStreams[index].connectID = undefined);
	      this._vcsIns.controlsAccount["connections"] = this._vcsIns.controlsAccount["connections"].filter(connection => {
	        return connection.connectID !== pcID;
	      });
	      deffered.resolve();
	    }).catch(err => {
	      deffered.reject(err.message || err);
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 推送音频流，流数据来源于vcsIns.setAudioEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  publishSelfAudio() {
	    var _this$_vcsIns$audioSt;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    loggerMrtc.log('进入 publishSelfAudio 函数');
	    const deffered = deffer();
	    // 复用易会权限逻辑
	    // 1. 会控状态
	    if (this._vcsIns.controlsAccount.audio_state == 2) {
	      const error = this._vcsIns.vcsErr.throwErr(707, `推流失败${index}：音频权限被主持人禁用。`, "publishSelfAudio");
	      return Promise.reject(error);
	    }

	    // 2. 获取流
	    const streamID = this._vcsIns.audioStreams[index] ? (_this$_vcsIns$audioSt = this._vcsIns.audioStreams[index]) === null || _this$_vcsIns$audioSt === void 0 ? void 0 : _this$_vcsIns$audioSt.streamID : undefined;
	    if (!streamID) {
	      const error = this._vcsIns.vcsErr.throwErr(9001, `推流失败${index}：流编号错误。`, "publishSelfAudio");
	      return Promise.reject(error);
	    }
	    this._vcsIns.media.getStream(streamID).then(async stream => {
	      let promise = null;
	      if (this._localAudioTrack) {
	        loggerMrtc.log('检测到 _localAudioTrack 存在，跳过publish');
	        promise = Promise.resolve();
	      } else {
	        this._localAudioTrack = await DingRTC.createCustomAudioTrack({
	          mediaStreamTrack: stream.getAudioTracks()[0]
	        });
	        promise = this._drtcIns.publish(this._localAudioTrack);
	      }
	      promise.then(res => {
	        this._drtcIns.mixAudioToGroup(this._localAudioTrack, true); // 混音
	        this._localAudioTrack.setMuted(false);
	        const pcID = randomString(12);
	        // 复用易会逻辑
	        // 4. 更新状态信息
	        this._vcsIns.audioStreams[index] && (this._vcsIns.audioStreams[index].connectID = pcID);
	        this._vcsIns._updateSocket_addAudioTrack();
	        loggerMrtc.log(`推送音频流${index}成功。`);
	        if (!this._vcsIns.controlsAccount["connections"]) {
	          this._vcsIns.controlsAccount["connections"] = new Array();
	        }
	        this._vcsIns.controlsAccount["connections"].push({
	          connectID: pcID,
	          streamID: streamID,
	          index: index,
	          type: this._globalParams.vcsTypes.IFConnectionType.Audio
	        });
	        deffered.resolve(stream);
	      }).catch(err => {
	        console.error(`推送音频流${index}错误：SDP协商出错。`);
	        deffered.reject(err.message || err);
	      });
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 停止推送音频流，流数据来源于vcsIns.setAudioEnable
	   * @param {number} index // 媒体流的下标
	   * */
	  stopPublishSelfAudio() {
	    var _this$_vcsIns$audioSt2;
	    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    loggerMrtc.log('进入 stopPublishSelfAudio 函数');
	    const deffered = deffer();
	    // 复用易会中的状态变更
	    if (this._vcsIns.controlsAccount) {
	      this._vcsIns.controlsAccount.audio_state = 1;
	    }
	    const pcID = (_this$_vcsIns$audioSt2 = this._vcsIns.audioStreams[index]) === null || _this$_vcsIns$audioSt2 === void 0 ? void 0 : _this$_vcsIns$audioSt2.connectID;
	    if (!pcID) {
	      console.error(`停止推流音频${index}出错：没有相应的连接ID。stopPublishSelfAudio`);
	      return Promise.resolve();
	    }
	    this._localAudioTrack.setMuted(true);
	    this._drtcIns.unpublish(this._localAudioTrack).then(res => {
	      var _this$_localAudioTrac;
	      (_this$_localAudioTrac = this._localAudioTrack) === null || _this$_localAudioTrac === void 0 || _this$_localAudioTrac.close();
	      this._localAudioTrack = null;
	      // 2. socket更新
	      this._vcsIns._updateSocket_removeAudioTrack(index);
	      // 3. 删除流连接信息
	      this._vcsIns.audioStreams[index] && (this._vcsIns.audioStreams[index].connectID = undefined);
	      this._vcsIns.controlsAccount["connections"] = this._vcsIns.controlsAccount["connections"].filter(connection => {
	        return connection.connectID !== pcID;
	      });
	      deffered.resolve();
	    }).catch(err => {
	      deffered.reject(err.message || err);
	    });
	    return deffered.promise;
	  }
	  /**
	   * @description 推送屏幕共享流
	   * */
	  publishSelfScreen(index) {
	    var _this$_vcsIns$screenS;
	    const deffered = deffer();
	    loggerMrtc.log('进入 publishSelfScreen 函数');
	    // 复用易会项目中的逻辑
	    // 1. 获取流
	    const streamID = this._vcsIns.screenStreams[index] ? (_this$_vcsIns$screenS = this._vcsIns.screenStreams[index]) === null || _this$_vcsIns$screenS === void 0 ? void 0 : _this$_vcsIns$screenS.streamID : undefined;
	    if (!streamID) {
	      const error = this._vcsIns.vcsErr.throwErr(9002, `推流失败${index}：流编号错误。`, "publishSelfScreen");
	      return Promise.reject(error);
	    }
	    this._vcsIns.media.getStream(streamID).then(async stream => {
	      // 3. SDP协商
	      this._localScreenVideoTrack = await DingRTC.createCustomVideoTrack({
	        mediaStreamTrack: stream.getVideoTracks()[0]
	      }, 'screen-cast');
	      // this._localScreenVideoTrack.setSource('screen-cast') // 钉钉已支持
	      this._drtcIns.publish(this._localScreenVideoTrack).then(res => {
	        const pcID = randomString(12);
	        // 4. 更新状态信息
	        this._vcsIns.screenStreams[index] && (this._vcsIns.screenStreams[index].connectID = pcID);
	        this._vcsIns._updateSocket_addScreenTrack(index);
	        if (!this._vcsIns.controlsAccount["connections"]) {
	          this._vcsIns.controlsAccount["connections"] = new Array();
	        }
	        this._vcsIns.controlsAccount["connections"].push({
	          connectID: pcID,
	          streamID: streamID,
	          index: index,
	          type: this._globalParams.vcsTypes.IFConnectionType.MixtureOrScreen
	        });
	        deffered.resolve(stream);
	      }).catch(err => {
	        deffered.reject(err.message || err);
	      });
	    });
	    return deffered.promise;
	  }

	  /**
	   * @description 停止推送屏幕共享流
	   * */
	  stopPublishSelfScreen(index) {
	    loggerMrtc.log('进入 stopPublishSelfScreen 函数');
	    return new Promise((resolve, reject) => {
	      var _this$_vcsIns$screenS2;
	      // 复用易会中的逻辑
	      // 1. 信令断开
	      const pcID = (_this$_vcsIns$screenS2 = this._vcsIns.screenStreams[index]) === null || _this$_vcsIns$screenS2 === void 0 ? void 0 : _this$_vcsIns$screenS2.connectID;
	      if (!pcID) {
	        this._vcsIns.vcsErr.throwErr(1003, `停止推流桌面${index}出错：没有相应的连接ID。`, "stopPublishSelfScreen");
	        // return reject(error);
	        return resolve();
	      }
	      const promise = this._localScreenVideoTrack ? this._drtcIns.unpublish(this._localScreenVideoTrack) : Promise.resolve(); // 兼容rejoin的场景，_localScreenVideoTrack为null的情况下，unpublish没有返回。
	      promise.then(res => {
	        var _this$_localScreenVid;
	        loggerMrtc.log('drtc unpublish screen 成功');
	        (_this$_localScreenVid = this._localScreenVideoTrack) === null || _this$_localScreenVid === void 0 || _this$_localScreenVid.close();
	        this._localScreenVideoTrack = null;
	        // 将风远的执行逻辑放到钉钉unpublish之后，业务上觅讯消息传的太快，导致部分处理逻辑有点异常。
	        this._vcsIns.screenStreams[index] && (this._vcsIns.screenStreams[index].connectID = undefined);
	        this._vcsIns._updateSocket_removeScreenTrack(index);
	        // 2. socket更新
	        // 3. 删除流连接信息
	        this._vcsIns.controlsAccount["connections"] = this._vcsIns.controlsAccount["connections"].filter(connection => {
	          return connection.connectID !== pcID;
	        });

	        // this.roomInfo.setRoomState("", 0, 0);
	        resolve();
	      }).catch(err => {
	        loggerMrtc.log('drtc unpulish screen 失败：', err);
	        reject(err);
	      });
	    });
	  }

	  // 订阅逻辑
	  /**
	   * @description 订阅混音流
	   * @param {Object} params
	   * */
	  async pullPeerMixerAudioStream(params) {
	    loggerMrtc.log('进入pullPeerMixerAudioStream，订阅远端混音流');
	    const deffered = deffer();
	    if (this._role === 'audience') {
	      // 研讨会 & 观众
	      loggerMrtc.log('观众，_signalingIns发起请求混音流cdn地址');
	      const streamID = await this._vcsIns.media.createStream(1, false, false);
	      const stream = await this._vcsIns.media.getStream(streamID);
	      this._signalingIns.connect({
	        peerID: 'amixer',
	        offerType: this._globalParams.vcsTypes.OfferType.Audio,
	        stream,
	        isScreen: false,
	        descOption: {
	          desc: "pullPeerMixerAudioStream"
	        },
	        person: this._vcsIns.account,
	        cdnStreamTypes: 32 // opus混音流
	      }).then(pcID => {
	        loggerMrtc.log('观众，拉取混音流成功');

	        // 绑定到vcs roomInfo
	        this._vcsIns.roomInfo.connectMixerAudio(streamID, pcID, 0, this._globalParams.vcsTypes.IFConnectionType.Audio, stream);
	        this._remoteMixAudioStream = stream;
	        deffered.resolve({
	          connectID: pcID,
	          stream: this._remoteMixAudioStream
	        });
	      }).catch(err => {
	        this._vcsIns.media.closeStream(streamID);
	        deffered.reject((err === null || err === void 0 ? void 0 : err.message) || err);
	      });
	    } else {
	      // 常规逻辑
	      this._drtcIns.subscribe('mcu', 'audio').then(remoteAudioTrack => {
	        // remoteAudioTrack.play()
	        // remoteAudioTrack.setVolume(0)
	        this._remoteMixAudioTrack = remoteAudioTrack;
	        this._remoteMixAudioStream = new MediaStream([remoteAudioTrack.getMediaStreamTrack()]);
	        deffered.resolve({
	          connectID: null,
	          stream: this._remoteMixAudioStream
	        });
	      }).catch(err => {
	        deffered.reject(err.message || err);
	      });
	    }
	    return deffered.promise;
	  }

	  /**
	   * @description 取消订阅混音流
	   * */
	  stopPullPeerMixerAudioStream() {
	    var _this$_remoteMixAudio, _this$_remoteMixAudio2;
	    loggerMrtc.log('进入stopPullPeerMixerAudioStream，取消订阅远端混音流');
	    this._updateStreamTrack(this._remoteMixAudioStream, (_this$_remoteMixAudio = this._remoteMixAudioStream) === null || _this$_remoteMixAudio === void 0 || (_this$_remoteMixAudio2 = _this$_remoteMixAudio.getAudioTracks) === null || _this$_remoteMixAudio2 === void 0 || (_this$_remoteMixAudio2 = _this$_remoteMixAudio2.call(_this$_remoteMixAudio)) === null || _this$_remoteMixAudio2 === void 0 ? void 0 : _this$_remoteMixAudio2[0]);
	    this._remoteMixAudioTrack = null; // 混音音频轨道
	    this._remoteMixAudioStream = null; // 混音音频流

	    return new Promise((resolve, reject) => {
	      if (this._role === 'audience') {
	        // 研讨会 & 观众
	        const connectionID = this._vcsIns.roomInfo.getMixerAudioConnectionID();
	        const streamID = this._vcsIns.roomInfo.getMixerAudioStreamID();
	        this._signalingIns.disconnect(connectionID, true).then(() => {
	          this._vcsIns.media.closeStream(streamID);
	          if (this._vcsIns.roomInfo) {
	            this._vcsIns.roomInfo.disconnectMixerAudio();
	          }
	          resolve();
	        }).catch(reject);
	      } else {
	        this._drtcIns.unsubscribe('mcu', 'audio').then(resolve).catch(reject);
	      }
	    });
	  }

	  /**
	   * @description 订阅视频
	   * @param {string} id // 用户ID
	   * @param {object} option
	   * */
	  async pullPeerVideoStream(id, option) {
	    const deffered = deffer();
	    const stream_id = this._vcsIns.roomInfo.getStreamID(id);
	    loggerMrtc.log(`订阅视频，personId:${id}, stream_id: ${stream_id}`);
	    const index = (option === null || option === void 0 ? void 0 : option.index) || 0;
	    if (this._role === 'audience') {
	      // 研讨会 & 观众
	      loggerMrtc.log('观众，_signalingIns发起请求视频cdn地址');
	      const person = this.roomInfo.getPeer(id);
	      const streamID = await this._vcsIns.media.createStream(1, false, false);
	      const stream = await this._vcsIns.media.getStream(streamID);
	      const progress = this._vcsIns.peerConnectionProgressQueue.createPeerConnectionProgress(id + index);
	      progress.setTask(true, "beforecreateStream");
	      this._signalingIns.connect({
	        peerID: stream_id,
	        track: index,
	        offerType: this._globalParams.vcsTypes.OfferType.Video,
	        stream,
	        isScreen: false,
	        descOption: {
	          desc: "pullPeerVideoStream",
	          id
	        },
	        person,
	        progress,
	        cdnStreamTypes: 1 // 默认拉小流，上层会根据时机切换大流
	      }).then(connectID => {
	        loggerMrtc.log(`观众，拉取stream_id: ${stream_id} 视频成功`);
	        if (progress && progress.state === "closed") {
	          return deffered.reject("101已经停止拉流");
	        } else if (progress && progress.state === "normal") {
	          progress.setTask(true, "beforeRoomInfoConnect");
	        }
	        // 绑定到vcs对象上
	        this._vcsIns.roomInfo.connect(id, streamID, connectID, index, this._globalParams.vcsTypes.IFConnectionType.Video, stream);
	        this._remoteUserStreams[stream_id] = stream;
	        deffered.resolve({
	          connectID,
	          stream
	        });
	      }).catch(err => {
	        this._vcsIns.media.closeStream(streamID);
	        deffered.reject(err.message || err);
	      });
	    } else {
	      // 正常订阅（嘉宾），drtc订阅视频
	      // 风远订阅视频（透传）（当做会控消息处理）
	      // const vcsPromise = this._vcsIns.pullPeerVideoStream(id, option)
	      const vcsPromise = Promise.resolve();
	      const drtcPromise = new Promise((resolve, reject) => {
	        const remoteUser = this._drtcIns.remoteUsers.find(item => item.userId === stream_id);
	        if (remoteUser !== null && remoteUser !== void 0 && remoteUser.videoTrack) {
	          loggerMrtc.log('已存在订阅的视频流，直接返回remoteUser.videoTrack');
	          resolve(remoteUser.videoTrack);
	          return;
	        }
	        this._drtcIns.subscribe(stream_id, 'video').then(resolve).catch(reject);
	      });
	      Promise.all([vcsPromise, drtcPromise]).then(async res => {
	        const remoteVideoTrack = res[1];
	        const connectID = `${id}_remote_video`;
	        const stream = new MediaStream([remoteVideoTrack.getMediaStreamTrack()]);
	        this._remoteUserStreams[stream_id] = stream;
	        this._remoteUserTracks[stream_id] = remoteVideoTrack;

	        // 绑定到vcs对象上
	        const streamID = await this._vcsIns.media.createStream(1, false, false, null, stream);
	        this._vcsIns.roomInfo.connect(id, streamID, connectID, index, this._globalParams.vcsTypes.IFConnectionType.Video, stream);
	        deffered.resolve({
	          connectID,
	          stream
	        });
	      }).catch(err => {
	        deffered.reject(err.message || err);
	      });
	    }
	    return deffered.promise;
	  }
	  /**
	   * @description 取消订阅视频（根据用户id）
	   * @param {string} id // 用户id
	   * @param {number} index // 下标
	   * */
	  stopPullPeerVideoStreamByPersonId(id) {
	    let index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    loggerMrtc.log(`进入stopPullPeerVideoStreamByPersonId方法`);
	    return new Promise((resolve, reject) => {
	      const stream_id = this._vcsIns.roomInfo.getStreamID(id);
	      loggerMrtc.log(`取消订阅视频，personId:${id}, stream_id: ${stream_id}`);
	      if (this._role === 'audience') {
	        // 研讨会 & 观众
	        const progress = this._vcsIns.peerConnectionProgressQueue.getPeerConnectionProgress(id + index);
	        if (progress) {
	          progress.setTask(false, "close");
	          const task = progress.getTask("beforeSignalingInsDisConnect");
	          const connectID = task.args.connectionID;
	          const videoConnectionInfo = this._vcsIns.roomInfo.getConnection(id, connectID);
	          this._signalingIns.disconnect(connectID).then(() => {
	            if (videoConnectionInfo) {
	              this._vcsIns.media.closeStream(videoConnectionInfo === null || videoConnectionInfo === void 0 ? void 0 : videoConnectionInfo.streamID);
	            }
	            this._vcsIns.roomInfo.disconnect(id, connectID);
	            resolve();
	          }).catch(reject);
	        } else {
	          loggerMrtc.log(`取消订阅视频，personId:${id}, stream_id: ${stream_id}失败，progress为空`);
	        }
	      } else {
	        // 风远取消订阅视频（透传）（当做会控消息处理）
	        // const vcsPromise = this._vcsIns.stopPullPeerVideoStreamByPersonId(id, index)
	        // drtc取消订阅视频
	        const drtcPromise = this._drtcIns.unsubscribe(stream_id, 'video');
	        Promise.all([drtcPromise]).then(res => {
	          delete this._remoteUserStreams[stream_id];
	          delete this._remoteUserTracks[stream_id];

	          // 清除vcs数据
	          const connectID = `${id}_remote_video`;
	          const videoConnectionInfo = this._vcsIns.roomInfo.getConnection(id, connectID);
	          if (videoConnectionInfo) {
	            this._vcsIns.media.closeStream(videoConnectionInfo === null || videoConnectionInfo === void 0 ? void 0 : videoConnectionInfo.streamID);
	          }
	          this._vcsIns.roomInfo.disconnect(id, connectID);
	          resolve();
	        }).catch(err => {
	          reject(err.message || err);
	        });
	      }
	    });
	  }
	  /**
	   * @description 取消订阅视频
	   * @param {string} connectID // 连接id
	   * */
	  stopPullPeerVideoStream(connectID) {
	    const personID = this._vcsIns.roomInfo.getIDByConnectID(connectID);
	    return this.stopPullPeerVideoStreamByPersonId(personID);
	  }
	  /**
	   * @description 订阅屏幕共享流
	   * @param {string} id // 用户id
	   * @param {number} index // 下标
	   * */
	  async pullPeerScreenStream(id, index) {
	    const deffered = deffer();
	    const stream_id = String(this._vcsIns.roomInfo.getStreamID(id));
	    const person = this._vcsIns.roomInfo.getPeer(id);
	    loggerMrtc.log(`订阅屏幕共享流，personId:${id}, stream_id: ${stream_id}`);
	    if (this._role === 'audience') {
	      // 研讨会 & 观众
	      const streamID = await this._vcsIns.media.createStream(2, false, false);
	      const stream = await this._vcsIns.media.getStream(streamID);
	      this._signalingIns.connect({
	        peerID: stream_id,
	        track: index,
	        offerType: this._globalParams.vcsTypes.OfferType.Screen_Video,
	        stream,
	        isScreen: false,
	        descOption: {
	          desc: "pullPeerScreenStream",
	          id
	        },
	        person,
	        cdnStreamTypes: 4 // 屏幕流
	      }).then(pcID => {
	        loggerMrtc.log(`观众 订阅屏幕共享流成功`);
	        // 3. 更新状态
	        this._vcsIns.roomInfo.connect(id, streamID, pcID, index, this._globalParams.vcsTypes.IFConnectionType.MixtureOrScreen, stream);
	        return deffered.resolve({
	          connectID: pcID,
	          stream: stream
	        });
	      }).catch(err => {
	        return deffered.reject(err);
	      });
	    } else {
	      // 常规逻辑（嘉宾）
	      // 风远订阅屏幕共享流（透传）（当做会控消息处理）
	      // const vcsPromise = this._vcsIns.pullPeerScreenStream(id, index)
	      const vcsPromise = Promise.resolve();
	      // drtc订阅视频
	      const drtcPromise = new Promise((resolve, reject) => {
	        const remoteUser = this._drtcIns.remoteUsers.find(item => item.userId === stream_id);
	        if (remoteUser.auxiliaryTrack) {
	          loggerMrtc.log('已存在订阅的屏幕共享流，直接返回remoteUser.auxiliaryTrack');
	          resolve(remoteUser.auxiliaryTrack);
	          return;
	        }
	        loggerMrtc.log(`drtc发起屏幕共享流订阅`);
	        this._drtcIns.subscribe(stream_id, 'video', true).then(res => {
	          this._drtcIns.setRemoteVideoStreamType(stream_id, 'high', true);
	          resolve(res);
	        }).catch(reject);
	      });
	      Promise.all([vcsPromise, drtcPromise]).then(async res => {
	        loggerMrtc.log(`屏幕共享流订阅成功`);
	        const remoteVideoTrack = res[1];
	        const stream = new MediaStream([remoteVideoTrack.getMediaStreamTrack()]);
	        this._remoteScreenStream = stream;
	        this._remoteScreenTrack = remoteVideoTrack;
	        const connectID = `${id}_remote_screen`;

	        // 绑定到vcs对象上
	        const streamID = await this._vcsIns.media.createStream(2, false, false, null, stream);
	        this._vcsIns.roomInfo.connect(id, streamID, connectID, index, this._globalParams.vcsTypes.IFConnectionType.MixtureOrScreen, stream);
	        deffered.resolve({
	          connectID,
	          stream: this._remoteScreenStream
	        });
	      }).catch(err => {
	        deffered.reject(err.message || err);
	      });
	    }
	    return deffered.promise;
	  }
	  /**
	   * @description 取消订阅屏幕共享流
	   * @param {string} connectID // 连接id
	   * */
	  stopPullPeerScreenStream(connectID) {
	    // 这里不用deferred，因为getIDByConnectID会报找不到用户的错误，导致业务逻辑直接中断了（deferred的坑)
	    return new Promise((resolve, reject) => {
	      const id = this._vcsIns.roomInfo.getIDByConnectID(connectID);
	      const stream_id = this._vcsIns.roomInfo.getStreamID(id);
	      loggerMrtc.log(`取消订阅屏幕共享流，personId:${id}, stream_id: ${stream_id}, connectID: ${connectID}`);
	      if (this._role === 'audience') {
	        // 研讨会 & 观众
	        this._signalingIns.disconnect(connectID, true).then(() => {
	          loggerMrtc.log(`观众 取消订阅屏幕共享流成功`);
	          // 3. 信息同步
	          if (this._vcsIns.roomInfo.hasConnectionByConnectID(id, connectID)) {
	            // 删除流
	            // 2. 断开连接
	            const screenConnectionInfo = this._vcsIns.roomInfo.getConnection(id, connectID);
	            if (id && connectID) {
	              this._vcsIns.roomInfo.disconnect(id, connectID);
	            }
	            if (screenConnectionInfo && screenConnectionInfo.streamID) {
	              this._vcsIns.media.closeStream(screenConnectionInfo === null || screenConnectionInfo === void 0 ? void 0 : screenConnectionInfo.streamID);
	            }
	          }
	          return resolve();
	        }).catch(err => {
	          return reject(err);
	        });
	      } else {
	        // 常规逻辑（嘉宾）
	        // 风远取消订阅视频（透传）（当做会控消息处理）
	        // const vcsPromise = this._vcsIns.stopPullPeerScreenStream(connectID)
	        // drtc取消订阅视频
	        const drtcPromise = this._drtcIns.unsubscribe(stream_id, 'video', true);
	        Promise.all([drtcPromise]).then(res => {
	          this._remoteScreenStream = null;
	          this._remoteScreenTrack = null;

	          // 清除vcs数据
	          // 3. 信息同步
	          if (this._vcsIns.roomInfo.hasConnectionByConnectID(id, connectID)) {
	            // 删除流
	            // 2. 断开连接
	            const screenConnectionInfo = this._vcsIns.roomInfo.getConnection(id, connectID);
	            if (id && connectID) {
	              this._vcsIns.roomInfo.disconnect(id, connectID);
	            }
	            if (screenConnectionInfo && screenConnectionInfo.streamID) {
	              this._vcsIns.media.closeStream(screenConnectionInfo === null || screenConnectionInfo === void 0 ? void 0 : screenConnectionInfo.streamID);
	            }
	          }
	          resolve();
	        }).catch(err => {
	          reject(err.message || err);
	        });
	      }
	    });
	  }
	  // 切换视频到大流
	  switchBigStream(connectID) {
	    loggerMrtc.log(`进入switchBigStream 方法`);
	    return new Promise((resolve, reject) => {
	      const personId = this._vcsIns.roomInfo.getIDByConnectID(connectID);
	      const stream_id = this._vcsIns.roomInfo.getStreamID(personId);
	      if (this._role === 'audience') {
	        // 研讨会 & 观众
	        loggerMrtc.log(`观众切换视频到大流`);
	        this._signalingIns.switchTrack(connectID, 1).then(resolve).catch(reject);
	      } else {
	        // 常规会议
	        loggerMrtc.log(`drtc切换视频到大流`);
	        this._drtcIns.setRemoteVideoStreamType(String(stream_id), 'high').then(res => {
	          loggerMrtc.log(`drtc切换用户${stream_id}视频到大流成功`);
	          resolve();
	        }).catch(reject);
	      }
	    });
	  }
	  // 切换视频到小流
	  switchSmallStream(connectID) {
	    loggerMrtc.log(`进入switchSmallStream 方法`);
	    return new Promise((resolve, reject) => {
	      const personId = this._vcsIns.roomInfo.getIDByConnectID(connectID);
	      const stream_id = this._vcsIns.roomInfo.getStreamID(personId);
	      if (this._role === 'audience') {
	        // 研讨会 & 观众
	        loggerMrtc.log(`观众切换视频到小流`);
	        this._signalingIns.switchTrack(connectID, 0).then(resolve).catch(reject);
	      } else {
	        // 常规会议
	        loggerMrtc.log(`drtc切换视频到小流`);
	        this._drtcIns.setRemoteVideoStreamType(String(stream_id), 'low').then(res => {
	          loggerMrtc.log(`drtc切换用户${stream_id}视频到小流成功`);
	          resolve();
	        }).catch(reject);
	      }
	    });
	  }
	  /**
	   * @description 获取当前rtcType
	   * @returns {string} // vcs | drtc
	   * */
	  getRtcType() {
	    return this._rtcType;
	  }
	  /**
	   * @description 劫持vcs的事件监听
	   * */
	  on(event, fn) {
	    let fnNew = fn;
	    if (this._rtcType === 'drtc') {
	      // 拦截网络质量状态变化（不拦截了，直接在drtc获取getRemoteVideoStats()的时候直接上报）
	      // if (event === 'throwStreamNetworkState') {
	      //   fnNew = async (state) => {
	      //     let newState = state
	      //     if (!newState.closed) {
	      //       const personId = this._vcsIns.roomInfo.getIDByConnectID(newState.id)
	      //       // 判断personid是否存在，避免不存在反复报错”房间状态：获取成员stream_id时，成员不存在. id: null“
	      //       if (personId) {
	      //         const streamId = this._vcsIns.roomInfo.getStreamID(personId)
	      //         newState = await this._replaceConnectionStateState(newState, streamId)
	      //       }
	      //     }
	      //     return fn(newState)
	      //   }
	      // }
	      // 拦截屏幕共享开启事件，因为vcs屏幕共享通知和 ertc的通知事件，会出现不同步，ertc 的 stream-added，可能会延迟1-2s，导致stream-added事件还没触发，但已经调用了订阅屏幕共享的接口，导致获取不到报错，所以统一在stream-added的时候向上层通知屏幕共享开启
	      if (event === 'onPeerSharingScreenStart') {
	        fnNew = target => {
	          // 1、如果是stream-added触发的
	          // 2、如果是当前用户开启的屏幕共享，也会触发，为了兼容上层当前用户开启屏幕共享后，会在onPeerSharingScreenStart的回调函数中执行关闭摄像头操作
	          if (target !== null && target !== void 0 && target.isFromMrtc || target.id === this._vcsIns.getAccount().id) {
	            // 考虑到上层应用可能会监听多个 onPeerSharingScreenStart 事件，所以这里不做delete，避免逻辑出现错误
	            // delete target.isFromMrtc
	            return fn(target);
	          }
	          loggerMrtc.log('onPeerSharingScreenStart 事件被拦截，此次事件不是由mrtc触发');
	        };
	      }
	      // 拦截 onRoomMemberInfoChange 事件，同步音视频状态
	      if (event === 'onRoomMemberInfoChange') {
	        fnNew = target => {
	          // 同步音视频状态
	          target.persons = this._replacePersons(target.persons);
	          return fn(target);
	        };
	      }
	      const audienceExclude = ['throwStreamNetworkState', 'onPeerSharingScreenStart'];
	      if (this._role === 'audience' && audienceExclude.includes(event)) {
	        // 研讨会 & 观众，直接返回
	        fnNew = async state => fn(state);
	      }
	      this._vcsIns.on(event, fnNew);
	    } else {
	      this._vcsIns.on(event, fnNew);
	    }
	  }
	  /**
	   * @description 消息连接执行的副作用函数
	   * */
	  _connectEffect() {
	    const vcsRoomInfo = this._vcsIns.getRoom();
	    // 手动触发vcs的onRoomMemberInfoChange事件，更新房间信息
	    loggerMrtc.log('_connectEffect，触发vcs房间信息更新');
	    this._vcsIns.notice(this._globalParams.vcsTypes.NoticeType.throwRoomMemberInfo, vcsRoomInfo);
	  }
	  /**
	   * @description 消息重连后执行的副作用函数
	   * */
	  _reconnectEffect() {
	    const trackIds = this._drtcMediaReconnectFailTrackIds;
	    trackIds.forEach(trackId => {
	      try {
	        // 混音流
	        if (trackId === this._remoteMixAudioTrack.trackId) {
	          // 混音流由于不会重新订阅，所以需要在这边进行重新赋值
	          loggerMrtc.log('有混音流，且重连fail了，drtc重新订阅混音流');
	          // 常规逻辑
	          this._drtcIns.subscribe('mcu', 'audio').then(remoteAudioTrack => {
	            var _this$_remoteMixAudio3;
	            loggerMrtc.log('重连混音流成功', '新的track：', remoteAudioTrack.getMediaStreamTrack());
	            this._updateStreamTrack(this._remoteMixAudioStream, (_this$_remoteMixAudio3 = this._remoteMixAudioStream.getAudioTracks()) === null || _this$_remoteMixAudio3 === void 0 ? void 0 : _this$_remoteMixAudio3[0], remoteAudioTrack.getMediaStreamTrack());
	            this._remoteMixAudioTrack = remoteAudioTrack;
	          }).catch(err => {
	            loggerMrtc.log(err.message || err);
	          });
	          return;
	        }
	        // 视频、屏幕共享流
	        const screenUser = this._drtcIns.remoteUsers.find(item => {
	          var _this$_remoteScreenTr;
	          return item.hasAuxiliary && ((_this$_remoteScreenTr = this._remoteScreenTrack) === null || _this$_remoteScreenTr === void 0 ? void 0 : _this$_remoteScreenTr.trackId) === trackId;
	        }); // 是否有屏幕分享
	        const videoUser = this._drtcIns.remoteUsers.find(item => {
	          var _this$_remoteUserTrac;
	          return item.hasVideo && item.videoMuted === false && ((_this$_remoteUserTrac = this._remoteUserTracks[item.userId]) === null || _this$_remoteUserTrac === void 0 ? void 0 : _this$_remoteUserTrac.trackId) === trackId;
	        }); // 是否有视频流
	        // 更新屏幕共享流
	        if (screenUser) {
	          loggerMrtc.log('有屏幕流，且屏幕流重连fail了，drtc重新订阅屏幕流');
	          this._drtcIns.subscribe(screenUser.userId, 'video', true).then(remoteTrack => {
	            var _this$_remoteScreenSt;
	            loggerMrtc.log('重连屏幕流成功', '新的track：', remoteTrack.getMediaStreamTrack());
	            this._updateStreamTrack(this._remoteScreenStream, (_this$_remoteScreenSt = this._remoteScreenStream.getVideoTracks()) === null || _this$_remoteScreenSt === void 0 ? void 0 : _this$_remoteScreenSt[0], remoteTrack.getMediaStreamTrack());
	            this._remoteScreenTrack = remoteTrack;
	          }).catch(err => {
	            loggerMrtc.log(err.message || err);
	          });
	          return;
	        }
	        // 更新视频流
	        if (videoUser) {
	          loggerMrtc.log(`用户${videoUser.userId}有视频流，且视频流重连fail了，drtc重新订阅视频流`);
	          this._drtcIns.subscribe(videoUser.userId, 'video').then(remoteTrack => {
	            var _this$_remoteUserStre;
	            loggerMrtc.log(`重连用户${videoUser.userId}视频流成功`, '新的track：', remoteTrack.getMediaStreamTrack());
	            this._updateStreamTrack(this._remoteUserStreams[videoUser.userId], (_this$_remoteUserStre = this._remoteUserStreams[videoUser.userId].getVideoTracks()) === null || _this$_remoteUserStre === void 0 ? void 0 : _this$_remoteUserStre[0], remoteTrack.getMediaStreamTrack());
	            this._remoteUserTracks[videoUser.userId] = remoteTrack;
	          }).catch(err => {
	            loggerMrtc.log(err.message || err);
	          });
	          return;
	        }
	      } catch (error) {
	        loggerMrtc.log(`_reconnectEffect重新订阅流报错：`, error);
	      }
	    });
	    this._drtcMediaReconnectFailTrackIds = [];
	    this._connectEffect();
	  }
	  // drtc 正常入会后执行的副作用函数
	  _joinEffect() {
	    const vcsRoomInfo = this._vcsIns.getRoom();
	    // 手动触发订阅屏幕共享
	    const screenUser = this._drtcIns.remoteUsers.find(item => item.hasAuxiliary);
	    if (screenUser) {
	      var _vcsRoomInfo$persons2;
	      loggerMrtc.log('drtc正常入会后，触发屏幕共享流订阅消息上报');
	      const person = (_vcsRoomInfo$persons2 = vcsRoomInfo.persons) === null || _vcsRoomInfo$persons2 === void 0 ? void 0 : _vcsRoomInfo$persons2.find(item => item.stream_id === screenUser.userId);
	      this._vcsIns.roomInfo.event_startSharingScreen({
	        id: person.id,
	        // 这里要传personId
	        index: null,
	        type: 3,
	        isFromMrtc: true // 标识是否是mrtc触发的，并非原先的 event_startSharingScreen 必须参数，而是额外添加的，在on的拦截函数中会判断，并删除。
	      });
	    }
	    this._pollingRemoteVideoStats();
	  }
	  // drtc 重新入会后执行的副作用函数
	  _rejoinEffect() {
	    if (this._localVideoTrack) {
	      loggerMrtc.log('drtc重新入会，推送本地视频流');
	      this._drtcIns.publish(this._localVideoTrack);
	    }
	    if (this._localAudioTrack) {
	      loggerMrtc.log('drtc重新入会，推送本地音频流');
	      this._drtcIns.publish(this._localAudioTrack).then(() => {
	        this._drtcIns.mixAudioToGroup(this._localAudioTrack, true);
	      });
	    }

	    // rejoin后需要重新订阅混音流
	    loggerMrtc.log('drtc重新入会，重新订阅混音流');
	    this._drtcIns.subscribe('mcu', 'audio').then(remoteAudioTrack => {
	      var _this$_remoteMixAudio4;
	      this._remoteMixAudioTrack = remoteAudioTrack;
	      this._updateStreamTrack(this._remoteMixAudioStream, (_this$_remoteMixAudio4 = this._remoteMixAudioStream.getAudioTracks()) === null || _this$_remoteMixAudio4 === void 0 ? void 0 : _this$_remoteMixAudio4[0], this._remoteMixAudioTrack.getMediaStreamTrack());
	    });

	    // rejoin后手动触发订阅屏幕共享
	    const screenUser = this._drtcIns.remoteUsers.find(item => item.hasAuxiliary);
	    if (screenUser) {
	      if (this._remoteScreenStream) {
	        if (screenUser.auxiliaryTrack) {
	          var _this$_remoteScreenSt2;
	          loggerMrtc.log('drtc重新入会后，更新对端屏幕共享流track');
	          this._updateStreamTrack(this._remoteScreenStream, (_this$_remoteScreenSt2 = this._remoteScreenStream.getVideoTracks()) === null || _this$_remoteScreenSt2 === void 0 ? void 0 : _this$_remoteScreenSt2[0], screenUser.auxiliaryTrack.getMediaStreamTrack());
	          this._remoteScreenTrack = screenUser.auxiliaryTrack;
	        } else {
	          loggerMrtc.log('drtc重新入会后，重新订阅对端屏幕共享流');
	          this._drtcIns.subscribe(screenUser.userId, 'video', true).then(remoteTrack => {
	            var _this$_remoteScreenSt3;
	            this._updateStreamTrack(this._remoteScreenStream, (_this$_remoteScreenSt3 = this._remoteScreenStream.getVideoTracks()) === null || _this$_remoteScreenSt3 === void 0 ? void 0 : _this$_remoteScreenSt3[0], remoteTrack.getMediaStreamTrack());
	            this._remoteScreenTrack = remoteTrack;
	          });
	        }
	      } else {
	        var _vcsRoomInfo$persons3;
	        loggerMrtc.log('drtc重新入会后，触发屏幕共享流订阅消息上报');
	        const person = (_vcsRoomInfo$persons3 = vcsRoomInfo.persons) === null || _vcsRoomInfo$persons3 === void 0 ? void 0 : _vcsRoomInfo$persons3.find(item => item.stream_id === screenUser.userId);
	        this._vcsIns.roomInfo.event_startSharingScreen({
	          id: person.id,
	          // 这里要传personId
	          index: null,
	          type: 3,
	          isFromMrtc: true // 标识是否是mrtc触发的，并非原先的 event_startSharingScreen 必须参数，而是额外添加的，在on的拦截函数中会判断，并删除。
	        });
	      }
	    }
	  }
	  /**
	   * @description 监听vcs加入房间前事件，避免因为异步问题，导致vcs入房后 到 ertc入房后的这段时间，业务层的监听事件不生效
	   * */
	  _listenVcsBeforeEnterRoomEvent() {
	    var _this3 = this;
	    this._vcsIns.once('onSelfAccountChange', function () {
	      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }
	      _this3._vcsBeforeEnterRoomEventTransactions['onSelfAccountChange'] = args;
	    });
	  }
	  _triggerVcsBeforeEnterRoomEvent() {
	    Object.entries(this._vcsBeforeEnterRoomEventTransactions).forEach(_ref => {
	      let [key, args] = _ref;
	      this._vcsIns.eventBus.emit(key, ...args);
	      // 删除
	      delete this._vcsBeforeEnterRoomEventTransactions[key];
	    });
	  }

	  /**
	   * @description 更新批量person信息
	   * */
	  _replacePersons(vcsPersons) {
	    loggerMrtc.log('vcsPersons转换前数据：', vcsPersons);
	    const vcsPersonsClone = lodashEs.cloneDeep(vcsPersons);
	    if (this._role === 'audience') {
	      // 观众
	      return vcsPersonsClone;
	    } else {
	      // 正常逻辑（嘉宾）
	      // 过滤出drtc与vcs共同的用户，避免出现vcs与drtc用户数量不一致的时候，人数显示上和其他端有差异（其他端都做了过滤）。
	      return vcsPersonsClone === null || vcsPersonsClone === void 0 ? void 0 : vcsPersonsClone.reduce((acc, vcsPerson) => {
	        var _this$_drtcIns;
	        const personMatched = (_this$_drtcIns = this._drtcIns) === null || _this$_drtcIns === void 0 || (_this$_drtcIns = _this$_drtcIns.remoteUsers) === null || _this$_drtcIns === void 0 ? void 0 : _this$_drtcIns.find(item => item.userId == vcsPerson.stream_id);
	        if (personMatched) {
	          acc.push(this._replacePerson(vcsPerson, personMatched));
	        } else if (this._vcsIns.getAccount().id === vcsPerson.id) {
	          // 如果是当前用户，直接添加
	          acc.push(vcsPerson);
	        }
	        return acc;
	      }, []);
	    }
	  }
	  /**
	   * @description 更新单个person信息
	   * */
	  _replacePerson(vcsPerson, drtcPerson) {
	    // 更新媒体状态
	    // 不更新自己，因为有滞后性，导致状态不及时
	    if (vcsPerson.id !== this._vcsIns.getAccount().id) {
	      // vcsPerson.vstate = (!!drtcPerson?.hasVideo && !drtcPerson?.videoMuted) ? 0 : 1
	      // vcsPerson.astate = !!drtcPerson?.hasAudio ? 0 : 1
	      // vcsPerson.astate = this._remoteUserMicMuted[drtcPerson.userId] === false ? 0 : 1 // 不在这处理了，直接以风远会控媒体音频状态为准
	      vcsPerson.streams = this._replacePersonStreams(vcsPerson.streams);
	      if (this._vcsIns.roomInfo.checkPeer(vcsPerson.id) && this._vcsIns.roomInfo.getVideoState(vcsPerson.id) !== vcsPerson.vstate) {
	        this._vcsIns.roomInfo.setVideoState(vcsPerson.id.toString(), vcsPerson.vstate);
	      }
	      if (this._vcsIns.roomInfo.checkPeer(vcsPerson.id) && this._vcsIns.roomInfo.getAudioState(vcsPerson.id) !== vcsPerson.astate) {
	        this._vcsIns.roomInfo.setAudioState(vcsPerson.id.toString(), vcsPerson.astate);
	      }
	    }
	    return vcsPerson;
	  }
	  /**
	   * @description 替换vcs的媒体流链接状态数据
	   * */
	  _replacePersonStreams(streams) {
	    streams === null || streams === void 0 || streams.forEach(stream => {
	      stream.angle = 0;
	    });
	    return streams;
	  }
	  /**
	   * @description 替换vcs的媒体流链接状态数据
	   * */
	  _replaceConnectionStateState(state, id) {
	    return new Promise((resolve, reject) => {
	      const connectionState = state;
	      if (this._remoteVidioStats) {
	        var _res$id, _res$id2;
	        const res = this._remoteVidioStats;
	        const data = ((_res$id = res[id]) === null || _res$id === void 0 ? void 0 : _res$id.auxiliary) || ((_res$id2 = res[id]) === null || _res$id2 === void 0 ? void 0 : _res$id2.camera); // 优先去取屏幕共享流，毕竟屏幕共享流和视频流不共存。
	        if (data) {
	          connectionState.keyFramesDecoded = data.keyFramesDecoded;
	          connectionState["bytesReceived/s"] = data.receiveBitrate / 1024 / 8;
	          connectionState.packetsReceived = data.receivePackets;
	          connectionState.afterPackersLost = data.receivePacketsLost || 0;
	          connectionState.beforePackersLost = data.receivePacketsLost || 0;
	        }
	        resolve(connectionState);
	      } else {
	        reject('未获取到 this._remoteVidioStats 数据');
	      }
	    });
	  }
	  // 轮询drtc的媒体流性能报告
	  _pollingRemoteVideoStats() {
	    if (this._remoteVideoStatsIntervalId) {
	      clearInterval(this._remoteVideoStatsIntervalId);
	      this._remoteVideoStatsIntervalId = null;
	    }
	    this._remoteVideoStatsIntervalId = setInterval(() => {
	      this._drtcIns.getRemoteVideoStats().then(res => {
	        this._remoteVidioStats = res;
	        Object.entries(res).forEach(_ref2 => {
	          let [stream_id, value] = _ref2;
	          const auxiliary = value === null || value === void 0 ? void 0 : value.auxiliary;
	          const camera = value === null || value === void 0 ? void 0 : value.camera;
	          const data = auxiliary || camera; // 优先去取屏幕共享流，毕竟屏幕共享流和视频流不共存。
	          if (data) {
	            const personId = this._vcsIns.roomInfo.getID(stream_id);
	            const person = this._vcsIns.roomInfo.getPeer(personId);
	            const connectionState = {
	              id: `${personId}_remote_${auxiliary ? 'screen' : 'video'}`,
	              closed: false,
	              customType: auxiliary ? 'pullPeerScreenStream' : 'pullPeerVideoStream',
	              time: new Date().getTime(),
	              person
	              // 这几个参数业务层都没用到，不去取了。
	              // startConnectTime: this.startConnectTime,
	              // connectionState: this._peerConnection.connectionState,
	              // iceConnectionState: this._peerConnection.iceConnectionState,
	            };
	            connectionState.keyFramesDecoded = data.keyFramesDecoded;
	            connectionState["bytesReceived/s"] = data.receiveBitrate / 1024 / 8;
	            connectionState.packetsReceived = data.receivePackets;
	            connectionState.afterPackersLost = data.receivePacketsLost || 0;
	            connectionState.beforePackersLost = data.receivePacketsLost || 0;

	            // 上报到vcs，目前只支持上报视频和屏幕流。不上报音频流，看业务层也没对音频流做任何处理。
	            this._vcsIns._signaling_state_change(connectionState);
	          }
	        });
	      });
	    }, 2000);
	  }
	  /**
	   * @description 观众角色，创建信令实例，通过cdn地址拉流，建立webrtc连接
	   * */
	  _createSiganling() {
	    var _enterData$room, _enterData$room2;
	    const enterData = this._vcsIns.getEnterRoomData();
	    this._signalingIns = new WSSignaling({
	      userID: this._enterRoomParams.ertcParams.userId,
	      // 用户ID
	      serv: `${enterData.stream_host}:${enterData.stream_port}`,
	      conf: (_enterData$room = enterData.room) === null || _enterData$room === void 0 ? void 0 : _enterData$room.sdk_no,
	      token: enterData.session,
	      roomNo: (_enterData$room2 = enterData.room) === null || _enterData$room2 === void 0 ? void 0 : _enterData$room2.no,
	      // 会议号
	      prefix: this._enterRoomParams.ertcParams.domain,
	      amixer: this._enterRoomParams.vcsParams.amixer,
	      cdnPrefix: true,
	      ertcParams: this._enterRoomParams.ertcParams
	    });

	    // 绑定信令状态事件
	    WSSignaling.event_signaling_change = this._vcsIns._signaling_state_change.bind(this._vcsIns);
	    WSSignaling.event_reconnect_signaling = this._vcsIns._signaling_reconnect.bind(this._vcsIns);
	    WSSignaling.event_network_change = this._vcsIns._signaling_network_change.bind(this._vcsIns);
	    WSSignaling.event_sync_stream = this._vcsIns._sync_stream.bind(this._vcsIns);
	    WSSignaling.event_user_stream_track = this._vcsIns.updateUserStreamLinkTrack.bind(this._vcsIns);
	    WSSignaling.event_disconnect_signaling = this._vcsIns._signaling_disconnect.bind(this._vcsIns);
	    WSSignaling.event_get_account = (() => {
	      return this._vcsIns.getAccountState();
	    }).bind(this._vcsIns);
	  }
	  // 更新stream
	  _updateStreamTrack(stream, oldTrack, newTrack) {
	    oldTrack && stream.removeTrack(oldTrack);
	    newTrack && stream.addTrack(newTrack);
	  }
	  /**
	   * @description 重置房间内状态
	   * */
	  _resetRoomStatus() {
	    this._rtcType = null;
	    this._drtcNetworkState = null;
	    this._mqttNetworkState = null;
	    this._transactions = {};
	    this._role = null;
	    this._remoteMixAudioTrack = null; // 混音音频轨道
	    this._remoteMixAudioStream = null; // 混音音频流

	    this._remoteScreenStream = null; // 远端用户的屏幕流
	    this._remoteScreenTrack = null;
	    this._remoteUserStreams = {}; // 远端用户的视频流/屏幕流
	    this._remoteUserTracks = {};

	    // this._remoteUserMicMuted = {}

	    this._drtcMediaReconnectFailTrackIds = [];
	    this._remoteVidioStats = null;
	    clearInterval(this._remoteVideoStatsIntervalId);
	    this._remoteVideoStatsIntervalId = null;
	    this._resetLocalTrackStatus();
	  }
	  // 重置本地音视频状态
	  _resetLocalTrackStatus() {
	    var _this$_localVideoTrac2, _this$_localAudioTrac2, _this$_localScreenVid2;
	    (_this$_localVideoTrac2 = this._localVideoTrack) === null || _this$_localVideoTrac2 === void 0 || _this$_localVideoTrac2.close();
	    this._localVideoTrack = null; // 本地采集的视频轨道

	    (_this$_localAudioTrac2 = this._localAudioTrack) === null || _this$_localAudioTrac2 === void 0 || _this$_localAudioTrac2.close();
	    this._localAudioTrack = null; // 本地采集的音频轨道

	    (_this$_localScreenVid2 = this._localScreenVideoTrack) === null || _this$_localScreenVid2 === void 0 || _this$_localScreenVid2.close();
	    this._localScreenVideoTrack = null; // 本地采集的屏幕轨道
	  }
	  /**
	   * @description 添加drtc重连待执行函数，在mqtt重连后触发
	   * */
	  _addDrtcReconnect(fn) {
	    if (this._transactions['drtc_reconnect']) {
	      const oldTransaction = this._transactions['drtc_reconnect'].bind(this);
	      this._transactions['drtc_reconnect'] = () => {
	        oldTransaction();
	        fn();
	      };
	    } else {
	      this._transactions['drtc_reconnect'] = fn.bind(this);
	    }
	  }
	}
	_defineProperty(D_MRTC, "EVENT", {
	  // REMOTE_STREAM_AVAILABLE_AMIXER: 'REMOTE_STREAM_AVAILABLE_AMIXER', // 远端混音流可用
	});

	class MRTC {
	  /**
	   * @description 构造函数
	   * @param {Object} params
	   * @param {Object} params.vcsIns // 风远sdk实例
	   * @param {Object} params.vcsTypes // 风远sdk的常量枚举值
	   * @param {boolean} [params.debug] // 是否开启调试模式，日志打印
	   * @param {boolean} [params.exportLogs] // 是否支持日志导出
	   * @param {string} [params.domain] // api域名前缀（钉钉会议中是不需要的，通过enterRoom的params中传递了）
	   * @param {string} [param.rtcPlatformAbility] // rtc平台能力
	   * */
	  constructor(params) {
	    // 否则走后续初始化逻辑
	    this._emrtcIns = new E_MRTC(params);
	    this._dmrtcIns = new D_MRTC(params);
	    this._vcsIns = params.vcsIns || {};

	    // 初始变量
	    this._platformType = localStorage.getItem('mrtc-platformType') || null;
	    this._platformMap = {
	      'EZVIZ': '_emrtcIns',
	      'DING': '_dmrtcIns'
	    };
	    // this._rtcType = localStorage.getItem('mrtc-rtcType') || null // 当前sdk rtc接入类型 vcs | ertc，在加入房间接口获取
	    this._globalParams = params; // 初始化的全局参数

	    // 返回proxy,捕获未定义函数和_rtcType为vcs时，代理到vcsIns
	    return new Proxy(this, {
	      get: function (target, prop) {
	        const isUndefinedPros = !(prop in target); // 是否在当前实例上存在
	        // const isSelfProperty = [].includes(prop) // 是否是私有变量，主要是两个实例对象，避免 _rtcType 是 vcs的时候，从 _vcsIns里去找 mrtc的函数和变量 （有isUndefinedPros判断了，好像这个判断条件没作用了）
	        // const isSelfFun = ['_getRoomAndPlatform'].includes(prop) // 是否是私有函数
	        // const isRebuild = ['enterRoom'].includes(prop) // 是否在业务层已改造传参的函数
	        const platformRtc = target._platformMap[target._platformType];
	        if (!isUndefinedPros) {
	          // 如果当前实例上存在，则返回当前实例上的方法/属性
	          return target[prop];
	        }
	        if (platformRtc) {
	          // 如果当前 platformRtc 已存在，说明已经调用过enterRoom方法，则返回对应平台实例上的方法/属性
	          if (typeof target[platformRtc][prop] === 'function') {
	            return target[platformRtc][prop].bind(target[platformRtc]);
	          } else {
	            return target[platformRtc][prop];
	          }
	        } else {
	          // 不存在 platformRtc，则直接返回风远vcs上的方法/属性
	          return target._vcsIns[prop];
	        }
	      },
	      set: function (target, prop, value) {
	        // 在业务层调用赋值的时候，避免直接赋值到当前实例上，而取值却到_vcsIns上，导致获取不到的情况，统一赋值取值都去_vcsIns上
	        const platformRtc = target._platformMap[target._platformType];
	        const isUndefinedPros = !(prop in target);
	        if (!isUndefinedPros) {
	          target[prop] = value;
	          return true;
	        }
	        if (platformRtc) {
	          target[platformRtc][prop] = value;
	        } else {
	          target._vcsIns[prop] = value;
	        }
	        return true;
	      }
	    });
	  }
	  /**
	   * @description 加入房间
	   * @param {Object} params
	   * @param {Object} params.vcsParams
	   * @param {Object} params.vcsParams.roomOption
	   * @param {string} params.vcsParams.roomOption.room_no // 会议ID
	   * @param {string} [params.vcsParams.roomOption.password] // 会议密码
	   * @param {string} [params.vcsParams.roomOption.device_id] // 设备id
	   * @param {string} [params.vcsParams.roomOption.upload_id] // ？
	   * @param {string} [params.vcsParams.roomOption.lineID] // 线路id
	   * @param {boolean} params.vcsParams.amixer // 是否混音
	   * @param {Object} params.vcsParams.accountData
	   * @param {string} params.vcsParams.accountData.audio_state // 入会是否开启音频
	   * @param {string} params.vcsParams.accountData.video_state // 入会是否开启视频
	   * @param {string} params.vcsParams.accountData.nickname // 入会昵称
	   * @param {string} [params.vcsParams.inviterUid] // 邀请人uid
	   * @param {string} [params.vcsParams.webinar_invitation_link_code] // ？
	   * @param {string} [params.vcsParams.test] // ？
	   * @param {Object} params.ertcParams
	   * @param {string} params.ertcParams.appId // 控制台应用id
	   * @param {string} params.ertcParams.roomId // 房间id
	   * @param {string} params.ertcParams.userId // 用户id
	   * @param {string} params.ertcParams.accessToken // 用户资源token
	   * @param {string} params.ertcParams.domain // 域名前缀，会覆盖实例化时候的入参domain
	   * */
	  async enterRoom(params) {
	    var _res$data$rtcInfo, _res$data$rtcInfo2;
	    // 获取房间信息和平台类型
	    const res = await this._getRoomAndPlatform(params);
	    const platformAppId = res.data.appId;
	    const platformType = res.data.platformType;
	    const dingInfo = (_res$data$rtcInfo = res.data.rtcInfo) === null || _res$data$rtcInfo === void 0 ? void 0 : _res$data$rtcInfo.ding;
	    const ezvizInfo = (_res$data$rtcInfo2 = res.data.rtcInfo) === null || _res$data$rtcInfo2 === void 0 ? void 0 : _res$data$rtcInfo2.ezviz;
	    this._platformType = platformType;
	    localStorage.setItem('mrtc-platformType', platformType);
	    if (platformType === 'EZVIZ' && ezvizInfo) {
	      // ertc入会
	      return this._emrtcIns.enterRoom(params);
	    }
	    if (platformType === 'DING' && dingInfo) {
	      // 钉钉rtc入会
	      return this._dmrtcIns.enterRoom({
	        ...params,
	        drtcParams: {
	          appId: platformAppId,
	          token: dingInfo.token,
	          uid: params.ertcParams.userId,
	          userName: params.vcsParams.accountData.nickname,
	          channel: params.ertcParams.roomId,
	          initMicMuted: true
	        }
	      });
	    }
	  }
	  // 获取房间信息和平台类型
	  _getRoomAndPlatform(params) {
	    return new Promise((resolve, reject) => {
	      const requestData = {
	        strRoomId: params.ertcParams.roomId,
	        customId: params.ertcParams.userId,
	        appId: params.ertcParams.appId,
	        rtcPlatformAbility: this._globalParams.rtcPlatformAbility || 2,
	        // 1:ertc 2:drtc 3:ertc+drtc，现在默认写死2
	        bizCode: 'WEBRTC'
	      };
	      fetchData({
	        url: `${params.ertcParams.domain || "https://open.ys7.com"}/api/v3/ertc/room/enter-info`,
	        method: 'POST',
	        data: requestData,
	        headerOptions: {
	          accessToken: params.ertcParams.accessToken
	        }
	      }).then(res => {
	        var _res$meta;
	        if (((_res$meta = res.meta) === null || _res$meta === void 0 ? void 0 : _res$meta.code) === 200) {
	          resolve(res);
	        } else {
	          reject(res);
	        }
	      }).catch(reject);
	    });
	  }
	}
	_defineProperty(MRTC, "EVENT", {
	  // REMOTE_STREAM_AVAILABLE_AMIXER: 'REMOTE_STREAM_AVAILABLE_AMIXER', // 远端混音流可用
	});

	const ERTC = EzRtc;
	const ERTCDevice = EzRtcDevice;
	const MRTC_WEB = MRTC;
	const EMRTC_WEB = E_MRTC;

	exports.EMRTC_WEB = EMRTC_WEB;
	exports.ERTC = ERTC;
	exports.ERTCDevice = ERTCDevice;
	exports.MRTC_WEB = MRTC_WEB;
	exports.default = ERTC;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
