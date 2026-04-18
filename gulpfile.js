let path            = require("path");
    
let gulp            = require("gulp");
let gulpClean       = require("gulp-clean");
let gulpRename      = require("gulp-rename");
let gulpFrontMatter = require("gulp-front-matter");
let gulpMarked      = require("gulp-marked");
let gulpPostcss     = require("gulp-postcss");

let stream          = require("stream"); 
let Vinyl           = require("vinyl");
let through2        = require("through2");
let twig            = require("twig");
let liveServer      = require("live-server");
let tailwindcss     = require("@tailwindcss/postcss");

twig.cache(false);

let site = require("./site.json")

let rePostName = /(\d{4})-(\d{1,2})-(\d{1,2})-(.*)/

function initializeSiteTask(cb) {
  site.time = new Date()
  site.posts = []
  cb()
}

function applyTemplate(templateFile) {
  let tplFile = path.join(__dirname, templateFile)
  return through2.obj(function (file, enc, cb) {
    let data = {
      site,
      page: file.page,
      content: file.contents.toString()
    }
    twig.renderFile(tplFile, data, function (err, html) {
      if (err === null) {
        file.contents = Buffer.from(html, "utf8")
      }
      cb(err, file)
    })
  })
}

function summarize(marker) {
  return through2.obj(function (file, enc, cb) {
    let summary = file.contents.toString().split(marker)[0]
    file.page.summary = summary
    cb(null, file)
  })
}

function fixTitle() {
  let reTitle = /\s*#([ -~]+)/

  return through2.obj(function (file, enc, cb) {
    if (file.page.title) {
      return cb(null, file)
    }

    let contents = file.contents.toString()
    let match = contents.match(reTitle)
    if (!match) {
      return cb(null, file)
    }

    let title = match[1].trim()
    file.page.title = title
    file.contents = Buffer.from(contents.replace(reTitle, ""), "utf-8")

    return cb(null, file)
  })
}

function filename2date() {
  return through2.obj(function (file, enc, cb) {
    let basename = path.basename(file.path, ".md")
    let match = rePostName.exec(basename)

    if (match) {
      let year = match[1]
      let month = match[2]
      let day = match[3]
      let postBasename = match[4]

      file.page.date = new Date(`${year}-${month}-${day}`)
      file.page.url = `/${year}/${month}/${day}/${postBasename}`
    }

    cb(null, file)
  })
}

function makeDatePath(filePath) {
  filePath.extname = ".html"
  let match = rePostName.exec(filePath.basename)

  if (match) {
    let year = match[1]
    let month = match[2]
    let day = match[3]

    filePath.dirname = `${year}/${month}/${day}`
    filePath.basename = match[4]
  }
}

function collectPosts() {
  let posts = []

  return through2.obj(
    function (file, enc, cb) {
      posts.push(file.page)
      posts[posts.length - 1].content = file.contents.toString()
      cb(null, file)
    },
    function (cb) {
      posts.sort(function (a, b) {
        return b.date - a.date
      })
      site.posts = posts
      cb()
    }
  )
}

function dummy(filePath, title) {
  let file = new Vinyl({
    path: filePath,
    contents: Buffer.from("", "utf8")
  })

  file.page = { title }

  return stream.Readable.from([file], { objectMode: true });
}

function posts(basename, count) {
  let files = []

  if (site.posts) {
    let c = 0
    let page = 0
    let pagePosts = []

    site.posts.forEach(function (post) {
      pagePosts.push(post)
      c++

      if (c === count) {
        let file = new Vinyl({
          path: basename + (page === 0 ? "" : page) + ".html",
          contents: Buffer.from("", "utf-8")
        })

        file.page = {
          title: "Journal",
          posts: pagePosts,
          prevPage: page !== 0 ? basename + (page - 1 === 0 ? "" : page - 1) + ".html" : null,
          nextPage: (page + 1) * count < site.posts.length ? basename + (page + 1) + ".html" : null
        }

        files.push(file)
        c = 0
        pagePosts = []
        page++
      }
    })

    if (pagePosts.length !== 0) {
      let file = new Vinyl({
        path: basename + (page === 0 ? "" : page) + ".html",
        contents: Buffer.from("", "utf-8")
      })

      file.page = {
        title: "Journal",
        posts: pagePosts,
        prevPage: page !== 0 ? basename + (page - 1 === 0 ? "" : page - 1) + ".html" : null,
        nextPage: null
      }

      files.push(file)
    }
  }

  return stream.Readable.from(files, { objectMode: true });
}

function cleanTask() {
  return gulp.src("build", {read: false, allowEmpty: true})
    .pipe(gulpClean());
}

function assetsTask() {
  return gulp.src("assets/**/*", { encoding: false })
    .pipe(gulp.dest("build"));
}

function mediaTask() {
  return gulp.src("content/media/**/*", { encoding: false })
    .pipe(gulp.dest("build/media"));
}

function cssTask() {
  return gulp.src("templates/*.css")
    .pipe(gulpPostcss([tailwindcss()]))
    .pipe(gulp.dest("build/css"));
}

function pagesTask() {
  return gulp.src("content/pages/*.md")
    .pipe(gulpFrontMatter({ property: "page", remove: true }))
    .pipe(gulpMarked())
    .pipe(applyTemplate("templates/page.html"))
    .pipe(gulpRename({ extname: ".html" }))
    .pipe(gulp.dest("build"))
}

function postsTask() {
  return gulp.src("content/posts/*.md")
    .pipe(gulpFrontMatter({ property: "page", remove: true }))
    .pipe(fixTitle())
    .pipe(gulpMarked())
    .pipe(summarize("<!--more-->"))
    .pipe(filename2date())
    .pipe(collectPosts())
    .pipe(applyTemplate("templates/post.html"))
    .pipe(gulpRename(makeDatePath))
    .pipe(gulp.dest("build"))
}

function archiveTask() {
  return posts("journal", 10)
    .pipe(applyTemplate("templates/journal.html"))
    .pipe(gulp.dest("build"))
}

function indexTask() {
  return dummy("index.html", "Index")
    .pipe(applyTemplate("templates/index.html"))
    .pipe(gulp.dest("build"))
}

function resetStateTask(cb) {
  delete require.cache[require.resolve("./site.json")];
  site = require("./site.json");
  site.time = new Date();
  site.posts = [];
  twig.extend(function (Twig) {
    Twig.Templates.registry = {};
  });
  cb();
}

let buildAll = gulp.series(
  initializeSiteTask,
  resetStateTask,
  gulp.parallel(assetsTask, mediaTask, pagesTask, postsTask, cssTask),
  gulp.parallel(archiveTask, indexTask)
)

function watchTask() {
  gulp.watch("assets/**/*", assetsTask)
  gulp.watch("content/media/**/*", mediaTask)
  gulp.watch("content/pages/*.md", pagesTask)
  gulp.watch("content/posts/*.md", gulp.series(postsTask, gulp.parallel(archiveTask, indexTask)))
  gulp.watch("templates/*.html", gulp.series(gulp.parallel(pagesTask, postsTask, cssTask), gulp.parallel(archiveTask, indexTask)))
  gulp.watch("templates/*.css", cssTask)
}

function serverTask() {
  liveServer.start({
    root: "build",
    wait: 500
  })
}

exports.clean = cleanTask
exports.build = buildAll
exports.server = gulp.series(buildAll, gulp.parallel(watchTask, serverTask))
