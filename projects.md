---
layout: default
title: Projects
---

## libxmlmm

While developing applications with [gtkmm] I was introduced to the [libxml++], 
which is a fine wrapper of the XML library [libxml2]. I was so fond of the library
that I wanted to use it with other projects; especially ones that build on top
of SDL and openGL. Unfortunately libxml++ uses Glib::ustring to handle the 
UTF-8 strings with libxml2. Although the basic premise is reasonable, ensure that
any string operations work with UTF-8, the resulting link and deployment dependencies
do not. On top of the regular dependency to libxml2 and iconv, you also depend
on glibmm, which in turn depends on glib, gobject and a few minor libraries 
commonly found on Linux systems.

If you need the libraries all is nice and fine, but if you need half a dozen
libraries, just for passing around UTF-8 strings, it is overkill. Especially,
as it turns out, most if not all operations I needed was storing and passing
the string around. I can't think of one case where I needed to do a string 
operation on a value taken from the XML document.

After finding no solution that the maintainers of libxml++ where comfortable 
with, I decided to roll my own library, thus [libxmlmm] was born. Since libxmlmm
and libxml++ wrap the same C library, they have a few things in common, but 
libxml++ does a few things differently. The basic DOM is mostly similar, but
the accessors are refined. For example most of your operations involve elements,
so most accessors have a version that handles elements; this makes the client
code much cleaner, since you don't need to cast nodes to elements, where you
know only a element can come out. The other big thing is that XQuery queries 
can be used to set or get any value, not only nodes. This enables to 
formulate queries that do not reference nodes, such as functions like "count(books)".

[gtkmm]: http://www.gtkmm.org
[libxml++]: http://libxmlplusplus.sourceforge.net/
[libxml2]: http://xmlsoft.org
[libxmlmm]: http://www.github.com/rioki/libxmlmm

## mathex

After writing linear algebra classes for the thrid time, I decided to refactor
them out. Thus came the library [mathex] into life. It's not perfect, not 
the most performant thing, but I just love the interface.

[mathex]: https://github.com/rioki/mathex

## sanity

For some reason or other I constanty wrote trace and check functions. Finally
I decided to refactor them into a small library for exactly these purposes, 
called [sanity].

If you wonder how to use the library, you may want to read 
[How to retain your sanity]

[sanity]: https://github.com/rioki/sanity
[How to retain your sanity]: /2011/06/08/how-to-retain-your-sanity.html

## rioki@github

I am mainly using [github][gh] for my hobby programming. Not each project there
is worthwhile to mention, but you can all find them there.

[gh]: http://github.org/rioki

