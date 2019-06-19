'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.default = void 0;
var _ky = _interopRequireDefault(require('ky'));
var _ = _interopRequireWildcard(require('lodash'));
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
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
function _interopRequireDefault(obj) {
    return obj && obj.__esModule
        ? obj
        : {
              default: obj
          };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc =
                        Object.defineProperty && Object.getOwnPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(
                Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(
                        source,
                        sym
                    ).enumerable;
                })
            );
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _throw(e) {
    throw e;
}
var LOG_METHODS = ['error', 'warn', 'info', 'debug', 'trace'];
var DEFAULT_INTERVAL = 1000 * 10;
var LogBatch = function LogBatch(param) {
    var options = param === void 0 ? {} : param;
    _classCallCheck(this, LogBatch);
    _defineProperty(
        this,
        'getStore',
        function() {
            return this.logStore;
        }.bind(this)
    );
    _defineProperty(
        this,
        'setStore',
        function(s) {
            this.logStore = _objectSpread({}, s, {
                updatedAt: new Date()
            });
        }.bind(this)
    );
    _defineProperty(
        this,
        'add',
        function(item) {
            var store = this.getStore();
            Array.isArray(store.logObjs)
                ? store.logObjs.push(item)
                : (store.logObjs = [item]);
            this.setStore(store);
        }.bind(this)
    );
    _defineProperty(
        this,
        'clear',
        function() {
            console.debug('clearing log store...');
            var store = this.getStore();
            store.logObjs = [];
            this.setStore(store);
        }.bind(this)
    );
    _defineProperty(
        this,
        'send',
        async function() {
            var headers = this._headers;
            var httpHeaders = _.isFunction(headers)
                ? headers()
                : _.isPlainObject(headers)
                ? headers
                : undefined;
            var store = this.getStore();
            var logObjs = store.logObjs;
            if (Array.isArray(logObjs) && logObjs.length > 0) {
                var result = await _ky.default
                    .post('/client-logs', {
                        json: {
                            logObjs: logObjs
                        },
                        headers: httpHeaders
                    })
                    .json();
                console.debug('result:', result);
                console.debug('store: ', store);
                this.clear();
            } else {
                console.debug('no log messages sent - none found in store');
            }
        }.bind(this)
    );
    _defineProperty(
        this,
        'interval',
        async function() {
            try {
                await this.send();
            } catch (error) {
                throw error;
            }
        }.bind(this)
    );
    _defineProperty(
        this,
        '_startInterval',
        function() {
            setInterval(this.interval, this.intervalDuration);
        }.bind(this)
    );
    _defineProperty(
        this,
        '_stopInterval',
        function() {
            clearInterval(this.interval);
        }.bind(this)
    );
    this._headers = options.headers || undefined;
    this.intervalDuration = options.interval || DEFAULT_INTERVAL;
    this.logStore = {
        logObjs: [],
        createdAt: new Date()
    };
    this._startInterval();
};
var logLevelRemote = function(log, param) {
    var options = param === void 0 ? {} : param;
    if (options === {}) {
        throw new Error('logLevelRemote options cannot be empty');
    }
    var ref = options
            ? options
            : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")),
        version = ref.version,
        client = ref.client,
        headers = ref.headers,
        interval = ref.interval;
    var logBatch = new LogBatch({
        headers: headers,
        interval: interval
    });
    console.debug('logLevelRemote:', options);
    var originalFactory = log.methodFactory;
    log.methodFactory = function(methodName, logLevel, loggerName) {
        console.debug('methodFactory:', methodName, logLevel, loggerName);
        var rawMethod = originalFactory(methodName, logLevel, loggerName);
        var logMethod = _.indexOf(LOG_METHODS, methodName);
        return function() {
            for (
                var _len = arguments.length,
                    messages = new Array(_len),
                    _key = 0;
                _key < _len;
                _key++
            ) {
                messages[_key] = arguments[_key];
            }
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
            rawMethod.apply(void 0, messages);
        };
    };
    log.setLevel(log.getLevel());
};
var _default = logLevelRemote;
exports.default = _default;
