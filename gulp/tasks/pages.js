var gulp = require('gulp');
var frontMatter = require('gulp-front-matter');
var marked = require('gulp-marked');
var applyTemplate = require ('../utils/apply-template');
var rename = require('gulp-rename');

var config = require('../config').pages;

gulp.task('pages', function () {
    return gulp.src(config.src)
        .pipe(frontMatter(config.frontMatterConfig))
        .pipe(marked())
        .pipe(applyTemplate(config.defaultTemplate))
        .pipe(rename({extname: config.renameExt}))
        .pipe(gulp.dest(config.dest));
});
