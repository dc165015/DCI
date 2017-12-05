class Introduction {
    public static cutIn(subject, introduce) {
        const introduction = new Introduction(subject);
        introduction.cutIn(introduce);
        return introduction;
    }
    protected readonly introductionsStack: Function[];
    constructor(public subject) {
        this.introductionsStack = [];
    }

    public cutIn(introduce) {
        this.introductionsStack.push(introduce);
    }

    public setOff() {
        const stack = this.introductionsStack;
        const itertaor = stack[Symbol.iterator]();
        (function cutin() {
            const introduce = itertaor.next().value;
            // tslint:disable-next-line:no-unused-expression
            introduce && introduce(this.subject, cutin);
        })();

        this.introductionsStack.length = 0;
        return this.subject;
    }
}
