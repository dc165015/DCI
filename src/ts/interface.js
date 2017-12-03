//import {Util as u} from 'util';
const U = require('./util');
const u = U.Util;

Interface.equipInterface = function (object, face){
    Object.assign(object, face);
};


Interface.placeholder =  function(){
    throw new TypeError(`${this.name || 'This placeholder'} can not be executed before instantiation!`);
};

function Interface(faceName, ...traitNameList){
    // traits should be instantiated by specific subject
    traitNameList.forEach((v) => this['i' + faceName + u.capitalize(v)] = Interface.placeholder);
}

module.exports = {Interface:Interface};