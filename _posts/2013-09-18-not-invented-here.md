---
layout: post
title: "Not Invented Here?"
tags:
    - meta
    - json
---

Ups, I did it again! I just built a library for functionality that already
exists; I just built a [JSON library for C++][rjson].

By looking at my "successful" and failed projects on [github] or rather 
the projects that provide concise functionality and meses of disconnected code,
you can easily come to the conclusion that I have a serious case of 
[Not Invented Here][NIH] syndrome.

<!--more-->

The Not Invented Here syndrome is commonly seen as a developer or organizational
dysfunction. Unfortunately for our industry, there are many cases where some 
project is undertaken for many thousand man hours, which could be solved by
an off the shelf solution for a couple hundred bucks. This is not hypothetical
hearsay, I could tell you about at least three internal projects from 
Siemens Industry, which I won't, since that would be against my current 
employment contract. 

Interestingly, one of my heros, Joel Spolsky has a [slightly different stance][jos1]
on the subject. He says that you should not outsource your competitive advantage.
Yet I see to fail to see many projects that get the Not Invented Here stigma being
of any competitive advantage. In most cases I see the projects stemming from
developer boredom, lack of research, lack of understanding or a management 
dysfunction.

So back to me, why have I written a [linear algebra library][mathex], 
a [libxml2 C++ wrapper][libxmlmm], a [resource compiler][ezrc] or as 
of recent a [JSON Library for C++][rjson]? Because all alternatives I saw
where crap!

For each project that has a precedent, I can tell you a story and point out
what flaws it has and why I could not change that in the original project. Take
libxmlmm for example. I was using [libxml++] in the context of GTKmm and was 
quite fond of the library. Then when needing XML parsing in a different project 
that was as close to user interfaces as Himalayans are to surfing I sumbled over 
the dependency to glibmm.

The developers of GTK have a very string feeling about using UTF-8. As such they
have created a suite of functions to handle UTF-8 properly, whcih they put in 
their base library glib. The maintainers of the C++ wrappers for GTK then warped
these handling functions into a class called ustring. As it happens the primary
maintainer of GTKmm is also the maintainer of libxml++. Since libxml2 takes
and returns UTF-8 string and there is no apparent way to correctly handle UTF-8 
in C++, Glib::ustring must the correct way to handle UTF-8 in libxml++. This
sounds reasonable until you see the dependnecies of glibmm: glib, iconv, 
pkg-config, gettext, pthreads, pcre and other minor contraptions. These are 
all libraries that are not trivial to complie on, say windows. In contrals 
libxml2 has as only dependency iconv and builds with MinGW32 off the bat.

When I addressed the issue with the maintainers I was scoffed off and lectured
that the only correct way to handle UTF-8 was through ustring. Guess what? I 
have handled UTF-8 flawlessly for good 15 years with std::string, including my 
favourite Unicode symbol: [☣]. The only concession you need to make is to 
realise that `char` is not nessesarly a single character and as such you need to 
take strings for everything even "single" characters. Relativistically, the only 
situation where you need to step through UTF-8 character by character is when
rendering text, for example in user interface libraries like say GTK.

At first I though about forking libxml++. But the more I looked at the library
the simpler it seemed. Although libxml2 somewhat dictates the structure of any
library wrapping it, I quickly saw ways that you could do better. I then started 
from scratch to write a new wrapper library that would get all the minor 
annoyances of libxml++ right. Two or three hours later I had a wrapper library
for libxml2, that did not require explicit initialisation, had proper support
for XPath queries and did not spill it's guts over attributes.

It is not that I do not use other people's code. I use and strongly recommend
projects such as: [sigc++], [bison], [flex], [SDL], [openAL soft], [libuv] or 
[node]. I just have little tolerance for bad code or stupid build and dependency
requirements. 

[rjson]: http://github.com/rioki/rjson
[github]: http://github.com/rioki
[NIH]: http://c2.com/cgi/wiki?NotInventedHere
[jos1]: http://www.joelonsoftware.com/articles/fog0000000007.html
[mathex]: http://github.com/rioki/mathex
[libxmlmm]: http://github.com/rioki/libxmlmm
[ezrc]: http://github.com/rioki/ezrc
[libxml++]: http://libxmlplusplus.sourceforge.net/
[☣]: http://www.fileformat.info/info/unicode/char/2623/index.htm
[sigc++]: http://libsigc.sourceforge.net/
[bison]: http://www.gnu.org/s/bison/
[flex]: http://flex.sourceforge.net/
[SDL]: http://www.libsdl.org
[openAL soft]: http://kcat.strangesoft.net/openal.html
[libuv]: https://github.com/joyent/libuv
[node]: http://nodejs.org/


