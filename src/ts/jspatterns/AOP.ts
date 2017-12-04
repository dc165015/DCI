/// <reference path="../../d.ts/AOP.d.ts" />
// require('');
const Aspects = ['before', 'introduce', 'wrap', 'after', 'afterThrown', 'afterFinally'];
/*
* @example: introduce(subject, cutin){preprocess(subject);cutin();postProcess(subject); }
*/
function hasIntroduction(sourceObject, originProperty: Function | object, args, introduce, advisor) {
    return introduce ? advisor.introductionsStack.push(introduce) : doOrigin(sourceObject, originProperty, args);
}

function doOrigin(sourceObject: object, originProperty: Function | object, args) {
    return typeof originProperty === 'function' ? originProperty.call(sourceObject, ...args) : originProperty;
}

function aftercare(sourceObject, originProperty, afterThrown, afterFinally, thrown) {
    let result;
    if (thrown && afterThrown) {
        result = afterThrown.call(sourceObject, result, thrown, originProperty);
    }
    if (afterFinally) {
        result = afterFinally.call(sourceObject, result, thrown, originProperty);
    }
    if (thrown && !afterThrown && !afterFinally) {
        throw thrown;
    }
    return result;
}

class Advisor  {
    public readonly processor: IProcessor;
    protected readonly introductionsStack: Function[];
    constructor(sourceObject: object, targetPropertyName: string | symbol, advice: IAdvice = {}) {
        const advisor = this,
            originProperty = sourceObject[targetPropertyName];
        this.introductionsStack = [];
        this.processor = Object.assign(processor, {
            cutIn: Advisor.makeCutInHandler(originProperty, advisor),
            embed: Advisor.makeAdviceHandler(sourceObject, targetPropertyName),
            revoke: Advisor.makeRevokeHandler(advice, sourceObject, targetPropertyName, originProperty),
            setOffIntroductions: Advisor.makeSetOffIntroductionsHandler(originProperty, advisor),
        });

        function processor(...args) {
            const { before, wrap, introduce, after, afterThrown, afterFinally } = advice;
            let result, thrown;

            try {
                if (before) result = before.call(sourceObject, ...args);

                if (wrap) {
                    result = wrap.call(sourceObject, originProperty, ...args);
                } else {
                    result = hasIntroduction(sourceObject, originProperty, args, introduce, advisor);
                }

                if (after) result = after.call(sourceObject, result, originProperty);
            } catch (e) {
                thrown = e;
            }

            result = aftercare(sourceObject, originProperty, afterThrown, afterFinally, thrown);

            return result;
        }
    }

    static makeAdviceHandler(sourceObject: object, targetPropertyName: string | symbol): Function {
        const _embed = embed;
        return function embed(advice: IAdvice) {
            return _embed(advice, sourceObject, targetPropertyName);
        };
    }
    static makeRevokeHandler(
        advice: IAdvice,
        sourceObject: object,
        targetPropertyName: string | symbol,
        originProperty: Function | object,
    ): Function {
        return function revoke(aspects?: (keyof IAdvice)[]) {
            if (aspects) {
                undef(advice, aspects);
            } else {
                sourceObject[targetPropertyName] = originProperty;
            }
            return this;
        };
    }

    static makeCutInHandler(originProperty: any, advisor: Advisor): Function {
        return function cutIn(introduce) {
            advisor.introductionsStack.push(introduce);
            return this;
        };
    }
    static makeSetOffIntroductionsHandler(subject: any, advisor: Advisor): Function {
        return function setOffIntroductions() {
            let stack = advisor.introductionsStack;
            const itertaor = stack[Symbol.iterator]();
            (function cutin() {
                const introduce = itertaor.next().value;
                introduce && introduce(subject, cutin);
            })();

            advisor.introductionsStack.length = 0;
            return subject;
        };
    }
}

function undef(object: object, properties: (string | symbol)[] = []) {
    properties.forEach(p => (object[p] = undefined));
}

function embed(advice: IAdvice, sourceObject: object, targetPropertyName: string | symbol) {
    const originProperty: Function | object = sourceObject[targetPropertyName];
    const processor = new Advisor(sourceObject, targetPropertyName, advice).processor;

    sourceObject[targetPropertyName] = processor;

    return processor;
}

class Introduction {
    protected introductionsStack: Function[];
    constructor(public subject) {
        this.introductionsStack = [];
    }

    public cutIn(introduce) {}

    static cutIn(subject, introduce) {
        const introduction = new Introduction(subject);
        introduction.cutIn(introduce);
        return introduction;
    }

    public setOff() {
        let stack = this.introductionsStack;
        const itertaor = stack[Symbol.iterator]();
        (function cutin() {
            const introduce = itertaor.next().value;
            introduce && introduce(this.subject, cutin);
        })();

        stack = [];
        return this.subject;
    }
}

export { embed };
