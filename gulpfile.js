var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    coffee = require('gulp-coffee'),
    jade = require('gulp-jade')

var paths = {
  stylus: ['public/stylus/**/*.styl'],
  coffee: ['*.coffee','./*/*.coffee'],
  jade: ['views/new/*.jade']
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

gulp.task('jade', function() {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('html'))
})

gulp.task('work', function() {
  gulp.watch(paths.coffee, ['coffee'])
  gulp.watch(paths.stylus, ['stylus'])
  gulp.watch(paths.jade, ['jade'])
})

gulp.task('default', ['stylus','coffee']);