import {Drama, Script, Scene, Scenario, Director, Advisor, Guard, Role,
    Person, Messenger, Message, IncomeRealtimeMessage} from './DCI';

const script = new Script("Sharing Books -Borrow and Lend Books", 'borrower', 'lender', 'library');

const sb = new Drama({script:script});



const A = new Person({name: 'A'});
const B = new Person({name: 'B'});


let courier = new Messenger();
let borrower = A.cosplay(blb, 'borrower');
let lender = new Role();
let books= new Set([{title:'bible',owner:lender}]);
books.hasTitle = (title) => [...books].some((book) => book.title === title);

borrower.search = function search(found, fail){
    console.log('found: ', found);
    if (books.hasTitle('bible'))
        found();
};

borrower.borrow = function borrowBook(deal, fail){
    //ask book's owner to bring the book.
    courier.send({to: });
};

function borrowBook(){
    let job = new Promise(borrower.search).then(borrower.borrow);
    return job;
}
