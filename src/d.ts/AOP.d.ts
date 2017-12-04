interface IAdvice {
    before?: Function;
    introduce?: Function;
    wrap?: Function;
    after?: Function;
    afterThrown?: Function;
    afterFinally?: Function;
}

interface IProcessor {
    embed: Function;
    revoke: Function;
    cutIn: Function;
    setOffIntroductions: Function;
}

interface IIntroduce {
    (subject: any, cutin: Function): IProcessor;
}
