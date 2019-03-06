# @neos21/in-browser-sass

[![NPM Version](https://img.shields.io/npm/v/@neos21/in-browser-sass.svg)](https://www.npmjs.com/package/@neos21/in-browser-sass)

ブラウザ上で SASS / SCSS コードをコンパイルし Web ページに適用するライブラリ。

[English version is here](README.md)


## デモ

__[デモ (GitHub Pages)](https://neos21.github.io/in-browser-sass/)__


## インストール方法

```html
<!-- Load sass.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.7/sass.sync.min.js"></script>
<!-- Load this script -->
<script src="in-browser-sass.js"></script>
```

[sass.js](https://github.com/medialize/sass.js) の CDN は以下が利用可能。

- https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.10.7/sass.sync.min.js
- https://unpkg.com/sass.js@0.10.7/dist/sass.sync.js


## スタンドアロン版

スタンドアロン版は sass.js を内蔵している。そのため、インストールは以下の1行で済む。

```html
<!-- Load this script included sass.js -->
<script src="in-browser-sass-standalone.js"></script>
```


## 使い方

HTML 中に `link` 要素もしくは `style` 要素で SASS / SCSS コードを挿入する。`type="text/sass"` か `type="text/sass"` の属性を付与すること。

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

これが以下のようにコンパイル・適用される。

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

コンパイル後の CSS ソースを持つ `style` 要素は、元の要素の直後に挿入される。


## 作者

[Neo](http://neo.s21.xrea.com/) ([@Neos21](https://twitter.com/Neos21))

- [GitHub - in-browser-sass](https://github.com/Neos21/in-browser-sass)
- [GitHub Pages - in-browser-sass](https://neos21.github.io/in-browser-sass/)
- [npm - @neos21/in-browser-sass](https://www.npmjs.com/package/@neos21/in-browser-sass)


## Links

- [Neo's World](http://neo.s21.xrea.com/)
- [Corredor](http://neos21.hatenablog.com/)
- [Murga](http://neos21.hatenablog.jp/)
- [El Mylar](http://neos21.hateblo.jp/)
- [Neo's GitHub Pages](https://neos21.github.io/)
- [GitHub - Neos21](https://github.com/Neos21/)
