---
title: User Stories are Half the Story
tags: 
  - projectmanagement
  - agile
---

There are many ways in which you can capture requirements. The current "en vogue"
method is to writ down user stories on index cards and stick them on a white 
board. A structured approach to requirements is key if you want to ever finish 
your project, unfortunately user stories fail to capture all aspects that 
define a piece of software.

The first and obvious contender to missed requirements are the non functional 
requirements. Non functional requirements are the ephemeral requirements that
encompass maintainability usability, performance and memory footprint. Many 
methodologies try to skirt the issue by defining "quality metrics" or 
"common values". The idea here is, that by creating the cleanest and optimal 
code you actually implement the non functional requirements because the code is
is such an awesome state. The problem is that the optimal solution solution for
ten elements is not the optimal solution for one million elements. 

<!--more-->

One of the aspects encapsulated in properly defined non functional requirements
are the performance characteristics with a certain input. Unfortunately this
does not fit onto an index card written in the manner "As a USER, I want GOAL 
as to REASON". You can write "As a user, I want to wait no longer than 1 minute
on my results, as to not waste my precious time." But what is the completion
criterion. 

You need to define you non functional requirements, you can call them quality 
metrics if you like. 

The second and less obvious contender to missed requirements are the collateral
features. The features that everybody expects a good piece of software has, but
can not be pinned to one single task. These are features like, undo, copy and 
paste. Optimally you want to undo each input and copy each element. It is 
conceivable that one common value, in the context of usability, is that each 
action should be undoable. The problem here is that it creates a constant drag 
on development and it is not a far fetch that undo provides less business value 
than the next proper feature. If the later is the case, basically each 
collateral feature needs to be captured through a user story and scheduled. 
This results in a large number of little user stories, but it is the better 
solution.

So next time you sit down to capture requirements into user stories, don't 
forget to also capture the non functional and collateral requirements.
