var gulp = require('gulp');
var posts = require ('../utils/posts')
var applyTemplate = require ('../utils/apply-template');

var config = require('../config').archive;

gulp.task('archive', ['posts'], function () {
    return posts(config.baseName, config.count)
        .pipe(applyTemplate(config.defaultTemplate))
        .pipe(gulp.dest(config.dest));
});
