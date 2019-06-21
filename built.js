"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var _ky = _interopRequireDefault(require("ky"));

var _ = _interopRequireWildcard(require("lodash"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line
var VERSION = "0.2.2";
var LOG_METHODS = ['error', 'warn', 'info', 'debug', 'trace'];
var DEFAULT_INTERVAL = 1000 * 10;

var LogBatch = function LogBatch() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, LogBatch);

  _defineProperty(this, "getStore", function () {
    return _this.logStore;
  });

  _defineProperty(this, "setStore", function (s) {
    _this.logStore = _objectSpread({}, s, {
      updatedAt: new Date()
    });
  });

  _defineProperty(this, "add", function (item) {
    var store = _this.getStore();

    Array.isArray(store.logObjs) ? store.logObjs.push(item) : store.logObjs = [item];

    _this.setStore(store);
  });

  _defineProperty(this, "clear", function () {
    console.debug('clearing log store...');

    var store = _this.getStore();

    store.logObjs = [];

    _this.setStore(store);
  });

  _defineProperty(this, "send",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var headers, httpHeaders, store, logObjs, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            headers = _this._headers;
            httpHeaders = _.isFunction(headers) ? headers() : _.isPlainObject(headers) ? headers : undefined;
            store = _this.getStore();
            logObjs = store.logObjs;

            if (!(Array.isArray(logObjs) && logObjs.length > 0)) {
              _context.next = 19;
              break;
            }

            _context.prev = 5;
            _context.next = 8;
            return _ky.default.post('/client-logs', {
              json: {
                logObjs: logObjs
              },
              headers: httpHeaders
            }).json();

          case 8:
            result = _context.sent;
            console.debug('result:', result);
            console.debug('store: ', store);

            _this.clear();

            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](5);
            console.error(_context.t0);

          case 17:
            _context.next = 20;
            break;

          case 19:
            console.debug('no log messages sent - none found in store');

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 14]]);
  })));

  _defineProperty(this, "interval",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _this.send();

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 5]]);
  })));

  _defineProperty(this, "_startInterval", function () {
    setInterval(_this.interval, _this.intervalDuration);
  });

  _defineProperty(this, "_stopInterval", function () {
    clearInterval(_this.interval);
  });

  console.debug("loglevel-remote v".concat(VERSION));
  this._headers = options.headers || undefined;
  this.intervalDuration = options.interval || DEFAULT_INTERVAL;
  this.logStore = {
    logObjs: [],
    createdAt: new Date()
  };

  this._startInterval();
};

var logLevelRemote = function logLevelRemote(log) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (options === {}) {
    throw new Error("logLevelRemote options cannot be empty");
  }

  var version = options.version,
      client = options.client,
      headers = options.headers,
      interval = options.interval;
  var logBatch = new LogBatch({
    headers: headers,
    interval: interval
  });
  console.debug('logLevelRemote:', options);
  var originalFactory = log.methodFactory;

  log.methodFactory = function (methodName, logLevel, loggerName) {
    console.debug('methodFactory:', methodName, logLevel, loggerName);
    var rawMethod = originalFactory(methodName, logLevel, loggerName);

    var logMethod = _.indexOf(LOG_METHODS, methodName);

    return function () {
      for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
        messages[_key] = arguments[_key];
      }

      try {
        console.debug('messages', messages);
        var logObj = {
          version: version,
          client: client,
          level: _.isNil(logMethod) ? -1 : logMethod,
          label: loggerName,
          occurredAt: new Date(),
          args: messages,
          trace: new Error().stack
        };
        logBatch.add(logObj);
      } catch (error) {
        console.error(error);
      }

      rawMethod.apply(void 0, messages);
    };
  };

  log.setLevel(log.getLevel());
};

var _default = logLevelRemote;
exports.default = _default;
