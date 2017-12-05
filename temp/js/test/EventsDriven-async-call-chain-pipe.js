import { Messenger } from '../src/ts/jspatterns/pubsub2';
let mgr = new Messenger();
let procedureList = [
    ['book targeted', borrowBook],
    ['book borrowed', readBook],
    ['book has been read', returnBook],
    ['book returned', rateBook],
];
let procedure = new Map(procedureList);
procedure.forEach((callback, topic) => {
    mgr.subscribe(topic, callback);
});
let n = 0;
function log(msg) {
    console.log(++n, msg);
}
function borrowBook() {
    log('borrowed!');
}
function readBook() {
    log('been read!');
}
function returnBook() {
    log('returned!');
}
function rateBook() {
    log('rated!');
}
mgr.publish('book targeted');
mgr.publish('book borrowed');
class Procedure extends Array {
    searchCall() { }
    divert() { }
    next() { }
}
function mThunk(mgr = new Messenger()) {
    return function Thunkify(startMsg, call, doneMsg, failMsg) {
        mgr.subscribe(startMsg, call);
    };
}
//# sourceMappingURL=c:/Users/dc/Desktop/BookNebula/DCI/src/map/test/EventsDriven-async-call-chain-pipe.js.map