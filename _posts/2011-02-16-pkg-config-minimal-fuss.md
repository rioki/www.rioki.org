---
layout: post
title: "pkg-config for MSys with Minimal Fuss"
tags:
    - building
---

[pkg-config][1] is a
really neat tool that makes life so easy on GNU/Linux systems. If you 
ever needed to write a configure script, now there is a (almost 
standard) way to check for dependencies. Oh the joy! Until you move to 
<a href="http://www.mingw.org/">MinGW</a> and MSys on Windows. You will 
find out that there is no binary from the guys at MinGW. You will also 
find out that to build pkg-config, you need glib, which needs pkg-config 
to configure some dependencies. There are mailing lists full of epic 
tales of people trying to build pkg-config from source. You just want to 
use pkg-config. It is bad enough that you need to build you software, 
you should not need to build other peoples software! The good news, 
getting pkg-config with minimal fuss is possible. Let me show you how. 

What is really nice, the people at <a href="http://www.gtk.org">Gtk+</a> 
have all the libraries precompiled in seperate zip archives. Head over 
to http://www.gtk.org/download-windows.html. You will need the glib <a 
href="http://ftp.gnome.org/pub/gnome/binaries/win32/glib/2.26/glib_2.26. 
1-1_win32.zip">run-time</a>, the gettext-runtime <a 
href="http://ftp.gnome.org/pub/gnome/binaries/win32/dependencies/gettext 
-runtime_0.18.1.1-2_win32.zip">run-time</a> and obviously pkg-config <a 
href="http://ftp.gnome.org/pub/gnome/binaries/win32/dependencies/pkg-con 
fig_0.25-1_win32.zip">tool</a> and <a 
href="http://ftp.gnome.org/pub/gnome/binaries/win32/dependencies/pkg-con 
fig-dev_0.25-1_win32.zip">dev</a>. No less no more. Unzip each folder to 
your root of your MSys installation. 

That's it. 

[1]: http://pkg-config.freedesktop.org/wiki/
