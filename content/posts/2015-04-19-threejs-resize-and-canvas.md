---
title: "Three.js: Resize and Canvas"
tags:
  - webgl
  - threejs
---

As [promised][1], resizing and attaching to a custom canvas in [Three.js][2]. 

We will start with [code from the getting started post][3] and simply add 
event handlers for resizing the window:

    window.addEventListener('resize', function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

Calling the `setSize` function on the renderer will resize the underlying canvas.
Since the canvas is fullscreen, here we simply use the window's client area. 
The camera also need to be notified of the changed aspect ratio. This is 
important or everything looks squashed. Since the camera can not detect that 
one of it's properties changed, we need to call `updateProjectionMatrix` 
function.

[Here is how it looks][4] and [here is the code][5].

<!--more-->

If you want to attach the renderer to an existing canvas things are a bit 
different. For starters you need a canvas: 

    <canvas id="canvas"></canvas>
    
Since you are using a custom canvas, you need to tell the renderer to actually 
use it.    
        
    var canvas = document.getElementById('canvas'); 
    
    var renderer = new THREE.WebGLRenderer({canvas: canvas});
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    
We can't use the `setSize` function in this case, because it also overwrites
the CSS sizing instruction and we normally want CSS to handle all sizing of 
elements. Because of this we need to tell the canvas what it's resolution is. 
Then we need to set the renderer's viewport to cover the entire canvas.

Likewise, since the canvas' size is the determining factor, the camera is 
created appropriately.

    var camera = new THREE.PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight, 0.1, 100);
    
[WARNING: The blow code does not work! See the updated code.][99]
    
Like in the case of the fullscreen canvas, we listen to resize events of the 
canvas and react appropriately.

    canvas.addEventListener('resize', function () {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    });

[Here is how it looks][6] and [here is the code][7].    
    
Of course, now you can have multiple renderers attached to different canvases. 

[1]: /2015/04/12/getting-started-with-three-js.html
[2]: http://threejs.org/
[3]: https://github.com/rioki/three.rioki.org/blob/master/first.html
[4]: http://three.rioki.org/resize-window.html
[5]: https://github.com/rioki/three.rioki.org/blob/master/resize-window.html
[6]: http://three.rioki.org/resize-canvas.html
[7]: https://github.com/rioki/three.rioki.org/blob/master/resize-canvas.html
[99]: /2015/08/18/resize-canvas-update.html