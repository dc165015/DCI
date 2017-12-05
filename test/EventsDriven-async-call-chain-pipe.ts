import { IMessage, Messenger } from '../src/ts/jspatterns/pubsub2';
import { IFunction, log } from '../src/ts/util';

const mgr = new Messenger();

const procedureList: Array<[IMessage, IFunction]> = [
    [new Event('book targeted'), borrowBook],
    [new Event('book borrowed'), readBook],
    [new Event('book has been read'), returnBook],
    [new Event('book returned'), rateBook],
];
const procedure = new Map(procedureList);

procedure.forEach((callback, topic) => {
    mgr.onMessage(topic, callback);
});

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

mgr.postMessage(new Event('book targeted'));
mgr.postMessage(new Event('book borrowed'));
