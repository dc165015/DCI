import {IAdvice, IIntroduce, IProcessor} from '../../d.ts/AOP';

// require('');
const Aspects = ['before', 'introduce', 'wrap', 'after', 'afterThrown', 'afterFinally'];

function doOrigin(sourceObject: object, originProperty: Function | object, args: any[]) {
    return typeof originProperty === 'function' ? originProperty.call(sourceObject, ...args) : originProperty;
}

function aftercare(
    sourceObject: object,
    originProperty: Function,
    afterThrown: Function | undefined,
    afterFinally: Function | undefined,
    thrown: any,
) {
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

class Advisor {
    private static makeAdviceHandler(sourceObject: object, targetPropertyName: string): Function {
        const $embed = embed;
        // tslint:disable-next-line:no-shadowed-variable
        return function embed(advice: IAdvice) {
            return $embed(advice, sourceObject, targetPropertyName);
        };
    }
    private static makeRevokeHandler(
        advice: IAdvice,
        sourceObject: object,
        targetPropertyName: string | symbol,
        originProperty: Function | object,
    ): Function {
        return function revoke(aspects?: Array<keyof IAdvice>) {
            if (aspects) {
                undef(advice, aspects);
            } else {
                sourceObject[targetPropertyName] = originProperty;
            }
            return this;
        };
    }

    private static makeCutInHandler(originProperty: any, advisor: Advisor): Function {
        return function cutIn(introduce: Function) {
            advisor.introductionsStack.push(introduce);
            return this;
        };
    }
    private static makeSetOffIntroductionsHandler(subject: object, advisor: Advisor): Function {
        return function setOffIntroductions() {
            const stack = advisor.introductionsStack;
            const itertaor = stack[Symbol.iterator]();
            (function cutin() {
                const introduce = itertaor.next().value;
                // tslint:disable-next-line:no-unused-expression
                introduce && introduce(subject, cutin);
            })();

            advisor.introductionsStack.length = 0;
            return subject;
        };
    }

    public readonly processor: IProcessor;
    protected readonly introductionsStack: Function[];
    constructor(sourceObject: object, targetPropertyName: string, advice: IAdvice = {}) {
        const $this = this;
        const advisor = this;
        const originProperty = sourceObject[targetPropertyName];
        this.introductionsStack = [];
        this.processor = Object.assign(processor, {
            cutIn: Advisor.makeCutInHandler(originProperty, advisor),
            embed: Advisor.makeAdviceHandler(sourceObject, targetPropertyName),
            revoke: Advisor.makeRevokeHandler(advice, sourceObject, targetPropertyName, originProperty),
            setOffIntroductions: Advisor.makeSetOffIntroductionsHandler(originProperty, advisor),
        });

        function processor() {
            const { before, wrap, introduce, after, afterThrown, afterFinally } = advice;
            let result;
            let thrown;

            try {
                if (before) { result = before.call(sourceObject, ...arguments); }

                if (wrap) {
                    result = wrap.call(sourceObject, originProperty, ...arguments);
                } else {
                    result = $this.hasIntroduction(sourceObject, originProperty, [...arguments], introduce, advisor);
                }

                if (after) { result = after.call(sourceObject, result, originProperty); }
            } catch (e) {
                thrown = e;
            }

            result = aftercare(sourceObject, originProperty, afterThrown, afterFinally, thrown);

            return result;
        }
    }

    private hasIntroduction(
        sourceObject: object,
        originProperty: Function | object,
        args: any[],
        introduce: Function | undefined,
        advisor: Advisor,
    ) {
        return introduce ? advisor.introductionsStack.push(introduce) : doOrigin(sourceObject, originProperty, args);
    }
}

function undef(object: object, properties: Array<string | symbol> = []) {
    properties.forEach((p) => (object[p] = undefined));
}

function embed(advice: IAdvice, sourceObject: object, targetPropertyName: string) {
    const originProperty: Function | object = sourceObject[targetPropertyName];
    const processor = new Advisor(sourceObject, targetPropertyName, advice).processor;

    sourceObject[targetPropertyName] = processor;

    return processor;
}

export { embed };
