import { Logger } from './log'
import { runProxy } from './runProxy'
import { split, tryRun } from './util'
import $$observable from 'symbol-observable'
import 'reflect-metadata';

let error: any = function () { console.error('lol not run()') }

let currentListeners = []
let nextListeners = currentListeners

function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice()
    }
}
function subscribe(listener) {
    if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.')
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
        if (!isSubscribed) {
            return
        }

        isSubscribed = false

        ensureCanMutateNextListeners()
        const index = nextListeners.indexOf(listener)
        nextListeners.splice(index, 1)
    }
}
export class Observable<T> {
}

export declare function ErrorCallback(e): void;

export interface LOL {
    onError(ErrorCallback): LOL;
    models(...model): LOL;
    init(state): LOL;
    run(isProd: boolean): void;
    dispatch(action): any;
    select(cb: string | Function): any;
    getState(): any;
    asObservable(): Observable<any>;
    getEnv(): 'production' | 'development';
}


let _onError = function (e: Error) { };
const onError = function (ErrorCb: any) {
    _onError = ErrorCb;
    return lol;
}

// let _middlewares = [];
// lol.applyMiddleware = function (...middlewares) {
//     _middlewares = middlewares;
//     return lol;
// }


let _models = null;
const models = function (...models) {
    _models = models;
    return lol;
}
let _preloadedState = {};
const init = function (state) {
    _preloadedState = state;
    return lol;
}
let _isProd = false;
const getEnv = function () {
    return _isProd ? 'production' : 'development';
}


const run = function (isProd = false) {
    _isProd = isProd;
    if (_models == null) {
        console.error('models not initialized')
    }
    let res = {};
    let store = {}
    let all = {}
    _models.forEach((x) => {
        let res = new x();
        store[x.prototype[`$__namespace__$`]] = Object.assign(res, _preloadedState[x.prototype[`$__namespace__$`]]);
    });

    lol.dispatch = (action) => {

        if (typeof action.type === 'string') {
            let { namespace, effect } = split(action.type)
            return store[namespace][effect](action.payload);
        }
        if (typeof action.type === 'function') {
            let { namespace, effect } = split(action.type['funcName'])
            return store[namespace][effect](action.payload);
        }
    }
    lol.select = (cb) => {
        let res = null
        if (typeof cb === 'function') {
            res = cb(store)
        } else {
            res = store[cb];
        }
        if (res == null) {
            console.error('lol select model error')
        }
        return res;

    }
    lol.getState = function () { return store; };
    lol.asObservable = function Observable() {
        const outerSubscribe = subscribe
        return {
            /**
             * The minimal observable subscription method.
             * @returns {subscription} An object with an `unsubscribe` method that can
             * be used to unsubscribe the observable from the store, and prevent further
             * emission of values from the observable.
             */
            subscribe(next?, complete?, error?) {
                let observer: any = {}
                if (typeof next === 'object') {
                    observer = next;
                } else {
                    observer = { next, complete, error }
                }
                const observeState = () => {
                    if (observer) {
                        observer.next(this['__select__'] ? lol.select(this['__select__']) : lol.getState())
                    }
                }
                observeState()
                const unsubscribe = outerSubscribe(observeState)
                return { unsubscribe }
            },
            select(cb) {
                this['__select__'] = cb
                return this;
            },
            [$$observable]() {
                return this
            }
        }
    }

}
let lol: LOL = {
    dispatch: error,
    select: error,
    getState: error,
    getEnv: error,
    asObservable: error,
    run, init, models, onError
};



export default lol;

export interface modelQuery {
    namespace: string;
    onBefore?: Function;
    onAfter?: Function;
    onError?: Function;
}
/**
 * 装饰器 将class变成一个lol.model
 * @param {modelQuery} query 参数类型---modelQuery
 */
export function model(query: modelQuery): Function {
    return function (constructor: Function) {
        let { namespace, onBefore, onAfter, onError } = query;
        if (onBefore == null) { onBefore = function () { } }
        if (onAfter == null) { onAfter = function () { } }
        if (onError == null) { onError = function () { } }
        let effects = constructor.prototype;
        for (let x in effects) {
            if (typeof effects[x] == 'function') {
                let oldValue = effects[x];
                let newValue = function (...args) {

                    let selectCB = Reflect.getOwnMetadata(injectMetadataKey, effects, x);
                    let runError = (e, isThrow) => {
                        let ab = false;
                        // if (effects['onError']) {
                        //     ab = effects['onError'].call(this, e);
                        // }
                        ab = onError.call(this, e, x);
                        if (!ab) { _onError(e); }
                        if (isThrow) {
                            throw (e);
                        }
                    }
                    let before_after_arg = [x];
                    let ab = onBefore.call(this, ...before_after_arg);


                    if (!ab) return tryRun(oldValue, this, selectCB ? [args, ...lol.select(selectCB)] : args, function () {
                        const listeners = currentListeners = nextListeners
                        for (let i = 0; i < listeners.length; i++) {
                            const listener = listeners[i]
                            listener()
                        }
                        onAfter()
                    }, runError, before_after_arg);
                }

                newValue['funcName'] = namespace + '/' + x;
                effects[x] = newValue;
            }

        }

        constructor.prototype[`$__namespace__$`] = namespace
    }
}
/**
 * 日志生成装饰器
 * @param {boolean} b 默认为true，输出日志
 */
export function log(b: boolean = true): Function {
    return function (constructor: Function) {
        if (b && !_isProd) {
            let effects = constructor.prototype;
            for (let x in effects) {
                if (typeof effects[x] == 'function') {
                    let oldValue = effects[x];
                    let newValue = function (...args) {
                        let action = { type: this[`$__namespace__$`] + '/' + x, args: args }
                        let L = new Logger("dispatch log -----  %c" + action.type, "color:#6a8b82", " ----- action args:", action.args.length === 1 ? action.args[0] : action.args || 'arguments None');
                        // let state = lol.select(x => x[this[`$__namespace__$`]]);
                        let state = this;
                        var that = runProxy(state, this[`$__namespace__$`], (key, oldValue, newValue) => {
                            if (oldValue === newValue) {
                                L.log("change property:%s --- %coldValue:%o ====%c newValue:%o", key, "color:red", oldValue, "color:red", newValue)
                            } else {
                                L.log("change property:%s --- %coldValue:%o ---%c> newValue:%o", key, "color:red", oldValue, "color:green", newValue)
                            }

                        })
                        let runFollow = function () {
                            L.log("current state:", state).end()
                        }
                        let runError = function (e) {
                            L.error("error:", e).end()
                        }
                        return tryRun(oldValue, that, args, runFollow, runError);
                    }
                    Object.assign(newValue, oldValue)
                    effects[x] = newValue;
                }
            }
        }

    }
}

const injectMetadataKey = Symbol("inject");


/**
 * 注入其他namespace数据 装饰器
 * @param {(string | Function)} select 
 */
export function inject(select: string | Function): Function {
    return function (target: Object, propertyKey: string | symbol, descriptorORparameterIndex: number | PropertyDescriptor) {
        if (typeof descriptorORparameterIndex === 'number') {
            Reflect.defineMetadata(injectMetadataKey, select, target, propertyKey);
        } else {
            let oldValue = descriptorORparameterIndex.value;
            let newValue = function (...args) {
                args.push(lol.select(select))
                return oldValue.apply(this, args);
            }
            Object.assign(newValue, oldValue)
            descriptorORparameterIndex.value = newValue;
        }

    }
}
