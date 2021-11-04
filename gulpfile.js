const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const terser = require('gulp-terser');

function html() {
  return src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(dest('dist'));
}

exports.html = html;

function styles() {
  return src('src/styles/index.css')
    .pipe(postcss([
      require('postcss-import'),
      require('autoprefixer'),
      require('postcss-csso')
    ]))
    .pipe(dest('dist/css'));
}

exports.styles = styles;

function scripts() {
  return src('src/scripts/index.js')
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(terser())
    .pipe(dest('dist/js'));
}

exports.scripts = scripts;
