import gulp from 'gulp';
import postcss from 'gulp-postcss';
import pimport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import htmlmin from 'gulp-htmlmin';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import browserSync from 'browser-sync';
import del from 'del';
import svgstore from 'gulp-svgstore';
import imagemin, { mozjpeg, optipng, svgo } from 'gulp-imagemin';

// Clean

function clean() {
  return del('dist');
}

// Copy

function copy() {
  return gulp.src(
    [
      'src/fonts/**/*.{woff2,woff}'
    ],{
      base: 'src'
    })
    .pipe(gulp.dest('dist'));
}

// HTML

function html() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Styles

function styles() {
  return gulp.src('src/styles/index.css')
    .pipe(postcss([
      pimport,
      autoprefixer,
      csso
    ]))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Scripts

function scripts() {
  return gulp.src('src/scripts/index.js')
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(terser())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

// Sprite

function sprite() {
  return gulp.src('src/images/sprite/**/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(gulp.dest('dist/images'));
}

// Images

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg}')
    .pipe(imagemin([
      mozjpeg({ progressive: true }),
      optipng({ optimizationLevel: 3 }),
      svgo()
    ]))
    .pipe(gulp.dest('dist/images'));
}

// Server

function server() {
  browserSync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  });

  // Watchers

  gulp.watch('src/**/*.html', gulp.series(html));
  gulp.watch('src/styles/**/*.css', gulp.series(styles));
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
  gulp.watch('src/images/sprite/**/*.svg', gulp.series(sprite));
  gulp.watch('src/images/**/*.{jpg,png,svg}', gulp.series(images));
  gulp.watch(['src/fonts/**/*.{woff2,woff}'], gulp.series(copy));
}

export default gulp.series(
  clean,
  copy,
  gulp.parallel(html, styles, scripts, sprite, images),
  server
);
