
// 1. Singleton

let tester = (function () {
    let _static, instance;

    function Singleton({x, y}) {
        this.x = x;
        this.m = function f() {
            console.log(y);
        }
    }

    _static = {
        getInstance: function (config) {
            return instance || new Singleton(config);
        }
    };

    return _static;
})();

tester.getInstance({x: 1, y: 2}).m();
tester.getInstance({x: 1, y: 23}).m();
