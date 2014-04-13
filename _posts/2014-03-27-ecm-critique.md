---
layout: post
title: "A Critique of the Entity Component Model"
tags:
    - gamedev
    - engineering
---

The entity component model is all the rave for the last decade. But if you look
at the design it opens more issues than it solves. 

Broadly speaking the entity component model can be summarized as the following: 
An entity is composed of components who each serve a unique purpose. The entity
does not contain any logic of it's own but is empowered bay said components.  

<img class="img-responsive" src="/images/ecm/ecm-intro.png" alt="Overviews are boring." />

But what does the entity component model try to solve?

<!--more-->

[Each][1] [and][2] [every][3] illustration of the entity component model starts
with a classic object oriented conundrum: a deep inheritance hierarchy with 
orthogonal proposes. For example you have a Goblin class. You from two 
specialisations of the Goblin class, the FylingGoblin who can fly and the 
MagicGoblin who uses magic spells. The problem is that it is hard to create 
the FylingMagicGoblin. 

<img class="img-responsive" src="/images/ecm/dreaded-diamond.png" alt="Suddenly goblins everywhere!" />

Even with C++ and it's multiple inheritance, you are not in the clear, you still
have the [dreaded diamond][4] and virtual inheritance to solve. But most 
languages do simply not support a concise way to implement it. 

When solving the issue with components, the components GroundMovement, FlyingMovment,
MeleeAttack and MagicAttack are created and the different types of goblins are
composed from these. 

<img class="img-responsive" src="/images/ecm/flying-magic-goblin.png" alt="Flying magic goblins are just a figment of your imagination." />

Good job, now we went from one anti-pattern (deep inheritance hierarchy) to a 
different anti-pattern (wide inheritance hierarchy). The central issue is that 
the inheritance hierarchy tries to incorporate orthogonal concepts and that is
never a good idea. Why not have two object hierarchies, one for attack modes
and one for movement modes?

<img class="img-responsive" src="/images/ecm/goblin-sanity.png" alt="Goblins can be different, yet same." />

As you can see from an object oriented standpoint the entity component model
fares quite poorly. But that is not the only problem the entity component model
tries to solve.

In many cases you see the concept of a data driven engine. The idea is that you
can cut down on development time by moving the object composition out of the
code and into some form of data. This allows game designers to "build" new 
object by writing some XML or using a [fancy editor][5]. Although the 
underlying motivation is valid, it does not need to be use an entity component 
model, as a few [counter examples][6] show quite well.

Putting the structural criticism aside, a naive implementation of the entity 
component model can in no way be efficient. In most cases the components are 
not such high concepts as moving or attacking, they are more along the
lines of rendering and collision detection. But unless you have additional 
management structures, you need to look at each and every entity and
check if it has components that are relevant for the rendering process. 

<img class="img-responsive" src="/images/ecm/inefficient.png" alt="No way is this efficient." />

The simplest way to resolve the issue without altering the design to radically,
is the introduction of systems. In this case the actual implementation is
within the systems and the components are just indicating the desired behaviour.
The result is that a system has all the relevant data in a very concise and 
compact format and as a result can operate quite efficiently.

<img class="img-responsive" src="/images/ecm/better-graphics.png" alt="Putting the high end into graphcis." />

But if you look closely you can see that we have all these useless components. 
What if you removed the components and just used properties on the components and
the systems just look for appropriately named properties? Now you have duck typing. 

<img class="img-responsive" src="/images/ecm/duck-typing.png" alt="If walks like a duck and quacks like a duck..." />

Duck typing is a concept that is used a lot in weakly typed languages, like 
for example JavaScript or Python. The main idea here is that the actual type 
if irrelevant, but specific properties and function are expected on a given
object within a specific context. For example it is irrelevant if it is a 
file stream, a memory stream or a network socket if it has the *write* function 
it can be used to serialize object to.

The problem with duck typing is that is does not lend itself easily to native 
languages. You can cook up some solution using some varying type but in no 
way is this an elegant solution. 

Chances are you already have a scripting system, in this case the solution is
quite straight forward, you implement the core game logic in scripts and 
underlying systems look at this definition and implement any heavy lifting in
native code. The idea of [alternating hard and soft layer][7] is [nothing new][8]
and should be considered where flexibility and performance is needed.

You may think that implementing the game logic in scripts is an inefficient way
to do it. In cases where you are building a simulation oriented game this
may be quite true. In these cases is makes sense to extract your logic and reduce
it to it's core concepts, a simulaiton if you will. Then implement the 
presentation layer and control layers externally directly against the simulation 
layer. 

<img class="img-responsive" src="/images/ecm/totally-not-mvc.png" alt="Totally not MVC!" />

The nice thing about this design is that you can split the presentation layer and
simulation so far that you can put one of them on one computer and the other 
on a different one. 

<img class="img-responsive" src="/images/ecm/mvc-network.png" alt="The internet is going to change everything." />

*Wait, did you just describe MVC?* Um... No... Stop changing the subject. 

When looking into scalability you get interesting requirements. [One very clever
implementation][9] of the entity component system was make it scale in an MMO 
setting. The idea here is that entities and components do not exist in code, 
but are entries in a database. The systems are distributed over multiple 
computers and each work at their own pace and read and write to the dabase as 
required. 

<img class="img-responsive" src="/images/ecm/mmo-ecm.png" alt="Totally not HLA." />

This design addresses the need of a distributed system and reminds me of the 
[High Level Architecture][10] used by NASA and NATO to hock up multiple real-time 
simulations together. Yes this design approach even has it's own standard, the 
IEEE 1516.

*Ok, oh wise one, what should we do?* 

If you read about these issues you are either building a game engine or a game. 
Each and every game has different requirements and game engines try to satisfy a
subset of these different requirements. Remember what you are developing and the
scope of your requirements. If your current design sucks, you do not need to go
overboard with your design, because chances are [you aren't gonna need it][11]. 
Try to make the smallest step that will solve the problem you are facing. It
pays out to be creative and look at what others have done.

[1]: http://piemaster.net/2011/07/entity-component-primer/
[2]: http://gameprogrammingpatterns.com/component.html
[3]: http://cowboyprogramming.com/2007/01/05/evolve-your-heirachy/
[4]: http://www.parashift.com/c++-faq/mi-diamond.html
[5]: http://unity3d.com/
[6]: https://www.unrealengine.com/
[7]: http://c2.com/cgi/wiki?AlternateHardAndSoftLayers
[8]: http://www.panda3d.org/
[9]: http://t-machine.org/index.php/2007/09/03/entity-systems-are-the-future-of-mmog-development-part-1/
[10]: https://en.wikipedia.org/wiki/High-level_architecture_(simulation)
[11]: https://en.wikipedia.org/wiki/You_aren't_gonna_need_it
