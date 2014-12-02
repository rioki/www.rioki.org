---
layout: post
title: "Code Reviews"
tags:
    - coding
    - quality
---

I will take a bold stance, experienced and dedicated programmers do not need 
code reviews. The reason is simple, they produce the cleanest and safest code
you can imagine by pure virtue of caring for their craft and taking pride
in their work.

I recently read a [not so good][1] opinion on the subject. The line that most 
struck me was when it mockingly states that the original Unix developers 
did not do code reviews. But to me, the bold statement "We were all pretty good coders." 
rings so true. I have seen great developers produce great code 
that no amount of code review could make better. But there must be some truth 
to all those quality improving precipices handed to us over the decades? 

<!--more-->

At the end of [said article][1] was a reference to a [more refined opinion on 
the subject of code review][2] that redeemed my opinion on the subject. The 
basic gist of the article is that the main benefit of code reviews is not 
the fact of finding bugs, but someone else is looking at the code. The first 
effect being that someone else learns to know the code better and as a result
this knowledge can help when filling in. The other is the fact that the review
requires the developer to think about other people reading his code and as
a result will create more readable and better documented code. (Think about
enforcing coding guidelines.) But nevertheless, code reviews basically address 
situations where developers don't do the best job they can. Code reviews are 
the ultimate weapon to weed out or keep in line rogue developers.

In a perfect world I would be working with a small team of dedicated developers.
No code ownership and frequent and open communication creates an atmosphere
of trust and knowledge. In this perfect world systematic code reviews are 
a waste of time. A certain amount of code review is still done, since everybody
sees all the code and bits of code that are not optimal get refactored into 
something optimal.

I admit that a certain amount of scrutiny should be placed on developers
who join a group. Code reviews are a good way to evaluate the new developers 
skill and build (or destroy) trust in what he does. 

It has become a industry wide trend to review every line of code that gets into
the code base, preferably before committing the changes. I think that this 
practice is a waste of time (and thus money) and misses the point. The code 
review tries to serve as quality gate that weed out bad code. But the real 
issue is that bad code was written in the first place. The real problem is
that many companies employ novice to medium programmers without really knowing
it. This mentality that monkeys with IDEs will create great software, 
if only the process is right is complete and utter nonsense. Especially, 
since they follow the reasoning that two monkeys doing code review will improve 
their code. Bannana! 

Code reviews only work in two situations: Either an experienced developer looks
over the code of a novice developer to find any deficiencies or the
novice developer looking over the code of an experienced developer to learn 
style and tricks. 

Code reviews have their place in a developers toolbox. But it would rather help
if companies would focus more on talent and less on process. 

[1]: http://blogs.sas.com/sasdummy/index.php?/archives/264-Are-you-too-good-for-code-reviews.html
[2]: http://scientopia.org/blogs/goodmath/2011/07/06/things-everyone-should-do-code-review/

