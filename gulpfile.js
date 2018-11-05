var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');

gulp.task('uglify', function(){
    return gulp.src('src/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minifycss', function(){
    return gulp.src('src/css/main.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.js', ['uglify']);
    gulp.watch('src/css/*.css', ['minifycss']);
});


gulp.task('default', ['uglify', 'minifycss', 'watch']);