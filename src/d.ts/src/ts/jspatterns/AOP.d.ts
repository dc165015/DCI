/// <reference path="../../../AOP.d.ts" />
declare function embed(advice: IAdvice, sourceObject: object, targetPropertyName: string | symbol): IProcessor;
declare class Introduction {
    subject: any;
    protected readonly introductionsStack: Function[];
    constructor(subject: any);
    cutIn(introduce: any): void;
    static cutIn(subject: any, introduce: any): Introduction;
    setOff(): any;
}
export { embed, Introduction };
