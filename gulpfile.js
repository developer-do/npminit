var gulp = require('gulp');

gulp.task('hello', function () {
    return console.log('Hello World');
});

gulp.task('default', ['hello']);