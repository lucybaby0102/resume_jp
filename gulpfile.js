const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

// Pug 編譯
gulp.task('pug', function () {
  return gulp.src('./src/pug/index.pug') // 只編譯 index.pug
    .pipe(plumber({ errorHandler: notify.onError('Pug Error: <%= error.message %>') }))
    .pipe(pug({ pretty: true })) // 轉成 HTML
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// Sass 編譯
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(plumber({ errorHandler: notify.onError('Sass Error: <%= error.message %>') }))
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

// 監聽檔案變化 & 自動刷新
gulp.task('watch', function () {
  browserSync.init({ server: { baseDir: './dist' } });

  gulp.watch('./src/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('./src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
});

// 預設執行
gulp.task('default', gulp.series(gulp.parallel('pug', 'sass'), 'watch'));
