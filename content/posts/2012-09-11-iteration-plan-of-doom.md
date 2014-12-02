---
layout: post
title: "Iteration Plan of Doom"
tags:
    - management
    - rant
---

On my "serious" hobby projects I try to keep a two week iteration going. Up 
until recently it worked like a charm. Each two weeks a new playable version 
came down the line. Although it was mostly playable, I could see the difference
to the last version and pat myself on the back. This worked like a charm,
until I got sick last week. This is just a hobby so no big deal, but it made 
me think about the "modern" planing methods. 

In my organisational unit at Siemens, we are trying to "agile up" our development
process. It is done under the banner Lean, but it is the same critter, with a
different fur color. We now have User Stories here, Iterations there and Kanban
everywhere. To a certain degree I am really happy that we are removing (some)
of the shackles of the document heavy process, but on the other hand I think
some of the modern trends take out much of the gain.

<!--more-->

On my hobby projects I use two weeks, because they give me sufficient time to 
implement something significant (approx 16 man hours), but are frequent enough
to keep me motivated and have a sense of progress. I do some planing ahead of 
time, but that is at best a rough sketch. You just need to realise the 
simple fact, as the guys at 37 signals so well illustrate it, 
[planing is guessing]. (Read their book [rework], it is **GREAT**.)

[planing is guessing]: http://37signals.com/svn/posts/1805-lets-just-call-plans-what-they-are-guesses
[rework]: http://37signals.com/rework

Now there are two trends that I see, since the ideas where formed about agile
development iterations got shorter and iteration plans became more detailed. 
I think these trends are making the development process more brittle and error
prone. 

As a consequence of shorter iterations, [user stories became shorter][1]. As a 
reminder: **"Story: One thing the customer wants the system to do. Stories should 
be estimable between one to five ideal programming weeks. Stories should be 
testable."** (Kent Beck, Extreme Programming Explained, 1st Edition) The idea
behind a user story, as Kent Beck described it, is a big picture idea that the 
user has. All the implementation details will be evolved during development 
with the the user. But how are you going to integrate a 5 ideal week user story
in a 2 real week iteration? 

The only option you have it to decompose the user stories into smaller ones. 
But user stories are supposed to be atomic, you either have them or you don't. 
So any decomposition happens at (for the user) unnatural boundaries. So you tell
your user that after the first two weeks, she can insert an object, but that
can't be undone, after the second two weeks it can be undone, but the consistency
check is not in place, after another two weeks the consistency check is in and
all is the way the user wanted. Why did we not let the user wait 6 weeks? This
is especially weird when you are talking about shrink wrapped software and the 
only "user" that sees the software are testers; testers that then write a bug
report that undo does not work while testing the first iteration. 

The reduction in user story size has only one goal, better planing capability. 
If you plan 3 x 2 weeks you can see that the schedule slips after the first two 
weeks. Which would not be such a big deal, your velocity / burn rate / 
whatever could improve over the course of development (or not). But now
the iteration plan is crammed with <del>features</del> user stories and some 
bean counter can tell that you will not make the final ship date. 

Iteration plans in many cases resemble a project plan of the good old waterfall
model. You have a start date and an end date, between them are iterations 
with constant duration. How is planing done, take all <del>development tasks</del> 
user stories and evenly distribute them (hopefully sorted by importance) into
the iterations. But now that you have a plan and with management buy in, you 
need to stick to it. Every iteration can potentially go into crunch mode.

But it gets even more weird when things, such as summer or Christmas don't get 
integrated into the plan. *Who would have thought that the half the development
team takes off in August?* 

The original proponents of agile development did not fix a release date, they 
released the software **every iteration**. But you can still estimate relatively
accurately  when a certain set of user stories is done: *user stories to go / 
current velocity*. The idea at play is to create a sustainable pace and not start 
permanent crunch, just because someone **guessed** wrong on his iteration plan.

[1]: http://www.agileproductdesign.com/blog/the_shrinking_story.html 
