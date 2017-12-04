/// <reference path="../../d.ts/AOP.d.ts" />

const Aspects = ['before', 'introduce', 'wrap', 'after', 'afterThrown', 'afterFinally'];

/*
* @example: introduce(subject, cutin){preprocessed(subject);cutin();postProcessed(subject); }
*/
interface IIntroduce {
	(subject: any, cutin: Function): IProcessor;
}

function hasIntroduction(sourceObject, originProperty: Function | object, args, introduce, advisor) {
	return introduce ? advisor.introductionsStack.add(introduce) : doOrigin(sourceObject, originProperty, args);
}

function doOrigin(sourceObject: object, originProperty: Function | object, args) {
	return typeof originProperty === 'function' ? originProperty.call(sourceObject, ...args) : originProperty;
}

function aftercare(sourceObject, originProperty, afterThrown, afterFinally, thrown) {
	let result;
	if (thrown && afterThrown) {
		result = afterThrown.call(sourceObject,result, thrown, originProperty);
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
	public processor: IProcessor;
	constructor(sourceObject: object, targetPropertyName: string | symbol, advices: IAdvices = {}) {
		let advisor = this,
			originProperty = sourceObject[targetPropertyName];

			(processor as any).moreIntroduce = Advisor.makeMoreIntroduceHandler(originProperty, advisor);
			Advisor.setAdviceHandler(sourceObject, targetPropertyName, processor);
			Advisor.setRevokeHandler(advices, sourceObject, targetPropertyName, originProperty, processor);
			Advisor.setSetOffIntroductionsHandler(originProperty, advisor);
			
			(this.processor as any) = processor;
		function processor (...args) {
			let { before, wrap, introduce, after, afterThrown, afterFinally } = advices;
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

	static makeMoreIntroduceHandler(originProperty, advisor) {
		return function moreIntroduce(introduce) {
			advisor.introductionsStack.add(introduce);
			return advisor.processor;
		};
	}

	static setAdviceHandler(sourceObject: object, targetPropertyName: string | symbol, processor: any) {
		processor.advice = function(advices: IAdvices) {
			return advice(sourceObject, targetPropertyName, advices);
		};
	}
	static setRevokeHandler(
		advices: IAdvices,
		sourceObject: object,
		targetPropertyName: string | symbol,
		originProperty: Function | object,
		processor: any,
	) {
		processor.revoke = (aspects?: (keyof IAdvices)[]) => {
			if (aspects) {
				undef(advices, aspects);
			} else {
				sourceObject[targetPropertyName] = originProperty;
			}
			return processor;
		};
	}

	static setSetOffIntroductionsHandler(subject, advisor) {
		advisor.introductionsStack = new Set();
		advisor.processor.setOffIntroductions = function() {
			let stack = advisor.introductionsStack;
			let itertaor = stack[Symbol.iterator]();
			function cutin() {
				let introduce = itertaor.next().value;
				if (!introduce) return;
				introduce(subject, cutin);
			}

			stack.clear();
		};
	}
}

function undef(object: object, properties: (string | symbol)[] = []) {
	properties.forEach(p => (object[p] = undefined));
}

function advice(sourceObject: object, targetPropertyName: string | symbol, advices: IAdvices) {
	let originProperty: Function | object = sourceObject[targetPropertyName];
	let processor = new Advisor(sourceObject, targetPropertyName, advices).processor;

	sourceObject[targetPropertyName] = processor;

	return processor;
}

export { advice };
