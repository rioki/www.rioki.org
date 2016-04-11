---
title: "Digital Ocean - a Breath of Fresh Air" 
tags:
  - cloud
  - digitalocean
---

<img src="/media/digitalocean/DO_Logo_Vertical_Blue-2c654e19.png" class="img-responsive">

I recently came across [Digital Ocean][1], when [researching wrecker deploy to AWS EC2][2].
I had to try it out and was amazed at how simple and bountiful it is. I have
been using the service for an experimental project for about a month now 
and have not regretted trying it out. 

The tl/dr version is Digital Ocean is like AWS EC2, but with a nicer UI
and cheaper. 

<!--more-->

Like all new and hip start up companies they have their own language. But the 
only term you really need to get is "droplet". This is one server instance,
the rest is quite standard.

<img src="/media/digitalocean/do1.png" class="img-responsive">

Droplets range from 512 MB RAM / 1 CPU / 20 GB SSD / 1000 GB network for 5$ per 
month to 64 GB RAM / 20 CPUs / 640 GB SSD / 9 TB network for 640$ per month. 
Digital Ocean has hourly and monthly rates for the droplets. The monthly rates
are nice, since it gives you a higher degree of predictability.

When creating the droplet you get the option to install a stock operating system 
or "one click Apps". The operaing systems available are:

<img src="/media/digitalocean/do2.png" class="img-responsive">

Each have multiple versions available. The "one click Apps" are currently:

<img src="/media/digitalocean/do3.png" class="img-responsive">

Alternatively you can create a snapshot of an existing server and then 
launch a new droplet based on that. Unlike EC2, as far as I can tell,
you can't import images. Then again, this was never really a feasible task.  

The droplets can be housed in 7 data centres around the world, currently this is:

<img src="/media/digitalocean/do4.png" class="img-responsive">

You can add additional services to your droplet, such as:

* Private Networking
* Backups
* IPv6
* User Data

The Private Networking feature is basically a VLAN / Firewall solution that
isolates your droplets from the public internet. This is solved in software via 
IPTables. 

The Backup feature provides backups with the last 4 states that you can use
in case of a catastrophic crash. It costs 20% of the running instance.

The IPv6 feature obviously associates you not with an IPv6 address.

The User Data feature are just custom data that you can associate with your 
droplet. 

This is all configured via a very simple to use interface, that makes launching
droplets almost fun.

Additionally to droplets, Digital Ocean provides three networking services:

* Floating IPs 
* Domains 
* PTR Records

The Floating IPs feature enables to have a fix IP address with varying servers 
behind it. This may be needed when implementing a high availability service;
since waiting for DNS to catch up may take a while.

The Domains feature is basically a DNS server. The key feature here is that 
the domains are associated to droplets. This if a droplet restarts and gets a
new IP address, this is automatically handled. Digital Ocean does not provide
domain name registration, so you need to tell your registrar that the DNS server 
for your domain is hosted by Digital Ocean.

The PTR Records are reverse DNS records. This is an ancillary to the domains 
feature.

Finally, not only is the interface nice and easy to use, Digital Ocean provides 
an HTTP API to manage your cloud.

All in all I like the service way more than EC2. AWS is a mess when it comes
to administering it and Digital Ocean is a breath of fresh air.

[1]: https://www.digitalocean.com/
[2]: http://blog.wercker.com/2013/08/22/Simplifying-ssh-based-deployment.html