const fs = require('fs');

// Sass.js
const sass = fs.readFileSync('./src/sass-0.10.7.sync.min.js', 'utf-8');

// Normal Version
const src = fs.readFileSync('./src/in-browser-sass-standalone.js', 'utf-8');

const dist = src.replace('/*! Sass.js */', sass);
fs.writeFileSync('./in-browser-sass-standalone.js', dist);

// Uglify Version : Uglify 後に Sass.js を追加する
const uglifiedSrc = fs.readFileSync('./in-browser-sass-standalone.min.js', 'utf-8');

const uglifiedDist = uglifiedSrc.replace('/*! Sass.js */', sass);
fs.writeFileSync('./in-browser-sass-standalone.min.js', uglifiedDist);
