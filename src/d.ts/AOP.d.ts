
interface IAdvices {
	before?: Function;
	introduce?: Function;
	wrap?: Function;
	after?: Function;
	afterThrown?: Function;
	afterFinally?: Function;
}

interface IProcessor {
	advice: Function;
	revoke: Function;
	moreIntroduce: Function;
}
