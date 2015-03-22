var swig = require('swig');
var path = require('path');
var through = require('through2');

var config = require('../config').applyTemplate;

var site  = config.siteConfig;

site.time = new Date();

swig.setDefaults({ 
    loader: swig.loaders.fs(path.resolve(config.templateSrc)),
    cache: false
});

module.exports = function (templateFile) {
    var tpl = swig.compileFile(path.join(__dirname, templateFile));
    return through.obj(function (file, enc, cb) {            
        var data = {
            site: site,
            page: file.page,
            content: file.contents.toString()
        };            
        file.contents = new Buffer(tpl(data), 'utf8');
        this.push(file);
        cb();
    });
}
