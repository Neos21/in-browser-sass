const fs       = require('fs').promises;
const path     = require('path');

const uglifyEs = require('uglify-es');


// 定数
// ================================================================================

const srcDir    = './src/'   ;  // ソースコードがあるディレクトリ
const distDir   = './dist/'  ;  // npm publish 時に同梱したいビルド後のディレクトリ
const publicDir = './public/';  // GitHub Pages で公開したいディレクトリ
// Sass.js
const sassJs = {
  srcName: 'sass.sync.js',      // 非圧縮版
  minName: 'sass.sync.min.js',  // 圧縮版
  src: '',  // ソースコードをファイルから読み込む
  min: ''   // ソースコードをファイルから読み込む
};
// in-browser-sass
const js = {
  srcName        : 'in-browser-sass.js',         // 取得するファイル名・および非圧縮ビルド後のファイル名
  minName        : 'in-browser-sass.min.js',     // 圧縮ビルド後のファイル名
  commentLoadSass: '/*! Load Sass.js First */',  // 置換対象コメント定義
  src: '',  // ソースコードをファイルから読み込む
  min: ''   // ソースコードをファイルから読み込む
};
// index.html およびテスト用 HTML
const html = {
  srcName                 : 'index.html',                         // 取得するファイル名・およびデモページのファイル名
  commentLoadSass         : '<!-- ! Load Sass.js ! -->',          // 置換対象コメント定義
  commentLoadInBrowserSass: '<!-- ! Load in-browser-sass ! -->',  // 置換対象コメント定義
  src: ''  // ソースコードをファイルから読み込む
};
// Example Styles : ファイルコピーのみ
const example = {
  sassName: 'example.sass',
  scssName: 'example.scss'
};


// タスク
// ================================================================================

// Dist・Public ディレクトリを空にする
const resetDirs = async () => {
  const resetDir = async (dirName) => {
    if(await fs.access(dirName).then(() => true).catch(() => false)) {
      await fs.rmdir(dirName, { recursive: true });
    }
    await fs.mkdir(dirName);
  };
  
  await resetDir(distDir);
  await resetDir(publicDir);
};

// ソースコードを読み込み定数のプロパティに控える : in-browser-sass の圧縮版はココで圧縮する
const loadFiles = async () => {
  sassJs.src = await fs.readFile(path.resolve(srcDir, sassJs.srcName), 'utf-8');
  sassJs.min = await fs.readFile(path.resolve(srcDir, sassJs.minName), 'utf-8');
  
  js.src = await fs.readFile(path.resolve(srcDir, js.srcName), 'utf-8');
  js.min = uglifyEs.minify(js.src, {
    compress: true,
    mangle: true,
    output: {
      comments: (/^!/u)
    }
  }).code + '\n';
  
  html.src = await fs.readFile(path.resolve(srcDir, html.srcName), 'utf-8');
};

// Sass.js を同梱しない in-browser-sass を書き出す
const buildSeparation = async () => {
  await fs.writeFile(path.resolve(distDir, js.srcName), js.src.replace(js.commentLoadSass + '\n\n', ''), 'utf-8');
  await fs.writeFile(path.resolve(distDir, js.minName), js.min.replace(js.commentLoadSass + '\n'  , ''), 'utf-8');
};

// Sass.js を同梱する in-browser-sass を書き出す
const buildBundle = async () => {
  const replaceFromSrc = (sassJsCode) => js.src.replace(js.commentLoadSass + '\n', sassJsCode + '\n');
  const replaceFromMin = (sassJsCode) => js.min.replace(js.commentLoadSass       , sassJsCode + '\n');
  const builds = [
    { sassJs: sassJs.src, js: replaceFromSrc, distName: js.srcName.replace('.js'    , '.bundle.js'    ) },
    { sassJs: sassJs.src, js: replaceFromMin, distName: js.minName.replace('.min.js', '.bundle.min.js') }
    // sassJs の圧縮版を混ぜ込もうとすると `Uncaught SyntaxError: Unexpected token '&'` エラーが出てしまうため辞める
    //{ sassJs: sassJs.min, js: replaceFromSrc, distName: js.srcName.replace('.js'    , '.bundle-min.js'    ) },
    //{ sassJs: sassJs.min, js: replaceFromMin, distName: js.minName.replace('.min.js', '.bundle-min.min.js') }
  ];
  for(let i = 0; i < builds.length; i++) {
    const build = builds[i];
    const jsCode = build.js(build.sassJs);
    await fs.writeFile(path.resolve(distDir, build.distName), jsCode, 'utf-8');
  }
};

// ソースディレクトリからのファイルコピー
const copySrcToPublic = async () => {
  await fs.copyFile(path.resolve(srcDir, sassJs.srcName)  , path.resolve(publicDir, sassJs.srcName));
  await fs.copyFile(path.resolve(srcDir, sassJs.minName)  , path.resolve(publicDir, sassJs.minName));
  await fs.copyFile(path.resolve(srcDir, example.sassName), path.resolve(publicDir, example.sassName));
  await fs.copyFile(path.resolve(srcDir, example.scssName), path.resolve(publicDir, example.scssName));
}

// ビルド後のファイルコピー
const copyDistToPublic = async () => {
  // Separation
  await fs.copyFile(path.resolve(distDir, js.srcName), path.resolve(publicDir, js.srcName));
  await fs.copyFile(path.resolve(distDir, js.minName), path.resolve(publicDir, js.minName));
  // Bundle
  await fs.copyFile(path.resolve(distDir, js.srcName.replace('.js'    , '.bundle.js'    )), path.resolve(publicDir, js.srcName.replace('.js'    , '.bundle.js'    )));
  await fs.copyFile(path.resolve(distDir, js.minName.replace('.min.js', '.bundle.min.js')), path.resolve(publicDir, js.minName.replace('.min.js', '.bundle.min.js')));
};

