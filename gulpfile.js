var gulp = require('gulp');

gulp.task('hello', function () {
    return console.log('Hello');
});

gulp.task('world', function () {
    return console.log('World');
});

gulp.task('default', ['hello', 'world']);