declare const Util: {
    capitalize: (str: any) => any;
    setObject: (branches: any, object: any) => void;
    extend: (target: any, source: any) => void;
};
declare function log(...args: any[]): void;
declare let win: any, doc: any;
declare let proto_obj: Object;
declare let judges: {
    isNull: (a: any) => boolean;
    isUndefined: (a: any) => boolean;
    isNumber: (a: any) => boolean;
    isString: (a: any) => boolean;
    isBoolean: (a: any) => boolean;
    isPrimitive: (b: any) => boolean;
    isArray: (a: any) => boolean;
    isFunction: (a: any) => boolean;
    isPlainObject: (o: any) => boolean;
    isWindow: (o: any) => boolean;
    isEmptyObject: (o: any) => boolean;
};
declare const u: {
    capitalize: (str: any) => any;
    setObject: (branches: any, object: any) => void;
    extend: (target: any, source: any) => void;
};
declare class Interface {
    static equipInterface: object;
    static placeholder: object;
    constructor(faceName: any, ...traitNameList: any[]);
}
declare class Observer extends Interface {
    constructor(subjectName: any);
}
declare class Subject extends Interface {
    constructor(subjectName: any);
}
declare let concreteSubject: {
    name: string;
};
declare let concreteObserver: {
    name: string;
};
declare function observe(subject: any, observer: any, signal: any): void;
