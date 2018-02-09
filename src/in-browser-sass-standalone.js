/*! in-browser-sass-standalone v1.0.4 : Neo (@Neos21) http://neo.s21.xrea.com/ */

/*! Sass.js */

(() => {
  
  /** SASS・SCSS ソースコードを CSS にコンパイルし style 要素として元要素の直後に挿入する */
  const inBrowserSass = () => {
    // style 要素と link 要素を取得する
    Array.prototype.forEach.call(document.querySelectorAll('style, link'), (elem) => {
      // type 属性値
      const typeAttr = elem.type.toLowerCase();
      
      // type 属性値が text/sass もしくは text/scss でなければ除外する
      if(typeAttr !== 'text/sass' && typeAttr !== 'text/scss') {
        return;
      }
      
      // SASS 記法は indentedSyntax: true オプションでコンパイルする必要があるので SASS 記法かどうか判定する
      const isSass = typeAttr === 'text/sass';
      
      // 要素ごとに処理する
      if(elem.tagName.toLowerCase() === 'style') {
        // style 要素は innerHTML でテキストを取得したらコンパイルする
        compileAndInsert(elem, elem.innerHTML, isSass);
      }
      else {
        // link 要素は Ajax でファイルの中身を取得してからコンパイルする
        const xhr = new XMLHttpRequest();
        xhr.open('GET', elem.href, true);
        xhr.onload = () => {
          compileAndInsert(elem, xhr.responseText, isSass);
        };
        xhr.timeout = 3000;  // タイムアウト設定
        xhr.send();
      }
    });
  };
  
  const compileAndInsert = (originalElem, source, isSass) => {
    Sass.compile(source, { indentedSyntax: isSass }, (compiledCss) => {
      const styleElem = document.createElement('style');
      styleElem.type = 'text/css';
      styleElem.innerHTML = compiledCss.text;
      originalElem.parentElement.insertBefore(styleElem, originalElem.nextSibling);
    });
  };
  
  // ブラウザの場合のみ処理する
  if(typeof document !== 'undefined') {
    // body 要素内の style 要素も取得するため全ての DOM 解析が終わってから実行する
    document.addEventListener('DOMContentLoaded', () => {
      // Sass.js を内蔵してあるので直接処理を実行する
      inBrowserSass();
    });
  }
  
})();