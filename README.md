# rollup-plugin-i18n

Embed your localized text into your bundle.

## How to use
In your source code, for example if you have a key called 'msg_hello', to translate it use `__('msg_hello')`

## Config

```js
import i18n from 'rollup-plugin-i18n';

export default {
  input: 'index.js',
  plugins: [
    i18n({
      language: {
        'msg_hello': 'Hello',
        'msg_world': 'World!',
      },
    }),
  ],
}
```

```js
// index.js

console.log(__('msg_hello'), __('msg_world'));

```

### Output
```
Hello World!
```

### Options
- `language: {[key:string]: string}`: an object that map from a string key to the localized message

### Limitations
Currently we are using a regex to replace all instances of `__(<msg>)` with their translation. In the future if rollup decides to open up access to the AST we can do a better job of replacement.
