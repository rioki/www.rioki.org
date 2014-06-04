---
layout: post
title: "What Cloud?"
tags: 
    - cloud
    - rant
---

Cloud computing is now becoming mainstream. But what is cloud computing? 
Actually it is noting, it's just a buzzword that is used for different 
concepts. 

<!--more-->

Google Docs, Office 365 and Windows Live
----------------------------------------

There are many so called cloud services. Some call them software as a service,
but if you think about it these are just web applications. True they are quite
complex web applications, built to mimic desktop applications, but they still
are loaded from a web server and running in the browser. Chances are, they are
running on some large server farm, let's call it a cloud for now and that is 
needed to handle all the client requests. Are you tapping into the awesome power 
of the cloud? Not really, 95% of the application is running in your browser on
your machine. The only advantage you get is that the data is stored on some
server and you have access to it from anywhere. On the subject of cloud storage
we will come later.

Let's face it these are just application running in the browser. Honestly, it 
is quite awesome how they bent HTML and JavaScript to do these awesome feats. But
it's like someone building a functioning spaceship from scrap metal and duct 
tape, awesome but not really the right tools for the job. The only advantage you
get is that you do not need to install the program. First installing a program 
is not such a big deal, it takes around the same time to log into those services
and you do it only once. Even in those cases where installation is not feasible
there are often [portable versions][1] of your favorite tools.

Cloud Storage
-------------

A number of services provide so called cloud storage such as [Amazon S3][2] or
[Back Blaze][3]. Basically you have two types of services, a content 
distribution network and remote storage. 

Remote storage has basically not much to do with the traditional distributed 
concept of cloud computing, since it can be all in one place. You are leasing
a disk space on some server farm. This can either be by the MB or a flat rate. 
This if often used as a remote backup solution or file storage and transfer to
other third parties. The big marketing ring is that you have access to your data
from everywhere. The down side is that so has everyone else, as a result security 
is paramount if you are using such a service. The good news is that the hosting 
provider probably has a better backup strategy than the average Joe and remote 
backups are a good idea, in case of a catastrophic data loss (eg. Fire).

A content distribution network is something entirely different. The basic idea
is to provide your users fast access to your files and is something website 
operators should look into. Content distribution networks are basically built
up in the way that you submit the files and these are then replicated around
the world. The user then gets the server assigned that is closes to her, which
reduces download times. But for this to make a real difference, you need a large
number of users and lots of content.

Amazon EC2 and other VPS hosters
--------------------------------

The [Amazon EC2][4] "cloud" is basically a virtual private server (VPS) hoster
that provides hourly rates. There is no big difference between Amazon and 
any "normal" hoster. It's like hotels, there are hotels you can rent hourly, 
but that does not make them special. They are just used in a different fashion.

What especially makes Amazon "not special" is that you need to handle the 
starting and stopping of your nodes on your own. So not only do you have to 
develop a distributed application, you also have to develop the entire 
management application. The "I don't care how it works" mentality to most 
cloud services is definitely not applying here. 

Although services, like those provided by amazon, are quite interesting when 
you have strongly fluctuating load, they are quite expensive. For every server
that you keep running all the time, it may be cheaper to simply rent a normal
dedicated VPS or root server.

Google Apps Engine
------------------

The [Google Apps Engine][5] is an interesting concept and I have not seen any other
doing the same thing. It is basically a dedicated web hoster that provides Java
or python scripting for web applications. This service is remarkable for the fact
that Google will ramp up the number and locations of servers deadening on load.

This service is quite attractive for small to medium websites, since there is a 
generous free quota and the service can react easily to load spikes. Getting 
[slashdotted][6] is a real threat to small websites and with the Google
Apps Engine they can sail through it with ease.

Conclusion
----------

There is much confusion and marketing claptrap around the concept of cloud
computing and I personally think there is no such thing as cloud computing. 
True there are interesting and not so interesting services out there but none 
warrant the cloud computing word. Cloud computing is a meaningless buzzword, just
like Web 2.0. 

[1]: http://portableapps.com/apps/office/libreoffice_portable
[2]: http://aws.amazon.com/s3/
[3]: http://www.backblaze.com/
[4]: http://aws.amazon.com/ec2/
[5]: http://code.google.com/appengine/
[6]: http://en.wikipedia.org/wiki/Slashdot_effect
