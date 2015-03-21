var gulp = require('gulp');
var dummy = require ('../utils/dummy');
var applyTemplate = require ('../utils/apply-template');

var config = require('../config').index;

gulp.task('index', ['posts'], function () {
    return dummy(config.dummy)
        .pipe(applyTemplate(config.defaultTemplate))
        .pipe(gulp.dest(config.dest));
})
