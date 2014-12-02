---
title: Fiddler vs. ISA-Server
layout: post
tags:
    - network
    - fiddler
---

I recently looked into [Ruby on Rails][1] to see what the hype is or rather
was about. I even found a [niffty introduction][2] to the subject and found along
the way the nifty little language ruby. I probably will [not use it for any 
serious projects][3], but it is nice to know I have a new tool in my tool belt.

I wanted to show a coworker my new found knowlage about this niffty language,
but when trying to use gem I was locked out. I was quite aquinted with installing
gems directly by downloading them and invoking gem locally, because of my previous
[jekyll experiance][4], but there should be a better way.

<!--more-->

At work we are a almost pure Microsoft shop and thus use a ISA-Server as proxy. 
The ISA-Server has the unique feature that you authenticate with your system user 
account. Although this single logon feature is quite usefull, it is like so many 
things from Microsoft a non standard implementation. In theory the server 
supports other standard authentication mechanisms, but these are disabled in this
instalation.

I looked online and found people using [fiddler][5] to go through the ISA server.
Fiddler is actually a HTTP debugging tool and works as a open proxy, but it
implements the authentication required for the ISA server. And what do you know;
it worked like a charm. Just fire up fiddler, use the proxy on your machine and
now you get through the ISA server. The great thing is that now I know a way to
get other tools to work, like git (for HTTP hosted repositories). 

[1]: http://rubyonrails.org/
[2]: http://railsforzombies.org/ 
[3]: /2011/02/26/cpp-rocks.html
[4]: /2011/04/04/make-mine-jekyll.html
[5]: http://www.fiddler2.com/fiddler2/
