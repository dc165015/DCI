// 2. module
// 2.1 jQuery module
function library(module) {
    $(function () {
        module.init && module.init();
    });
    return module;
}

function myModule() {
    let privateProperty = [];

    function privateMethod() {
    }

    return {
        init: function init() {
            console.log('initialized.');
        },
        publicProperty: "public p",
        publicMethod: function () {
            return privateMethod();
        }
    }
}

library(myModule);

// 2.2 Dojo module

let store = {};

u.setObject('basket.core', myModule).bind(store);
console.log(store);
