import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import gulpPug from 'gulp-pug';

const sassCompiler = gulpSass(sass);

const paths = {
  pug: {
    src: 'client/views/**/*.pug',
    dest: 'public/'
  },
  styles: {
    src: 'client/styles/**/*.scss',
    dest: 'public/css/'
  },
  scripts: {
    src: 'client/js/**/*.js',
    dest: 'public/js/'
  }
};

export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

export function pugCompile() {
  return gulp.src(paths.pug.src)
    .pipe(gulpPug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.pug.dest));
}

export function watch() {
  gulp.watch(paths.pug.src, pugCompile);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

export const build = gulp.series(
  gulp.parallel(pugCompile, styles, scripts)
);

export default build;

