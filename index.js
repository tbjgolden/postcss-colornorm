const csstree = require('css-tree');
const validProperties = require('./getValidProperties');
const colornorm = require('colornorm');

const defaults = {
  output: undefined
}

module.exports = (opts = defaults) => {
  opts = Object.assign({}, defaults, opts)

  return {
    postcssPlugin: 'postcss-colornorm',
    Declaration(decl) {
      if (validProperties.has(decl.prop)) {
        const propOffset = decl.prop.length + 1;
        const declarationStr = `${decl.prop}:${decl.value}`
        const declaration = csstree.parse(declarationStr, { context: 'declaration', positions: true });
        const colors = csstree.lexer.findValueFragments(declaration.property, declaration.value, 'Type', 'color')
          .map(fragment => fragment.nodes);

        if (colors.length > 0) {
          let outputValue = decl.value

          for (let i = colors.length - 1; i >= 0; i--) {
            const color = colors[i]
            const start = color.head.data.loc.start.offset - propOffset
            const end = color.tail.data.loc.end.offset - propOffset
            const inputColor = decl.value.slice(start, end)
            const outputColor = colornorm(inputColor, opts.output)
            outputValue = outputValue.slice(0, start) + outputColor + outputValue.slice(end)
          }

          decl.value = outputValue;
        }
      }
    }
  }
}
module.exports.postcss = true
