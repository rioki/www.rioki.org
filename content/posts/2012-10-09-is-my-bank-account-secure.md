---
layout: post
title: "Is my Bank Account Secure?"
tags:
    - security
---
It is now starting to become common knowlage that, [the longer your password
is][1] the [harder it is to crack][2]. This has mostly to do with the fact that
the bruteforcing the takes longer and [rainbow tables are infeasible][3] at a 
certain size.

To log into my online banking account I need the following information. 

* the banch id (3 numbers)
* my account number (8 numbers)
* my PIN (6 numbers)

The banch id and account number can be read of my checking card or a bank slip,
so we assume that this information is available to an attacker. The only 
security between the atacker and my bank account is the 6 digit PIN. 
Is the security of my bank from the dark ages?!? 

<!--more-->

Actually no that is not the case, the security model at my bank is fundamentally
different from that of any website. But to understand this you first have to look
at the treat posed to most websites. 

One of the biggest flaws people have with passwords is that they can only remember
a few passwords and thus [use one for each and every service they use][4]. This password
is probably reasonably safe, since most websites require a certain level of 
complexity. So let us assume that you visit a small forum you give them
your email address and your password. The password is (hopefully) stored 
in hashed form. 

Unfortunatly the security at that site was not so great and an attacker was 
able to retrive the user database. Now what the attacker has are a bunch of
email addresses (not bad in itself) and associated hashed passwords. The attacker
can not do much with the hashes themselves, though. What the attacker wants 
are the passwords and for that he needs to crack the hash. But since the hashing 
can only be one one way he needs either brute force the hash by trying all 
possible passwords and look if the hash matches or use a big table containg hashes
and associated passwords. It becomes clear why a short password is of a 
disadvantage. In the brute force aproach more characters means increasing 
complexity and runtime. With rainbow tables, it does not get better, 
each character adds exponential data and after a certain size of password, for
example for alphanumeric, digits, mixed case and special characters at 14 chars
you need 64GB for a NTLM table.

Now that the attacker has your email address and one password you use, he will
try to log into your email account with that password. Like I said, many use 
one password for everything. If this succedes the atacker has access to almost
all the services you use. All he needs to do either try the password or 
go though the account retrival process. Free shoping at amazon or itunes. 
Probably just your email address as a spam source is sufficent. 

Ok back to my bank. There are a number of significant differences.
The biggest is that, if the bank server gets hacked, the attackers are not 
interested in your account, they can do almost anything and that is very bad. 
It is so bad that banks are very mindful about security. 

The second aspect is that the PIN was randomly generated and I can't change it. 
This prevents the obvious human flaws like date of birth or one password for 
all services. 

The third aspect is that you only get three tries, then access is permanently 
denied. After that I need to turn up in person with a photo id at my branch 
to unlock it again.

The fourth is that you can not do much with only the PIN. Ok you can see how 
much money I have and what transactions I did. This might be interesting
if you try to impersonate me, but apart form that not much harm. The thing
is that each action requires to be clared with a TAN. That TAN is unique, random
and asked for only once and that is why I regualrly get a block of TANs in the 
mail. 

The only real vulnerability is a successfull man in the middle attack, but
in that case password complexity is irelevant.

[1]: http://xkcd.com/936/
[2]: http://howsecureismypassword.net/
[3]: http://www.codinghorror.com/blog/2007/09/rainbow-hash-cracking.html
[4]: http://xkcd.com/792/
