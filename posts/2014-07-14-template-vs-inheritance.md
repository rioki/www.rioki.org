---
title: "Procedural Terrain Material (Unreal Engine 4)"
tags:
    - gamedev
    - ue4
---

You can [read][1] or [watch][2] many tutorials on how to texture a terrain
using layer blends. Although that is a valid way to texture a terrain, 
I think that most of the work you put into texturing the terrain is redundant. 

Take the classical grass, rock and sand terrain material. The flats always 
get the grass, the rock goes on the slopes and the sand goes on the beach. This
would be something similar to this:

<img class="img-responsive" src="/images/terrainmat/EffectOverview.jpg" alt="Grass on flats, rock on slopes and sand on beaches." />

But if this rule holds up in your scene, why not encode it in the terrain 
shader?

<!--more-->

Here is how I did it:

<img class="img-responsive" src="/images/terrainmat/M_IslandTerrain.png" alt="Procedural terrain shading, it's complicated, not." />

The first is the slope detection is done with the material function SlopeBlend. 
Originally I used the World_Align_Blend, as describes in the [Stylized Landscape][3]. 
But I found that offered little control, over the blend smoothness, the arguments 
where confusing and the function was way to complicated. So I elected to write
my own as a very simple one:

<img class="img-responsive" src="/images/terrainmat/SlopeBlend.png" alt="SlopeBlend" />

This function is quite simple. We compare the current normal with the up vector 
(0, 0, 1). This is done using the dot product. The dot product return 1 for 
equality and 0 when it is perpendicular. To achieve the desired blend
we just scale the out desired range to 0 - 1. And this is how the slope looks:

<img class="img-responsive" src="/images/terrainmat/SlopeBlend_Vis.png" alt="SlopeBlend Visualsisation" />

The HeightBlend could also be done with HeightLerp, but again, I opted 
to write a simpler function:

<img class="img-responsive" src="/images/terrainmat/HeightBlend.png" alt="HeightBlend" />

The actual hight is moved by the height parameter so that the result is 0 at the 
desired height. The sharpness then spreads the 0-1 range over the given value. 
The result is that the values are blended over the given height.

And this is the result of the terrain shader, no blend maps, no ugly watter:

<img class="img-responsive" src="/images/terrainmat/ResultNoWatter.jpg" alt="Result of procedural terrain shader." />

[1]: https://docs.unrealengine.com/latest/INT/Engine/Landscape/Materials/index.html
[2]: https://www.youtube.com/watch?v=tsXVP0fykBM
[3]: https://docs.unrealengine.com/latest/INT/Resources/Showcases/Stylized/Landscape/index.html