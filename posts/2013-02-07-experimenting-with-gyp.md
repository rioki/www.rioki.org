---
layout: post
title: "Experimenting with GYP"
tags: 
    - gyp
    - building
---

I am working again on a game project, think [solid] only better. My development 
targets are first and foremost Windows, then GNU/Linux and finally Mac OS X. Building 
portable code is relatively easy, if you stand on the shoulders of giants like
[libSDL] or [libuv]. In all my code I have only one #ifdef for the location where
savegames and the configuration is stored; all else is abstracted by libSDL and 
libuv.

Keeping the build system portable is a different story. I have been an avid 
proponent of GCC and its Windows offspring MinGW. I still think they are the 
superior tool chain. But when third party libraries are involved, it becomes
more and more a resource drag. The problem is simple, for Windows you will 
always get the MSC ("Visual Studio") builds or MSBuild definitions, but seldom 
one compatible for MinGW. Technically all you need is a Makefile, as you would use 
for GNU/Linux, but with all the sources and preprocessor flags set for windows
and that is rare.

As a result I have started using Visual Studio again. Somehow it makes sense to
use the "native" tool chain to build something, than to monkey one from a different
platform. Now this creates a new problem, I start to have multiple build 
definitions to maintain. But why can't I generate the native build definitions
from a master build definition? And there comes [GYP] to the rescue. (No,
I am not even going to think about touching [CMake].)

<!--more-->

GYP is interesting. It was initially developed by the [Chromnium] developers at 
Google to solve exactly the problem of keeping multiple build definitions in sync.
GYP has spread to other projects, such as [V8] and is used by Node for [building 
native addons][node-gyp]. GYP is still rough around the edges, but very usable.

