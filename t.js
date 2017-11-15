
const admins = new Set([]);
admins.add(88);
const man = {id: 8, do: () => console.info('hi')};
function isAdmin(man) {
  return admins.has(man.id);
}

const checks = [isAdmin];

function inspect(checks, ...roles) {
  for (const role of roles) {
    const {object, before, after, around} = role;
    for (const action of before) {
      const _action = object[action];
      for (const check of checks) {
        object[action] = function(...args) {
          if (!check(object)) { throw object; }
          _action.apply(object, args);
        };
      }
    }
  }
}

inspect(checks, {object: man, before: ['do']});
man.do();