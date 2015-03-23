var gulp = require('gulp');
var clean = require('gulp-clean');

var config = require('../config').clean;

gulp.task('clean', function() {
  return gulp.src(config.src, config.read)
    .pipe(clean());
});
