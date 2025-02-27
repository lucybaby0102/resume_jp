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
  return gulp.src('./src/sass/**/*.sass')  // 來源是 Sass 檔案
    .pipe(plumber({ errorHandler: notify.onError('Sass Error: <%= error.message %>') }))  
    .pipe(sass())  // 編譯 Sass 成 CSS
    .pipe(gulp.dest('./dist/css'))  // 輸出到 dist/css 資料夾
    .pipe(browserSync.stream());
});

//處理圖片和其他靜態資源
gulp.task('images', function () {
  return gulp.src('./src/images/**/*')  // 來源資料夾
    .pipe(gulp.dest('./dist/images'));  // 複製到 dist/images 資料夾
});


// 監聽檔案變化 & 自動刷新
gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './dist'  // 設定 BrowserSync 伺服器根目錄
    }
  });

  gulp.watch('./src/pug/**/*.pug', gulp.series('pug'));  // 監聽 Pug 變化
  gulp.watch('./src/sass/**/*.sass', gulp.series('sass'));  // 監聽 Sass 變化
  gulp.watch('./dist/*.html').on('change', browserSync.reload);  // 監聽 HTML 變化
});

// 預設任務：執行所有任務
gulp.task('default', gulp.series('sass', 'pug', 'watch'));
