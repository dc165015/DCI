export interface IAdvice {
    before?: Function;
    introduce?: Function;
    wrap?: Function;
    after?: Function;
    afterThrown?: Function;
    afterFinally?: Function;
}

export interface IProcessor {
    embed: Function;
    revoke: Function;
    cutIn: Function;
    setOffIntroductions: Function;
}

export interface IIntroduce {
    (subject: any, cutin: Function): IProcessor;
}
