const postcss = require('postcss')
const plugin = require('.')

async function run (input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('changes to hsl by default', async () => {
  await run(
    `
    a{ color: red; border: 1px solid #00f; background: rgb(2,2,2, .8)}
    .classname{ background:  linear-gradient(to bottom right, red , blue)}
    `,
    `
    a{ color: hsl(0 100% 50%); border: 1px solid hsl(240 100% 50%); background: hsl(0 0% 1%/0.8)}
    .classname{ background:  linear-gradient(to bottom right, hsl(0 100% 50%) , hsl(240 100% 50%))}
    `
  )
})

it('changes to hsl when passed an empty object', async () => {
  await run(
    `
    a{ color: red; border: 1px solid #00f; background: rgb(2,2,2, .8)}
    .classname{ background:  linear-gradient(to bottom right, red , blue)}
    `,
    `
    a{ color: hsl(0 100% 50%); border: 1px solid hsl(240 100% 50%); background: hsl(0 0% 1%/0.8)}
    .classname{ background:  linear-gradient(to bottom right, hsl(0 100% 50%) , hsl(240 100% 50%))}
    `,
    {}
  )
})

it('changes to format that was passed in', async () => {
  await run(
    `
    a{ color: red; border: 1px solid #00f; background: rgb(2,2,2, .8)}
    .classname{ background:  linear-gradient(to bottom right, red , blue)}
    `,
    `
    a{ color: #f00; border: 1px solid #00f; background: #020202cc}
    .classname{ background:  linear-gradient(to bottom right, #f00 , #00f)}
    `,
    {
      output: "hex"
    }
  )
})

it('is tolerant to errors passed in', async () => {
  await run(
    `
    /* Invalid property */
    a { invalid-prop: red }
    /* Invalid color nukes whole value */
    .classname { background:  linear-gradient(to bottom right, #f00, bloo)}
    /* currentcolor passed through lowercase */
    #id { background: currentColor }
    /* above errors do not affect valid input */
    [attr] { border: 2px solid whitesmoke; }
    `,
    `
    /* Invalid property */
    a { invalid-prop: red }
    /* Invalid color nukes whole value */
    .classname { background:  linear-gradient(to bottom right, #f00, bloo)}
    /* currentcolor passed through lowercase */
    #id { background: currentcolor }
    /* above errors do not affect valid input */
    [attr] { border: 2px solid rgb(245 245 245); }
    `,
    {
      output: "rgb"
    }
  )
})
