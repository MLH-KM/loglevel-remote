"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var VERSION = "0.4.0";
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
  regeneratorRuntime.mark(function _callee2() {
    var headers, httpHeaders, store, logObjs, sendLogObjs, MAX_LOGS, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            headers = _this._headers;
            httpHeaders = _.isFunction(headers) ? headers() : _.isPlainObject(headers) ? headers : undefined;
            store = _this.getStore();
            logObjs = store.logObjs;

            if (!(Array.isArray(logObjs) && logObjs.length > 0)) {
              _context2.next = 22;
              break;
            }

            _context2.prev = 5;

            sendLogObjs =
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(logObjs) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _ky.default.post('/client-logs', {
                          json: {
                            logObjs: logObjs
                          },
                          headers: httpHeaders
                        }).json();

                      case 2:
                        return _context.abrupt("return", _context.sent);

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function sendLogObjs(_x) {
                return _ref2.apply(this, arguments);
              };
            }();

            MAX_LOGS = 10; // Chunk the logObjs before sending to avoid payload size failures.

            _context2.next = 10;
            return Promise.all(_.chunk(logObjs, MAX_LOGS).map(sendLogObjs));

          case 10:
            result = _context2.sent;
            console.debug('result:', result);
            console.debug('store:', store);

            _this.clear();

            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](5);
            console.error(_context2.t0); // TODO Remove this once only unique errors are sent back to the server

            _this.clear();

          case 20:
            _context2.next = 23;
            break;

          case 22:
            console.debug('no log messages sent - none found in store');

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 16]]);
  })));

  _defineProperty(this, "interval",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _this.send();

          case 3:
            _context3.next = 8;
            break;

          case 5:
            _context3.prev = 5;
            _context3.t0 = _context3["catch"](0);
            console.error(_context3.t0);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 5]]);
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
