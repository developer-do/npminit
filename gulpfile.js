var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps'); // sourcemap 생성
var newer = require('gulp-newer');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var plumber = require('gulp-plumber');

var errorHandler = function (error) {
    console.error(error.message);
    this.emit('end');
};

var plumberOption = {
    errorHandler: errorHandler
}

/*
    npm init
    npm install -g gulp-cli
    npm install --save-dev gulp
    require(' ☆☆☆☆ ') 저 안에 있는 것들이 이름.
    npm install --save-dev ☆☆☆☆  적으면 설치 됨.

    --save-dev 옵션으로 설치해 주는 이유는, 대부분 gulp가 production 이 아닌 개발 과정에서만 필요하기 때문에, NODE_ENV 의 값이 production 인 경우 gulp가 설치되지 않도록 하기 위해서 이다.
*/


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
        .pipe(plumber(plumberOption)) // 빌드 과정에서 오류 발생시 gulp가 죽지 않도록 예외처리
        .pipe(newer('dist')) // dist에 있는 결과물 보다 새로운 파일만 다음 단계로 진행
        .pipe(minifyhtml()) // minify 해서
        .pipe(gulp.dest('dist')) // dist 폴더에 저장
        .pipe(browserSync.reload({
            stream: true // browserSync 로 브라우저에 반영
        }));
});

// javaScript 파일을 browserify 로 번들링
gulp.task('uglify', function () {
    return browserify('src/js/main.js')
        .bundle() // browserify 로 번들링
        .on('error', errorHandler)
        .pipe(source('main.js')) // vinyl object 로 변환
        .pipe(buffer()) // buffered vinyl object 로 변환
        .pipe(plumber(plumberOption)) // 빌드 과정에서 오류 발생시 gulp 가 죽지 않도록 예외 처리
        .pipe(sourcemaps.init({loadMaps: true, debug: true})) // 소스맵 생성 준비
        .pipe(uglify()) // minify 해서
        .pipe(sourcemaps.write('./')) // 생성된 소스맵을 스트림에 추가
        .pipe(gulp.dest('dist.js')) // dist 퐆더에 저장
        .pipe(browserSync.reload({
            stream:true // browserSync 로 브라우저에 반영
        }));
});

// CSS 파일을 minify
gulp.task('minifycss', function(){
    return gulp.src('src/**/*.css') // src 폴더 아래의 모든 css 파일을
        .pipe(plumber(plumberOption)) // 빌드 과정에서 오류 발생시 gulp가 죽지 않도록 예외처리
        .pipe(sourcemaps.init({ loadMaps: true, debug: true })) // 소스맵 생성 준비
        .pipe(cached('css')) // 파일들을 캐시하고 캐시된 것보다 새로운 파일만 다음 단계로 진행
        .pipe(minifycss()) // 새로운 파일만 minify 해서 (@import된 파일이 수정된 경우 최상위 파일은 캐시된 상태 그대로 이므로 minifycss를 타지 않아 정상적으로 종속성 관리가 이루어지지 않는 점을 주의!)
        .pipe(remember('css')) // minify된 새로운 파일과 캐시된 나머지 내용들을 다시 스트림으로
        .pipe(concat('main.css')) // 병합하고
        .pipe(sourcemaps.write('./')) // 생성된 소스맵을 스트림에 추가
        .pipe(gulp.dest('dist/css')) // dist 폴더에 저장
        .pipe(browserSync.reload({
            stream: true // browserSync 로 브라우저에 반영
        }));
});

// 파일 변경 감지
gulp.task('watch', function(){
    gulp.watch('src/**/*.js', ['uglify']);
    gulp.watch('src/css/*.css', ['minifycss']);
    gulp.watch('src/**/*.html', ['minifyhtml']);
});

// gulp를 실행하면 default 로 minfycss task를 실행
gulp.task('default', ['server', 'watch']);