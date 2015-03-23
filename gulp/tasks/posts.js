var gulp = require('gulp');
var frontMatter = require('gulp-front-matter');
var marked = require('gulp-marked');
var summarize = require ('../utils/summarize');
var applyTemplate = require ('../utils/apply-template');
var collectPosts = require ('../utils/collect-posts');
var filename2date = require ('../utils/filename2date');
var rename = require('gulp-rename');
var path = require('path');

var config = require('../config').posts;

var rePostName = config.rePostName;

gulp.task('posts', function () {
    return gulp.src(config.src)
        .pipe(frontMatter(config.frontMatterConfig))        
        .pipe(marked())
        .pipe(summarize(config.summarizeSign))
        .pipe(filename2date())
        .pipe(collectPosts())
        .pipe(applyTemplate(config.defaultTemplate))
        .pipe(rename(function (path) {
            path.extname = config.renameExt;
            var match = rePostName.exec(path.basename);
            if (match)
            {
                var year = match[1];            
                var month = match[2];
                var day = match[3];
            
                path.dirname = year + '/' + month + '/' + day;
                path.basename = match[4];
            }            
        }))
        .pipe(gulp.dest(config.dest));
});
