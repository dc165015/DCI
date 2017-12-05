import {Messenger} from '../src/ts/jspatterns/pubsub2';


let messenger = new Messenger();
let unSubscribe = messenger.onMessage('hi ', function hi(topic) {
    console.log(topic);
});
messenger.onMessage('hi ', function hi(topic) {
    console.log(topic);
});
messenger.postMessage('hi ', 'hi, everyone');
console.log(messenger);
unSubscribe();
console.log(messenger);
messenger.postMessage('hi ', 'hi, you');
