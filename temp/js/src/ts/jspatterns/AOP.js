/// <reference path="../../d.ts/AOP.d.ts" />
// require('');
const Aspects = ['before', 'introduce', 'wrap', 'after', 'afterThrown', 'afterFinally'];
/*
* @example: introduce(subject, cutin){preprocess(subject);cutin();postProcess(subject); }
*/
function hasIntroduction(sourceObject, originProperty, args, introduce, advisor) {
    return introduce ? advisor.introductionsStack.push(introduce) : doOrigin(sourceObject, originProperty, args);
}
function doOrigin(sourceObject, originProperty, args) {
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
class Advisor {
    constructor(sourceObject, targetPropertyName, advice = {}) {
        const advisor = this, originProperty = sourceObject[targetPropertyName];
        this.introductionsStack = [];
        this.processor = Object.assign(processor, {
            cutIn: Advisor.makeCutInHandler(originProperty, advisor),
            embed: Advisor.makeAdviceHandler(sourceObject, targetPropertyName),
            revoke: Advisor.makeRevokeHandler(advice, sourceObject, targetPropertyName, originProperty),
            setOffIntroductions: Advisor.makeSetOffIntroductionsHandler(originProperty, advisor),
        });
        function processor() {
            const { before, wrap, introduce, after, afterThrown, afterFinally } = advice;
            let result, thrown;
            try {
                if (before)
                    result = before.call(sourceObject, ...arguments);
                if (wrap) {
                    result = wrap.call(sourceObject, originProperty, ...arguments);
                }
                else {
                    result = hasIntroduction(sourceObject, originProperty, arguments, introduce, advisor);
                }
                if (after)
                    result = after.call(sourceObject, result, originProperty);
            }
            catch (e) {
                thrown = e;
            }
            result = aftercare(sourceObject, originProperty, afterThrown, afterFinally, thrown);
            return result;
        }
    }
    static makeAdviceHandler(sourceObject, targetPropertyName) {
        const _embed = embed;
        return function embed(advice) {
            return _embed(advice, sourceObject, targetPropertyName);
        };
    }
    static makeRevokeHandler(advice, sourceObject, targetPropertyName, originProperty) {
        return function revoke(aspects) {
            if (aspects) {
                undef(advice, aspects);
            }
            else {
                sourceObject[targetPropertyName] = originProperty;
            }
            return this;
        };
    }
    static makeCutInHandler(originProperty, advisor) {
        return function cutIn(introduce) {
            advisor.introductionsStack.push(introduce);
            return this;
        };
    }
    static makeSetOffIntroductionsHandler(subject, advisor) {
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
function undef(object, properties = []) {
    properties.forEach(p => (object[p] = undefined));
}
function embed(advice, sourceObject, targetPropertyName) {
    const originProperty = sourceObject[targetPropertyName];
    const processor = new Advisor(sourceObject, targetPropertyName, advice).processor;
    sourceObject[targetPropertyName] = processor;
    return processor;
}
class Introduction {
    constructor(subject) {
        this.subject = subject;
        this.introductionsStack = [];
    }
    cutIn(introduce) {
        this.introductionsStack.push(introduce);
    }
    static cutIn(subject, introduce) {
        const introduction = new Introduction(subject);
        introduction.cutIn(introduce);
        return introduction;
    }
    setOff() {
        let stack = this.introductionsStack;
        const itertaor = stack[Symbol.iterator]();
        (function cutin() {
            const introduce = itertaor.next().value;
            introduce && introduce(this.subject, cutin);
        })();
        this.introductionsStack.length = 0;
        return this.subject;
    }
}
export { embed, Introduction };
//# sourceMappingURL=c:/Users/dc/Desktop/BookNebula/DCI/src/map/src/ts/jspatterns/AOP.js.map