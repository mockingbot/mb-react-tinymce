# mb-react-tinymce

[![i:npm]][l:npm]
[![i:size]][l:size]
[![i:lint]][l:lint]
[![i:npm-dev]][l:npm]

[Online DEMO](https://mockingbot.github.io/mb-react-tinymce/)

[i:npm]: https://img.shields.io/npm/v/mb-react-tinymce.svg?colorB=blue
[i:npm-dev]: https://img.shields.io/npm/v/mb-react-tinymce/dev.svg
[l:npm]: https://www.npmjs.com/package/mb-react-tinymce
[i:size]: https://packagephobia.now.sh/badge?p=mb-react-tinymce
[l:size]: https://packagephobia.now.sh/result?p=mb-react-tinymce
[i:lint]: https://img.shields.io/badge/code_style-standard_ES6+-yellow.svg
[l:lint]: https://standardjs.com

Try to deal with:
* Warp `TinyMCE` into `React Component`
* Also provides a hackable EditorToolbar Component

#### Basic Usage

You can build the test version by `npm i && npm start`,
and serve the `example/` directory.
Then open `example/index.html`.

Check code to init example at:
- `source/index.example.js`
- `example/index.html`

this package expects `TinyMCE` to be loaded as: `window.tinyMCE || window.tinymce`

this package exports: 
```
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
