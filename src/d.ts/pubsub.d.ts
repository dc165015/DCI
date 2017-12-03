interface Callback {
    (...args: any[]): any;
}
interface Handler {
    topic: string;
    callback: Callback;
}
declare class Messenger {
    scope: object | undefined;
    protected topics: Map<string, Set<Callback>>;
    constructor(scope?: object | undefined);
    publish(topic: string, args?: any, scope?: object): void;
    subscribe(topic: string, callback: Callback): Handler;
    unsubscribe(handler: Handler): void;
}
declare let m: Messenger;
declare let h: Handler;
