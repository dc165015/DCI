Window;
class Messenger {
    constructor(scope) {
        this.scope = scope;
        this.topics = new Map();
        this.scope = this.scope || this;
    }
    publish(topic, args, scope = this.scope) {
        const subscribers = this.topics[topic];
        if (subscribers) {
            for (let callback of subscribers) {
                callback.call(scope, args);
            }
        }
    }
    subscribe(topic, callback) {
        let subscribers = this.topics[topic];
        if (!subscribers) {
            subscribers = this.topics[topic] = [];
        }
        subscribers.push(callback);
        return () => {
            const index = subscribers.indexOf(callback);
            subscribers.splice(index, 1);
        };
    }
}
class Message extends Event {
}
export { Messenger, Message };
//# sourceMappingURL=c:/Users/dc/Desktop/BookNebula/DCI/src/map/src/ts/jspatterns/pubsub2.js.map