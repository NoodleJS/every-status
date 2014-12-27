var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade')

var paths = {
  stylus: ['public/stylus/**/*.styl'],
  jade: ['views/new/*.jade']
};

gulp.task('stylus', function() {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest('public/css'));
});

gulp.task('jade', function() {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('public/html'))
})

gulp.task('work', function() {
  gulp.watch(paths.stylus, ['stylus'])
  gulp.watch(paths.jade, ['jade'])
})

gulp.task('default', ['stylus', 'jade']);