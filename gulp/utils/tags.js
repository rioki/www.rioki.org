var through = require('through2');
var gutil = require('gulp-util');

var config = require('../config').tagsUtil;

var site  = config.siteConfig;

module.exports = function () {    
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});
    
  if (site.tags)
  {
    site.tags.forEach(function (tag) {
      var file = new gutil.File({
        path: tag + '.html',
        contents: new Buffer('')
      });
      file.page = {title: tag, tag: tag}
            
      stream.write(file);        
    });
  }
  
  stream.end();
  stream.emit("end");
  
  return stream;
}
