const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');

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
