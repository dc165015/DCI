let book = 0;
function pipe(call) {
    if (ss.state) {
        console.group(call.name);
        console.log('>>> start from ', ss.value);
        let result = call();
        if (result) {
            console.log('<<< done with ', ss.value);
        } else {
            ss.state = false;
            console.log('<<< failed with ', ss.value);
        }
    } else{
        console.log(call.name, 'cancelled!');
    }
    console.groupEnd();
    return pipe;
}

function random() {
    return Math.random();
}

let ss = { state: true, value: 0 };

pipe(function searchBook() {
    return (ss.value = random()) > 0.3;
})(function borrowBook() {
    return (ss.value = random()) > 0.5;
})(function readBook() {
    return (ss.value = random()) > 0.1;
})(function returnBook() {
    return (ss.value = random()) > 0.1;
})(function rateBook() {
    return (ss.value = random()) > 0.1;
});
