const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');

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
