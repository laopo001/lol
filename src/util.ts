
export function split(effect) {
    let zz = effect.split('/');
    return {
        namespace: zz[0],
        effect: zz[1]
    }
}
export function tryRun(func: Function, funcThis: any, args: any[], thenFunc, errorFunc, thenArgs?) {
    try {
        let result = func.apply(funcThis, args);
        if (result instanceof Promise) {
            result.then(thenFunc.bind(funcThis, ...thenArgs), errorFunc)
        } else {
            thenFunc.call(funcThis, ...thenArgs)
        }
        return result;
    } catch (e) {
        errorFunc(e,true)
    }
}

export function autoLoad(key: string, select: Function = function () { return this }, time?: number) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        let old = descriptor.value;
        let newValue = function (...args) {
            select.call(this)[key] = true;
            let res = old.apply(this, args)
            res.then(() => {
                select.call(this)[key] = false;
            }).catch(() => {
                if (select.call(this)[key]) select.call(this)[key] = false;
            })
            if (time) {
                setTimeout(() => {
                    if (select.call(this)[key]) select.call(this)[key] = false;
                }, time)
            }

            return res;
        }
        Object.assign(newValue,old)
        descriptor.value = newValue
    }
}
var throttleF = require('lodash.throttle');
export function throttle(time: number, option: Object) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        let old = descriptor.value;
        let newValue = throttleF(old, time, option)
        descriptor.value = newValue
    }
}

export function toBoolean(value: any): boolean {

    switch (value) {
        case '':
            return true;
        case 'true':
            return true;
        case 'false':
        case '1':
            return true;
        case '0':
            return false;
        default:
            return !!value;
    }
}
export function format(formatFnc: Function): any {
    return function (target: any, key: string, descriptor) {
        //var t = Reflect.getMetadata("design:type", target, key);
        //console.log(`${key} type: ${t.name}`);
        Object.defineProperty(target, key, {
            set: function (x) {
                this['$_' + key] = formatFnc(x)
            },
            get: function () {
                return this['$_' + key];
            }
        })
    }
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
export function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error(message)
    }
    /* eslint-enable no-console */
    try {
        // This error was thrown as a convenience so that if you enable
        // "break on all exceptions" in your console,
        // it would pause the execution at this line.
        throw new Error(message)
        /* eslint-disable no-empty */
    } catch (e) { }
    /* eslint-enable no-empty */
}

export function createClass(className): any {
    let data = new className();
    let effects = data.__proto__;
    while (!('$__namespace__$' in effects)) {
        effects = effects.__proto__;
    }
    let namespace = effects['$__namespace__$'];
    let onError = effects['onError'];
    delete effects['onError']
    let temp = { namespace };
    delete effects['$__namespace__$']
    Object.keys(effects).filter(x => x !== 'onError').forEach((x) => {

        let res = Object.getOwnPropertyDescriptor(effects, x);
        if (res.value == null) {
            Object.defineProperty(temp, x, res);
        } else {
            temp[x] = namespace + '/' + x
        }

    })

    // data.__proto__=Object.getPrototypeOf({})
    data.__proto__ = temp;
    return {
        effects: effects,
        state: data,
        namespace: namespace,
        onError: onError
    }
}
