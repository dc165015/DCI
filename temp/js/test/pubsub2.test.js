import { Messenger } from '../src/ts/jspatterns/pubsub2';
let messenger = new Messenger();
let unSubscribe = messenger.subscribe('hi ', function hi(topic) {
    console.log(topic);
});
messenger.subscribe('hi ', function hi(topic) {
    console.log(topic);
});
messenger.publish('hi ', 'hi, everyone');
console.log(messenger);
unSubscribe();
console.log(messenger);
messenger.publish('hi ', 'hi, you');
//# sourceMappingURL=c:/Users/dc/Desktop/BookNebula/DCI/src/map/test/pubsub2.test.js.map