var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('uglify', function(){
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
    gulp.watch('src/*.js', ['uglify']);
});


gulp.task('default', ['uglify', 'watch']);