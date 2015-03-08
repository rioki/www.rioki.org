---
title: "Agile Spices for Classical Process"
tags:
  - projectmanagement
  - agile
---

In this day and age every programmer and his dog know that well implemented
agile processes are more efficient and create an environment where you 
actually want to work. Unfortunately many organisations are not ready to
implement agile processes. This resistance unfortunately is somewhat well 
founded, when you need to comply with regulations, it is really hard to explain 
how traceability is implemented when all you have to document your requirements
are index cards. Although it is possible to implement traceability in an agile 
process, such as Scrum, that even the FDA will approve of, getting the upper 
rungs of management to agree, can be an impossible task.

But not all hope is lost, there are a few things you can take from the agile 
play book and seamlessly integrate into a classical model, like waterfall or 
the V-model. 

<!--more-->

**The Daily Standup Meeting**

Even [books from the 70s agree][1], communication the key factor in a project's
success. Classical processes codify most communication in documents, but human
day to day communication is also important. Unfortunately some people like to 
hide behind design documents and meeting minutes.

The [standup meeting][2] is a vehicle of forced communication where you 
everybody answers 3 questions:

- What did I accomplish since the last meeting?
- What will I do until the next meeting?
- What obstacles are impeding my progress?

This is done while standing up, without any discussion. The nature of standing
sends the message, this is a meeting to be held as short as possible. If 
any issues need to be resolved, such as removing a road block, a separate 
meeting is scheduled with only the people needed. 

Optimally, stand up meetings are held just before lunch. This ensures that
it will be swiftly carried out. This also allows for people with flex time to 
really use it. 

**Kanban Board**

In Scrum a [Kanban][3] is the primary method to schedule work and evaluate 
throughput. But with a classical project this is handled though some form of
project plan. Yet it sill makes sense to use paper cards and a blackboard to 
visually display work in progress.

Commonly tasks have states, like "not started", "started", "integration", 
"quality assurance" and "done". These can be columns on the board. Without any 
further restrictions the tasks are moved on the board. This quickly and quite 
effectively show capacity bottlenecks and problems. 

**Test Driven Development**

Writing [unit tests][4] has become a staple of each and every developer. Just because
the project management process is from the 70s, there is no reason why you can't
write tests before implementing a module. Of course, since you will already 
have a mostly fleshed out design the actual development is not driven by the 
tests, but it creates a quick feedback loop if the design is met.

This is an invaluable, since it common that the minute details of a design are 
not specified, this will quickly show a viable solution. In addition, unit tests
commonly also show flaws in a design at a relatively early stage. Flaws that 
would have only been found down the road when the code is integrated into the
bigger system.

**Pair Programming**

[Pair programming][5] is an invaluable resources, that unfortunately commonly has
allot of resistance. Granted when you put two people together they will not
work twice as fast, yet they will work at around 1.7 times the speed and
have significantly cleaner code. If you are aiming at producing high quality 
code, pair programming may be one of your most valuable resources. 

[1]: https://en.wikipedia.org/wiki/The_Mythical_Man-Month
[2]: https://en.wikipedia.org/wiki/Stand-up_meeting#Software_development
[3]: https://en.wikipedia.org/wiki/Kanban_board
[4]: https://en.wikipedia.org/wiki/Test-driven_development
[5]: https://en.wikipedia.org/wiki/Pair_programming
