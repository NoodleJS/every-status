var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    coffee = require('gulp-coffee')

var paths = {
  stylus: ['public/stylus/**/*.styl'],
  coffee: ['*.coffee','./*/*.coffee']
};

gulp.task('stylus', function() {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest('public/css'));
});

gulp.task('coffee', function() {
  return gulp.src(paths.coffee)
    .pipe(coffee())
    .pipe(gulp.dest(''))
})

gulp.task('work', function() {
  gulp.watch(paths.coffee, ['coffee'])
  gulp.watch(paths.stylus, ['stylus'])
})

gulp.task('default', ['stylus','coffee']);