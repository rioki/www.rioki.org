---
layout: post
title: "Make mine Jekyll"
tags:
    - jekyll
    - meta
---

This site recently took a new turn technologically wise. I migrated it to Jekyll
for my CMS and this is the epic tale of how this came to be.

A long long time ago in on a website far far away I read the post 
[Google App Engine for indie developers][1] on the Wolfire blog. This post 
made me start to think about cloud based hosting for my website; especially 
since I am hopping that my hobby work on games will start to turn around.

<!--more-->

The basic gist of the post is that [Wolfire Games][2] occasionally are being 
slashdotted or digged (featured on Slashdot or Digg) and then the site better 
not be down for the astronomical load. The important part to remember here is
that in these moments your site gets the largest exposure it can get and when
the site is down this is nulled.

My current server is a very small hosted virtual server for 12 EUR. For the 
normal load of a few hundred visitors (split by 5 sites) my server is fully 
sufficient. Many websites basically can stay on the server because there are 
no load spikes to be expected. But what is with that website I want to use to 
feature my big next indy hit? (Yea, as if that is really going to happen...)

At first I looked at the [Google Apps Engine][3] as the post by Jeffrey from
Wolfire Games described. The Google Apps Engine is an interesting concept. You
are locked down to Python and Java and there you get a slim subset orienting 
around web applications. This is enhanced by Google's own distributed 
technologies. The real advantage is in the processing capacity that your get. 
The Google Apps Engine bring up as many instances of your application as needed. 
No only do you get the processing power required to adequately serve the load, 
also the load is distributed around the globe. This ensures a minimal refresh 
time for your website. And the best part is, it is relatively cheap.

I only looked into the python option, since that looked like the most attractive.
The Google Apps Engine borrows strongly from [Django][4]. Django is a incredibly 
well designed and compact web application framework that really nailed
the DRY (Do not Repeat Yourself) principle. The big difference is that the 
Google Apps Engine uses their own Datastore, instead of Django's SQL based 
data storage. This comes obviously from the strong distributed aspect that 
Django does not integrate.

The down part is that there are no CMS software for the Google Apps Engine that 
is up to par. As a result I started to write my own little CMS. But after two 
weeks I ditched it. I have so little time, I want to write games not web 
application software as a hobby!

As I favor [Drupal][5] as CMS for a LAMP architecture I looked at options for
distributing this. Unless you roll your own cloud/load balancing the only 
option is the [Amazon EC2][6] cloud. The Amazon EC2 cloud is not to dissimilar
to my visual server, each node in the cloud is a full virtual machine. The 
main difference is the pricing model and you can quickly bring up and shutdown
instances of your application. The only catch is that you need to do that on 
your own. This can of course be automated and Drupal has a few modules to help 
with this. But in the end you are looking into a very complex integration 
scheme. This is especially problematic because in the case of Drupal you must 
ensure a persistent database. To be honest, this even more complex than using 
the Google Apps Engine. In addition the Amazon EC2 cloud is relatively expensive,
in comparison to other hosting options.

As a result I decided, for the time being, to do nothing and open a bottle of
Champagne if I ever get slashdotted. Until I discovered [github pages][7]...

github pages on it's own is not such a remarkable service. The offer free 
hosting of static content for every github user. The clue is that they added 
Jekyll to the mix. Jekyll is a static CMS written by Tom Preston-Werner and 
is very well described by his blog post [Blogging Like a Hacker][8].

When I looked at what Jekyll could do, it struck me like a lightning bolt. My 
content is mostly static. My page has a few static pages that almost never 
change and a journal that updates around 2 times per month. Although the journal 
has a commenting feature, it does not receive many comments, save spam.

One thing I researched as I was implementing my site for the Google Apps Engine 
were comments. The biggest problem with the Google Apps Engine and 
authentication is how to implement it. You have 4 options: using Google user 
accounts, google apps accounts from one specific domain, OpenID or rolling your 
own. All options seem kind of heavy weight just for comments. At the time I 
discovered the [Disqus][9] service. They add comments to your page by 
integrating the feature through AJAX. By shifting the comments to Disqus my 
website can be 100% converted to static pages. 

Jekyll is great for a number of reasons. First, it ensures a consistent look of
your website by running the pages (fragments) through a template engine. Second,
it knows about posts and can aggregate them. Third, pages and posts can be 
written in light weight markup languages, such as textile or markdown. Finally,
by generating static content your HTTP server does exactly what it is intended 
to, server documents. This means that it can be massively distributed trivially.

I am now running my personal website off github pages. This gives me the added 
bonus that they can absorb traffic if I ever get slashdotted. But the real kick 
is that I can move my page to any service, being Google Apps Engine, Amazon EC2 
cloud or the next big thing in cloud computing, simply because my site requires 
no server side scripting. I probably still need to run a forum or wiki off 
a LAMP server, but this will almost certainly not be affected by such severe 
load spikes. 

The best thing about Jekyll is that it is so astronomically efficient. I used 
to boast that with Django or Drupal you could setup a site within a few days. 
The time was mostly spent templating with Drupal and coding with Django. But I 
got this site up and running within 2 hours. I spent one additional hour 
migrating my content and I was ready for launch.

If you are interested the "source code" for this website can be found at my
[rioki.github.com][10] repository.

[1]: http://blog.wolfire.com/2009/03/google-app-engine-for-indie-developers/
[2]: http://www.wolfire.com
[3]: http://code.google.com/appengine/
[4]: http://www.djangoproject.com/
[5]: http://drupal.org/
[6]: http://aws.amazon.com/ec2/
[7]: http://pages.github.com/
[8]: http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html
[9]: http://disqus.com
[10]: http://github.com/rioki/rioki.github.com
