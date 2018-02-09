const fs = require('fs');

// Sass.js
const sass = fs.readFileSync('./src/sass-0.10.7.sync.min.js');
const sassTxt = sass.toString();

// Normal Version
const src = fs.readFileSync('./src/in-browser-sass-standalone.js');
const srcTxt = src.toString();

const distTxt = srcTxt.replace('/*! Sass.js */', sassTxt);
fs.writeFileSync('./in-browser-sass-standalone.js', distTxt);

// Uglify Version : Uglify 後に Sass.js を追加する
const uglifiedSrc = fs.readFileSync('./in-browser-sass-standalone.min.js');
const uglifiedSrcTxt = uglifiedSrc.toString();

const uglifiedDistTxt = uglifiedSrcTxt.replace('/*! Sass.js */', sassTxt);
fs.writeFileSync('./in-browser-sass-standalone.min.js', uglifiedDistTxt);
