import ky from 'ky';
import * as _ from 'lodash';

const LOG_METHODS = ['error', 'warn', 'info', 'debug', 'trace'];
const DEFAULT_INTERVAL = 1000 * 10;

class LogBatch {
    constructor(options = {}) {
        this._headers = options.headers || undefined;
        this.intervalDuration = options.interval || DEFAULT_INTERVAL;
        this.logStore = { logObjs: [], createdAt: new Date() };
        this._startInterval();
    }

    getStore = () => this.logStore;
    setStore = s => {
        this.logStore = { ...s, updatedAt: new Date() };
    };

    add = item => {
        const store = this.getStore();
        Array.isArray(store.logObjs)
            ? store.logObjs.push(item)
            : (store.logObjs = [item]);
        this.setStore(store);
    };

    clear = () => {
        console.debug('clearing log store...');
        const store = this.getStore();
        store.logObjs = [];
        this.setStore(store);
    };

    send = async () => {
        const headers = this._headers;
        const httpHeaders = _.isFunction(headers)
            ? headers()
            : _.isPlainObject(headers)
            ? headers
            : undefined;

        const store = this.getStore();
        const logObjs = store.logObjs;

        if (Array.isArray(logObjs) && logObjs.length > 0) {
            const result = await ky
                .post('/client-logs', {
                    json: { logObjs },
                    headers: httpHeaders
                })
                .json();

            console.debug('result:', result);
            console.debug('store: ', store);
            this.clear();
        } else {
            console.debug('no log messages sent - none found in store');
        }
    };

    interval = async () => {
        try {
            await this.send();
        } catch (error) {
            throw error;
        }
    };

    _startInterval = () => {
        setInterval(this.interval, this.intervalDuration);
    };

    _stopInterval = () => {
        clearInterval(this.interval);
    };
}

const logLevelRemote = (log, options = {}) => {
    if (options === {}) {
        throw new Error(`logLevelRemote options cannot be empty`);
    }

    const { version, client, headers, interval } = options;

    const logBatch = new LogBatch({ headers, interval });

    console.debug('logLevelRemote:', options);
    const originalFactory = log.methodFactory;

    log.methodFactory = (methodName, logLevel, loggerName) => {
        console.debug('methodFactory:', methodName, logLevel, loggerName);
        const rawMethod = originalFactory(methodName, logLevel, loggerName);
        const logMethod = _.indexOf(LOG_METHODS, methodName);

        return (...messages) => {
            console.debug('messages', messages);

            const logObj = {
                version,
                client,
                level: _.isNil(logMethod) ? -1 : logMethod,
                label: loggerName,
                occurredAt: new Date(),
                args: messages,
                trace: new Error().stack
            };

            logBatch.add(logObj);

            rawMethod(...messages);
        };
    };

    log.setLevel(log.getLevel());
};

export default logLevelRemote;
