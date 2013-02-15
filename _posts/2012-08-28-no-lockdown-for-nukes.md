---
layout: post
title: "No Lock Down for Nukes"
tags:
    - security
---

I recently have seen a very good presentation by Cory Doctorow, 
[The Coming Civil War over General Purpose Computing][1]. It is worth
reading / watching for many reasons. In this presentation he mentions that
it may make sense to look down hardware used at nuclear power plants with a [TPM][3].
That is only allowing the computers to run software signed by the 
[Nuclear Regulatory Commission][2].

<a href="http://en.wikipedia.org/wiki/File:TPM_Asus.jpg"><img src="/images/tpm.jpg" /></a>

Actually I think this is a totally bad idea, and for totally different reasons 
that Cory Doctorow. At first it sounds like a good idea.
Anyway, every line of code that runs in a nuclear power plant in the US must be 
approved by the NRC. This is true for most other countries, some regulatory body
needs to approve what runs in nuclear power plants; actually in most industrial 
installations. Basically, I think this is a good idea and I want the TÜV to 
crack down on bad code at the nuclear power plant 30 km away and the oil 
refinery down a few blocks from my work.

<!--more-->

The problem that I have with using a TPM that allows only running approved 
software by the regulatory body, is that it creates a false sense of security. 
The thing with industrial installations is that each and every one is unique. 
Sure most modern fission reactors share the basic setup, but each and everyone
is unique in small ways. The size of the coolant tank can be different, the inputs 
and outputs of the SPS are mapped differently or different sensors are used. 
Taking a program from one plant and putting it on a different plant will not 
magically make it run properly.

The attack vector is clear, take an approved program from one plant and install
it on a different one and all goes BOOM. All you can hope for is that the 
physical safeguards prevent a major catastrophe. 

The remedy is simple, install one key and only allow to run software that was
signed by this key. This ensures that only the software that was intended to run
on that plant and only that plant can run on it. Now you only need to ensure the
safety of one key.

[1]: http://boingboing.net/2012/08/23/civilwar.html
[2]: http://en.wikipedia.org/wiki/Nuclear_Regulatory_Commission
[3]: http://en.wikipedia.org/wiki/Trusted_Platform_Module
