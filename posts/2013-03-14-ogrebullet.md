---
layout: post
title: "OgreBullet"
tags:
    - green
    - ogre
    - bullet
---

I am looking into using [OGRE] and [Bullet] for my [little project] and while I was
browsing through the OGRE Wiki, I stumbled over [OgreBullet]. So my reaction, was
"interesting". I knew that anything of this matter would not work into my 
proposed architecture, since it mixes two systems I want to separate. 
Nevertheless I looked into it. 

And it is what I thought it was. It is what you get when someone says "Let us
add physics to out small graphics demo!" and then heads to code something up 
without further though.

But this naive approach is common in hobby game development circles. It stems 
from the fact that the first thing you get from a game is it's graphics. As 
a result developers start on the graphics first and then start weaving other
elements, such as sound, AI and physics into the graphic code. Unfortunately it 
takes allot of unlearning to realise that the proper way go is to think about 
and build the model code first and then wrap the presentation layers around it.

Fun fact, if you look into the OGRE wiki, you will find similar gems, like 
[OgreAL], [OgreSocks] and [OgreMP]. What good does a graphic library do with a Berkley 
socket layer? And no, it is not multi system rendering, which would be arguably 
cool. I get extensions that meaningfully extend OGRE like [Hikari], [OgreSpeedTree], 
[Berkelium] or [Particle Universe plugin], but the mere existence of these odd 
libraries is insane.

[OGRE]: http://www.ogre3d.org
[Bullet]: http://www.bulletphysics.com/
[little project]: /tag/green.html
[OgreBullet]: http://www.ogre3d.org/tikiwiki/tiki-index.php?page=OgreBullet
[OgreAL]: http://www.ogre3d.org/tikiwiki/tiki-index.php?page=OgreAL
[OgreSocks]: http://sourceforge.net/projects/ogresocks/
[OgreMP]: http://sourceforge.net/projects/ogremp/
[Hikari]: http://www.ogre3d.org/tikiwiki/tiki-index.php?page=Hikari
[OgreSpeedTree]: http://www.ogre3d.org/tikiwiki/tiki-index.php?page=OgreSpeedTree
[Berkelium]: http://www.ogre3d.org/tikiwiki/tiki-index.php?page=Berkelium
[Particle Universe plugin]: http://www.ogre3d.org/tikiwiki/tiki-index.php?page=Particle+Universe+plugin
