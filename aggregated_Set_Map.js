function _add(...batch){
    for (let one of batch) {
        Reflect.getPrototypeOf(this).add(one);
    }
}

class AggregatedSet extends WeakSet {
    constructor(...batch) {
        super();
        for (let one of batch) {
            super.add(one);
        }
    }

    add(...batch) {
        _add.apply(this,batch);
    }
}
