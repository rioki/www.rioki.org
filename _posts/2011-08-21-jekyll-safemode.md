---
layout: post
title: "Working Around Jekyll's Safe Mode"
tags:
    - jekyll
    - github
---

[github][gh] has this nifty service [github pages][ghp] and under the hood
they use [jekyll][j]. The concept is quite simple, you maintain a jekyll site
lives in a special reopsitory and they transform it to plain HTML using jekyll.

The biggest problem I have with jekyll is that it is quite limited. To combat 
this jekyll has a plugin system, where you add extensions and modifications 
under the \_plugin folder in your jekyll site. A feature that I kind of "need"
to operatre [this site][r].

The problem with github pages is that they operate jekyll with the "safe mode".
This disables the plugin feature and renders github pages unsuable for me.

Since I am a cheap sod, I still want to use the service. The trick is that you
don't need to have a jekyll site and can just put plain HTML pages in the service.
The simple solution, tha master branch only contains the processed HTML files and
the actual jekyll site is stored under the branch raw. You can see my 
[current stup][rep].

[gh]: http://github.com
[ghp]: http://pages.github.com
[j]: http://github.com/mojombo/jekyll/
[r]: http://www.rioki.org
[rep]: http://github.com/rioki/libxmlmm