Unfortunately the requirements for GYP are quite hefty, you need [Python] 2.7 and
some POSIX tools (on Windows either [MinGW's MSYS][mingw] or [Cygwin]). On 
top of that you need [Subversion] to get GYP itself. But as software developer, 
these are tools you probably would have lying around anyway. So after you clear 
all requirements and [get the latest version of gyp][1] you are set to go. 

The input to gyp are \*.gyp files which are JSON. (Actually a python dialect, that
allows comments and trailing comments.) The structure is quite simple: 

    {
      'variables': {
        # ...
      },
      'includes': [
        '../build/common.gypi'
      ],
      'target_defaults': {
        # ...
      },
      'targets': [
        {
          'target_name': 'moo',
            # ...
        },
        {
          'target_name': 'foo',
            # ...
        }
      ]
    }

The structure is straight forward, first you have variables, then you include
other GYP files for common shared settings, then you defined defaults for 
all targets and finally you have a list of targets. Any questions so far?

Before we look into how single targets are defined, I want to discuss the 
project layout. This is something, that took me while to properly nail down. 
You can define all targets in one single gyp file or distribute the files 
through your project. The clue is that you don't need to reference them in anyway
GYP will recursively scan your folders for gyp files and process them.

So a simple executable will look like so:

    {
      'targets': [
        {
          'target_name': 'kooltool',
          'type': 'executable',
          'dependencies': [
            'xyzzy',
            '../bar/bar.gyp:bar'
          ],
          'defines': [
            'KOOL=1337',
            'USE_BAR'
          ],
          'include_dirs': [
            '../includes',
            '../bar'
          ],
          'sources': [
            'Kool.h'
            'Kool.cpp',
            'main.cpp'
          ]    
        }
      ]
    }

Again this looks very straight forward. We have the kooltool target and it is
an executable. It depends on the targets xyzzy and bar. Here is to note, 
that you can reference a target in this file or from other gyp files. (Here the 
xyzzy target would have to be defined in this gyp file.) The nice thing about 
dependencies, is that if the dependency is a library, it will automatically 
be linked with the current target. Defines, include directories and source 
explain themselves. You only need to specify the sources to compile and no 
headers, but I like to see the header files in the IDE. 

A library is quite similar, but has a few nifty twists:

    {
      'targets': [
        {
          'target_name': 'bar',
          'type': 'shared_library',
          'dependencies': [
            '../drinks/drinks.gyp:drinks'
          ],
          'defines': [
            'USE_DRINKS',
            'NONSMOKING'
          ],
          'include_dirs': [
            '..'
          ],
          'direct_dependent_settings': {
            'defines': [
              'USE_BAR',
              'NONSMOKING'
            ],
            'include_dirs': [
              '.'
            ]
          },
          'export_dependent_settings': [
            '../drinks/drinks.gyp:drinks'
          ],
          'sources': [
            'Bar.h',
            'Bar.cpp'            
          ]
        }
      ]
    }
    
Ok so this looks mostly like the executable target. The target types for libraries
may be either *shared_library* or *static_library*. The [GYP documentation][2] 
states you should use a variable to switch between static and shared libraries,
but I have not found any use for that. 

The really interesting thing is how settings can be applied to dependent targets.
The *direct_dependent_settings* will be added to any target that depends directly
on this target. There is also *all_dependent_settings* that will apply to all 
dependents (directly or indirectly), but that may be overkill for most cases. 
The *export_dependent_settings* will "pass on" the *direct_dependent_settings* 
of a given target as it it where it's own *direct_dependent_settings*.

So this is all nice and well, but often you need to do different things on 
different platforms. Like for example, openGL has different library names on 
each platform. 

    {
      'targets': [
        {
          'target_name': 'kooltool',
          'type': 'executable',
          'dependencies': [
            'xyzzy',
            '../bar/bar.gyp:bar'
          ],
          'defines': [
            'KOOL=1337',
            'USE_BAR'
          ],
          'include_dirs': [
            '../includes',
            '../bar'
          ],
          'sources': [
            'Kool.h'
            'Kool.cpp',
            'main.cpp'
          ],
          'conditions': [
            ['OS=="linux"', {
              'libraries': [
                '-lGL',
                '-lGLU'
              ]
            }],
            ['OS=="win"', {
              'libraries': [
                '-lopengl32.lib',
                '-lglu32.lib'
              ]
            }],
            ['OS=="mac"', {
              'libraries': [
                '$(SDKROOT)/System/Library/Frameworks/OpenGL.framework'
              ]
            }]
          ]        
        }
      ]
    }

The conditions syntax needs a bit getting used to but is simple to apply. You
can use any expression as condition and put any directive to be amended. 

This all will bring you actually quite far. It creates some quite generic projects
though and you might expect something differently. In the case you are used to
the "Debug" and "Release" configurations and your developers will expect it. 

Appart from the conditions, there are also configurations and build system 
specific configurations. This is a good thing to put into a centra *.gypi file 
for use by all *.gyp targets/projects. A configuration might look like so:

    {
      'target_defaults': {
        'default_configuration': 'Release',
        'configurations': {
          'Debug': {
            'defines': [ 'DEBUG', '_DEBUG' ],
            'msvs_settings': {
              'VCCLCompilerTool': {
                'RuntimeLibrary': 1, 
              },
              'VCLinkerTool': {
                'LinkTimeCodeGeneration': 1,
                'OptimizeReferences': 2,
                'EnableCOMDATFolding': 2,
                'LinkIncremental': 1,
                'GenerateDebugInformation': 'true',
                'AdditionalLibraryDirectories': [
                    '../external/thelibrary/lib/debug'
                ]
              }          
            },
            'xcode_settings': {
              'OTHER_LDFLAGS': [
                '-Lexternal/thelibrary/lib/debug'
              ]
            }
          },
          'Release': {
            'defines': [ 'NDEBUG' ],
            'msvs_settings': {
              'VCCLCompilerTool': {
                'RuntimeLibrary': 0,
                'Optimization': 3,
                'FavorSizeOrSpeed': 1,
                'InlineFunctionExpansion': 2,
                'WholeProgramOptimization': 'true',
                'OmitFramePointers': 'true',
                'EnableFunctionLevelLinking': 'true',
                'EnableIntrinsicFunctions': 'true'            
              },
              'VCLinkerTool': {
                'LinkTimeCodeGeneration': 1,
                'OptimizeReferences': 2,
                'EnableCOMDATFolding': 2,
                'LinkIncremental': 1,
                'AdditionalLibraryDirectories': [
                  '../external/thelibrary/lib/debug'
                ]            
              }          
            },
            'xcode_settings': {
             'OTHER_LDFLAGS': [
                  '-Lexternal/thelibrary/lib/release'
              ]
            }
          }
        }  
      }
    }

This bit of JSON looks at first daunting, but is very simple once you pick out 
the bits. The entire block is put into target_defaults, so that it is applied
to all targets, obviously. The *default_configuration* key simply indicates 
what is the default to use. I use release here, since with open source software
more users will build your software and they want a release build, but that 
setting is debatable. The names of your configurations are fully up to you, 
but it is sensible to use the somewhat standard 'Release' and 'Debug'. Within
these configurations you can basically use any value you would use with in a
target clause. 

The interesting thing happens in *msvs_settings* and *xcode_settings*. These 
are project settings for Visual Studio and XCode respectively. The *msvs_settings*
are the MSBuild directives you would also find in a vcxproj. So you can just 
copy your favorite value from the vcxproj that was generated by Visual Studio. 
The same thing is with xcode_settings for XCode, except that I don't have a clue 
about that, since I never have seen a Mac from up close in at least a decade.

Here are two useful examples of useful configurations: 
* [Converting a C library to gyp][3]
* [gyp - how to specify link library flavor][4]

As conclusion I can say, gyp is a nice tool if you need to target multiple 
build environments as it supports make, Visual Studio (2005-2012), XCode, 
SCons and ninja. GYP is simple to use but requires a certain amount of one 
time effort to get it to generate exactly the project file as you want it. I 
for my part ended up not using GYP for my project; for now. I might migrate
[libxmlmm] to GYP though. 

[solid]: /2012/08/09/solid-shelved.html
[libSDL]: http://www.libsdl.org/
[libuv]: https://github.com/joyent/libuv
[GYP]: https://code.google.com/p/gyp/
[CMake]: http://www.cmake.org/
[Chromnium]: http://www.chromium.org/
[V8]: http://code.google.com/p/v8/
[node-gyp]: https://github.com/TooTallNate/node-gyp
[Python]: http://www.python.org/
[mingw]: http://www.mingw.org/
[Cygwin]: http://www.cygwin.com/
[Subversion]: http://subversion.apache.org/
[1]: https://code.google.com/p/gyp/source/checkout
[2]: https://code.google.com/p/gyp/wiki/GypUserDocumentation#Skeleton_of_a_typical_library_target_in_a_.gyp_file
[3]: http://n8.io/converting-a-c-library-to-gyp/
[4]: http://stackoverflow.com/questions/13979860/gyp-how-to-specify-link-library-flavor#
[libxmlmm]: https://github.com/rioki/libxmlmm
