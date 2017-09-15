/**
 * 日志模块
 * @module Logger 
 * 
 */

/**
 * 日志生成
 * @class Logger
 */
export class Logger {
    list = []
    index = 0

    /**
     * 创建一个实例
     * @constructor {any} args 
     */
    constructor(...args) {
        if (args.length != 0) {
            this.list.push(args);
        }
    }
    pause() {
        for (var i = this.index; i < this.list.length; i++) {
            if (i == 0) {
                console.group.apply(window, this.list[i]);
                continue;
            }
            console.log.apply(window, this.list[i]);
        }
        this.index = i;
        return this;
    }
    log(...message) {
        this.list.push({ type: 'log', data: message });
        return this;
    }
    error(...message) {
        this.list.push({ type: 'error', data: message });
        return this;
    }
    wrap() {
        this.list.push('wrap');
        return this;
    }
    endWrap() {
        this.list.push('endWrap');
        return this;
    }
    end() {
        let open = 'groupCollapsed'
        let temp = this.list.filter((x) => {
            if (typeof x === 'object' && x.type === 'error') {
                return true;
            } else { return false }
        })
        if (temp.length > 0) { open = 'group'; }

        let q = 0;
        for (let i = 0; i < this.list.length; i++) {
            if (i == 0) {
                console[open].apply(window, this.list[i]);
                continue;
            }
            if (this.list[i] == 'wrap') {
                i++;
                q++;
                console[open].apply(window, this.list[i].data);
                continue;
            }
            if (this.list[i] == 'endWrap') {
                console.groupEnd()
                continue;
            }
            console[this.list[i].type].apply(window, this.list[i].data);

        }
        console.groupEnd()
        while (q > 0) {
            console.groupEnd();
            q--;
        }
    }
}


