
type AA<F,P> = {new():F, prototype:{p:P}};

function factory<F,P>(arg:AA<F,P>){
    // var f = new type();
    // console.log(f);
    var f = new arg();
    console.log(f);
    // f.p = console.log;
   return f; 
}

class A{
    p:Function;
}

var f = factory<A, Function>(A);

console.log(f);