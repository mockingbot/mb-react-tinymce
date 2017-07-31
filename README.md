# mb-react-tinymce

Try to deal with:
* Warp `TinyMCE` into `React Component`
* Also provides a hackable EditorToolbar Component

[Online DEMO](https://mockingbot.github.io/mb-react-tinymce/)

#### Basic Usage

You can build the test version by `npm i && npm start`,
and serve the `example/` directory.
Then open `example/index.html`.

Check code to init example at:
- `source/index.example.js`
- `example/index.html`

this package requires: 

```js
const TINY_MCE = window.tinyMCE || window.tinymce // TinyMCE needs to be loaded
```

this package exports: 

```js
export {
  createEditorStore,
  TinyMCEComponent,
  Toolbar,
  LOCALE_LIST,
  GET_LOCALE,
  SET_LOCALE
}
```

#### Reference

- [TinyMCE](https://www.tinymce.com/)
- [mb-icons](https://github.com/mockingbot/mb-icons) (for EditorToolbar)
