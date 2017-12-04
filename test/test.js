let ctx = [];
function * g(n){
    while(1){
         ctx.push( n++);yield;
    }
}

var gi = g(0);

function call(){
    gi.next();
}

var a = setInterval(call, 500);

setTimeout(()=>clearInterval(a), 5901 );

setTimeout(()=>console.log(ctx), 6000);