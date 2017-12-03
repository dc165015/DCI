let ctx = [];
let stack = [];


function use(callback) {
	stack.push(callback);
}

function run() {
	// let it = stack[Symbol.iterator](), state, call;
	// (function inStack() {
	// 	if ((state = it.next()) && (call = state.value)){
	//         call(ctx, inStack);
	//     }
	// })()
        let i=0;
        function inStack() {
            if (i == stack.length) return;
            let deeperLevel = stack[i++];
            deeperLevel(ctx, inStack);
        }
        
        inStack();
        
	console.log(ctx);
}

use(function(ctx, inStack) {
	ctx.push('1>>>');
	inStack();
	ctx.push('<<<1');
});

use(function(ctx, inStack) {
	ctx.push('2>>>');
	inStack();
	ctx.push('<<<2');
});
use(function(ctx, inStack) {
	ctx.push('3>>>');
	inStack();
	ctx.push('<<<3');
});

run();
