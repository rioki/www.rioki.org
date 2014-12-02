---
title: What makes this Website Tick
layout: post
tags:
    - meta
    - jekyll
---

This website is generated with [jekyll][1] and hosted on [Amazon S3][2] but how
does this all work together? 

First off there is jekyll, a blog aware static site generator. What jekyll does
is it takes input files written in [HTML][3], [Markdown][4] or [Textile][5] 
and applies a HTML template with [liquid][6]. The result of this is a fully 
static website. 

Since the input to jekyll is mostly text files, it applies itself to put the 
files into source control. In my case I used [git][7]. As backup and for 
posterity I push the changes to a [public repository][8] hosted by [github][9]. 
If a team would maintain the website, this would be the main means how changes
to the website are shared.

<!--more-->

To get the generated website to Amazon S3, you "just" need to upload everything
to your bucket. Since this is error prone, I use jekyll-s3 which does the task
for me. Currently jekyll-s3 will upload everything, but it is in the works to
make it upload only changed files. For obvious security reasons the only thing
I do not put under source control is the configuration for jekyll-s3, 
"_jekyll-s3.yml".

Does this solution scale? First off, S3 itself can take quite a beating before
it starts to slow down. But should I become a Internet celebrity over night
the strategy is clear, I would use [Amazon Cloud Front][10]. Cloud Front works
by distributing your content from a central sever to "edge nodes" 
distributed over the globe and it works especially well with Amazon S3.

If you look at most content on the Internet, it is read only. True social media
site change this a bit, but the primary content is still some form of blog, 
article or product page. The only common dynamic part are comments. Comments can 
be implemented with services such as [disqus][11]. Actually this page had 
disqus comments that I removed because they where seldom used. The way this 
works is that disqus operates a server that receives, stores and produces the 
comments, all your site needs is a bit of Java Script code.

All in all I would say that a jekyll powered site on Amazon S3 can power almost
any site, from small to large, serving mostly static content.

[1]: http://github.com/mojombo/jekyll
[2]: http://aws.amazon.com/s3/
[3]: http://en.wikipedia.org/wiki/HTML
[4]: http://http://daringfireball.net/projects/markdown/
[5]: http://http://en.wikipedia.org/wiki/Textile_%28markup_language%29
[6]: http://liquidmarkup.org/
[7]: http://git-scm.com/
[8]: http://github.com/rioki/www.rioki.org
[9]: http://github.com
[10]: http://aws.amazon.com/cloudfront/
[11]: http://disqus.com/
