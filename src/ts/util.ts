const Util = {
    capitalize(str: string) {
        str = str.trim();
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str;
    },

    setObject(branches: string, object: object) {
        const branchesList: string[] = branches.trim().split('.');
        let stem = this;
        let parent: object = this;
        let p;
        for (p of branchesList) {
            parent = stem;
            stem = stem[p] = stem[p] || {};
        }
        if (p && parent) {
            parent[p] = object;
        }
    },

    extend(target: object, source: object) {
        for (const p in source) {
            if (!['constructor', 'prototype'].includes(p)) {
                target[p] = source[p];
            }
        }
    },
};

function log(...args: any[]) {
    const logger = console;
    let n: number = 0;
    logger.group('=====log=====');
    args.forEach((arg) => logger.log(`${++n}:  `, arg));
    logger.groupEnd();
}

type IFunction = (...args: any[]) => any;

// let win, doc;
// if (typeof window !== 'undefined')
//    (win = window) && (doc = win.document);
// let proto_obj = Object.prototype;

// let judges = {
//     isNull: function (a) {
//         return a === null;
//     },
//     isUndefined: function (a) {
//         return a === undefined;
//     },
//     isNumber: function (a) {
//         return typeof a === 'number';
//     },
//     isString: function (a) {
//         return typeof a === 'string';
//     },
//     isBoolean: function (a) {
//         return typeof a === 'boolean';
//     },
//     isPrimitive: function (b) {
//         let a = typeof b;
//         return b === undefined || b === null || a == 'boolean' || a == 'number' || a == 'string';
//     },
//     isArray: function (a) {
//         return proto_obj.toString.call(a) === '[object Array]';
//     },
//     isFunction: function (a) {
//         return proto_obj.toString.call(a) === '[object Function]';
//     },
//     isPlainObject: function (o) {
//         if (!o || o === win || o === doc || o === doc.body) {
//             return false;
//         }
//         return 'isPrototypeOf' in o && proto_obj.toString.call(o) === '[object Object]';
//     },
//     isWindow: function (o) {
//         return o && typeof o === 'object' && 'setInterval' in o;
//     },
//     isEmptyObject: function (o) {
//         for (let a in o) {
//             return false;
//         }
//         return true;
//     },

// };

Object.assign(Util);

export { Util, log, IFunction };
// module.exports = {Util:Util, log:log};
