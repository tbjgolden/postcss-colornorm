# PostCSS Colornorm

[PostCSS] plugin to normalize colors using [colornorm] to a specific format.

```css
.foo {
  background-color: rgb(255 0 0 / 1);
  border-color: #ff0000ff;
  outline-color: Red;
  color: hsla(0, 100%, 50%, 1);
}
```

```css
.foo {
  background-color: hsl(0 100% 50%);
  border-color: hsl(0 100% 50%);
  outline-color: hsl(0 100% 50%);
  color: hsl(0 100% 50%);
}
```

Defaults to `hsl`, as this is the most intuitive for humans, and supports all
browsers back to IE9. _This can be changed with a setting._

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-colornorm
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-colornorm'),
    require('autoprefixer')
  ]
}
```

Or to choose a different color output format, try:

Valid output color formats can be found on the [colornorm] docs.

```diff
module.exports = {
  plugins: [
+   require('postcss-colornorm')({ output: "hex" }),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
[PostCSS]: https://github.com/postcss/postcss
[colornorm]: https://github.com/tbjgolden/colornorm
