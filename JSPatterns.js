import {Util as u} from 'util';
import Interface from './interface';

// 1. Singleton

let tester = (function () {
    let _static, instance;

    function Singleton({x, y}) {
        this.x = x;
        this.m = function f() {
            console.log(y);
        }
    }

    _static = {
        getInstance: function (config) {
            return instance || new Singleton(config);
        }
    };

    return _static;
})();

tester.getInstance({x: 1, y: 2}).m();
tester.getInstance({x: 1, y: 23}).m();


// 2. module
// 2.1 jQuery module

function library(module) {
    $(function () {
        module.init && module.init();
    });
    return module;
}

function myModule() {
    let privateProperty = [];

    function privateMethod() {
    }

    return {
        init: function init() {
            console.log('initialized.');
        },
        publicProperty: "public p",
        publicMethod: function () {
            return privateMethod();
        }
    }
}

library(myModule);

// 2.2 Dojo module

let store = {};

u.setObject('basket.core', myModule).bind(store);
console.log(store);

// 3. Observer Subject ConcreteObserver ConcreteSubject

// Observer.update(signal) -> ConcreteObserver.update
// Subject.notify(signal) -> ConcreteSubject.notify(){this.observers.update}

class Observer extends Interface {
    constructor(subjectName) {
        super(subjectName, 'update');
    }
}

class Subject extends Interface {
    constructor(subjectName) {
        super(subjectName, 'notify');
        let observerList = 'on' + subjectName + 'Observers';
        this[observerList] = new WeakSet;
        this.notify = function (signal) {
            this[observerList].forEach((o) => o.update(signal));
        }
    }
}

let doc = window.document;

let concreteSubject = doc.createElement('button');
u.extend(concreteSubject, new Subject('click'));

let concreteObserver = doc.createElement('input');
concreteObserver.type = 'check';
u.extend(concreteObserver, new Observer('click'));

concreteSubject.onClickObservers.add(concreteObserver);