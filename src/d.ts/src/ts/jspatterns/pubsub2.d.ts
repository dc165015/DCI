declare class Messenger {
    scope: object | undefined;
    protected topics: Map<string, Function[]>;
    constructor(scope?: object | undefined);
    publish(topic: string, args?: any, scope?: object | undefined): void;
    subscribe(topic: string, callback: Function): Function;
}
declare class Message extends Event {
}
export { Messenger, Message };
