var through = require('through2');
var path = require('path');

var config = require('../config').fileName2Date;

var rePostName   = config.rePostName;

module.exports =function () {
    return through.obj(function (file, enc, cb) {                
        var basename = path.basename(file.path, config.markDownExtension);
        var match = rePostName.exec(basename);
        if (match)
        {
            var year     = match[1];            
            var month    = match[2];
            var day      = match[3];
            var basename = match[4];
            file.page.date = new Date(year + "-" + month + "-" + day);
            file.page.url  = '/' + year + '/' + month + '/' + day + '/' + basename + '.html';
        }
        
        this.push(file);
        cb();
    });
}
