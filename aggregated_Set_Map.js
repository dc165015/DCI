
export class AggregatedSet extends WeakSet {
    add(...batch) {
        for (let one of batch) {
            Reflect.getPrototypeOf(this).add(one);
        }
    }
}

export class AggregatedMap extends WeakMap {
    add(...batch) {
        for (let one of batch) {
            this.set(one[0], one[1]);
        }
    }
}

