---
layout: post
title: "Just a View?"
tags:
    - games
    - engineering   
---

Over the years of developing object oriented (OO) software, many software engineers
have come the paradigm that, in most cases "It's just a view". This is especially
well described in Andy Hunt's classical Pragmatic Programmer (ISBN: 020161622X)
and this stuck with me. (Chapter 29: It's just a view.)

But what I have trouble reconciling this idea with game logic. 

<!--more-->

Before going into my qualms about the concept and how that relates to game logic,
a brief description of what it all means. 

The basic idea stems form the good old Model-View-Controller (MVC) pattern. A
basically interesting idea to separate the data (model), form it's presentation 
(model) and the business logic applied to it (controller). The basic motivation, 
is that you can switch out the view and controller or have multiple views and 
controllers on one data set.

Unfortunately, for small problems this either created lots of code. For every 
element in the model there now had to be two additional classes, that were 
basically useless on their own. The additional down side was that many missed 
the point and the view, controller and model classes became strongly bound and 
switching one meant having to change the other.

The other pattern that emerged what the MVC that weren't. There was a time when
about every framework claimed to be MVC, like the Microsoft Foundation Classes (MFC). 
In reallity the concepts where muddled together. In the case of MFC you normally 
had one class, indirectly derived from CWindow, that contained the data, mostly 
as simply types and the event handers where the controller. Although MFC was a 
real improvement at the time, it was not MVC. 

The realisation came that MVC was not really practical, especially since, in
most GUI frameworks, the controller and the view can not be separated. This lead 
people to either abandon the idea of MVC completely or use the refined Document-
View (DV) pattern.

The DV pattern realised the fact that having pure data classes was a stupid idea. 
So the document contains it's data and the logic centered around the data. For 
example validation it now implemented in the document and not in the controller. 
The view also got it's logic back and it implements all display logic, including 
the forwarding the user interactions to the document.

The DV pattern is a step froward, since not you can have one document and 
multiple views. Interestingly, Andy Hunt takes it even further. In his case he
says that you can create views of views. The idea is that a view does not have
to be a user interface, it can also be an aggregate that creates aggregate data
and this is then visualised.

Back to games. This is an all nice and dandy concept, but it seams like in many
cases the data used in games is directly or indirectly tied to it's visualisation.

The real problem is not that it is impossible to build such a game engine. If 
the project it only built up of programmers and the data is somehow generated
procedurally, this may work. You would have the pure simulation data and
it's simulation in the document and the visualisation, such as sound, graphics
and input attached as views to that document. Editing of data, aka level, is done
purely on the simulation level and any mapping to the visualisation has to be 
defined elsewhere. 

The problem is when you put artists on the team. They don't start with some ugly
simulation data, such as collision volumes, but with nice and pretty meshes with
lots of materials and effects and want to put that into the engine. Now the 
document needs to accommodate data for the visualisation and simulation data is
derived from that.

Source has an interesting answer to that problem, they split the entities into
two halves. One for the "server" (i.e. Document) and one for the "client" 
(visualisation). The problem here is the often lamented problem, that a 
programmer is needed to get an art asset into the engine. In addition, this
applies only to entities, the level/scene which is built as a BSP also contains
visualisation information in the BSP.

I think the problem is more one of tools and modeling. Artists and level 
designers what to work visually; as the Cryengine add says "what you see is 
what you play". I would even extend that notion to, when I add an object with 
a mesh, the collision should just work.

Unfortunately I have no good ideas for solving this, but just writing this 
essay gave me some new ideas to research.

