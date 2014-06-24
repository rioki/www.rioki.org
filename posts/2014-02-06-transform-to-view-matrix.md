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

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mi>V</mi>
  <mo>=</mo>
  <msup>
    <mi>T</mi>
    <mrow>
      <mo>-</mo>
      <mn>1</mn>
    </mrow>
  </msup>
</math>

But computing the inverse of a 4x4 matrix is 
[not much fun](http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche23.html)
and definitely quite computationally expensive. 

But if you remember what the transformation matrix contains and how you compute
a view matrix through the look at function. You will see an interesting correlation. 

<!--more-->

The important thing to remember is that the transformation matrix is an 
orthonormal basis with a position slapped on.

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mover>
    <mi>x</mi>
    <mo>&rarr;</mo>
  </mover>
  <mo>=</mo>
    <mrow>
      <mo>(</mo>
      <msub>
        <mi>x</mi><mn>1</mn>
      </msub>
      <mo>,</mo>
      <msub>
        <mi>x</mi><mn>2</mn>
      </msub>
      <mo>,</mo>
      <msub>
        <mi>x</mi><mn>3</mn>
      </msub>
      <mo>)</mo>
    </mrow>
</math>

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mover>
    <mi>y</mi>
    <mo>&rarr;</mo>
  </mover>
  <mo>=</mo>
    <mrow>
      <mo>(</mo>
      <msub>
        <mi>y</mi><mn>1</mn>
      </msub>
      <mo>,</mo>
      <msub>
        <mi>y</mi><mn>2</mn>
      </msub>
      <mo>,</mo>
      <msub>
        <mi>y</mi><mn>3</mn>
      </msub>
      <mo>)</mo>
    </mrow>
</math>

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mover>
    <mi>z</mi>
    <mo>&rarr;</mo>
  </mover>
  <mo>=</mo>
    <mrow>
      <mo>(</mo>
      <msub>
        <mi>z</mi><mn>1</mn>
      </msub>
      <mo>,</mo>
      <msub>
        <mi>z</mi><mn>2</mn>
      </msub>
      <mo>,</mo>
      <msub>
        <mi>z</mi><mn>3</mn>
      </msub>
      <mo>)</mo>
    </mrow>
</math>

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mi>T</mi>
  <mo>=</mo>
  <mfenced open='(' close=')' separators=''>
    <mtable>
      <mtr>
        <mtd><msub><mi>x</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>p</mi><mn>1</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><msub><mi>x</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>p</mi><mn>2</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><msub><mi>x</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>p</mi><mn>3</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><mn>1</mn></mtd>
        <mtd><mn>1</mn></mtd>
        <mtd><mn>1</mn></mtd>
        <mtd><mn>1</mn></mtd>
      </mtr>
    </mtable>
  </mfenced>
</math>

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


<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mi>T</mi>
  <mo>=</mo>
  <mfenced open='(' close=')' separators=''>
    <mtable>
      <mtr>
        <mtd><msub><mi>x</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>p</mi><mn>1</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><msub><mi>x</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>p</mi><mn>2</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><msub><mi>x</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>p</mi><mn>3</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>1</mn></mtd>
      </mtr>
    </mtable>
  </mfenced>
</math>

You compute:  

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mi>O</mi>
  <mo>=</mo>
  <mfenced open='(' close=')' separators=''>
    <mtable>
      <mtr>
        <mtd><msub><mi>x</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>1</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>1</mn></msub></mtd>
        <mtd><mn>0</mn></mtd>
      </mtr>
      <mtr>
        <mtd><msub><mi>x</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>2</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>2</mn></msub></mtd>
        <mtd><mn>0</mn></mtd>
      </mtr>
      <mtr>
        <mtd><msub><mi>x</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>y</mi><mn>3</mn></msub></mtd>
        <mtd><msub><mi>z</mi><mn>3</mn></msub></mtd>
        <mtd><mn>0</mn></mtd>
      </mtr>
      <mtr>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>1</mn></mtd>
      </mtr>
    </mtable>
  </mfenced>
</math>

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mi>E</mi>
  <mo>=</mo>
  <mfenced open='(' close=')' separators=''>
    <mtable>
      <mtr>
        <mtd><mn>1</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><msub><mi>p</mi><mn>1</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>1</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><msub><mi>p</mi><mn>2</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>1</mn></mtd>
        <mtd><msub><mi>p</mi><mn>3</mn></msub></mtd>
      </mtr>
      <mtr>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>0</mn></mtd>
        <mtd><mn>1</mn></mtd>
      </mtr>
    </mtable>
  </mfenced>
</math>

<math xmlns='http://www.w3.org/1998/Math/MathML' display='block'>
  <mi>V</mi>
  <mo>=</mo>
  <mi>O</mi>
  <mo>&sdot;</mo>
  <mi>E</mi>
</math>

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

