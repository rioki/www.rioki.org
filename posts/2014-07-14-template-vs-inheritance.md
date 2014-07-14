---
title: "Template vs. Inheritance"
tags:
    - programming
    - cpp
    - theory
---

I was asked the following question:

> Bjarne said "It's usually a mistake to express parametrization of a class and 
> its associated functions with a type using inheritance. It's best done using 
> templates..." but why?? what's wrong with using inheritance??

Oddly enough I never thought about the issue and used templates and inheritance 
purely on an intuitive level. But now I am forced formulate the difference, 
where each is applicable and where each falls down.

To show the difference I will use two examples that are clearly at home in their 
respective implementations.

The first is the well trodden shapes example:

<img class="img-responsive" src="/images/2014-07-14-shapes.png" alt="The classical example if inheritance: shapes" />

The other is are multidimensional vector as implemented in [glm]:

<img class="img-responsive" src="/images/2014-07-14-vector.png" alt="The classical example if templates: vectors" />

What makes the use cases so different? 

<!--more-->

First you must realize what inheritance means. Classically public inheritance is 
generally "is a" relationship. (I will ignore protected and private inheritance 
because that is normally not used and rather a glitch of C++.) The shape example 
shows that quite well, the cube is a shape and the circle is a shape. 

On the other hand the 2d vector is a special case a vector. If there where not 
templates in C++ the logical implementation would be blatant duplication by
implementing different classes, one for each variant.

The important bit from a programming standpoint is, does it make sense to handle 
different  variants through a common base class. In the shape example the bare 
minimum we want to do to a shape is calling the draw method. With the vectors 
this is the opposite, vectors of different sizes need to be converted to common 
size before anything meaningful can be done with them.

To illustrate this point I will invert the implementation. 

<img class="img-responsive" src="/images/2014-07-14-vector2.png" alt="Vectors implemented with inheritance." />

Although you may come up with a better idea, this rough sketch illustrates the
problem. Since the code needs to accommodate multiple types, `bool`, `int`,
`unsigned int`, `float` and `double` to be exact, you can see that there is no
common storage technique. This makes the base class `vector` basically 
meaningless. If I restricted the scalar type to only `float` there may be some
use to a base class. I could also allow variable size vectors, but then all 
variance is in the algorithm and there is only one class. (For N sized vectors 
you can see [uBLAS's implementation][1].)

No matter how you spin it the code is clunky and everywhere you need to check 
for the size. If you want to deduplicate the + operator, for examples you need 
to write something like:

    vector operator + (const vector& a, const vector& b)
    {
        size_t new_size = max(a.size, b.size);
        
        // new memory is allocated on the heap
        vector result(new_size); 
        
        for (unsinged int i = 0; i < new_size; i++)
        {
            // guard against out of bounds access
            float ai = i < a.size : 0.0f;
            float bi = i < b.size : 0.0f;
            result[i] = ai + bi;
        }
        
        return result;
    }
    
Although this does not look so bad, the variable vector size requires a allocation
on the heap for each operation. In addition, since the vectors may be of different
size, each access must be checked and guarded. 

Compare that to the version using templates:

    template <typename T, size_t N>
    vector<T, N> operator (const vector<T, N>& a, const vector<T, N>& b)
    {
        vector<T, N> result;
        
        for (unsinged int i = 0; i < N; i++)
        {
            // you may use v[i] directly, we know i < N
            result[i] = a[i] + b[i];
        }
        
        return result;
    }

Not only is the templated version slightly more concise, it is also way more 
efficient. The memory is on the stack and since the loop is of constant size,
determined at compile time, the compiler may unroll the loop if it thinks it 
gets a performance benefit. The only minor downturn is the fact that the 
executable gets larger, since each and every variant is compiled.

<img class="img-responsive" src="/images/2014-07-14-shapes2.png" alt="Shapes implemented with templates and traits." />

Coming up with an idea how to implement the shapes with a template was not 
trivial. I settled on the basic concept of using traits to encapsulate behaviour
into a template environment. 

The first problem here is clear, there is no simple way implement the different 
attribute sets between the different shapes. One solution could have been that
the traits define a typedef to a struct that contains the attributes and 
instantiate this in the body of the `Shape` class. But I opted in this case in 
the least common denominator aproach, having a `vec2` with a size. The circle 
is simply contained in a virtual rectangle defined by size 
(i.e. `min(size[0], size[1])`).

The other obvious problem now is that you can not have a bunch of shapes and 
draw that. You can have a bunch of circles and a bunch of rectangles and
draw each respectively, but no mixing.

For me the basic rule is as follows:

**If you have the same algorithm, but with different types and sized, use 
templates. If you have multiple types you want to handle though a common 
interface, use inheritance.**    

[glm]: https://github.com/rioki/glm/blob/master/src/vector.h
[1]: http://www.boost.org/doc/libs/1_55_0/libs/numeric/ublas/doc/vector.htm#vector