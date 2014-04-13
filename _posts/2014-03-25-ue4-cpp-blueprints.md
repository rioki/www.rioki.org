---
layout: post
title: "Unreal Engine 4: C++ vs. Blueprints"
tags:
    - gamedev
    - ue4
    - ut2014
---

For my [UT2014 Challenge][1] I had the first hard decision to make:

> Should I use C++ or Blueprints to drive the game logic?

<div class="alert alert-warning">
<strong>Disclaimer:</strong> In case you stumble over this and try to make a 
decision to either use C++ or Blueprints for your project, keep in mind that I only 
had a good hard look at the issue for a few hours. 
</div>

Looking at the C++ code for the FPS sample, it becomes quite clear that you find
all the bits that used to be in U-Script in UE2 and UE3. You have the Pawn, 
Character, Controller, GameMode and Game classes, just this time in C++. So if 
you know your way around the older version of the engine you are quickly at home 
here.

<!--more-->

One of the most epic features is that the editor / game engine will reload 
recompiled libraries seamlessly. This means that you can make changes to the 
code **while it is being executed**. I honestly do not know how it works, but
it is awesome. (I could come up with a few options, but I do not know what
epic put into their engine.)

I think the biggest feature of C++ has nothing to do with the engine. You can 
call any third party library you like. Although I can not think of any cases 
for my current project, there are many interesting things you could do. You
can integrate for example real-time simulation and make the unreal engine
the front-end to your training application. You can integrate some form of
peripheral Epic has not thought about. You can interface the engine with other
programs never intended to, like a [process manager][2].

Blueprints on the other hand are an integral part of the engine. Even if you use
C++, you will need some Blueprints. If you can implement logic easily in C++ and
Blueprints, then the extra overhead of C++ does not make so much sense. Although 
the turnaround time of C++ is awesomely low with the Unreal Engine 4, Blueprints 
are even smaller. Make a change and you can try it out, even before saving the 
Blueprint.

The mixing of C++ and Blueprints makes for some mental confusion. Do I set the 
value in C++, in the Blueprint's defaults or in the Blueptint's build script? 
It is often not clear what the best course of action is with this hybrid state,
when you use Blueptins this is clear and obvious. They are just variables and
if you want to change them from the outside, you check one checkbox.

For the time being I will take the following approach: *Use Blueptrins until I 
hit a roadblock.* Honestly, I think this will be never in the case of my 
project.

[1]:/2014/03/21/ut2014.html
[2]: http://www.cs.unm.edu/~dlchao/flake/doom/

