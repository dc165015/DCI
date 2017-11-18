/* a character is created by story
*  a role is a character being cosplayed by some actor/actress
*  a scenario is future situation which is likely to happen
*  a scene is a place setting meanwhile something happened
*  a plot is a pattern or sequence introduced by happened scenes
 */

import {Rule, CheckRulesSet, Rules} from './rules';
import {Message, IncomeRealtimeMessage, Messenger} from './messages';

if (GeneratorFunction === undefined)
    GeneratorFunction = (function*(){}).constructor;

class Scene {
    constructor(roles = [], settings = [], title = '') {
        this.roles = roles;
        this.settings = settings;
        this.title = title;
        this.timeStamp = Date.now();
    }
}

class Scenario extends Promise{
    constructor({
                input,
                output, // resolve, reject
                plots, // planned activities
                constraints, //rules
                description, //scripting
                }, resolve, reject){
        super(resolve, reject);
    }
}

class Script {
    constructor (title, ...characters){
        this.title = title;
        this.characters = new Set(characters);
    }

    hasCharacter(c){
        this.characters.has(c);
    }
}

class Drama {
    constructor({   acts = [],
                    script = new Script,
                    characters = script.characters,
                    casting = new WeakSet,
                    messenger = new Messenger,
                    constraints = new CheckRulesSet,
                    title = script.title || 'new drama'} = {}) {

        let lastScene;

        function* plot(..._acts){
            acts = _acts.length ? _acts : acts;
            for (let act of acts) {
                plot.lastScene = lastScene = yield act;
            }
        }
        plot.default = plot();
        plot.play = plot.default.next.bind(plot.default);

        plot.addRole = function ({person, roleName}){
        };

        return plot;
    }
}


class Person {
    constructor({id, name, username, address = '', phone, email}, ...methods){
        this.id = id;
        this.name = Rules.validation.name.checkupOverall(name) ? name : 'no_name';
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

    cosplay(drama,character){
        return new Role(this, drama, character);
    }

    onMessage(msg){
        console.log(`I, ${this.name}, got a msg: { ${msg.description} }`);
    }
}

const character = new Person({name:'prototype'}, function play(){
        console.log(`Let's play!`);
    }
);

class Role {
    constructor(self = Person.prototype, drama, characterName) {
        this.drama = drama;
        this.name = typeof characterName === 'string' ? characterName : character.name;
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

    async drive(scene) {
        await this.drama.nextPlot(scene);
    }
}

class Advisor extends Role {

    setAOP(){}

    startWatch(){}

    audit(){}

    timekeeping(){}

    shooting(){}

    onTerminate(){}

    onEnd(){}
}

class Guard extends Role {
    checkInCharacters(characters){}

    checkOutCharacters(characters){
        //checkReturnProperties();
    }

    checkInAudience(audience){
        //checkTickets();
        //checkSafety();
    }

    checkOutAudience(audience){
        //checkReturnProperties();
    }
}

export {Drama, Script, Scene, Scenario, Director, Advisor, Guard, Role,
    Person, Messenger, Message, IncomeRealtimeMessage};