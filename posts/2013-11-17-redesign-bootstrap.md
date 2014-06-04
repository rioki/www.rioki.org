---
layout: post
title: "Redesign with Bootstrap"
tags:
    - web
    - bootstap
---

This website just got a lifting. With the help of [Bootstrap] the site looks
spiffy and the effort to get it work was about 15 minutes. This is the fastest
redesign to date. 

<img src="/images/redesign.png" class="img-responsive" alt="wooosh" />

The design is based on the [Narrow Jumbotron]. Which was easy a quite easy
conversion. I dropped the twitter, github and RSS links at the top.

<!--more-->

Color
-----

My first issue was getting the color from blue to orange. With the help of 
[paintstrap] I got the colors the way I wanted. I had to go over kuler and
built [this color scheme][1]:

<img src="/images/kuler_rioki_corner.png" class="img-responsive" alt="kuler theme" />

I ended up only using the two orange shades and forced the text to white and 
black.

Navigation
----------

To get the active navigation to properly show up was slightly tricky. I added
a new field to the YML front matter called "nav":

    ---
    layout: page
    title: About
    nav: about
    ---

Then based on this value the proper navigation pill is set to active with a simple
[liquid if expression][2].

A little justify CSS and the site was ready to go.

[Bootstrap]: http://getbootstrap.com/
[Narrow Jumbotron]: http://getbootstrap.com/examples/jumbotron-narrow/
[paintstrap]: http://paintstrap.com/
[1]: https://kuler.adobe.com/Riokis-Corner-color-theme-3211296/
[2]: https://github.com/rioki/www.rioki.org/blob/master/_layouts/default.html#L15