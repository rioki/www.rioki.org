---
layout: post
title: "Ruthless Automation"
tags:
    - nodejs
---
I have a special problem. The software I am working on at Siemens uses 
Visual Studio 6. You would think that Visual Studio 6 would have been fazed
out a long time ago. Unfortunately the software was half mothballed ten years ago,
but now some major features are to be added to the software. Unfortunately 
nobody has the <del>balls</del> time to upgrade the project.

The Visual Studio 6 compiler (MSC 6) is a one thing you can get accustomed to. It
is not fully standard compliant (C++98), but the you get to learn the quirks. 
But if you ever tried to get anything done in the Visual Studio 6 IDE, you
would want to hang yourself. To put that in context, I use [Notepad++] and 
[GNU Make] for my hobby projects.

**How to use Visual Studio 6, without actually using Visual Studio 6?**

<!--more-->

Some claim to have some success to [use MSC 6 with Visual Studio 2008][1]. 
Unfortunately, the other Visual Studio I have installed is 2010 and it does not 
work there. I will not install yet an other version of Visual Studio, just to 
get that hack working. So I started working with both Visual Studio 6 and 
Visual Studio 2010 open side by side. The charm of it is that you can debug 
and write code flawlessly in Visual Studio 2010, all I need to do is hit
the compile button in Visual Studio 6. 

Since I am working on an add on to [Step 7], I need to copy the build results
into the executable directory. At first I built a simple copy script using 
[robocopy]. Unfortunately, not everything in the build target directory, 
is supposed to be copied into the executable directory. As an added impediment 
the script takes sort of long to copy many unchanged files.

So I decided to smarten up my script. I have been trying out [node.js] lately 
and the best thing node.js can to is sit around and do nothing without wasting 
CPU cycles. So I changed my CMD script to a node.js script that keeps two
folder in sync.

The [autosync.js] script is quite simple. Read both the source and target 
directory, find all matching files and watch for changes in the source directory.
If a file changes, copy it to the destination directory. The only assumption 
the script makes, is that the destination directory is fully primed; all files,
including PDBs where copied by hand or the setup first.

This approach reduced the extra copy step and was blazing fast, since only the 
changed files where ever copied. But I still need to press build in 
Visual Studio 6. It would be nice if I could get rid of that ugly program all
along. The good news is you can use the *msdev* executable to build from the 
command line without ever seeing a window. 

The [autobuild.js] script takes it a step further. It tracks changes in a number
of source directories and if a change happened it initiates a build. If that
build was successful, the build results are copied to the target directory. 

Now, that is what I call continuous deployment. The upside of this script is
that always the latest changes are in the executable directory. No more 
"Ups! I forgot to copy the latest DLL!". Now every time I hit the 
debugger my build and sources are in sync.

By the way, if you want to use the script feel free to do so; I claim not 
copyright on those scripts.

[Notepad++]: http://notepad-plus-plus.org/
[GNU Make]: http://www.gnu.org/software/make/
[1]: http://resnikb.wordpress.com/2009/10/28/using-visual-studio-2008-with-visual-c-6-0-compiler/
[node.js]: http://nodejs.org/
[Step 7]: http://www.automation.siemens.com/mcms/simatic-controller-software/en/step7/pages/default.aspx
[robocopy]: http://en.wikipedia.org/wiki/Robocopy
[autosync.js]: https://gist.github.com/3713041
[autobuild.js]: https://gist.github.com/3741948
