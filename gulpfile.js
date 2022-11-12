const path                          = require('path')
const {series, parallel, src, dest, watch} = require('gulp')
const clean                         = require('gulp-clean')
const rename                        = require('gulp-rename')
const marked                        = require('gulp-marked')
var   Vinyl                         = require('vinyl');
const frontMatter                   = require('gulp-front-matter')
const through2                      = require('through2')
const twig                          = require('twig')
const liveServer                    = require("live-server");

twig.cache = false;

var site  = require('./site.json');
site.time = new Date();

function applyTemplate(templateFile) {
  const tplFile = path.join(__dirname, templateFile)
  return through2.obj(function (file, enc, cb) {
      var data = {
          site: site,
          page: file.page,
          content: file.contents.toString()
      };
      twig.renderFile(tplFile, data, function(err, html) {
        if (err === null) {
          file.contents = Buffer.from(html, 'utf8')
        }
        cb(err, file)
      })
  })
}

function summarize(marker) {
  return through2.obj(function (file, enc, cb) {
    const summary = file.contents.toString().split(marker)[0]
      file.page.summary = summary;
      cb(null, file);
  });
}

function fixTitle() {
  const reTitle = /\s*#([\w\ \t]+)/;

  return through2.obj(function (file, enc, cb) {
    if (file.page.title) {
      return cb(null, file);
    }

    const contents = file.contents.toString();
    const match = contents.match(reTitle);
    if (!match) {
      return cb(null, file);
    }

    const title = match[1].trim();
    file.page.title = title;
    file.contents = Buffer.from(contents.replace(reTitle, ""), "utf-8");

    return cb(null, file);
  });
}

const rePostName   = /(\d{4})-(\d{1,2})-(\d{1,2})-(.*)/;

function filename2date() {
  return through2.obj(function (file, enc, cb) {
    const basename = path.basename(file.path, '.md');
    const match = rePostName.exec(basename);
    if (match)
    {
      const year     = match[1];
      const month    = match[2];
      const day      = match[3];
      const basename = match[4];
      file.page.date = new Date(year + "-" + month + "-" + day);
      file.page.url  = '/' + year + '/' + month + '/' + day + '/' + basename;
    }
    cb(null, file);
  });
}

function collectPosts() {
  var posts = [];
  return through2.obj(function (file, enc, cb) {
      posts.push(file.page);
      posts[posts.length - 1].content = file.contents.toString();
      cb(null, file);
  },
  function (cb) {
      posts.sort(function (a, b) {
          return b.date - a.date;
      });
      site.posts = posts;
      cb();
  });
}

function dummy(file, title) {
  var stream = through2.obj(function(file, enc, cb) {
		cb(null, file);
	})

  if (site)
  {
    var file = new Vinyl({
      path: file,
      contents: Buffer.from('', 'utf8')
    })
    file.page = {title: title}
    stream.write(file);
  }

  stream.end()
  stream.emit("end")

  return stream
}

function posts(basename, count) {
  const stream = through2.obj(function(file, enc, cb) {
		this.push(file);
		cb();
	});

  if (site.posts)
  {
    let c     = 0;
    let page  = 0;
    let posts = [];
    site.posts.forEach(function (post) {
      posts.push(post);
      c++;
      if (c == count) {
        const file = new Vinyl({
          path: basename + (page == 0 ? '' : page) + '.html',
          contents: Buffer.from('', 'utf-8')
        });
        file.page = {
          title: 'Journal',
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
      const file = new Vinyl({
        path: basename + (page == 0 ? '' : page) + '.html',
        contents: Buffer.from('', 'utf-8')
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

function cleanTask() {
  return src('build', {read: false, allowEmpty: true})
    .pipe(gulpClean())
}

function assetsTask() {
  return src('assets/**/*')
    .pipe(dest('build/'))
}

function mediaTask() {
  return src('content/media/**/*')
    .pipe(dest('build/media'))
}

function pagesTask() {
  return src('content/pages/*.md')
      .pipe(frontMatter({property: 'page', remove: true}))
      .pipe(marked())
      .pipe(applyTemplate('templates/page.html'))
      .pipe(rename({extname: '.html'}))
      .pipe(dest('build'))
}

function postsTask() {
  return src('content/posts/*.md')
      .pipe(frontMatter({property: 'page', remove: true}))
      .pipe(fixTitle())
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
      .pipe(dest('build'))
}

function archiveTask() {
  return posts('journal', 10)
    .pipe(applyTemplate('templates/journal.html'))
    .pipe(dest('build/'))
}

function indexTask() {
  return dummy('index.html', 'Index')
    .pipe(applyTemplate('templates/index.html'))
    .pipe(dest('build/'))
}

const buildAll = series(parallel(assetsTask, mediaTask, pagesTask, postsTask), parallel(archiveTask, indexTask))

function watchTask() {
  watch('assets/**/*',        assetsTask);
  watch('content/media/**/*', mediaTask);
  watch('content/pages/*.md', pagesTask);
  watch('content/posts/*.md', series(postsTask, parallel(archiveTask, indexTask)));
  watch('templates/*.html',   series(parallel(pagesTask, postsTask), parallel(archiveTask, indexTask)));
}

function server() {
  liveServer.start({
    root: "build",
    wait: 500
  });
}

exports.clean   = cleanTask
exports.default = buildAll
exports.watch   = series(buildAll, watchTask)
exports.server  = series(buildAll, parallel(watchTask, server))
