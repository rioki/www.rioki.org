---
title: "Getting Started with Three.js"
tags:
  - webgl
  - threejs
---

I think [WebGL] is an awesome idea; you can use accelerated 3D graphics within 
a browser. This is totally game changing and opens the gate to games serves 
directly to your browser. 

Working with [OpenGL] primitives is somewhat annoying. (One of the reason why
I build [wrappers for C++][pkzo].) But for javascript there are already quite 
usable libraries, one of these is [Three.js]. Today I will show the relative 
easy with which you can start to use WebGL. (Easy to learn hard to master.)

I will show you how implement the following:

<!-- TODO get bootstrap to do the heavy lifting -->
<div style="text-align: center">  
  <iframe style="width: 450px; height: 350px" src="http://three.rioki.org/first.html"></iframe>
  <br>
  <a href="http://three.rioki.org/first.html">full screen</a>
</div>

<!--more-->

The basic template I will be using is the following.

    <html>
      <head>
        <title>Title</title>
        <style>
          body { margin: 0; }
          canvas { width: 100%; height: 100% }
        </style>
      </head>
      <body>    
        <script src="js/three.min.js"></script>    
        <script>
            <!-- code -->
        </script>
      </body>
    </html>
    
This is a HTML skeleton and it does little, except being a valid HTML file. As 
a start we will just make the rendered to area the entire usable area of the 
screen. This is enforced by the CSS style in the header.

The actual interesting bits are the script elements. Firstly we need to actually
load Three.js. The next script element we will put the actual setup and 
rendering code. (The following JavaScript code goes there.)

The core of Three.js is it's WebGL renderer and that is the first thing
that we will setup.

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

This is a common paradigm, it create a renderer without a canvas to render to. 
The renderer will then create the canvas and put it into domElement. To ensure
that the canvas is the same size as the window's client area the renderer is 
instructed to size the canvas appropriately. Finally the actual canvas is then 
attached to the document's body. 

This will only give you a black screen, now we will create somehting to render.

Three.js uses the concept of a scene to structure the thing to render. This
is basically a [scene graph][1], although a simple one.

    var scene = new THREE.Scene();
    
When rendering something, you need something to tell the renderer from where to 
render, this dome by the camera.

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 3;
    
In our case we are using a perspective camera; this is the most common case when
rendering realistic scenes. The camera is constructed with the field of view, 
aspect ratio, the near plane and the far plane. If you want to know how 
perspective cameras work in OpenGL, [here is good article on the subject][2]. 
The camera is moved up from the centrer, since our subject will be there.

Speaking of subject, here is a cube to look at.

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0x1C4A8C });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

In Three.js the mesh is the primary visible object. The mesh is built up of two
things, a geometry that defines it's shape and a material that defines the 
visual properties of the object. There are multiple types of geometries and
materials but for our purposes we will use a box and the almighty phong material. 

But since the phong material is fully lit, we also need alight to actually 
illuminate the scene. For these purposes we will use a simple directional light.

    var light = new THREE.DirectionalLight(0xffffff, 0.55);
    light.position.set(0, 0, 1);
    scene.add(light);
    
The light is constructed with the color and intensity. This is useful, since it 
means you don't have to encode the intensity in the color. Directional lights are
odd in Three.js, their position defines the direction of the light. That is
the direction of light is the vector form the position to the origin. Here the 
light shines directly in the same direction as the camera is looking onto the
scene.

But so far nothing actually is happening, but here is the render loop:

    var render = function () {
      requestAnimationFrame( render );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    render();

The render loop uses the requestAnimationFrame function to ensure continues 
rendering without taxing the CPU unnecessary. The function also rotates the cube,
to show that this actually is dynamic. But the really important bit is the 
invocation of the actual render function of the renderer.

You can see the [full code on github][3] and the [entire thing in action][4].

There are a few remaining issues, such as resizing and attaching to an existing
canvas, but that I will address in a further article.
    
[WebGL]: https://www.chromeexperiments.com/webgl
[OpenGL]: https://www.opengl.org/
[pkzo]: https://github.com/rioki/pkzo
[Three.js]: http://threejs.org/
[1]: https://en.wikipedia.org/wiki/Scene_graph
[2]: http://blog.db-in.com/cameras-on-opengl-es-2-x/
[3]: https://github.com/rioki/three.rioki.org/blob/master/first.html
[4]: http://three.rioki.org/first.html
