import {AggregatedSet} from './aggregated_Set_Map';

class Message extends String {
    constructor({from, to, description, type, sentTime, receivedTime}){
        super(description);
        this.from = from;
        this.to = to;
        this.type = type;
        this.sentTime = sentTime || Date.now();
        this.receivedTime = receivedTime || Date.now();
    }
}

class Messages extends AggregatedSet{
    empty(){
        this.clear();
    }
}

class IncomeRealtimeMessage extends Message {
    // expired after 3 seconds by default
    constructor(msg, expiration = 3000) {
        super(msg);
        this.expiration = expiration;

        this._expired = false;
        Reflect.defineProperty(this, 'expire', {
            get: ()=> this._expired = true
        })
    }

    isExpired() {
        return this._expired || this.expiration > Date.now() - this.sentTime;
    }
}

class IncomeRealtimeMessages extends Messages {

}

class Messenger {
    constructor(...msgs) {
        this.msgs = [msgs];
        this.specifiedListeners = new Map;
        Reflect.defineProperty(this, 'subscribedMsgsTypes', {
            get: () => this.listeners.keys(),
        });

        setInterval(()=>{this.notify()}, 1000);
    }

    subscribe(msgType, ...listeners) {
        let subscribedListeners = this.specifiedListeners.get(msgType);

        if (!subscribedListeners)
            this.specifiedListeners.set(msgType, new AggregatedSet);

        subscribedListeners.add(...listeners);
    }

    notify(){
        let msg;
        while( msg = this.msgs.shift())
            setTimeout(()=>msg.to.onMessage(msg));
    }

    send(msg) {
        let listeners = this.specifiedListeners.get(msg.type);
        for (let listener of listeners) {
            listener.apply(msg.to, msg);
        }
    }
}

export {Message, IncomeRealtimeMessage, Messenger}