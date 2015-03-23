var gulp = require('gulp');
var connect = require('connect');
var http = require('http');

var config = require('../config').watch;

gulp.task('watch', ['default'], function () {
  gulp.watch(config.assetsSrc, ['assets']);
  gulp.watch(config.mediaSrc, ['media'])
  gulp.watch(config.pagesSrc, ['pages']);
  gulp.watch(config.blogSrc, ['posts', 'index', 'archive', 'tags', 'rss']);
  
  var app = connect()
    .use(connect.static('build'))
    .use(connect.directory('build'));
  
  http.createServer(app).listen(3000);
});
