import {Rule, CheckRulesSet, Rules} from './rules';
import {Message, IncomeRealtimeMessage, Messenger} from './messages';

class Scene {
    constructor(actors = [], settings = [], title = '') {
        this.actors = actors;
        this.settings = settings;
        this.title = title;
        this.timeStamp = Date.now();
    }
}

class Script {
    constructor (plot = new WeakSet([new Scene]), characters = new Set()){
        this.characters = characters;
        this.plot = plot;
        this.next = this.plot[Symbol.iterator]();
    }

    rehearsal(){

    }
}


class Drama {
    constructor({script = new Script, constraints = new CheckRulesSet, title}) {
        this.script = script;

        this.constraints = constraints;

        this.casting = roles;

        this.title = title;

        this.messenger = new Messenger;
    }

    doCasting(roles = new WeakMap){
        let {director, advisor, guards, casting} = roles;
        this.director = director || new Director();
        this.advisor = advisor || new Role;
        this.guards = guards || [new Role];
        this.casting = casting || [new Role];
    }

    play(){

        this.nextPlot = this.script[Symbol.iterator]();
    }

    end(outcome){}

    terminate(){}
}


class Person {
    constructor({id, name, username, address = '', phone, email}, ...methods){
        this.id = id;
        this.name = Rules.validation.name.checkupOverall(name) ? name : '';
        Reflect.defineProperty(this, 'name', {writable: false});
        Reflect.defineProperty(this, 'id', {writable: false});
        Reflect.defineProperty(this, 'username', {
            set: (username) => {
                return Rules.validation.name.checkupOverall(name) ? name : ''
            },
        });

        this.address = address;
        this.phone = phone;
        this.email = email;
        for (let method of methods){
            this[method.name] = method;
        }

        this.realtimeMsgs = [];
    }
}

const actor = new Person(
    {id: `__actor__`},
    function play(){
        console.log(`Let's play!`);
    }
);

class Role {
    constructor(self = Person.prototype, prototype = actor) {
        this.prototype = prototype;
        this.self = self;
    }
}

class Director extends Role {
    constructor(drama = new Drama, ...args) {
        super(args);
        this.drama = drama;
    }

    assignRole(person, role) {
        return new Role(person, role);
    }

    async drive(scene, roles) {
        // play if not started
        if (!this.drama.nextPlot) this.drama.play(roles);

        await this.drama.nextPlot(scene);
    }
}

class Advisor extends Role {

    setAOP(){}

    startWatch(){}

    audit(){}

    timekeeping(){}

    captureScene(){}

    onTerminate(){}

    onEnd(){}
}

class Guard extends Role {
    checkInCharacters(characters){}

    checkOutCharacters(characters){
        checkReturnProperties();
    }

    checkInAudience(audience){
        checkTickets();
        checkSafety();
    }

    checkOutAudience(audience){
        checkReturnProperties();
    }
}

const borrow_lend_books = new Script();


