---
layout: post
title: "Woohooo! Node.js!"
tags:
    - nodejs
---

This is odd, I have not been **so exited** about learning a new technology,
than [node.js]. I really tried many things, Lisp, Python, Ruby, openAL, 
openGL, Ruby on Rails, aspect oriented programing, Django, Flask, Drupal, HTML5, 
pure C and many more, but all where at best a "hmm, interesting". In most cases
I was looking for a tool for a task and picked up the things that people where 
talking about.

If you forage in the archive of this journal you will see that 
[C++ is my language of choice][1] and there are very few other languages
that I consider usefull. My rationale is that, C++ is a powerfull and strong
laguage and any other language must offer a significant gain in functionality
to warant the penaly of a virtual machine or runtime safty checks. 

**Why is node.js so awsome?!**

<!--more-->

At first node is hard to wrap your head around. It sounds feeble with 
Java Script as the core technology. But since I know that Java Script
is the [most misunderstod language in the world][2] and I seriously worked
on integrating [Spider Monkey] into some of my (failed) game engine projects.

What really is revelutionary is the way that almost everything is handled
asyncronously. The obvious ones, such as waiting on I/O, are handled this way,
but also other aspects, such as a HTTP server handling function. What makes this
revelitionary is the way in which Java Scripts closures make it totally
pain less and readable to implement.

This leads to the wierd fact, that node is single threaded but many locgical 
threads do things. Not only does it results in a very efficient use of CPU time,
but it also makes programing really simple. No need for locking primitives,
you only have one thread. 

What is also interesting is that node solves many scalability issues. If you 
can distribute tasks between multiple instances of node, putting these instances
on multiple serves becomes tivial. 

What is also nice is the large and open [NPM] reporitory and NPM in general. 
This is not such a big deal and I con not tell you why I think NPM is great and 
Python's PIP evokes only "meh". But one of the killer featues is that, by default
NPM installs the dependencies locally, based on your *package.json* file. This 
makes node applications extreamly portable, since no globaly installed 
dependencies are required, save node itsself.

**Try node.js, it is great.** But take this advice with a grain of salt, as always.

[node.js]: http://nodejs.org/
[1]: /2011/02/26/cpp-rocks.html
[2]: http://javascript.crockford.com/popular.html
[Spider Monkey]: http://developer.mozilla.org/en-US/docs/SpiderMonkey
[NPM]: htt://npmjs.org
