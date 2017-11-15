import './aggregated_Set_Map';

const ReservedWords = new Set(['admin','administrator','root','习近平']);
ReservedWords.add = () => {
    let _add = ReservedWords.add;
    for (let arg of arguments) {
        _add(arg.toLocaleLowerCase());
    }
};
ReservedWords.contain = (myWord) => {
    let str = myWord.toLocaleLowerCase();
    return [...ReservedWords].some((word) => word === str);
};

class Ruler {
    constructor(id, description) {
        this.id = id;
        this.description = description || '';

        this._enabled = true;

        // change enabled state while accessing enabled property,
        // instead of invoke methods like .enable() or .disable()
        Reflect.defineProperty(this, 'enable', {
            get:() => this._enabled = true,
        });
        Reflect.defineProperty(this, 'disable', {
            get:() => this._enabled = false,
        });
    }

    isEnabled() {
        return this._enabled;
    }
}

class Rule extends Function {
    constructor({run, id, description, runCode = '() => {}'}){
        let rule = run || super(runCode);
        let ruler = new Ruler(id, description);
        Reflect.setPrototypeOf(rule, ruler);

        return new Proxy(rule, {apply: function(target, thisArg, argumentsList){
            if (!rule._enabled) return;
            return rule(...argumentsList);
        }});
    }
}

class CheckRulesSet extends AggregatedSet {
    checkOn(ruleId, ...args) {
        let rule = null;

        for (rule of this) {
            if ( rule.id === ruleId) break;
        }

        if (!rule) throw `no such rule ${ruleId}`;

        return rule(args);
    }

    checkupOverall(arg){
        for (let rule of this) {
            if (rule.isEnabled() && !rule(arg)){
                (function(){
                    throw `rule ${rule.id} violated: ${rule.description}`
                })();
                return false;
            }
        }
        return true;
    }
}

const Rules = {
    validation: {
        name: new CheckRulesSet(
            {
                id:'isString',
                description: 'name must be a string',
                run: (v) => typeof v === 'string',
            },

            {
                id: 'maxLength',
                description: 'name exceeded the max length',
                run: (v) => v.length < 19,
            },

            {
                id: 'test',
                description: 'name must pass the test against ...',
                run: (v) => /[\s\S]/.test(v),
            },

            {
                id: 'noReservedWords',
                description: 'name must not contain reserved or sensitive words',
                run: (v) => !ReservedWords.contain(v),
            }
        )
    }
};

export {Rule, CheckRulesSet, Rules};