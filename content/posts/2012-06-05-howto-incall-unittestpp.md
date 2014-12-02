---
layout: post
title: "How To Install UnitTest++"
tags:
    - coding
    - unittest
---

In my opingion [UnitTest++] is the most awsome unit testing framework for
C++ ever created. The only minor downside is that the library misses an install
rutine for when built with make. 

I actually wrote the procedure down a while ago, but apperently I don't have 
this article online anymore. So here I will post it again.

The actual procedure is quite simple, first you build the library are normal:

    make
    
I am assuming that you want to install it to the common location /usr/local. 
If you fancy a different place, you just need to change that bit.

The first step is to create any missing folders:

    mkdir /usr/local/include/UnitTest++
    mkdir /usr/local/include/UnitTest++/Posix
    mkdir /usr/local/include/UnitTest++/Win32
    
And now you copy the files:

    cp src/*.h /usr/local/include/UnitTest++
    cp src/Posix/*.h /usr/local/include/UnitTest++/Posix
    cp src/Win32/*.h /usr/local/include/UnitTest++/Win32
    cp libUnitTest++.a /usr/local/lib
    
Note, that I included both the Win32 and Posix headers. You actually just need 
one set of them and can skip the other. I include it, since people acutally use
MinGW32 (for example me) and there the Win32 headers come into play.

[UnitTest++]: http://unittest-cpp.sourceforge.net/
