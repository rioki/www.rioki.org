---
layout: post
title: "The Most Important Feature of DSCM"
tags:
    - scm
---

Distributed Source Code Management (DSCM), such as [git] or [mercurial] have 
changed how software development projects are structured. But there is one 
feature that really changed the game for free software. 

It is not that contributing changes are really easy. With distributed 
source code management patches are a thing of the past, you merge 
changes into your workspace, like it was a branch. This makes it fully clear from 
which revision the change comes and it significantly reduces the chance of
conflicts. But that is not it.

It is not that every developer has a full repository. If you want to contribute 
to a project your get your own repository, just for you. You can try things out,
revert and alter as you like. Having full source control management features 
at your disposal is important, especially if you only want to contribute 
small piece of your alterations. But that is not it.

It is not that users can easily stay in sync with the repository. It depends on 
your needs, but some users prefer a stable build and need to be at the bleeding 
edge of development. Instead of grabbing a tar ball and copying the files, the
user can create a tracking repository. Now with minimal effort he can track the
latest changes or any stable branch. Even going from stable version to stable 
version with local modifications is assisted through the tool. But that is not it.

In my opinion the most valuable feature of distributed source code management 
is that anyone can fork a project. There is much useful software out there, 
unfortunately many of it is not actively maintained. Before, you had to 
export the repository, if you had read access and import it into a new 
repository. This can be a long process and can potentially loose history. 
With a distributed source code management you just create a clone and are 
ready to continue. Even when development restarts on by the original authors 
merging the changes together are fairly simple, since the history was never 
corrupted. 

[git]: http://git-scm.com/
[mercurial]: http://mercurial.selenic.com/
