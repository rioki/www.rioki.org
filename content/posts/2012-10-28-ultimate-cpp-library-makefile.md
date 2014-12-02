---
layout: post
title: "Ultimate C++ Library Makefile"
tags:
    - building
    - make
    - gist
---


I like make, I really like make. Make is, in contrast to many other build
systems, extremely simple yet ultimately powerful. The best part is that it
is almost standard everywhere, save windows and for that you have [MinGw].

I switched over to make at the beginning of this year and have refined my makefiles
ever since. I recently started [the experiment][1] of wrapping [libuv] in C++ and
decided to take the makefile one step further. I wrote [a makefile][2] that 
is so generic that all you need to change are the three variables PACKAGE,
VERSION and lib_libs and solve 90% of all use cases.

<!--more-->

The makefile makes some assumptions about the package layout, one that is common
and should be standard for libraries. There are basically three folders 
*include*, *src* and *test* and it is obvious what goes there. The *include* 
folder contains the public headers that will be installed in the system. The 
*src* folder contains the sources and private headers that make up the library. 
The folder *test* contains the unit tests for the library. 

The makefile also makes some assumptions about your build environment. The first
is that you use a GNU or compatible tool chain for building your software. 
Through the use of the environment variables *CXX*, *CXXFLAGS* and *LDFLAGS* 
you can alter and extend your build environment. It is assumed that any 
dependencies are "published" through the variables *CXXFLAGS* using *-I* and 
LDFLAGS using *-L* or located in common public locations. This gives the 
flexibility of building your project in any build environment, as long as 
CXXFLAGS and LDFLAGS are properly set. 

To use the makefile all you need to do is copy the makefile to the root
of your project and set the variable *PACKAGE* to your package / project / library 
name and *VERSION* to the correct version of your package. Depending on your 
need you may need to extend CXXFLAGS and lib_libs to add any required preprocessor
macros and libraries. You should not add any search paths to dependent libraries,
as noted above the CXXFLAGS and LDFLAGS should already contain any environment
dependent modifications.

Now for the fun part, I will walk you through the [makefile][2] and show you
how it was done. Even if you are not building a library there is much insight
into using make efficiently.

    CXX      ?= g++ -std=c++0x
    CXXFLAGS += -Iinclude -DVERSION=\"$(VERSION)\"
    LDFLAGS  += 
    prefix   ?= /usr/local

