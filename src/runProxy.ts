export function runProxy(state, key = 'this', callback) {
    if (typeof state != 'object' || state == null || Array.isArray(state)) {
        return state
    }
    let prototype: any = {}
    prototype.__proto__ = Object.getPrototypeOf(state);
    prototype['$__get__$'] = function () {
        return state;
    }
    let keys = Object.keys(state);
    keys.forEach((x) => {
        prototype[x] = runProxy(state[x], key + '.' + x, callback);
    })
    // for (let x in state) {
    //     prototype[x] = runProxy(state[x], key + '.' + x, callback);
    // }
    let p = new Proxy(state, {
        set(target, property, value, receiver) {
            let oldValue = target[property]
            let newValue = value;
            try {
                if (newValue != null && typeof newValue['$__get__$'] == "function") {
                    newValue = newValue['$__get__$']();
                }
            } catch (e) {
                console.warn(newValue)
            }
            callback(key + '.' + property.toString(), oldValue, newValue)
            prototype[property] = runProxy(value, key + '.' + property.toString(), callback);

            //return target[property]=newValue
            return Reflect.set(target, property, newValue);
        },
        get(target, property) {

            return Reflect.get(prototype, property);
        }
    })

    return p;
}