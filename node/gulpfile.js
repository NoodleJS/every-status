var gulp = require('gulp'),
    stylus = require('gulp-stylus');

var paths = {
  stylus: ['public/stylus/**/*.styl']
};

gulp.task('stylus', function() {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['stylus']);