The first real part of the makefile is setting and extending the build 
environment. This is the sane way to do it, we let the user choose what 
compiler (CXX) he wants to use and only provide a sane fall back. This is the same
with CXXFLAGS and LDFLAGS, we only extend them. So if you want "-g -Wall" or
"-O3 -DNDEBUG" you should specify it externally. *prefix* is a bit special and
we will see how that works when addressing installation. 

    headers    = $(wildcard include/*.h)
    lib_hdr    = $(wildcard src/*.h)
    lib_src    = $(wildcard src/*.cpp)
    lib_libs   = -lalib 
    test_hdr   = $(wildcard test/*.h)
    test_src   = $(wildcard test/*.cpp)
    test_libs  = $(lib_libs) -lUnitTest++
    extra_dist = Makefile README.md
    dist_files = $(headers) $(lib_hdr) $(lib_src) $(test_hdr) $(test_src) $(extra_dist)

This part describes the actual project. As you can see we use wild cards for files. 
Using wild cards is extremely powerful; to add a file you just add the file, 
to remove a file, you just remove a file and to rename a file you rename the file;
no need to alter the build configuration.

The only variables you might want to touch are *lib_libs*, *test_libs* and 
*extra_dist*. *lib_libs* contains any libraries you need to link your library to 
and *test_libs* contains any libraries you need to link your test to. *test_libs*
is automatically extended with *lib_libs*, since obviously you need to link to
the same dependencies. The *extra_dist* contains any files not part of the build,
but you want / need them as part of the distributed package. 

    ifeq ($(MSYSTEM), MINGW32)
      EXEEXT = .exe  
      LIBEXT = .dll
    else
      EXEEXT =
      LIBEXT = .so  
    endif
    
This is a small hack to ensure portability between POSIX and Windows. 

    .PHONY: all check clean install uninstall dist
    
As the phony targets show, this makefile is mostly GNU compatible, with the most
common targets. 

    all: $(PACKAGE)$(LIBEXT)
    
    $(PACKAGE)$(LIBEXT): $(patsubst %.cpp, %.o, $(lib_src))
        $(CXX) -shared -fPIC $(CXXFLAGS) $(LDFLAGS) $^ $(lib_libs) -Wl,--out-implib=$(patsubst %$(LIBEXT),lib%.a, $@) -o $@
    
This is the all rule and the actual build instruction for the linking the 
library. The main idea is that users do not want to run any tests, so we will
not force them to. Note the use of pattern substitution to form the object to 
link. This, with the wild card, forms the automatic deduction of what needs to be 
done. Although mostly not required, this instruction not only creates the shared
library, but also a matching link library. 

The compiler instruction is written in the generic form, save for *$(lib_libs)*,
it can be used in any makefile. The arguments for the compiler are deduced from
make's automatic variables *$^* (prerequisites) and *$@* (target). 

But how are the objects created? Well we could rely on a built in rule but for 
dependency tracking we extended the generic rule:
   
    %.o : %.cpp
        $(CXX) $(CXXFLAGS) -MD -c $< -o $(patsubst %.cpp, %.o, $<)
   
This is quite a standard rule. The important bit is the -MD flag which will
create for every *.o* object a *.d* makefile snippet. These snippets contain
all header files needed during the build of that object. This in itself useless, 
but all we need to do is include these:

    ifneq "$(MAKECMDGOALS)" "clean"
    deps  = $(patsubst %.cpp, %.d, $(lib_src))
    deps += $(patsubst %.cpp, %.d, $(test_src))
    -include $(deps)
    endif
    
Two thing strike out. First we don't include the files during clean, this 
is obvious because we delete these files. Second is that we use *-include* 
directive, to prevent any error if the *.d* file is not present. Obviously 
if you have a clean package, there are no *.d* files.

    clean: 
        rm -f src/*.o src/*.d test/*.o test/*.d $(PACKAGE)$(LIBEXT) test-$(PACKAGE)$(EXEEXT)	

The next common used rule is *clean* and it is quite straight forward. 

    install: $(PACKAGE)$(LIBEXT)
        mkdir -p $(prefix)/include/$(PACKAGE)
        cp $(headers) $(prefix)/include/$(PACKAGE)
        mkdir -p $(prefix)/lib
        cp lib$(PACKAGE).a $(prefix)/lib
        mkdir -p $(prefix)/bin
        cp $(PACKAGE)$(LIBEXT) $(prefix)/bin

    uninstall:
        rm -r $(prefix)/include/$(PACKAGE)
        rm $(prefix)/lib/lib$(PACKAGE).a
        rm $(prefix)/bin/$(PACKAGE)$(LIBEXT)

The *install* and *uninstall* targets are interesting but straight forward. As
you can see anything in *include* is copied to the specified *include/package* 
The use of prefix makes it possible to install the library in non standard locations
by specifying the prefix on the make invocation like so:

    $ prefix=/opt make install
    
As developer you should always call the *check* rule:

    check: test-$(PACKAGE)$(EXEEXT)	
        ./test-$(PACKAGE)$(EXEEXT)

    test-$(PACKAGE)$(EXEEXT): $(PACKAGE)$(LIBEXT) $(patsubst %.cpp, %.o, $(test_src))
        $(CXX) $(CXXFLAGS) $(LDFLAGS) $^ $(test_libs) -o $@

This builds the unit test and executes it. The build instruction is again
generic and can be used in any other make rule. 

Finally as package maintainer you need the handy *dist* rule:

    dist:
        mkdir $(PACKAGE)-$(VERSION)
        cp --parents $(dist_files) $(PACKAGE)-$(VERSION)
        tar -czvf $(PACKAGE)-$(VERSION).tar.gz $(PACKAGE)-$(VERSION)
        rm -rf $(PACKAGE)-$(VERSION)

This does what you expect, it packages all sources into a tar ball for source 
distribution. 

At a first glance the [makefile][2] looks a little intimidating, but when you 
realise that it can build your package without the need to ever touch it again
(except maybe the version number) you realise that make is awesome!
        
[MinGw]: http://www.mingw.org/
[1]: http://github.com/rioki/libuvpp
[libuv]: http://github.com/joyent/libuv
[2]: https://gist.github.com/3957339
