---
title: From Jekyll to Gulp.js
tags: 
  - gulp
  - meta
  - jekyll
published: true
---

*Note: I overhauled the generation process to be simple and more streamlined. This post is not wrong, it is just sligtly inefficent. In addition to this post you may want to read [Overhaul of Page Generation](/2014/12/02/overhaul-of-page-generation.html)*

For quite a long time this site was powered by the static site generator 
[jekyll]. I came into contact with Jekyll through the [github pages], that
employ Jekyll and immediately fell in love with the idea of generating 
static HTML pages. I have always found it superfluous to operate a simple 
and mostly static blog using a fat web stack. 

Although Jekyll does it's work quite nice it was not the optimal solution 
for me and when I stumbled over [gulp.js], I know i had found a fitting 
replacement. After some starting difficulties I migrated this page to using
gulp.js.

<!--more-->

First off, Jekyll and gulp.js are two completely different tools. Jekyll is 
written in Ruby and is a static site generator. Gulp.js is written in JavaScript
for Node.js and is a build tool. This means that migrating from Jekyll to 
gulp.js means writing a build script that emulates Jekyll's behavior.

For the sake of simplicity I decided not to emulate Jekyll's behavior to a 100%,
as a result a few things changed. The most prominent change is that the pages 
are all put into the pages folder. The second visible change is that I got rid 
of the folders with an underscore. The third big change is that I use [swig] 
for template and the "layout" directive is meaningless. 

Now onto gulp. A `gulpfile.js` is just a Node.js script using gulp. The gulp 
module basically has only four function. The `task` function defines a task to
be done, the `src` function creates an object stream of files to process, 
the `dest` function writes all the files to that location and the `watch` 
function that waits for changes and triggers tasks.

As an [example][ex1], let us take the task that copies the files to the output folder:

    gulp.task('files', function () {
        return gulp.src('files/**/*')        
            .pipe(gulp.dest('build/files'));
    }); 

It is quite obvious what it does, it scans the folder `files` and picks up all
two files there and makes an object stream out of it and then the `dest` 
directive will write them to the destination folder `build/files`. The gulpfile
contains a few rules like that, rules that just copy files.

But you don't need gulp if you just copy files. The task for the pages formated
in markdown is more indicative of the genius within gulp.

    gulp.task('pages:md', function () {
        return gulp.src('pages/*.md')
            .pipe(frontMatter({property: 'page', remove: true}))
            .pipe(marked())
            .pipe(applyTemplate('design/page.html'))
            .pipe(rename({extname: '.html'}))
            .pipe(gulp.dest('build'));
    });

This task takes all markdown formated pages, reads and removes the YAML font 
matter, converts the markdown to HTML, applies the template 'pages.html' and 
renames the files to have the extension 'html' and writes them out to the 
output folder.

All these steps are provided through node.js modules, the result is awesomely 
little code for a relatively complex operation. The only one out, is the 
`applyTemplate`, it was written by me, since there where no appropriate modules
for integrating swig.

But then again the `applyTemplate` function is not that complex either:

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

This function emulates the way Jekyll would apply templates to the pages. 
Adding support for the 'layout' parameter would be trivial, but I did not
need it so I did not implement it.

Building the posts is mildly more complicated.

    gulp.task('posts', function () {
        return gulp.src('posts/*.md')
            .pipe(frontMatter({property: 'page', remove: true}))        
            .pipe(marked())
            .pipe(summarize('<!--more-->'))
            .pipe(filename2date())
            .pipe(collectPosts())
            .pipe(applyTemplate('design/post.html'))
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

This task extracts the YAML frontMatter, converts the markdown to HTML, 
[extracts a summary][ex2], [converts the filename to a date][ex3], 
[collects all posts][ex4] and adds them to the site (see later), 
applies the `post.html` template renames the files so that they are sorted 
into folders by date and then writes them to the output directory.

The reason why the posts are all collected, is for the HTML pages. The
HTML pages are somewhat special, since they read the posts. My current solution
mimics Jekyll's behavior, in that the posts are all collected and provided
as an array on the `site` object. But this is somewhat inefficient and maybe
I need to rethink this approach. 

So here is the task to create the HTML pages:

    gulp.task('pages:html', ['posts'], function () {
        return gulp.src(['pages/*.html'])
            // use gulp-swig?
            .pipe(through.obj(function (file, enc, cb) {            
                var data = {
                    site: site,
                    page: {} // empty object that can be extended as needed
                };
                var tpl = swig.compileFile(file.path);
                file.contents = new Buffer(tpl(data), 'utf8');
                this.push(file);
                cb();
            }))        
            .pipe(gulp.dest('build'));
    });

This task introduces the next element of gulp and these are dependencies. Since
building the HTML pages can only be done once the posts are built and have 
populated the `site.posts` array. 

You can also have tasks that only have dependencies, such as the the `page` task:

    gulp.task('pages', ['pages:md', 'pages:html']);

Like all build systems, gulp has a task that will be used when no task was 
specified on the commandine, the `default` task:

    gulp.task('default', ['posts', 'pages', 'images', 'files', 'tags', 'design', 'rss']);

This basically makes up the tasks required to convert the entire site from
a few markdown files to a full website. 

But while you are working on the site, you probably want to view the changes 
before they go live. For this I used a simple connect HTML server and the a
watch task.

    gulp.task('watch', ['default'], function () {
        gulp.watch(['posts/*.md', 'design/*.html'], ['posts', 'pages', 'rss', 'tags']);
        gulp.watch(['pages/**/*', 'design/*.html'], ['pages']);
        gulp.watch(['images/**/*'], ['images']);
        gulp.watch(['files/**/*'], ['files']);
        gulp.watch(['design/**/*'], ['design']);
        
        var app = connect()
            .use(connect.static('build'))
            .use(connect.directory('build'));
        
        http.createServer(app).listen(3000);
    });

The watch rules are a bit to aggressive and in many cases rebuild way to much,
but the aim here is not to restart gulp, just because you updated a template.

[jekyll]: http://jekyllrb.com/
[github pages]: http://pages.github.com/
[gulp.js]: http://gulpjs.com/
[swig]: https://paularmstrong.github.io/swig/
[ex1]: https://github.com/rioki/www.rioki.org/blob/2a88c14eb805e7b5ff3881a10abd1d3edcf49da4/gulpfile.js#L153
[ex2]: https://github.com/rioki/www.rioki.org/blob/2a88c14eb805e7b5ff3881a10abd1d3edcf49da4/gulpfile.js#L72
[ex3]: https://github.com/rioki/www.rioki.org/blob/2a88c14eb805e7b5ff3881a10abd1d3edcf49da4/gulpfile.js#L53
[ex4]: https://github.com/rioki/www.rioki.org/blob/2a88c14eb805e7b5ff3881a10abd1d3edcf49da4/gulpfile.js#L25