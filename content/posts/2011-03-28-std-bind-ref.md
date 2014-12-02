---
layout: post
title: "Solving the Reference to Reference Problem with std::bind"
tags:
    - coding
---
Now let's pretend you have a class called `Screen` and a few classes that 
are derived from a class called `Widget`. Each have a method called `draw`
that takes a class `Canvas` as reference. It is the task to draw the screen
and each widget onto the canvas. The basic algorithm is stupidly simple, do some
setup for the screen and call draw with the canvas for each widget.

<!--more-->

If you are using a `std::vector` you can use a simple for loop:

    Screen::draw(Canvas& canvas) const
    {
        // some setup
        for (unsigned int i = 0; i < widgets.size(); i++)
        {
            widgets[i]->draw(canvas);
        }
    }

But if you start having many widgets using a `std::vector` is not such a good 
idea, since you must guarantee continuous segment of memory. Although often not 
a real deal, you should use a `std::list` for your widgets. Now you need to 
change the code to using iterators:

    Screen::draw(Canvas& canvas) const
    {
        // some setup
        std::list<Widget*>::const_iterator iter = widgets.begin();
        while (iter != widgets.end())
        {
            (*iter)->draw(canvas);
        }
    }

Boy this double indirection looks awful, doesn't it. Additionally the explicit 
looping is kind of cluttered. Why not use the handy functional programming
that C++ give us. Like so:

    Screen::draw(Canvas& canvas) const
    {
        // some setup
        std::for_each(widgets.begin(), widgets.end(), 
            std::bind2nd(std::mem_fun(&Widget::draw), canvas));
    }

Now this is straight forward and relatively elegant. To bad it fails to compile.
The error message is that the compiler can not convert `Canvas&` to 
`const Canvas&`.

If you search the web, you will find many posts lamenting the problem that 
was already described by Herb Sutter: the reference to reference problem. The 
main issue here is that the signature for `bind2nd` is something like

    template <typename Fun, typename Arg>
    binder2nd<Fun, Arg> bind2nd(Fun fun, const Arg& arg);

The obvious problem here is the use of a constant reference, which is quite 
unfortunate for us. If you read on, many posts will either send you to 
`boost::bind` or `std::tr1::bind`. Since I happen to use [sigc++][1] I may also
add `sigc::bind` to the mix of options. But the end result is about the same, they
all build on the same basic implementation scheme. The change to the code is
minimal:

    Screen::draw(Canvas& canvas) const
    {
        // some setup
        std::for_each(widgets.begin(), widgets.end(), 
            sigc::bind(std::mem_fun(&Widget::draw), canvas));
    }

This still looks quite pleasant. The bad news, this code also does not compile. 
This time the error message is that the compiler can not convert `Canvas&` to
`Canvas`. 

But wait wasn't `xxx::bind` supposed to solve the problem? Well technically 
`xxx::bind` can solve the problem, the remaining problem is that the compiler 
fails to determine the correct type to use. This is one of the few cases where 
you need to enforce the correct template type. So let's look at the signature of
`sigc::bind`:

    template <typename Fun, typename Arg>
    binder2<Fun, Arg> bind(Fun fun, Arg arg);

Please note that it is strongly simplified version, for the sake of argument. 
The added complexity is for other features that are irrelevant here. 

So this is simple, just change the code to explicitly specify the argument type: 

    Screen::draw(Canvas& canvas) const
    {
        // some setup
        std::for_each(widgets.begin(), widgets.end(), 
            sigc::bind<???, Canvas&>(std::mem_fun(&Widget::draw), canvas));
    }
    
Well to bad, we need to specify the first argument too, which is the type of 
functor. So what is the type of the functor that is created with 
`std::mem_fun(&Widget::draw)`? Honestly, I don't want to know and it should 
be my compiler's job to determine that, since this is the entire point of 
generic programming. 

Ok I give up, that loop did not look so bad...

Stop, there is a quite simple solution, reverse the arguments. For this
we need to write the binder on our own, just like so:

    template <typename Fun, typename Arg1>
    struct binder2nd
    {
        Fun fun;
        Arg1 arg1;

        binder2nd(Fun f, Arg1 a1)
        : fun(f), arg1(a1) {}
        
        template <typename Arg0>
        void operator () (Arg0 arg0)
        {
            fun(arg0, arg1);
        }
    };

    template <typename Arg1, typename Fun>
    binder2nd<Fun, Arg1> bind2nd(Fun fun, Arg1 arg1)
    {
        return binder2nd<Fun, Arg1>(fun, arg1);
    }

Now we just need to write the draw method just like so:

    Screen::draw(Canvas& canvas) const
    {
        // some setup
        std::for_each(widgets.begin(), widgets.end(), 
            bind2nd<Canvas&>(std::mem_fun(&Widget::draw), canvas));
    }

I chose to use the `std::bind2nd` syntax, since it is simpler than 
`xxx::bind` and does the job for me. You may use my code snippet as you like and
changing it to a `bind1st` is as trivial as swapping `arg1` and `arg0`. Now you 
can bind as many references as you like.

[1]: http://libsigc.sourceforge.net
