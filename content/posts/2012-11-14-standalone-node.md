---
layout: post
title: "Making Standalone Programs with Node.js"
tags:
    - nodejs
---
I think I already [raved][1] about how cool node.js is and it totally makes
sense to build small utility applications with it. But I had trouble to 
use the "bin" option in my [package.json]. Apparently it was working for
everybody but me. But through some odd insight I found out what it was.

The short story is you need a hashbang:

    #!/bin/env node
    
NPM will then use that in the script it creates to invoke your node script. 
This is crucial on windows machines, since hashbangs are useless there.

The long story is a tale I like to tell you over a [hot beverage][2].

<!--more-->

A while back, in [Ruthless Automation][3], I wrote about the [autobuild][4] script.
What I had created there was a hack optimized for never having
to open the Microsoft Developer Studio 6 again. But I soon realised the potential 
in the tool; never explicitly invoke the compiler again.

I like code that works. If I can and it is little effort I build unit tests and
rejoice that they work and keep working. But even when there are no unit tests
I like code that compiles. I have this [Obsessive–Compulsive Disorder][5] 
of saving my text and building my code in small intervals. For example, 
while writing the last paragraph I hit CTRL+S 7 times. It is so ingrained in
me that I do not actively notice it. In an IDE it is simple to invoke the compiler, 
you just hit F7. But working at home I use Notepad++ and GNU make; 
thus I need to change the focus to the shell and call make (UP -> ENTER). 

So I decided to make autobuild a proper standalone tool. The first step of
refactoring it into a generic tool easy, even adding a user interface, was easy.
But how do you make it a real tool, callable on the command line, like 
[supervisor][6]? 

Sure you can hack a cmd script together, but there seams to be a common way to 
do it with NPM. And yes there is [the bin parameter in your package.json][7].

Unfortunately it did not work for me. Yes NPM created the script autobuild
but it was not usable and distinctly different for the one created for
supervisor. But what was the difference?

I let it be for the time being. I could execute autobuild from my development
folder by invoking node and referring explicitly to the index.js. 

A few days ago I had a hunch, what about the hashbang? I never needed a hashbang,
since it is useless on windows and I did not expect to invoke a .js file directly.
(Oddly enough I thought it OK for .pl file.) So I added the hashbang and voila,
it worked!

    #!/bin/env node

Now when you want autobuild with a GUI, appjs requires that you use the 
--harmony flag. How do you add that flag to the script? If you Google the 
issue you find some resources that show you to use the flags properly that
is enabled since node 0.8.1.

    {
        ...
        "node": "0.8.1",
        "flags": ["--harmony"],
        ...
    }

But that does not solve the issue. It refers to specifying node flags in 
environments like [nodejuzu][8]. 

So I had an other hunch, what if I add it to the hashbang? Unfortunately it 
[appjs broke on me][9] just recently and I did not notice it as such. If you
read an error message once, why would you read it again, right? Too bad it was
not the same one... 

But after I found my mistake the final hashbang I used is as follows

    #!/bin/env node --harmony
    
and it works like a charm.

[1]: /2012/10/01/woohoo-node-js.html
[package.json]: http://package.json.jit.su/
[2]: http://images.lmgtfy.com/?q=hot+beverage
[3]: /2012/09/19/ruthless-automation.html
[4]: https://npmjs.org/package/autobuild
[5]: http://en.wikipedia.org/wiki/Obsessive%E2%80%93compulsive_disorder
[6]: https://npmjs.org/package/supervisor
[7]: https://npmjs.org/doc/json.html#bin
[8]: http://jit.su/
[9]: https://github.com/rioki/autobuild/issues/1
