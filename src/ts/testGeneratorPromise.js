'use strict';

let n = 0;

Promise.prototype = {

    then: function(onResolved, onRejected){
        let {state, value, deferredOnResolved, name, promise} = this;

        if (state === 'pending'){
            deferredOnResolved.push(onResolved);
            return;
        }

        if (typeof onResolved === 'function') {
            console.log(`接着执行 ${onResolved.name} 来处理`, value);
            value = onResolved.call(this, value);
        }

        if (value instanceof Promise) return value;

        console.log(`任务${name}执行结束！`);
        return Object.create(promise, {value: {value: value}});
    },
};

Promise.resolve= function (v) {
    /*
       如果传入的参数v是个另一个promise或者thenable对象(带有then方法)，则在该对象后尾随一个then。
       等待该对象resolved后，再调用当前promise对象的resolve。
       也就是先执行新传入的promise/thenable，再执行自己的promise。
       这意味着新的promise是自己成功执行的【前置任务】！
    */
    if (v && typeof v.then === 'function') {
        let callback = new Proxy(this.resolve.bind(this), {
            get: (target, property) => {
                if (property === 'name') return 'resolve_' + this.name;
                else return target[property];
            }
        });
        v.then(callback);
        return;
    }

    this.state = 'resolved';
    this.value = v;
    this.deferredOnResolved.forEach((call) => setTimeout(call(v)));
    console.groupEnd();

    /*
    如果放在后面这段执行，则意味着新的promise是自己成功执行的【后续任务】！
    // todo test resolve w/o bind
    if (v && typeof v.then === 'function') {
        v.then(this.resolve.bind(this));
        return;
    }
    */
};

Promise.reject = function (e){
    this.state = 'rejected';
    console.log(e);
};


    /*
    * 承诺要完成一项任务
    * @constructor
    * @this {Promise}
    * @param {string} mission 执行任务函数
    * @return {?}
     */
function Promise(mission){
    let status = {
        name: mission.name,
        description: mission.description,
        state: 'pending',
        value: undefined,

        //同一个promise之后，多次调用（注意不是链式调用）then，则排队执行
        deferredOnResolved: [],

        resolve: Promise.resolve,
        reject: Promise.reject,
        promise: this,
    };

    this.then = this.then.bind(status);

    console.group('#' + n++, `开始任务“${mission.name}”——${mission.description}!`);

    mission(Promise.resolve.bind(status), Promise.reject.bind(status));
}

reading.description = '坚持阅读';
searchBooks.description = '先找找书';

let boom = new Promise(reading);

function reading(/*要读*/resolve, /*没完成*/reject){
    let readWhat = new Promise(searchBooks);
    readWhat.then(function ifFound(books){
        borrowBooks.description = '然后借书';
        function borrowBooks(toBargain, reject){
            toBargain(books);
            return books;
        }
        return new Promise(borrowBooks).then(function ifGot(books){
            console.log(`》》》我借到${books}了！`);
        })
    });

    // resolve 是传入参数arguments[0]的代号，当传入给它一个new Promise时:
    // 它调用new Promise.then(resolve)，即等待new Promise在settled以后才执行当前体内的resolve；
    resolve(readWhat); // ==> search.then(resolve)

}

function searchBooks(/*找到了*/ toFind, /*没找到*/ reject){
    //找啊找……
    let theBook = (function searching(){
        let rate = Math.random() * 10;
        return rate > 0 ? '《金瓶梅》' : undefined; //找到《金瓶梅》
    })();

    if(theBook) {
        // ifFound 是传入参数arguments[0]的代号，实际是它在Promise内被定义，是匿名函数, 体内有2句话:
        // 1.一旦被调用就改变当前所在Promise的状态为Resolved；2.执行延迟的回调；
        toFind(theBook);
    } else {
        reject(`抱歉，没找到 theBook `);
    }
}
