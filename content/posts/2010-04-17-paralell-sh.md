---
layout: post
title:  "Porting parallel.sh to MSys"
tags:
    - coding
    - bash
---

Ever wanted to process many files but your program is single threaded 
and your have multiple cores?  Well I wanted just that, process 1500 
files and I have a 8 core machine. The problem with bash scripts is that 
loops are executed in sequential order. You can process commands in parallel 
by appending & at the end of the script. The problem launching 1500 processes 
is a sure thing to kill your machine.

I tripped over this article: 
<a href="http://pebblesinthesand.wordpress.com/2008/05/22/a-srcipt-for-running-processes-in-parallel-in-bash/">A srcipt for running processes in parallel in Bash</a>. 
It is a really cool script with which you can execute commands in parallel.

I copied the script into my <a href="http://www.mingw.org/wiki/MSYS">MSys</a> 
installation. Guess what, it did not work. The problem is that it checks for 
*/proc/$PID*. Too bad that MSys does not have a */proc* file system.

So I changed the code to use *ps* and *grep*. Its probably not as effective, 
but it works on msys...

Download the modified script; <a href="/files/parallel.sh">parallel.sh</a>

