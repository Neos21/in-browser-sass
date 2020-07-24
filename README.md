# in-browser-sass : @neos21/in-browser-sass

[![NPM Version](https://img.shields.io/npm/v/@neos21/in-browser-sass.svg)](https://www.npmjs.com/package/@neos21/in-browser-sass) [![GPR Version](https://img.shields.io/github/package-json/v/neos21/in-browser-sass?label=github)](https://github.com/Neos21/in-browser-sass/packages/326130)

Compile SASS / SCSS in the browser.

[Japanese version is here](README.ja.md)


## Demo

__[Demo (GitHub Pages)](https://neos21.github.io/in-browser-sass/)__


## Installation

```html
<!-- Load sass.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js"></script>
<!-- Load this script -->
<script src="in-browser-sass.js"></script>
```

[sass.js](https://github.com/medialize/sass.js) CDNs are available here:

- <https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js>
- <https://unpkg.com/sass.js@0.11.1/dist/sass.sync.js>


## Bundle Version

Bundle version includes sass.js. So installation needs one line:

```html
<!-- Load this script included sass.js -->
<script src="in-browser-sass.bundle.js"></script>
```


## Usage

You can use `link` or `style` elements for include SASS / SCSS. `type="text/sass"` or `type="text/sass"` attribute must be set.

```html
<!-- SASS : link tag -->
<link rel="stylesheet" type="text/sass" href="example.sass">

<!-- SCSS : link tag -->
<link rel="stylesheet" type="text/scss" href="example.scss">

<!-- SASS : style tag -->
<style type="text/sass">
body
  p
    color: #f00
</style>

<!-- SCSS : style tag -->
<style type="text/scss">
body {
  p {
    font-weight: bold;
  }
}
</style>
```

This compiles to:

```html
<!-- SASS : link tag -->
<link rel="stylesheet" type="text/sass" href="example.sass">
<!-- Compiled example.sass -->
<style type="text/css">
body > selection {
  font-size: 110%;
}
</style>

<!-- SCSS : link tag -->
<link rel="stylesheet" type="text/scss" href="example.scss">
<!-- Compiled example.scss -->
<style type="text/css">
a {
  color: #06f;
}
a:hover {
  color: #f09;
}
</style>

<!-- SASS : style tag -->
<style type="text/sass">
body
  p
    color: #f00
</style>
<!-- Compiled inline SASS -->
<style type="text/css">
body p {
  color: #ff0;
}
</style>

<!-- SCSS : style tag -->
<style type="text/scss">
body {
  p {
    font-weight: bold;
  }
}
</style>
<!-- Compiled inline SCSS -->
<style type="text/css">
body p {
  font-weight: bold;
}
</style>
```

Compiled `style` elements are inserted after each original element.

`@import` is not supported.


## Author

[Neo](http://neo.s21.xrea.com/)

- [GitHub - in-browser-sass](https://github.com/Neos21/in-browser-sass)
- [GitHub Pages - in-browser-sass : @neos21/in-browser-sass](https://neos21.github.io/in-browser-sass/)
- [npm - @neos21/in-browser-sass](https://www.npmjs.com/package/@neos21/in-browser-sass)


## Links

- [Neo's World](http://neo.s21.xrea.com/)
- [Corredor](https://neos21.hatenablog.com/)
- [Murga](https://neos21.hatenablog.jp/)
- [El Mylar](https://neos21.hateblo.jp/)
- [Neo's GitHub Pages](https://neos21.github.io/)
- [GitHub - Neos21](https://github.com/Neos21/)
