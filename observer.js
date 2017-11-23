
// 3. Observer Subject ConcreteObserver ConcreteSubject

// Observer.update(signal) -> ConcreteObserver.update
// Subject.notify(signal) -> ConcreteSubject.notify(){this.observers.update}
const I = require('./interface');
const U = require('./util');
const Interface = I.Interface;
const u = U.Util;

class Observer extends Interface {
    constructor(subjectName) {
        super(subjectName, 'update');
        this['i'+subjectName+'Update'] = function(signal){
            console.log(signal);
        }
    }
}

class Subject extends Interface {
    constructor(subjectName) {
        super(subjectName, 'notify');
        let observerList = 'on' + subjectName + 'Observers';
        this[observerList] = new Set;
        this['i'+subjectName+'Notify'] = function (signal) {
            this[observerList].forEach((o) => o['i'+subjectName+'Update'](signal));
        }
    }
}

let concreteSubject = {name: 'conSub'};

let concreteObserver = {name: 'conOb'};

function observe(subject, observer, signal){
    signal = u.capitalize(signal);
    u.extend(subject, new Subject(signal));
    u.extend(observer, new Observer(signal));
    subject['on'+signal+'Observers'].add(observer);
}

observe(concreteSubject, concreteObserver, 'click');
console.log(concreteObserver,concreteSubject);

concreteSubject.iClickNotify(1);