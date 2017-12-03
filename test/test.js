
var app= {};
var stack = [];
app.use = function(cb){
    stack.push(cb);
}

app.use(1);
app.use(2);

app.run = function* g(){
    yield* stack;
} 

var runner = app.run();
var state= runner.next();


console.log(state, state.value);
runner.next();
console.log(state, state.value);
runner.next();
console.log(state, state.value);
