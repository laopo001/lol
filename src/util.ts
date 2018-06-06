
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

