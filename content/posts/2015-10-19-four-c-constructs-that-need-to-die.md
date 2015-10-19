---
title: "Four C Constructs That Need To Die"
tags:
  - programming
  - cplusplus
---

C++'s compatibility to C is the key feature that got it off the ground. It also
makes integrating C libraries into C++ astoundingly easy; which again is 
key, because all the really interesting libraries are written in C. But if you
program C++ there are a few constructs that just need to be purged from
any code base. Here are four constructs that have no place in proper hight level
C++ code.

Linked Lists
------------

**Bad Code:**

    struct FooNode
    {
        Foo      value;
        FooNode* next;
    };
    
    FooNode* foos = new FooNode;
    foos->next = nullptr;
    
When learning basic algorithms and data structures, the linked list is one 
of the first construct you learn. The linked list is also the backbone of many 
containers. The key problem here is, that using it directly is error prone. 
Unless wrapped in clear access functions, adding and removing items quickly 
become problematic code. For example, since you are always holding single 
elements, you never know if you are actually holding the root element and 
can never be sure if you can just delete the element.

**Good Code:**

    std::list<Foo> foos;
    
I strongly urge the use of standard containers. Yes the iterator interface is 
not pretty, but by now everybody has understood it. Using containers 
is just stupidly simple and since you can choose from the 3 basic containers
'vector', 'list' and 'deque' you get all performance characteristics you like.
In addition you also get the simplified wrappers 'stack' and 'queue', for even
more convenience. 

Dynamic Arrays
--------------

**Bad Code:**

    size_t fooCount = 23;
    Foo*   foos     = new Foo[fooCount];
    
    delete [] foos;
    
Dynamic arrays have all the problems of raw pointers with the added uncertainty 
of what size they are. A real design flaw in C++ is the fact that you can't 
see from a pointer is it actually points to one element or multiple. Finally the 
array delete operator is or rather lack lack of one, is a perpetual source of 
memory leaks.

**Good Code:**

    size_t fooCount = 23;
    std::vector<Foo> foos(fooCount);
    
The vector class actually makes almost all uses of dynamic arrays obsolete. 
It solves three problems very elegantly, it ensures strict ownership, always 
know how many elements it contains and will always call the proper delete 
operators. In addition the vector class also implements efficient resizing, 
buy you should not do often, so... 
    
Static Arrays
-------------

**Bad Code:**

    #define FOO_COUNT 23
    Foo foos[FOO_COUNT];

Static arrays are generally a bad idea for entirely different reasons than 
dynamic arrays. Sure you can still get the count wrong, but the key issue is 
that in almost all uses they are really inefficient and just inflexible. Ever 
wonder why Windows restricts directory paths to MAX_PATH(260) chars? Because 
the path handling functions in windows use a static character array. Most 
static arrays are a ballpark number of a reasonable maximum element count. But 
in the general case you will not use that many. This is additionally compounded 
with the fact that most static arrays are used on the stack, quickly eating 
up stack space.

**Better Code:**

    std::array<Foo, 23> foos;
    
The use of the array class solves the issue with many programing pitfalls. By
using standard container semantics, you will seldom program a buffer overrun.    

**Good Code:**
    
    std::vector<Foo> foos;
    foos.resize(incomingFooCount);
    
By using the vector class the memory is moved from the stack to the heap. In 
addition the vector class allows to use exactly the amount of required values 
and thus reduces the overall memory need for the application.
    
Raw Strings
-----------

**Bad Code:**

    const char* name = "Initial";
    char* output = new char[strlen(name)];
    strcpy(ouput, name);
    
Using raw stings has all the issues of dynamic arrays, since they are
dynamic character arrays. The C standard has developed a class of functions to 
work with strings, which alleviates many smaller issues. 

But my primary issue with manipulating strings, is that the code just is not 
readable. Not only do you need to track the memory used, you also have this 
amalgamation of function calls for simple operations, such as assignment or 
concatenation. 
    
**Good Code:**

    std::string output = "Initial";
    
The use of the string class solves almost all readability issues. I will concede 
that 'string' is not efficient, but neither is your C string manipulation code.
(Efficient string manipulation is a different topic.)
    
Honorable Mentions
------------------

There are two constructs that I strongly discourage the use of, but still have
some valid use in modern C++ code. These are raw pointers and unions. Finally 
you should not use 'goto' or 'longjmp', even in C code. 

