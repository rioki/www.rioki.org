---
layout: post
title:  "Artificial Intelligence and The Travelling Salesman"
tags:
    - computer-science
    - artificial-intelligence
---

<img src="/media/hal9000.jpg" class="img-responsive" alt="HAL 9000">

The near future holds many interesting development, some of which we don't 
comprehend yet. But a general artificial intelligence or super artificial 
intelligence won't be part of it.

The notion of the singularity is not new. But recently I have seen more and more
articles discussing artificial intelligence. These either spell the doom of 
humanity or it's salvation. The problem is that a real artificial intelligence 
is very hard to realize and I will try to explore how hard it is.

<!--more-->

Before we go down the path of the complexity of an artificial intelligence, 
I will lay out what I mean by artificial intelligence. We are seeing interesting 
implementations of simulations, for example the chat bot Eliza and more recently
Alice have fooled people in thinking that a human is on the other side. News 
outlets are quick to note that the Turing test was beaten, ignoring the fact 
that the actual Turing test is significantly more complex.

But these are not artificial intelligence, they are simulated intelligence, that
is a clever, yet dumb program that excels simulating a facet of human behaviour. 
These programs are really interesting from a computer science and linguistic 
point of view, but if a artificial intelligence is to be as "smart as a human" 
or smarter, it must be self aware. As the Turing test states, an artificial 
intelligence must be able to understand the finer points of philosophy and 
formulate new ones. (Turing ignored the fact that two thirds of the human race
would probably also fail the his test.)

Artificial intelligence research spans many disciplines, such as language 
recognition, language synthesis, synthetic vision, higher level reasoning and 
many more fields. With little exception each area is hard, at the very least 
non-deterministic polynomial complete, if not non-deterministic polynomial hard.
As a result, if each area of an artificial intelligence is non-deterministic 
polynomial, then the entire artificial intelligence is non-deterministic 
polynomial at the very least.

To understand what non-deterministic polynomial means, we will look at the 
travelling salesman problem; the go to problem in computer science. 

*Assume that you are a travelling salesman and need to got to multiple customers,
located all over the area. How do you plan your route, to minimize the distance 
travelled?*

The interesting fact about this problem is that humans are able to come up with 
good solutions (95% optimal) almost instantly. Yet computers are struggling with 
the problem. Taking the trivial algorithm, they can only return the optimal 
solution or none. In addition each time you add a customer the execution time 
doubles. This exponential growth means that you very quickly go from seconds, 
to minutes, to day, to years in execution, just by adding more customers.

This fact, that humans can conjure up a good solution yet computers utterly fail
at the task, has vexed computer scientists for the last century. And that is why 
much research was put into finding algorithms that produce good solutions in 
reasonable time, such as randomly picking a couple hundred solutions and 
picking he best one.

It remains an open issue if non-deterministic polynomial is actually polynomial 
(P == NP) or not (P != NP). The question is, can a general algorithm be found,
that runs on a deterministic processing unit, but heeds the same efficiency that
one that runs on a non-deterministic processing unit? 

If you think about it, artificial intelligence embodies exactly this corundum, 
you are trying to model a non-deterministic processor (human) on a deterministic 
processor (computer). This means that artificial intelligence research must also
find this general algorithm or a specialized from for an artificial intelligence. 

Proponents of artificial intelligence will commonly state that complexity is 
irrelevant, this will be solved by improvements in computing power, by 
Moore's Law. This observation is interesting, since computing power is also
increasing exponentially. Computing power on individual devices has started to 
slow, as power consumption is more of an issue, that raw power for most 
applications. But in high performance computing, this still holds up; at least 
as a total. (Individual units' power has slowed, but this is compensated by 
adding more units.)

Now there are two factors working against each other, both are growing 
exponentially. If you paid attention in math, you will know that in almost all 
cases these two do not cancel each other out, but the stronger will ultimately 
win. At this point, it is unclear which will be the stronger, my educated guess 
is that the complexity of artificial intelligence grows faster than the computing 
power and I will explain why. 

For starters, hardware improvements have already started to struggle. The move
from single core to multi-core central processing units (CPU) was a necessity, 
since it became significantly more difficult to improve the single core. But at 
some point, the number of cores on a chip will be the next problem, this means
that the cores need to communicate. But not only that, there is data flowing 
through the system, the speed of random access memory (RAM) and disk access is 
the next hurdle. Where processors have improved blazingly fast, memory and disks
are, in comparison, slow to improve. The more this gap widens, the less
processors performance matters. This is even more aggravated when clustering 
computers together, now the slowest leg is the network interconnect. Again
improvements in networking, although awesome, are even slower to take hold. 

If you want to get anywhere, you need to take into account this architecture 
with all it's different speed. So now, not only are you trying to solve a
problem, such as synthetic vision, which is hard, you need to think about how 
to efficiently implement it, making it even harder. 

The good news is that many problems and solutions in the artificial intelligence 
field benefit from parallelisation. For example neural networks, in theory they
work the most efficient, if one core simulates one neuron. The bad news is that
this still suffers from memory access speeds, since each new state must be 
written back to memory, before it can be accessed by the next neuron consuming 
this value. (In this case, it may be also just a cache memory on the processor.) 
This ensures that synchronisation and memory access becomes factor that 
determines the speed.

But even though a general purpose processor may not be optimal for the task, it 
is conceivable to implement a dedicated hardware, similar to graphical processor
units (GPU), that can efficiently simulate a neural network. And yet, we are 
suffering from the exponential growth issue. Assuming that you can design a chip
that simulates one thousand neurons; something that should be feasible today. 
This means that you can implement a neural network with one thousand neurons. 
It is really easy to add one additional neuron to the network, but now you need 
to add an additional unit. This means that you need to synchronise the two units.

Sure these neuronal processors units may get more powerful, but with each 
iteration it will be harder and harder to improve the unit, since more and more
data flows through the unit. Parallelism in small numbers heads very high 
improvements, but at some point the management overhead nullifies the 
improvement. A well understood concept known under the term Amdahl's law.

It seems like the only solution is task parallelisation. That is you dedicate 
one device or a cluster to a dedicated task. For example synthetic vision and 
higher level reasoning. The synthetic vision then hands higher level concepts
(e.g. a car). But each task can only efficiently grow within the bounds it's 
unit, with each quickly hitting the point of diminishing returns. The problem is,
no matter how you dice and slice it, physics dictated the boundaries. (And don't
hold your breath for quantum computing either, all attempts so far where flawed 
or scams.)

But even within constrained performance boundaries, better and better solutions 
to the travelling salesman problem have been found. Following that logic, there
still hope for those hoping or dreading the singularity, a hope that I will 
quickly extinguish.

If you either look at solutions to the travelling salesman or common high level 
planing strategies, such case based reasoning, you will see that they are fake. 
They are clever tricks that allow flaws to achieve higher performance. Don't get 
me wrong, I believe that I will see interesting simulated intelligence devices, 
such as the automated secretary, call system or companion droid. But these 
devices will not be HAL 9000 or Jarvis, they will never be able to exceed 
their original programming. We may see some injuries and casualties as automated
system misjudge a situation, but they will not doom the human race or bring along
it's salvation.  
