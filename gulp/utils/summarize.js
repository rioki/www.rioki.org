var through = require('through2');

module.exports = function (marker) {
    return through.obj(function (file, enc, cb) {                
        var summary = file.contents.toString().split(marker)[0]
        file.page.summary = summary;
        this.push(file);
        cb();
    });
}
