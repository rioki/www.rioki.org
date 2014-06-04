---
layout: post
title: "Transform to View Matrix"
tags:
    - computer graphics
---

**How do you construct a view matrix from a transformation matrix?**

If you search the web about how to build a view matrix you will find many
references to `gluLookAt` or a [custom look at implementation, maybe even how
to setup a FPS camera](http://3dgep.com/?p=1700). These all come in handy when 
you setup a scene ad hoc, but the general case, when you already have a camera 
that has a transformation matrix is seldom discussed. After I pieced this 
information together, I want to share it with you.

The general case is quite simple, to get the view matrix (V) from the 
transformation matrix (T), all you need to do is take the inverse.

$$V = T^{-1}$$

But computing the inverse of a 4x4 matrix is 
[not much fun](http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche23.html)
and definitely quite computationally expensive. 

But if you remember what the transformation matrix contains and how you compute
a view matrix through the look at function. You will see an interesting correlation. 

<!--more-->

The important thing to remember is that the transformation matrix is an 
orthonormal basis with a position slapped on.

$$
X = (x_1, x_2, x_3) \\
Y = (y_1, y_2, y_3) \\
Z = (z_1, z_2, z_3) \\
P = (p_1, p_2, p_3) \\

T = 
\begin{pmatrix}
  x_1 & y_1 & z_1 & p_1 \\
  x_2 & y_2 & z_2 & p_2 \\
  x_3 & y_3 & z_3 & p_3 \\
    0 &   0 &   0 &   1 
 \end{pmatrix}
$$

If you look at the source code for [look at](https://github.com/rioki/glm/blob/master/src/projection.h#L40), 
you will see some similarities: 

    mat4 lookat(vec3 eye, vec3 target, vec3 up)
    {
        vec3 zaxis = normalize(eye - target);    
        vec3 xaxis = normalize(cross(up, zaxis));
        vec3 yaxis = cross(zaxis, xaxis);     
     
        mat4 orientation(
           xaxis[0], yaxis[0], zaxis[0], 0,
           xaxis[1], yaxis[1], zaxis[1], 0,
           xaxis[2], yaxis[2], zaxis[2], 0,
             0,       0,       0,     1);
         
        mat4 translation(
                  1,       0,       0, 0,
                  0,       1,       0, 0, 
                  0,       0,       1, 0,
            -eye[0], -eye[1], -eye[2], 1);
     
        return orientation * translation;
    }
    
*Note: The column and row is swapped in the matrix's initialisation.*

As you can see the function computes the X, Y, and Z vectors from the given
values and packs them transposed into the orientation matrix. This is then 
multiplied by the translation matrix containing the inverted position (eye).

The thing with the transformation matrix is that we already have the X, Y, and Z 
vectors.

So to get the view matrix from a transformation matrix you do the following:

with:

$$
T = 
\begin{pmatrix}
  x_1 & y_1 & z_1 & p_1 \\
  x_2 & y_2 & z_2 & p_2 \\
  x_3 & y_3 & z_3 & p_3 \\
    0 &   0 &   0 &   1 
 \end{pmatrix} \\
$$
 
You compute:  

$$
O = 
\begin{pmatrix}
  x_1 & x_2 & x_3 & 0 \\
  y_1 & y_2 & y_3 & 0 \\
  z_1 & z_2 & z_3 & 0 \\
    0 &   0 &   0 & 1 
 \end{pmatrix} \\
 
E = 
\begin{pmatrix}
  1 & 0 & 0 & -p_1 \\
  0 & 1 & 0 & -p_2 \\
  0 & 0 & 1 & -p_3 \\
  0 & 0 & 0 & 1 
 \end{pmatrix} \\
 
V = O \cdot E
$$

This solution is quite simple and involves mostly copying values around. 

There are a few caveats, though. Normally a camera is not scaled and scaling the 
scene may not be what you want, but you need to account for a scaled translation
matrix.

The work around to a scaled matrix is simple, you normalise the X, Y and Z 
vectors before putting them into the orientation matrix. If you desire to scale 
the entire scene, you can multiply the view matrix with the 1/S scaling matrix.

The second issue is a slanted transformation matrix. In this case you basically 
have no choice but to compute the proper inverse of the translation matrix. 
But honestly slanting the camera is sick thing to do... 

So the code for converting a transformation matrix to a view matrix is as follows
(not accounting for scaling): 

    mat4 transform = (...);
        
    vec3 xaxis = normalize(transform[0]);
    vec3 yaxis = normalize(transform[1]);
    vec3 zaxis = normalize(transform[2]);
    vec3 eye   = vec3(transform[3][0], transform[3][1], transform[3][2]);
    
    mat4 orientation(
       xaxis[0], yaxis[0], zaxis[0], 0,
       xaxis[1], yaxis[1], zaxis[1], 0,
       xaxis[2], yaxis[2], zaxis[2], 0,
              0,        0,        0, 1);
     
    mat4 translation(
              1,       0,       0, 0,
              0,       1,       0, 0, 
              0,       0,       1, 0,
        -eye[0], -eye[1], -eye[2], 1);
 
    mat4 view = orientation * translation;

