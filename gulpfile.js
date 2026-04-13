const path = require('path')
const { Readable } = require('stream')
const { series, parallel, src, dest, watch } = require('gulp')
const { deleteAsync } = require('del')
const rename = require('gulp-rename')
const matter = require('gray-matter')
const { marked } = require('marked')
const Vinyl = require('vinyl')
const through2 = require('through2')
const twig = require('twig')
const liveServer = require('live-server')

twig.cache = false

const site = require('./site.json')

const PATHS = {
  build: 'build',
  assets: 'assets/**/*',
  media: 'content/media/**/*',
  pages: 'content/pages/*.md',
  posts: 'content/posts/*.md',
  templates: 'templates/*.html'
}

const rePostName = /(\d{4})-(\d{1,2})-(\d{1,2})-(.*)/

function initializeSiteTask(cb) {
  site.time = new Date()
  site.posts = []
  cb()
}

function applyTemplate(templateFile) {
  const tplFile = path.join(__dirname, templateFile)
  return through2.obj(function (file, enc, cb) {
    const data = {
      site,
      page: file.page,
      content: file.contents.toString()
    }
    twig.renderFile(tplFile, data, function (err, html) {
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
    file.page.summary = summary
    cb(null, file)
  })
}

function parseFrontMatter() {
  return through2.obj(function (file, enc, cb) {
    const parsed = matter(file.contents.toString())
    file.page = {
      ...(file.page || {}),
      ...parsed.data
    }
    file.contents = Buffer.from(parsed.content, 'utf8')
    cb(null, file)
  })
}

function renderMarkdown() {
  return through2.obj(function (file, enc, cb) {
    file.contents = Buffer.from(marked.parse(file.contents.toString()), 'utf8')
    cb(null, file)
  })
}

function fixTitle() {
  const reTitle = /\s*#([ -~]+)/

  return through2.obj(function (file, enc, cb) {
    if (file.page.title) {
      return cb(null, file)
    }

    const contents = file.contents.toString()
    const match = contents.match(reTitle)
    if (!match) {
      return cb(null, file)
    }

    const title = match[1].trim()
    file.page.title = title
    file.contents = Buffer.from(contents.replace(reTitle, ''), 'utf-8')

    return cb(null, file)
  })
}

function filename2date() {
  return through2.obj(function (file, enc, cb) {
    const basename = path.basename(file.path, '.md')
    const match = rePostName.exec(basename)

    if (match) {
      const year = match[1]
      const month = match[2]
      const day = match[3]
      const postBasename = match[4]

      file.page.date = new Date(`${year}-${month}-${day}`)
      file.page.url = `/${year}/${month}/${day}/${postBasename}.html`
    }

    cb(null, file)
  })
}

function collectPosts() {
  const posts = []

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

function filesToStream(files) {
  return Readable.from(files, { objectMode: true })
}

function dummy(filePath, title) {
  const file = new Vinyl({
    path: filePath,
    contents: Buffer.from('', 'utf8')
  })

  file.page = { title }

  return filesToStream([file])
}

function posts(basename, count) {
  const files = []

  if (site.posts) {
    let c = 0
    let page = 0
    let pagePosts = []

    site.posts.forEach(function (post) {
      pagePosts.push(post)
      c++

      if (c === count) {
        const file = new Vinyl({
          path: basename + (page === 0 ? '' : page) + '.html',
          contents: Buffer.from('', 'utf-8')
        })

        file.page = {
          title: 'Journal',
          posts: pagePosts,
          prevPage: page !== 0 ? basename + (page - 1 === 0 ? '' : page - 1) + '.html' : null,
          nextPage: (page + 1) * count < site.posts.length ? basename + (page + 1) + '.html' : null
        }

        files.push(file)
        c = 0
        pagePosts = []
        page++
      }
    })

    if (pagePosts.length !== 0) {
      const file = new Vinyl({
        path: basename + (page === 0 ? '' : page) + '.html',
        contents: Buffer.from('', 'utf-8')
      })

      file.page = {
        title: 'Journal',
        posts: pagePosts,
        prevPage: page !== 0 ? basename + (page - 1 === 0 ? '' : page - 1) + '.html' : null,
        nextPage: null
      }

      files.push(file)
    }
  }

  return filesToStream(files)
}

function cleanTask() {
  return deleteAsync([`${PATHS.build}/**`, `!${PATHS.build}`])
}

function assetsTask() {
  return src(PATHS.assets).pipe(dest(PATHS.build))
}

function mediaTask() {
  return src(PATHS.media).pipe(dest(`${PATHS.build}/media`))
}

function pagesTask() {
  return src(PATHS.pages)
    .pipe(parseFrontMatter())
    .pipe(renderMarkdown())
    .pipe(applyTemplate('templates/page.html'))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(PATHS.build))
}

function postsTask() {
  return src(PATHS.posts)
    .pipe(parseFrontMatter())
    .pipe(fixTitle())
    .pipe(renderMarkdown())
    .pipe(summarize('<!--more-->'))
    .pipe(filename2date())
    .pipe(collectPosts())
    .pipe(applyTemplate('templates/post.html'))
    .pipe(
      rename(function (filePath) {
        filePath.extname = '.html'
        const match = rePostName.exec(filePath.basename)

        if (match) {
          const year = match[1]
          const month = match[2]
          const day = match[3]

          filePath.dirname = `${year}/${month}/${day}`
          filePath.basename = match[4]
        }
      })
    )
    .pipe(dest(PATHS.build))
}

function archiveTask() {
  return posts('journal', 10).pipe(applyTemplate('templates/journal.html')).pipe(dest(PATHS.build))
}

function indexTask() {
  return dummy('index.html', 'Index').pipe(applyTemplate('templates/index.html')).pipe(dest(PATHS.build))
}

const buildAll = series(
  initializeSiteTask,
  parallel(assetsTask, mediaTask, pagesTask, postsTask),
  parallel(archiveTask, indexTask)
)

function watchTask() {
  watch(PATHS.assets, assetsTask)
  watch(PATHS.media, mediaTask)
  watch(PATHS.pages, pagesTask)
  watch(PATHS.posts, series(postsTask, parallel(archiveTask, indexTask)))
  watch(PATHS.templates, series(parallel(pagesTask, postsTask), parallel(archiveTask, indexTask)))
}

function serverTask() {
  liveServer.start({
    root: PATHS.build,
    wait: 500
  })
}

exports.clean = cleanTask
exports.build = buildAll
exports.default = buildAll
exports.watch = series(buildAll, watchTask)
exports.server = series(buildAll, parallel(watchTask, serverTask))
