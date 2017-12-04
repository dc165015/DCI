/// <reference path="../src/d.ts/AOP.d.ts"/>

import AOP = require('../src/jspatterns/AOP');

let o: any = {
    x: [],
    f: function(n: any) {
        console.log('I am here', ++n);
        return n;
    },
};

AOP.advice(o, 'f', {
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
});

o.f(0);

o.f.revoke();

o.f(0);

let n = 1;

function intro(n) {
    return function(subject, cutin) {
        subject.push(`${n}>>>`);
        cutin();
        subject.push(`<<<${n}`);
    };
}

AOP.advice(o, 'x', { introduce: intro(n++) });

o.x.moreIntroduce(intro(n++));
o.x.moreIntroduce(intro(n++));

o.x.setOffIntroductions();
