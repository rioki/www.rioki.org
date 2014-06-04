---
layout: post
title: "GLSL Skybox"
tags:
    - opengl
    - graphic
    - demo
---

Anybody can load six textures and render a cube to create a skybox. How about 
rendering a skybox with exactly one quad? I tried [just that][1] in an example
to my [ice library][2]. And it looks awesome!

[![Skymap Demo](/images/cloudy_afternoon_sm.jpg)](/images/cloudy_afternoon.jpg)

But since few juicy bits are hidden in the library I will untangle them and explain
them. The process is quite simple, but I have not seen many tutorials on the 
subject. The best I found was the [tutorial by Keith Lantz][3] but he still uses
a cube to render the cubemap. 

<!--more-->

The first part of the riddle is the cubemap; instead of loading six textures, 
you load one texture with 6 "faces". If you look at my [Cubemap][4] class you
will not see much, because it rides on much of the [Image][5] and [Texture][6] 
classes.

The openGL and SDL code, untangled if as follows:

    GLInt id;
    SDL_Surface* xpos = IMG_Load("xpos.jpg");
    SDL_Surface* xneg = IMG_Load("xneg.jpg");
    SDL_Surface* ypos = IMG_Load("ypos.jpg");
    SDL_Surface* yneg = IMG_Load("yneg.jpg");
    SDL_Surface* zpos = IMG_Load("zpos.jpg");
    SDL_Surface* zneg = IMG_Load("zneg.jpg");    
    
    glEnable(GL_TEXTURE_CUBE_MAP);
    glGenTextures(1, &id);
    glBindTexture(GL_TEXTURE_CUBE_MAP, id);
    
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_MIN_FILTER, GL_LINEAR); 
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_CUBE_MAP, GL_TEXTURE_WRAP_R, GL_CLAMP_TO_EDGE);

    glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, RGB, xpos->w, xpos->h, 0, RGB, GL_UNSIGNED_BYTE, xpos->pixels); 
    glTexImage2D(GL_TEXTURE_CUBE_MAP_NEGATIVE_X, 0, RGB, xneg->w, xneg->h, 0, RGB, GL_UNSIGNED_BYTE, xneg->pixels); 
    glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_Y, 0, RGB, ypos->w, ypos->h, 0, RGB, GL_UNSIGNED_BYTE, ypos->pixels); 
    glTexImage2D(GL_TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, RGB, yneg->w, yneg->h, 0, RGB, GL_UNSIGNED_BYTE, yneg->pixels); 
    glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_Z, 0, RGB, zpos->w, zpos->h, 0, RGB, GL_UNSIGNED_BYTE, zpos->pixels); 
    glTexImage2D(GL_TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, RGB, zneg->w, zneg->h, 0, RGB, GL_UNSIGNED_BYTE, zneg->pixels); 

Once the code is spelled out like this, it looks really straight forward. It is 
quite similar to the "normal" 2D texture handling, except you are handling six
textures.

The next bit of the puzzle is the code to render the one quad:

    glDisable(GL_DEPTH_TEST);
    glDisable(GL_LIGHTING);

    glBindTexture(GL_TEXTURE_CUBE_MAP, id);
    glUseProgram(program_id);

    glBegin(GL_QUADS);           
        glVertex3f(-1.0, -1.0, 0.0);
        glVertex3f( 1.0, -1.0, 0.0);
        glVertex3f( 1.0,  1.0, 0.0);
        glVertex3f(-1.0,  1.0, 0.0);
    glEnd();

Yes that's it, that is all we do in the client code. What is omitted of course,
is that we setup the camera and projection before and render the remaining scene
after; but that is stuff you would do anyway. 

The next bit of the puzzle the GLSL shader. I will omit the code on how to compile
and upload a GLSL shader, you can read it how it is done in the [Shader][7] class
or any other online resource.

The reason why I posted the client code first, is because I use a common trick 
when rendering any full screen effects. The vertexes of the quad are not taken at 
random, the match the device coordinates. The result is that you can write a 
simple vertex shader that ignores the model view and projection matrices.

    void main()
    {
        gl_Position = gl_Vertex;
    }
    
But before we look at the vertex shader, we take a look at the [fragment shader][9]:

    uniform samplerCube cubemap;

    void main()
    {
        gl_FragColor = textureCube(cubemap, gl_TexCoord[0]);
    }

The fragment shader is just a simple lookup into the cubemap. The interesting 
thing about cubemaps, is that the texture coordinates are represented as
a [vector from the center of the cube][8]. This comes in handy, since the vector
from the camera to the fragment, is exactly this vector.

So here we are, the [vertex shader][9]:

    void main()
    {
        mat4 r = gl_ModelViewMatrix;
        r[3][0] = 0.0;
        r[3][1] = 0.0;
        r[3][2] = 0.0;
        
        vec4 v = inverse(r) * inverse(gl_ProjectionMatrix) * gl_Vertex;

        gl_TexCoord[0] = v; 
        gl_Position    = gl_Vertex;
    }

As I said above the texture coordinate is the vector from the camera to the 
fragment. For efficiency we compute it for the vertex and use openGL's 
interpolation. This can be done quite easily by using the inverse of the
model view and projection matrix and thus effectively unprojecting the
vertex. But since we only want the direction, the translation is removed from
the model view matrix first.

Note, if you look at my shader the coordinates are swapped. This is done because,
in my world z is up, but the skymap was generated with y as up. This is a 
minor correction for this issue. 
    
[1]: https://github.com/rioki/ice/blob/master/examples/sky/main.cpp
[2]: https://github.com/rioki/ice/
[3]: http://www.keithlantz.net/2011/10/rendering-a-skybox-using-a-cube-map-with-opengl-and-glsl/
[4]: https://github.com/rioki/ice/blob/master/ice/Cubemap.cpp
[5]: https://github.com/rioki/ice/blob/master/ice/Image.cpp
[6]: https://github.com/rioki/ice/blob/master/ice/Texture.cpp
[7]: https://github.com/rioki/ice/blob/master/ice/Shader.cpp
[8]: http://www.nvidia.com/object/cube_map_ogl_tutorial.html
[9]: https://github.com/rioki/ice/blob/master/examples/data/SkyProjection.frag
[10]: https://github.com/rioki/ice/blob/master/examples/data/SkyProjection.vert
