---
published: false
title: Overhaul of Page Generation
tags: 
  - meta
  - web
---

When migrating from [jekyl to gulp.js][1] I was basically following jekyls lead, purely to ease the migration pains.

Some point later [Daniel Naab][2] adapted my aproach. Although he build ontop of my ideas, [he played the ball out of the park][3]. What really stuck me as ingenious is the integration of [prose.io][4]. The combination of [travis-ci][5] and prose.io, means that novice users can author the website without knowing what git and a text editor is. The result is something close to a high end CMS with static generated HTML pages.

So I took some inspiration back from Daniel Naab. So here is a rundown from my enhanced glup.js powered website, this thime with wercker and prose.io support.

The basic layout of the website is as follows:

    + assets
      favicon.ico
      + css
      + js
      + fonts
    + content
      + media
      + pages
      + posts
    + templates
    wercker.yml
    _prose.yml
    package.json
    site.json
    gulp.js

The assets folder contains the bits that make up the website's design. These are copied verbatim to the output. The content folder contains the actual raw content, this is the folder where day to day editing is done. The content is seperated into three types, the media folder contains unstructured fils, such as pictures, the page folder contains pages, that is timeless content and the posts folder conttains journal entries.
The template folder contains the templates used to render the pages and posts. Finally the root folder contains all the configuration for the different services, such as the wercker.yml. 

The gulpfile still works mostly like the original as described in my [jekyl to gulp.js][1] post, just the paths are cleaned up. You can see the entiere file in my [github repository][7].

The interseting bit that changes is that now the journal backlog paginates: 

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

Also the special pages index.html and atom.xml are generated through a template:

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
    
    gulp.task('rss', ['posts'], function () {
      return dummy('atom.xml')
        .pipe(applyTemplate('templates/atom.xml'))
        .pipe(gulp.dest('build/'));
    });

The site build and deployment is handled through wercker. The configuration for this process is:

    box: wercker/nodejs@1.0.2
    build:
      steps:
        - wercker/npm-install@0.9.3
        - yeehaa/gulp@0.0.4
    deploy:
      steps:
        - s3sync:
            key_id: $KEY
            key_secret: $SECRET
            bucket_url: $URL
            source_dir: build

This does basically what you think it does. It runns `npm install` followed by a `gulp` call. The built site is then auto deployed to a AWS S3 bucket using s3sync. 

The prose.io configuration is also quite simple:

    prose:
      rooturl: 'content'
      siteurl: 'http://www.rioki.org'
      media: 'content/media'
      metadata:
        content/posts:      
          - name: "title"
            field:
              element: "text"
              label: "Title
              help: "The blog post title"
              placeholder: "Enter title"
          - name: "tags"
            field:
              element: "multiselect"
              label: "Tags"
              placeholder: "Choose Tags"
              alterable: True
              options:
                - name: "Meta"
                  value: "meta"
                - name: "C++"
                  value: "cpp"
                - name: "openGL"
                  value: "opengl"
                - name: "Web"
                  value: "web"

The only thing I need to do is populate the tags with more values to choose from. But the alterable flag means I can add some in a pinch.

BTW this post was written with prose.io, let's hope it works well.

[1]: /2014/06/09/jekyll-to-gulp.html
[2]: http://blog.crushingpennies.com/
[3]: http://blog.crushingpennies.com/a-static-site-generator-with-gulp-proseio-and-travis-ci.html
[4]: http://prose.io/
[5]: http://travis-ci.org/
[6]: http://wercker.com/
[7]: https://github.com/rioki/www.rioki.org/blob/master/gulpfile.js