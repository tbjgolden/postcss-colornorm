const { properties, types } = require('css-tree/data');

const merged = Object.assign(
  {},
  types,
  Object.entries(properties).reduce((o, [k, v]) => {
    o[`'${k}'`] = v;
    return o;
  }, {}),
)

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const allTypes = Object.entries(merged)
const checkedTypes = new Set()
let _prevTypesFound = 0
let prevTypesFound = 0

do {
  _prevTypesFound = prevTypesFound
  prevTypesFound = checkedTypes.size
  let regex = new RegExp(`<color>` + (Array.from(checkedTypes.values()).map(p => `|<${escapeRegExp(p)}>`).join('')))
  for (const [type, syntax] of allTypes) {
    if (regex.test(syntax)) {
      checkedTypes.add(type);
    }
  }
} while (_prevTypesFound !== checkedTypes.size)

const validProperties = new Set()

for (const t of checkedTypes) {
  if (t[0] === "'" && t[t.length - 1] === "'") {
    validProperties.add(t.slice(1, -1))
  }
}

module.exports = validProperties
