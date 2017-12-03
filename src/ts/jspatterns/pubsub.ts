interface Callback {
  (...args): any;
}

interface Handler {
  topic: string;
  callback: Callback;
}

class Messenger {
  protected topics: Map<string, Set<Callback>> = new Map();
  constructor(public scope: object|undefined = undefined) {}

  publish(topic: string, args?, scope: object = this.scope) {
    const subscribers: Set<Callback> = this.topics[topic];
    if (subscribers) {
      for (let callback of subscribers){
        callback.call(scope, args);
      }
    }
  }

  subscribe(topic: string, callback: Callback): Handler {
    let subscribers: Set<Callback> = this.topics[topic];
    if (!subscribers) {
      subscribers = this.topics[topic] = new Set();
    }
    subscribers.add(callback);
    return { topic, callback };
  }

  unsubscribe(handler: Handler) {
    let subscribers: Set<Callback> = this.topics[handler.topic];
    subscribers.delete(handler.callback);
  }
}

let m = new Messenger();
let h = m.subscribe("hi ", function hi(topic) {
  console.log(topic);
});
m.publish("hi ", "everyone");
console.log(m);
m.unsubscribe(h);
console.log(m);