// 公開用 index.html を書き出す
const buildPublicIndexHtml = async () => {
  let htmlCode = html.src;
  htmlCode = htmlCode.replace(html.commentLoadSass         , html.commentLoadSass.replace((/! /gu), '')          + '\n    <script src="./' + sassJs.srcName + '"></script>');
  htmlCode = htmlCode.replace(html.commentLoadInBrowserSass, html.commentLoadInBrowserSass.replace((/! /gu), '') + '\n    <script src="./' + js.srcName     + '"></script>');
  await fs.writeFile(path.resolve(publicDir, html.srcName), htmlCode, 'utf-8');
};

// Sass.js と in-browser-sass を別々に読み込むテストページを書き出す (それぞれの非圧縮・圧縮版の組合せで4種類)
const buildTestSeparationHtml = async () => {
  const replaceSassJsSrc = (htmlCode) => htmlCode.replace(html.commentLoadSass         , html.commentLoadSass.replace((/! /gu), '')          + '\n    <script src="./' + sassJs.srcName + '"></script>');
  const replaceSassJsMin = (htmlCode) => htmlCode.replace(html.commentLoadSass         , html.commentLoadSass.replace((/! /gu), '')          + '\n    <script src="./' + sassJs.minName + '"></script>');
  const replaceJsSrc     = (htmlCode) => htmlCode.replace(html.commentLoadInBrowserSass, html.commentLoadInBrowserSass.replace((/! /gu), '') + '\n    <script src="./' + js.srcName     + '"></script>');
  const replaceJsMin     = (htmlCode) => htmlCode.replace(html.commentLoadInBrowserSass, html.commentLoadInBrowserSass.replace((/! /gu), '') + '\n    <script src="./' + js.minName     + '"></script>');
  const builds = [
    { sassJs: replaceSassJsSrc, js: replaceJsSrc, htmlName: path.resolve(publicDir, 'test-src-src.html') },
    { sassJs: replaceSassJsSrc, js: replaceJsMin, htmlName: path.resolve(publicDir, 'test-src-min.html') },
    { sassJs: replaceSassJsMin, js: replaceJsSrc, htmlName: path.resolve(publicDir, 'test-min-src.html') },
    { sassJs: replaceSassJsMin, js: replaceJsMin, htmlName: path.resolve(publicDir, 'test-min-min.html') }
  ];
  for(let i = 0; i < builds.length; i++) {
    const build = builds[i];
    let htmlCode = html.src;
    htmlCode = build.sassJs(htmlCode);
    htmlCode = build.js(htmlCode);
    await fs.writeFile(build.htmlName, htmlCode, 'utf-8');
  }
};

// Sass.js 同梱版の in-browser-sass を使うテストページを書き出す
const buildTestBundleHtml = async () => {
  const builds = [
    { distName: js.srcName.replace('.js'    , '.bundle.js'    ), htmlName: path.resolve(publicDir, 'test-bundle-src-src.html') },
    { distName: js.minName.replace('.min.js', '.bundle.min.js'), htmlName: path.resolve(publicDir, 'test-bundle-src-min.html') },
    // sassJs の圧縮版を混ぜ込もうとすると `Uncaught SyntaxError: Unexpected token '&'` エラーが出てしまうため辞める
    //{ distName: js.srcName.replace('.js'    , '.bundle-min.js'    ), htmlName: path.resolve(publicDir, 'test-bundle-min-src.html') },
    //{ distName: js.minName.replace('.min.js', '.bundle-min.min.js'), htmlName: path.resolve(publicDir, 'test-bundle-min-min.html') }
  ];
  for(let i = 0; i < builds.length; i++) {
    const build = builds[i];
    let htmlCode = html.src;
    htmlCode = htmlCode.replace(html.commentLoadSass + '\n    \n    ', '');  // Remove Load Sass.js Comment
    htmlCode = htmlCode.replace(html.commentLoadInBrowserSass, '<!-- Load in-browser-sass Bundle -->\n    <script src="./' + build.distName + '"></script>');
    await fs.writeFile(build.htmlName, htmlCode, 'utf-8');
  }
};

// テストページへのリンク一覧ページを作る
const buildTestHtml = async () => {
  const headerHtml = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>in-browser-sass Test Page</title>
  </head>
  <body>
    <h1>in-browser-sass Test Page</h1>
    <ul>\n`;
  const footerHtml = `
    </ul>
  </body>
</html>`;
  
  const publicFiles = await fs.readdir(publicDir);
  const htmlFiles = publicFiles.filter((fileName) => fileName.endsWith('.html'));
  const listHtml = htmlFiles.map((fileName) => `      <li><a href="${fileName}">${fileName}</a></li>\n`).join('');
  const testHtml = headerHtml + listHtml + footerHtml;
  await fs.writeFile(path.resolve(publicDir, 'test.html'), testHtml, 'utf-8');
};


// 実行
// ================================================================================

(async () => {
  await resetDirs();
  await loadFiles();
  await buildSeparation();
  await buildBundle();
  
  await copySrcToPublic();
  await copyDistToPublic();
  await buildPublicIndexHtml();
  
  await buildTestSeparationHtml();
  await buildTestBundleHtml();
  await buildTestHtml();
  
  console.log('Finished');
})();
