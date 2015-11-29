---
title: "BowTie Review"
tags:
  - webdev
  - review
---

I was recently asked what I think of [BowTie][0], as a 
user of jekyll. Now my avid readers may know (yes you two), [I don't use 
jekyll anymore][1]. But generally I like the core concept of static website;
since they are way more efficient. So I took a look around and sized up BowTie.

BowTie is basically a managed jekyll website. They provide git hosting of the 
site and automatically build and deploy a copy, once the changes hit the central
repository. This all sounds similarly to Githup Pages, except for commercial use.
Additionally to these basic features, they have always on SSL, a payment/paywall,
user management, front end templeting, analytics and an email service. This
to the tune of $5-$82 per month.

**BowTie very elegantly solves a problem ...**

**... that nobody has.** 

<!--more-->

The key issue to remember here is, this is a [jekyll][2] hosted service, with 
git support and all. We are talking here about people that are sufficiently tech
savvy to use markdown, the command line and git. Not entirely hard core 
developers, but no novices either. 

If they invested sufficient time to build a jekyll site, they probably took some
time and effort to think about deployment. One of the easiest and cheapest 
deployment options is s3sync and if you combine this with Wercker, any hosted
service becomes obsolete. If github private repositories costs you $7 (optional)
and S3 hosting a couple cents, there is little benefit in paying $30.

Furthermore the "unique selling points" of BowTie are either useless or 
available for little money. 

Always on SSL is basically nonsensical for a static website. You are handling
publicly available information, encrypting it on the communication channel 
makes little sense. 

Paywalls and user management makes little sense in combination to static sites;
any service that is actually worth paying for has some interactive component,
save porn.

The "dozens of static components and templates" for your front end design 
appears to just be bootstrap. Any web designer worth his salt can either deploy
bootstrap or build his own design.

In the presence of Google Analytics, any other service is nice to have, but 
only at the same price point as Google Analytics.

Lastly, bundling an email service seems odd. The key issue here is that if,
you are going to do proper customer management, you won't stop at email. 

But this is not really the elephant in the room. This service tries to be 
easy to use, for the less technically savvy. But in the presence of services like
[Square Space][3], BowTie makes so little sense. Either you belong to the group
of people that are sufficiently technology savvy to use jekyll and BowTie is a
waste of money or you belong to the group of people that need further hand 
holding and BowTie is overcomplicated. 

[0]: https://bowtie.io
[1]: /2014/12/02/overhaul-of-page-generation.html
[2]: http://jekyllrb.com/
[3]: http://www.squarespace.com/
