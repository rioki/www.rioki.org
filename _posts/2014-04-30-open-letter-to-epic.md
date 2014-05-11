---
layout: post
title: "Open Letter To Epic"
tags:
    - gamedev
    - ue4
    - ut2014
---

My Dear Beloved Epic,

when I found out that you released the Unreal Engine 4 to the public at such 
friendly terms I jumped on it. I have always regarded the Unreal Engine as 
being one of the best, in many cases even the best game engine available. When
I first started the engine I was really impressed. The ease of use is astounding;
the ease at which assets can be integrated and even created in the engine 
is unrivalled. The though and engineering put into this engine is remarkable. 

But working basically every day for the last three weeks I have come to the 
conclusion, the engine, although very promising, is still severely lacking in
polish. The engine and editor is far from broken, but a few dints in the 
perfectly wrong places make working with the Unreal Engine 4 frustrating and
unpleasant. 

To begin with the documentation is severely limited. I understand that you 
focused on getting the engine ready for release was the top priority. In 
addition I can see that the body documentation is strongly growing and I 
am confident that is a years time, you and third parties will have created
the body documentation that is needed to build a game without foraging through 
menus and node lists. But for the time being, to a certain degree the saying 
applies: "If a feature is not documented, it does not exist". 

I really admire the fidelity of the static lighting, with a few tweaks the 
scene is lit in the most realistic lighting conditions. Unfortunately this
only is true for static lighting, dynamic lighting has no indirect lighting, 
not even approximated first level reflection. This makes dynamic time of day
basically a non starter. Either you have dynamic time of day or the scene 
look nice. 

One of the first project I looked at was the FPS demo. This demo is gorgeous 
and really shows off the potential of the engine. This demo ran around 20-30 FPS
on my machine. I will admit that my machine although strong, is not newest 
biggest money can buy. Also I did not expect other of you, this map must look 
awesome for at least the next half decade. The problem is that when this map
is loaded into the editor the editor slows to a crawl of 1-2 FPS and is rendered
almost totally unresponsive. I understand that the editor has more rendering
complexity with all the menus, but this drop in performance is unacceptable. 
Getting the rendering setting to a usable level of medium is borderline 
impossible, because of the level of unresponsiveness. The editor should detect 
severe adverse performance conditions and automatically scale back fidelity in
the sake of usability.

Although I have not yet found the true cause of this issue, even moderately 
complex levels of around 100 boxes introduce a small stutter when static 
geometry is moved, added or removed. It appears to be the preview light maps 
being updated. This stutter, where the editor freezes up for the duration of
something like 1-2 seconds makes building levels a real pain.

With the above in mind, the entire situation is aggravated with the fact that
the editor appears to leak memory. The longer it runs the more memory it needs.
Although I understand that the editor needs large amounts of memory start 
with, for example to keep previews of assets in memory, the growing memory 
consumptions forces my system to page out memory, something that is a very 
rare occasion. This make working with the engine and other tools after around
one hour impossible. The task switch then takes around ten seconds to complete. 
This is a problem that will not be solved with putting more memory in my system, 
since it will just delay this adverse condition. Getting back into a usable 
state requires either a reboot of the machine or patience and I do not want 
to have my coffee breaks dictated by a game editor. 

Finally using fonts in your engine is basically impossible. You import a 
true type font and one out of three times when playing the game from the editor
it crashes. You already have a large number of crash dumps and I hope that
you will soon fix this issue. If I can be of any help, like build the engine
from sources and then retry, let me know. 

Playing around with your engine was fun, but for the time being I will 
wait for a more mature version of your engine.

Best Regards,

Sean "rioki" Farrell 


