var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

// dist 폴더를 기준으로 웹서버 실행
gulp.task('server', ['uglify', 'minifycss', 'minifyhtml'], function () {
    return browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

// HTML 파일을 minify
gulp.task('minifyhtml', function () {
    return gulp.src('src/**/*.html') // src 폴더 아래의 모든 html 파일을 
        .pipe(minifyhtml()) // minify 해서
        .pipe(gulp.dest('dist')) // dist 폴더에 저장
        .pipe(browserSync.reload({
            stream: true // browserSync 로 브라우저에 반영
        }));
});

// javaScript 파일을 browserify 로 번들링
gulp.task('uglify', function () {
    return browserify('src/js/main.js')
        .bundle() // browserify로 버들링
        .on('error', function (err) {
            // browserify bundlung 과정에서 오류가 날 경우 gulp가 죽지않도록 예외처리
            console.error(err);
            this.rmit('end');
        })
        .pipe(source('main.js')) // vinyl object로 변환
        .pipe(buffer()) // buffered vinyl object 로 변환
        .pipe(sourcemaps.init({loadMaps: true, debug: true})) // 소스맵 생성 준비
        .pipe(uglify()) // minify 해서
        .pipe(sourcemaps.write('./')) // 생성된 소스맵을 스트림에 추
        .pipe(gulp.dest('dist.js')) // dist 퐆더에 저장
        .pipe(browserSync.reload({
            stream:true
        }));
});

// CSS 파일을 minify
gulp.task('minifycss', function(){
    return gulp.src('src/**/*.css') // src 폴더 아래의 모든 css 파일을
        .pipe(concat('main.css')) // 병합하고
        .pipe(sourcemaps.init({loadMaps: true, debug: true})) // 소스맵 생성 준비
        .pipe(minifycss()) // minify 해서
        .pipe(sourcemaps.write('./')) // 생성된 소스맵을 스트림에 추가
        .pipe(gulp.dest('dist/css')) // dist 폴더에 저장
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.js', ['uglify']);
    gulp.watch('src/css/*.css', ['minifycss']);
    gulp.watch('src/**/*.html', ['minifyhtml']);
});


gulp.task('default', ['server', 'watch']);