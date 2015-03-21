var gulp = require('gulp');

var config = require('../config').media;

gulp.task('media', function () {
    return gulp.src(config.src)        
        .pipe(gulp.dest(config.dest));
});
