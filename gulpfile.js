
var gulp        = require('gulp');
var frontMatter = require('gulp-front-matter');
var marked      = require('gulp-marked');
var rename      = require('gulp-rename');
var clean       = require('gulp-clean');
var gutil       = require('gulp-util');
var path        = require('path');
var swig        = require('swig');
var through     = require('through2');
var StaticServer = require('static-server');

var site  = require('./site.json');
site.time = new Date();

swig.setDefaults({
    loader: swig.loaders.fs(__dirname + '/templates'),
    cache: false
});

var rePostName   = /(\d{4})-(\d{1,2})-(\d{1,2})-(.*)/;

function collectPosts() {
    var posts = [];
    var tags = [];
    return through.obj(function (file, enc, cb) {
        posts.push(file.page);
        posts[posts.length - 1].content = file.contents.toString();

        if (file.page.tags) {
            file.page.tags.forEach(function (tag) {
                if (tags.indexOf(tag) == -1) {
                    tags.push(tag);
                }
            });
        }

        this.push(file);
        cb();
    },
    function (cb) {
        posts.sort(function (a, b) {
            return b.date - a.date;
        });
        site.posts = posts;
        cb();
    });
}

function filename2date() {
    return through.obj(function (file, enc, cb) {
        var basename = path.basename(file.path, '.md');
        var match = rePostName.exec(basename);
        if (match)
        {
            var year     = match[1];
            var month    = match[2];
            var day      = match[3];
            var basename = match[4];
            file.page.date = new Date(year + "-" + month + "-" + day);
            file.page.url  = '/' + year + '/' + month + '/' + day + '/' + basename;
        }

        this.push(file);
        cb();
    });
}

function summarize(marker) {
    return through.obj(function (file, enc, cb) {
        var summary = file.contents.toString().split(marker)[0]
        file.page.summary = summary;
        this.push(file);
        cb();
    });
}

function applyTemplate(templateFile) {
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

gulp.task('assets', function () {
    return gulp.src('assets/**/*')
        .pipe(gulp.dest('build/'));
});

gulp.task('media', function () {
    return gulp.src('content/media/**/*')
        .pipe(gulp.dest('build/media'));
});

gulp.task('pages', function () {
    return gulp.src('content/pages/*.md')
        .pipe(frontMatter({property: 'page', remove: true}))
        .pipe(marked())
        .pipe(applyTemplate('templates/page.html'))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('build'));
});

gulp.task('posts', function () {
    return gulp.src('content/posts/*.md')
        .pipe(frontMatter({property: 'page', remove: true}))
        .pipe(marked())
        .pipe(summarize('<!--more-->'))
        .pipe(filename2date())
        .pipe(collectPosts())
        .pipe(applyTemplate('templates/post.html'))
        .pipe(rename(function (path) {
            path.extname = ".html";
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
        .pipe(gulp.dest('build'));
});

function dummy(file) {
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

gulp.task('index', ['posts'], function () {
    return dummy('index.html')
        .pipe(applyTemplate('templates/index.html'))
        .pipe(gulp.dest('build/'));
});

function posts(basename, count) {
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

gulp.task('archive', ['posts'], function () {
    return posts('journal', 10)
        .pipe(applyTemplate('templates/journal.html'))
        .pipe(gulp.dest('build/'));
});

function tags() {
  var stream = through.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  stream.end();
  stream.emit("end");

  return stream;
}

gulp.task('default', ['assets', 'pages', 'media', 'posts', 'index', 'archive']);

gulp.task('clean', function() {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('watch', ['default'], function () {
  gulp.watch(['assets/**/*'], ['assets']);
  gulp.watch(['content/media'], ['media'])
  gulp.watch(['templates/page.html','content/pages/*.md'], ['pages']);
  gulp.watch(['templates/post.html', 'templates/index.html', 'templates/journal.html','content/posts/*.md'], ['posts', 'index', 'archive']);

  var server = new StaticServer({
    rootPath: 'build',         
    port: 8080,
  });

  server.start(function () {
    console.log('Server listening to', server.port);
  });
});
