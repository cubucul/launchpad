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

function clean() {
  return del('dist');
}

function html() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

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

function scripts() {
  return gulp.src('src/scripts/index.js')
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(terser())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

function sprite() {
  return gulp.src('src/images/sprite/**/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(gulp.dest('dist/images'));
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg}')
    .pipe(imagemin([
      mozjpeg({ progressive: true }),
      optipng({ optimizationLevel: 3 }),
      svgo()
    ]))
    .pipe(gulp.dest('dist/images'));
}

function server() {
  browserSync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('src/**/*.html', gulp.series(html));
  gulp.watch('src/styles/**/*.css', gulp.series(styles));
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
  gulp.watch('src/images/sprite/**/*.svg', gulp.series(sprite));
  gulp.watch('src/images/**/*.{jpg,png,svg}', gulp.series(images));
}

export default gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, sprite, images),
  server
);
