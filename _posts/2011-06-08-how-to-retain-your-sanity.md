---
layout: post
title: "How to retain your sanity"
tags:
    - sanity
    - coding
---

... while writing software. 

Over the years I have keep a set of functions that moved from one project to the next. 
These where small functions that served the sole process of retaining my own sanity. 
After feeling the need to use these functions in two of my free software projects, 
I decided to encapsulate them in a small library called [sanity][1].

<!--more-->

These functions come in two flavors, trace functions and check functions. 

The trace functions are quite simple. The actual function is masqueraded by a macro 
that hides the gitty details. The macros are TRACE_ERROR, TRACE_WARNING, TRACE_INFO 
and TRACE_DEBUG and take just a string. The macros amend the severity and the current 
function. By calling add_trace_target you can add a stream to which the output is 
directed. The function takes the minimum severity as additional parameter, so it is 
possible create different logs with different severities. 

The check function are a set of extended assert functions based on the concepts of 
design by contact. As with the trace functions, the check functions are wrapped by 
macros. The macros are ENSURE, ASSERT, REQUIRE and FAIL. All functions, but FAIL take 
one condition that must be true to pass the test. If the condition is not true an 
exception is raised. The FAIL function can be used in cases where the control flow of 
the program reaches a situation that should not occur, such as the default case of a 
switch statement. 

For convenience CHECK_ARGUMENT exists. This is a check function that can be used as 
shorthand for argument checks. If the check fails, a std::invalid_argument exception 
is throw. 

Since all functions are macros, they can be removed by conditional compilation, 
although this is not yet implemented.

[1]: http://github.com/rioki/sanity
