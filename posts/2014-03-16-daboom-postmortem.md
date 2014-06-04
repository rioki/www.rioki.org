---
layout: post
title: "Da Boom! - Post Mortem"
tags:
    - gamedev
    - daboom
---

I did not write it here, but I completed a game recently: *[Da Boom!][1]*.

*Da Boom!* was developed over the course of the last half year in my spare time. 
I is a classical bomb laying game with a retro art style, but with the ability
that you can play the game over the network. Not only can you play the game 
over the internet, but you can mix local multiplay and network play, you 
can for example have two player on one end and two on the other. 

The focus of this project mas mostly centred around developing technologies and
development strategies. This is the first hobby project that I ever completed. 
I went out and said, either I complete this project or I give up on game 
development.

<!--more-->

## What Went Right

### Limited Scope

From the start I knew that I had to pick a small project and severely limit the
scope. I can only invest around 20 hours on a good week and this means that I 
had to remove as much gold plating as possible.

The actual choice of the game type was triggered by a good friend complaining 
about that lack of bomb laying games that worked properly over the internet. 
This game type with it's limited scope fit the bill quite nicely.

But even here the scope was reduced to only have 3 power ups and a restricted
art style. 

### Art Direction

Although the art is technically speaking "programmer" art, it is not at the
level I can produce. I specifically aimed at a severely reduced and retro looking
art style. This art style meant that I could quickly get something on screen and
play around with the game mechanics.

<img src="/images/DaBoom-0.1.0-sc1.jpg" class="img-responsive" alt="DaBoom 0.1.0 Screenshot 1" />

### Pivotal Tracker

I almost by chance started to try out [Pivotal Tracker][2]. Originally I wanted
to use no planing software at all. I have come to the conclusion, at least for
my hobby projects, that the more you plan the less you actually do. The problem
comes from the fact that when I see the mountain of work to do and miss a 
deadline that this can final blow on my motivation.

But I found two things that where awesome about Pivotal Tracker. It allows you
to easily reorder work. This is important since I tend to plan things that are
not needed now or even never. This gold plating can then simply be pulled 
out of the plan, when you notice that everything will take forever. 

The second thing is that deadlines or rather milestones are estimated by
the work already done and how much is to do. Although you can assign a date 
to a milestone, there is no kidding you about the chance that you will make
the milestone on time, when that is not the case.

### Technology

I have a bone to pick with most graphics libraries that are available to me. 
They are either make really simply things hard to achieve or lack focus and 
maturity.

Over the years I have amassed a large body of code that does most of what I 
needed. The only problem was that it was not packaged in an easy to use fashion.

I invested some time into building and packaging [pkzo], [spdr] and [glm]. 
Not only do I now have usable libraries for rendering, sound and networking,
I gained a significant productivity boost. I not trying to integrate unwieldy 
libraries that waste my type, because they do not build from the get go,
they have weird intrusive interfaces or the setup overhead is huge. 

On the other hand I did not rewrite everything from scratch. Being able
to build upon awesome libraries like SDL and the companion libraries 
SDL_image, SDL_ttf and SDL_mixer really cut the development time in half. 

### Excessive Refactoring

One thing that I can simply not stand is ugly and bad code. This might be a 
character flaw, but I have given up working on projects because the code felt 
wrong. This time around I was determined to keep the code in the best shape as 
possible.

It sound easy at first, but some things just sneak up on you. For example class
handling the menu logic went from being small and well defined to a huge 
jumble of special cases. But even here it was possible to break up the code 
remove most duplication.

It takes severe discipline to refactor code. The problem is that it feels like
you are doing no progress at all while doing it. But it was worth the effort. 

<img src="/images/DaBoom-0.1.0-sc2.jpg" class="img-responsive" alt="DaBoom 0.1.0 Screenshot 2" />

## What Went Wrong

### Lack of Discipline

We are all humans and it is often hard to muster the strength to do all the 
little tedious things. The project was on a great start, what what do you expect,
this is my passion. But after the first two months went by I started to 
not put in the desired time. This was especially true that I also started to
pick the interesting thing to do instead of the really necessary ones. It
is interesting how much time you can spend choosing music when the game does 
not even have the means to play it.

### Rewrites and Gold Plating

I am proud to say that I only rewrote the entire rendering and networking 
systems about one and a half time each. Although this is a record low for me
it remains one of my biggest stumbling stones.

The first most obvious gold plating was that I migrated my rendering code from
immediate mode OpenGL 2.0 to OpenGL 3.2. Although the old code was inefficient,
it did fully and totally not matter. The scene is so simple that any decent 
PC is able to render it without breaking a sweat.

The second gold plating and unnecessary effort was in making the network system
asynchronously multi-threaded. Although the networking code worked fine, the
game logic broke in very suable ways and I ended up falling back in synchronous 
single threaded code. 

<img src="/images/DaBoom-0.1.0-sc3.jpg" class="img-responsive" alt="DaBoom 0.1.0 Screenshot 3" />

### Technological Blunders

The biggest lack of foresight was the game logic and especially the interaction 
with the presentation layer. Although the two where weakly bound, though the 
help of an event based system, it turned out to be fatal when integrating 
the networking layer. The multi-threaded nature of the networking system 
indirectly forced the presentation layer to be multi-threaded. But as it goes
with OpenGL, manipulating resources from multiple threads is not a good idea.

The real problem was that implementing mitigation strategies, such as call 
marshalling or locking strategies where significant unplanned effort. In the
end I ended up calling the networking system in the main even loop. 

Future designs I must think about multi-threading from the start, especially
if I want to get the most out of mulitcore systems. Then again, on such a small 
game, this is a wasted effort. 

### Missing Features

Unfortunately I was not able to implement all features I wanted. These being 
notably character animation, scoring and AI. My focus was on the core 
experience and unfortunately I did not fund the time and energy to implement
them. I will maybe add them in an other go around. 

### External Conditions

On of the biggest dampers was my professional situation. Normally I am working
4 day weeks. This gives me at least one entire day to work on such hobby projects.
But as the project at my day job approached it's release date and things got
a bit hectic, I worked 3 months for 5 days a week. This reduction in time meant 
that I could simply not get so much done. 


[1]: /daboom.html
[2]: https://www.pivotaltracker.com
[pkzo]: http://github.com/rioki/pkzo
[spdr]: http://github.com/rioki/spdr
[glm]: http://github.com/rioki/glm