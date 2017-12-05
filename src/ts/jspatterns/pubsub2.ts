import { IFunction } from 'util';

export interface IMessage extends Event {
    // save(): boolean;
}

export type IMessagedCall = (msg: IMessage, ...args: any[]) => IMessage;

export class Messenger {
    protected channels: Map<string, IFunction[]> = new Map();
    constructor(public scope?: object) {
        this.scope = this.scope || this;
    }

    public postMessage(topic: IMessage, args?: any, scope: object | undefined = this.scope) {
        const subscribers: IFunction[] = this.channels[topic.type];
        if (subscribers) {
            for (const callback of subscribers) {
                try {
                    return callback.apply(this.scope, args);
                } catch (e) {
                    this.postMessage(e);
                }
            }
        }
    }

    public onMessage(topic: IMessage, callback: IFunction) {
        let subscribers: IFunction[] = this.channels[topic.type];
        if (!subscribers) {
            subscribers = this.channels[topic.type] = [];
        }
        subscribers.push(callback);
        return () => {
            const index = subscribers.indexOf(callback);
            subscribers.splice(index, 1);
        };
    }
}
