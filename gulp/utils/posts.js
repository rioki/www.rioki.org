var through     = require('through2');
var gutil = require('gulp-util');

var config = require('../config').postsUtil;

var site  = config.siteConfig;

site.time = new Date();

module.exports = function (basename, count) {
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});
    
  if (site.posts)
  {
    var c     = 0;
    var page  = 0;
    var posts = [];
    site.posts.forEach(function (post) {
      posts.push(post);
      c++;
      if (c == count) {        
        var file = new gutil.File({
          path: basename + (page == 0 ? '' : page) + '.html',
          contents: new Buffer('')
        });
        console.log('page=' + page + ' c=' + c + ' posts.length=' + site.posts.length);
        file.page = {
          posts: posts, 
          prevPage: page != 0 ? basename + ((page-1) == 0 ? '' : page-1) + '.html' : null,
          nextPage: (page+1) * count < site.posts.length ? basename + (page+1) + '.html' : null,
          };
        stream.write(file);
        
        c = 0;
        posts = [];
        page++;
      }
    });   
    
    if (posts.length != 0) {
      var file = new gutil.File({
        path: basename + (page == 0 ? '' : page) + '.html',
        contents: new Buffer('')
      });
      file.page = {
        posts: posts, 
        prevPage: page != 0 ? basename + ((page-1) == 0 ? '' : page) + '.html' : null,
        nextPage: null,
        };
      stream.write(file);
    }
  }
  
  stream.end();
  stream.emit("end");
  
  return stream;
}
