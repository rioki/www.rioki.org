var through = require('through2');
var gutil = require('gulp-util')

var config = require('../config').dummy;

var site  = config.siteConfig;

site.time = new Date();

module.exports = function (file) {
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});
    
  if (site)
  {
    var file = new gutil.File({
      path: file,
      contents: new Buffer('')
    });
    file.page = {}        
    stream.write(file);        
  }
  
  stream.end();
  stream.emit("end");
  
  return stream;
}
