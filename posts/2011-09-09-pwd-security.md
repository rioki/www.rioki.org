---
layout: post
title: "Passphrases are Stronger then Passwords."
tags:
    - securtiy
---

What is a good password? We all know the answer to this question. A good and 
thus safe password is long, has mixed case characters, number, special 
characters and is not a word in any language. On first glance this seems always
like a password that is hard to remember. If you want to check how good
your password is, there is a [nifty website for this][pwd]. 

If you follow these guidelines "dKmeoD2!kkdpoqaEs5" sounds like a good password,
but can you remember it? These "safe" passwords are really hard to remember. But
there are long passwords or rather passphrases that are easy to remember, such as
"Oh no! 2 nuns on the mountain.". Yes, this is a real sentence. But it fulfills 
all the requirements, mixed case, numbers, special characters and is not a word.

<!--more-->

Wait?! But there are words, and they they are from the English language? The 
important thing to remember is that, you are not supposed to use one (or two) 
word. When you have many words the benefit of a dictionary attack does not hold 
up. Lets examine a simple example, take a password with 6 characters and 6 words. 
There are roughly 100 characters that can be input with a standard keyboard and
lets take around 1.000 words that are commonly used. (There are more words in 
the English language, but we are using a conservative estimate here.) In the 
case of the password we are talking about 6¹⁰⁰ = 6.53×10⁷⁷ possible combinations 
versus 6¹⁰⁰⁰ = 1.42×10⁷⁷⁸. So even if the tacker knows you are using words and
the pattern for your phrase, the sentence is an order of an order of a magnitude 
better. 

One of the biggest advantages of using a passphrase instead of a password is 
that the passphrase is long. This is especially interesting since that determines
how hard the password is to crack. Since [Moore's Law][ml] is working against 
us in this case it is important, not to have passwords that are a few bits longer
but significantly more complex. 

Long passwords are especially important, because of the danger of a [rainbow 
table][rt] attack. This attack scheme works against the password hash, that was
retrieved using for example a [SQL Injection][si]. The rainbow table stores all
hashes for a given set of passwords. The attacker then just has to look up the
hash and then has the password. The caveat with rainbow tables is that they
are quite large and so they fit into memory only encompass a certain range, such
as passwords up to 6 characters. The important bit to remember is that a 
successful attack is constant time effort, but once your password is to complex
the attack needs to fall back on a rather brute force attack.  

[pwd]: http://howsecureismypassword.net/
[ml]: http://en.wikipedia.org/wiki/Moore%27s_laww
[rt]: http://en.wikipedia.org/wiki/Rainbow_Table
[si]: http://en.wikipedia.org/wiki/SQL_Injection
