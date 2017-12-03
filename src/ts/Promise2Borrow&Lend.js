//import {log} from 'Util'
'use strict';

class Mission{
    constructor(attempt){
        let status = {state: 'to go', value: undefined};
        let nextMission = null;
        this.name = attempt.name;
        this.then = function(nextStepIfYes, nextStepIfNo) {
                let next = new Proxy(nextStepIfYes, {apply:(target, thisArg, argList)=>{
                    if (status.state === 'yes')
                        nextStepIfYes(status.value);
                    else if (status.state === 'no')
                        nextStepIfNo && nextStepIfNo(status.value);
                    else if (status.state === 'pending')
                        nextMission = nextStepIfYes;
                }});
                return new Mission(next);
        };

        function ifYes(book){
            status.state = 'yes';
            status.value = book;
            console.log('%cDone!', 'color:green;');
            nextMission && nextMission(book);
        }

        function ifNo(book){
            status.state = 'no';
            console.log('%cFailed!', 'color:red;')
        }

        setTimeout(()=>{
            console.group(`%c*** Mission ${attempt.name} ***`,'color:orange; font-size:big;');
            attempt(ifYes, ifNo);
            console.groupEnd();
        });
    }
}

let boom = new Mission(function searchBook(ifYes, ifNo){
    console.log('searching <<Bible>> ...');
    let book = Math.random() > 0.5 ? 'Bible' : null;
    book ? ifYes(book) : ifNo(book);
});

boom.then(function borrowBook(book){/* ... */})
    .then(function readBook(book){/* ... */})
    .then(function returnBook(book){/* ... */});

console.log(boom);
