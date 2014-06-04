---
layout: post
title: "DCPU-16 Simulator and Assembler"
tags:
    - dcpu16
---

So [Notch] is launching a new game called [0x10c] and it is a space exploration 
game. It would be an understatement that I am totally thrilled about that 
development. A classical game along the lines of elite with a modern cote of 
paint, is just what we need. Especially from the financially independent 
developer [Mojang].

One of the twist about it all is that the game features a freely programmable
16 Bit CPU. Since I had not dabbled in compiler and interpreter development
for a while, I was thrilled to take up the challenge and develop a assembler and
simulator. As an added challenge I decided to only a plain text editor and 
vanilla C. 

<img src="/images/dcpu16-chalange.png">

<!--more-->

## DCPU-16 Specification

The DCPU-16 is the aforementioned CPU. Notch wrote a specification that can be 
found at [http://0x10c.com/doc/dcpu-16.txt]. The specification is kind of 
sketchy, but what do you expect; it is a game. (I would probably not write more
in the same situation.)

The basic outline of the CPU can be summarized as:

* 16 bit words
* 0x1000 words of RAM
* 8 general purpose 16-bit registers (A, B, C, X, Y, Z, I, J)
* 3 special 16-bit registers (PC, SP, O)

The CPU knows 15 "basic" instructions:

* SET a, b - sets a to b
* ADD a, b - sets a to a+b, sets O to 0x0001 if there's an overflow, 0x0 otherwise
* SUB a, b - sets a to a-b, sets O to 0xffff if there's an underflow, 0x0 otherwise
* MUL a, b - sets a to a*b, sets O to ((a*b)>>16)&0xffff
* DIV a, b - sets a to a/b, sets O to ((a<<16)/b)&0xffff. if b==0, sets a and O to 0 instead.
* MOD a, b - sets a to a%b. if b==0, sets a to 0 instead.
* SHL a, b - sets a to a<<b, sets O to ((a<<b)>>16)&0xffff
* SHR a, b - sets a to a>>b, sets O to ((a<<16)>>b)&0xffff
* AND a, b - sets a to a&b
* BOR a, b - sets a to a|b
* XOR a, b - sets a to a^b
* IFE a, b - performs next instruction only if a==b
* IFN a, b - performs next instruction only if a!=b
* IFG a, b - performs next instruction only if a>b
* IFB a, b - performs next instruction only if (a&b)!=0

And so far one "extended" instruction:

* JSR a - pushes the address of the next instruction to the stack, then sets PC to a

## Gaps In the Specification

As I mentioned earlier, this is not the 
[Intel 64 and IA-32 Architectures Software Developer Manuals][IAM] and so
there are some unspecified issues.

## Processor Architecture

The most important issue that is not specified is what basic architecture 
the CPU has. There are two different CPU common architectures, the basic 
differences relate to how the handle data and the program.

The [Harvard architecture] has two memory areas, the instruction memory and the 
data memory. As a result you have the full amount of RAM for program data, but
on the other hand it is impossible or hard for the CPU to change the running
program.

[Harvard architecture]: https://en.wikipedia.org/wiki/Harvard_architecture

The [von Neumann architecture] uses one block of RAM and thus intermixes 
instructions and data. This has the advantage that operating systems can quite
flexibly change the program data, such as load new ones and remove old ones. 
The downside is that when writing the program you need to know where free memory
is. The commonly used PC architecture IA-32 and IA-64 is a von Neumann 
architecture.

[von Neumann architecture]: https://en.wikipedia.org/wiki/Von_Neumann_architecture

From the example program and the documentation, I deduced that the DCPU-16 is
a von Neumann architecture. But that might be wrong.

### CPU Initialisation

It is unclear what the CPU guarantees for an initial state. Is every thing zero
or undefined. The only obvious things are that PC is zero and SP is 0xFFFF. 
The RAM and the other registers are initialized to 0x0000. 

### Overflow

What rules are applied when registers overflow? It is somehow hinted that the 
normal registers will set O the modulo rule is applied. 

But more interestingly how is overflow on PC and SP handled? For PC and SP I 
assumed the following rule:

* In my current implementation PC wraps around, but is will walk the entire 
  memory first. 
* SP will trap if it goes out of bounds

### RAM Access out of Range

What happens if RAM is accessed outside of the valid range? Does the CPU trap or
is the value silently wrapped? I implemented a CPU trap for that.

### NOOP

The NOOP instruction is not defined. I simply assumed NOOP to match 0x0000, so
that the CPU does not trap when going over empty memory.

## Implementation

You can grab the source code, that I released under MIT licence, at my [d16 github 
repository][d16]. But if you are lazy, you can also grab the [binaries for Windows]. 

The first issue that I had to overcome was scanning the input. I decided to take 
a shortcut here and simply use a [flex scanner]. Writing a simple parser by 
hand is manageable, but a scanner borders on insanity or inefficiency. The 
scanner can be found in [scan.l].

The next step was the [parser]. This is a classical case of a recursive decent 
parser. I did not develop a formal grammar first, since that would have been 
overkill. The scanner runs line oriented, but does not enforce placement of
statements, like "real" assemblers do. To simplify the generation step, I also
encoded the argument value in the target format. 

Finally the [code generator] is the part that took the longest to develop. 
Especially since I had trouble understanding the encoding used for instructions. 
In retrospect the encoding is obvious, but the way the specification was worded
I ran off into the wrong direction. But the moment I could generate a binary 
equivalent of the example, the assembler was done.

The [CPU] was most fun to develop. This is the core piece and basically 
implements the DCPU-16 behavior. You can still see some of the issues I had
with the specification in the code. Especially the HARVARD_ARCH reveals that
I first went along the path to develop a Harvard architecture first. But after
reading some more into the 162 lines of the specification it dawned on me that
probably a von Neumann architecture was meant. 

## Going From Here

### Validation

As I am writing this I notice that I did not implement the O register. There 
are probably more things I did not do right, so effort should be invested in
validating and proofing the code.

*Update: Now I properly implemented the O register.*

### High Level Language

The next thing that must be done for the DCPU-16 is develop a high level 
language such and [NQC] \(not quite C\), so we can stop the assembly nonsense. 

### Solid

I had somewhat of a coders block on [Solid] and this was just the thing that
the doctor ordered. That you Noch!  

I do not know how much time I can and want to devote to d16, since my focus should
be on developing Solid. So let's see.

[Notch]: http://twitter.com/#!/notch
[0x10c]: http://0x10c.com/
[Mojang]: http://www.mojang.com/
[http://0x10c.com/doc/dcpu-16.txt]: http://0x10c.com/doc/dcpu-16.txt
[IAM]: http://www.intel.com/content/www/us/en/processors/architectures-software-developer-manuals.html
[d16]: https://github.com/rioki/d16
[binaries for Windows]: https://github.com/downloads/rioki/d16/d16-2012-04-08.zip
[flex scanner]: http://flex.sourceforge.net/
[scan.l]: https://github.com/rioki/d16/blob/master/scan.l
[parser]: https://github.com/rioki/d16/blob/master/parse.c
[code generator]: https://github.com/rioki/d16/blob/master/generate.c
[CPU]: https://github.com/rioki/d16/blob/master/cpu.c
[Solid]: /2012/03/16/solid-indev1.html
[NQC]: http://bricxcc.sourceforge.net/nqc/
