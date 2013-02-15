---
layout: post
title: "Project Management Software Found"
tags:
    - management
---

I have been looking for a suitable project management software for my hobby 
projects about as long as I have hobby projects. I have tried out allot of 
different solutions and none really gelled, until now.

It seems that my needs have a certain disconnect from most software. The reason
being that most project management software focuses on planing and work 
completion tracking. I tried software that addressed different methodologies. 
Notable ones are dotProject, that adheres to the classical project management
approach, to AgileTrack, that tries to bring tooling to XP or Scrum projects.

<!--more-->

My biggest problem with these methodologies are that they assume you basically 
know what you want to do. For my hobby projects this tends not to be well
set and change radically. Classical Project management falls totally flat with
the added burden that you also need to know how long you will take and how much 
time you have. But even agile methodologies have their drawback, you need to 
know in a certain advance what you want / need to do. I kept changing the plan
over and over and over gain.

That is not to say that some form of planing does not help me. I quickly 
discovered that issue trackers really help record the bugs you can't (don't want 
to) fix immediately or the features you put off for later. FogBugz is a nice 
tool, since it also integrates customer relationship management. But that tool
is quite expensive and over the top for me.

The situation got some what worse with the fact that I decided (noticed) that
writing small self sufficient libraries works better for me than building large
monolithic software. Now I need a system that can handle many different projects;
especially since I want them all to be tracked in one system. It gets even more
difficult, since I open source some projects. I now even need or rather want to 
expose these projects to the public.

I also noticed that documentation a real issue. Although not formally part of
project management, documentation management became a more and more important 
factor. Redmine was one of the first tools that I looked at, that basically
integrated a wiki into the project management software. The main reason I did
not use Redmine was that it is based on ruby and that would mean installing, 
maintaining and securing yet an other technology on my server. 
 
Interestingly the solution that worked best for me over the years was using 
dokuwiki, flyspray and gitosis. (I first used subversion and later converted
to git.) Although not perfect, integrating flyspray and dokuwiki works like a 
charm. I must add that source control integration was never really a big issue 
for me. Securing the tools for private use is quite simple, the problem I 
ran into is when I want to publish some part concerning public projects.

I started using github for hosting my git repositories. This comes basically
from the fact, that they are free for public repositories and this makes it
really easy to exchange code with other people. But even the private options 
are quite cost efficient. At first I did not use the wiki and issue features 
of github. The rationale was that I already had the tools in place (dokuwiki 
and flyspray) and did not want additional segmentation.

As it happens I move libxmlmm and libqgl from Source Forge github, since the 
service is so much easier. I also moved my private projects to github and as
a result now have all my repositories hosted on github.

For my open source projects, especially libxmlmm I started to use the wiki and
migrated the existing wiki entries to github. This basically was motivated from
the fact that I did not want to maintain yet an other website on my hosted 
server.

I also started to use the issue tracker for my personal website. This came from 
the fact that tracking issues for my websites in flyspray was kind of awkward 
and non intuitive. (Every issue needs a caused in and to be fixed version, great 
if your project does not have versions.)

After a while I noticed that I have found my perfect project management software,
github. It is easy, it is straight forward and it has all the features I need. 
Since the access is controlled at project level I can have my project and public
projects hosted at one place.

Even though github is a web based solution I can take almost everything with me. 
Obviously using git, the source code and version control comes with me. But the
wiki is also basically just a github repository filled with text files. The only
thing I can't take with me are the issues. But thanks to the source control 
integration I can close issues with a checking comment. (If I remember the issue
number, that is.)


