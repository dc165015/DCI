const Util = {
  capitalize: function(str) {
    str = str.trim();
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  },

  setObject: function(branches, object) {
    branches = branches.trim().split(".");
    let stem = this,
      parent,
      p;
    for (p of branches) {
      parent = stem;
      stem = stem[p] = stem[p] || {};
    }
    parent[p] = object;
  },

  extend: function(target, source) {
    for (let p in source) {
      target[p] = source[p];
    }
  }
};

function log(...args) {
  let n = 0;
  console.group("=====log=====");
  args.forEach(arg => console.log(`${++n}:  `, arg));
  console.groupEnd();
}

let win, doc;
if (typeof window !== "undefined") (win = window) && (doc = win.document);
let proto_obj = Object.prototype;

let judges = {
  isNull: function(a) {
    return a === null;
  },
  isUndefined: function(a) {
    return a === undefined;
  },
  isNumber: function(a) {
    return typeof a === "number";
  },
  isString: function(a) {
    return typeof a === "string";
  },
  isBoolean: function(a) {
    return typeof a === "boolean";
  },
  isPrimitive: function(b) {
    let a = typeof b;
    return (
      b === undefined ||
      b === null ||
      a == "boolean" ||
      a == "number" ||
      a == "string"
    );
  },
  isArray: function(a) {
    return proto_obj.toString.call(a) === "[object Array]";
  },
  isFunction: function(a) {
    return proto_obj.toString.call(a) === "[object Function]";
  },
  isPlainObject: function(o) {
    if (!o || o === win || o === doc || o === doc.body) {
      return false;
    }
    return (
      "isPrototypeOf" in o && proto_obj.toString.call(o) === "[object Object]"
    );
  },
  isWindow: function(o) {
    return o && typeof o === "object" && "setInterval" in o;
  },
  isEmptyObject: function(o) {
    for (let a in o) {
      return false;
    }
    return true;
  }
};

Object.assign(Util, judges);

///////////////////////////////////////////////////////////////////////////////

const u = Util;

class Interface {
  static equipInterface: object;
  static placeholder: object;
  constructor(faceName, ...traitNameList) {
    // traits should be instantiated by specific subject
    traitNameList.forEach(
      v => (this["i" + faceName + u.capitalize(v)] = Interface.placeholder)
    );
  }
}

Interface.equipInterface = function(object, face) {
  Object.assign(object, face);
};

Interface.placeholder = function() {
  throw new TypeError(
    `${this.name ||
      "This placeholder"} can not be executed before instantiation!`
  );
};

///////////////////////////////////////////////////////////////////////////////

class Observer extends Interface {
  constructor(subjectName) {
    super(subjectName, "update");
    this["i" + subjectName + "Update"] = function(signal) {
      log(signal);
    };
  }
}

class Subject extends Interface {
  constructor(subjectName) {
    super(subjectName, "notify");
    let observerList = "on" + subjectName + "Observers";
    this[observerList] = new Set();
    this["i" + subjectName + "Notify"] = function(signal) {
      this[observerList].forEach(o => o["i" + subjectName + "Update"](signal));
    };
  }
}

let concreteSubject = { name: "conSub" };

let concreteObserver = { name: "conOb" };

function observe(subject, observer, signal) {
  signal = u.capitalize(signal);
  u.extend(subject, new Subject(signal));
  u.extend(observer, new Observer(signal));
  subject["on" + signal + "Observers"].add(observer);
}

observe(concreteSubject, concreteObserver, "click");
log(concreteObserver, concreteSubject);

concreteSubject['iClickNotify'](1);
