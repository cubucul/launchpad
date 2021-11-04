const { src, dest, watch, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const del = require('del');
const svgstore = require('gulp-svgstore');

function clean() {
  return del('dist');
}

function html() {
  return src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('src/styles/index.css')
    .pipe(postcss([
      require('postcss-import'),
      require('autoprefixer'),
      require('postcss-csso')
    ]))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src('src/scripts/index.js')
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(terser())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

function sprite() {
  return src('src/images/sprite/**/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(dest('dist/images'));
}

function server() {
  browserSync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  });

  watch('src/**/*.html', series(html));
  watch('src/styles/**/*.css', series(styles));
  watch('src/scripts/**/*.js', series(scripts));
  watch('src/images/sprite/**/*.svg', series(sprite));
}

exports.default = series(
  clean,
  parallel(html, styles, scripts, sprite),
  server
);
