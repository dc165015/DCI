import { AbstractRule } from 'tslint/lib/rules';
import { AbstractFormatter } from 'tslint/lib/language/formatter/abstractFormatter';

// import AOP = require('../src/ts/jspatterns/AOP');
import {embed} from '../src/ts/jspatterns/AOP';

let o: any = {
    x: [],
    f: function(n: any) {
        console.log('I am here', ++n);
        return n;
    },
};

embed({
    before: n => {
        console.log('before', ++n);
        return n;
    },
    after: n => {
        console.log('after', ++n);
        return n;
    },
    wrap: (om, n) => {
        console.log('wrap', ++n);
        return om(n);
    },
}, o, 'f');

o.f(0);
o.f.revoke();

o.f(0);

let n = 0;

function intro(n) {
    return function(subject, cutin) {
        subject.push(`${n}>>>`);
        cutin();
        subject.push(`<<<${n}`);
    };
}

embed( { introduce: intro(n++) }, o, 'x');

o.x.cutIn(intro(n++));
o.x.cutIn(intro(n++));
o.x.cutIn(intro(n++));

console.log(o.x.setOffIntroductions());
console.log(n);