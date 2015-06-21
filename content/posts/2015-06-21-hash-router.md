---
title: "Building your own Hash Router"
tags:
  - javascript
  - webdev
---

For [fedz.me](http://fedz.me) I recently wrote a simple hash router. Initially 
I wrote fedz.me with only [jquery] and [swig]. It worked, but hash routing was 
slightly hacky. So I decided to write a proper [hash router][1]. 

Usage
-----

To use the router you instantiate it and set routes. Here I have 4 distinct 
routes, the tags route (#!tags), the single post route (#>123), the tag filter 
route (#yolo) and default fallback route. You can defined the route patterns
either as sting or regular expression. 

    var router = new Router();
    
    router.route('#!tags', showTags);
    
    router.route(/#>([0-9]+)/, function (hash) {     
      showPost(hash.substr(2));
    });
    
    router.route(/#([a-zA-Z0-9]+)/, showPosts);
    
    router.fallback = showPosts;       
    
If you want to track hash changes you can hook the `onnavigate` event. Here I 
use Google Analythics to track the navigations. 
    
    router.onnavigate = function (hash) {
      var title = hash ? hash : 'fedz.me';
      ga('send', 'pageview', {
        'page': '/' + hash,
        'title': title 
      });
    }

If the page is loaded with a hash and need the navigation code to be executed,
you should to call the navigate function when the document is ready.

    router.navigate(location.hash);

<!--more-->
    
Implementation
--------------

The implementation hinges on the `onchangechange` event of the window. I did 
not implement any fallbacks and expect the browser to be recent enough to have 
the event. The constructor also creates the routes array, this removes the 
need to check if it actually exists all the time. 

    var Router = function() {
      this.routes = [];
      
      // hook window change events
      var router = this;
      window.onhashchange = function () {
        router.navigate(location.hash);
      }
    }

Routes are published though the route function. This simply extends the 
routes array accordingly.
    
    Router.prototype.route = function (pattern, handler) {
      this.routes.push({pattern: pattern, handler: handler})
    }
    
The navigate function is the meet of the router. 

    Router.prototype.navigate = function (hash) {

Since the navigate function may be called any time from the code the hash is 
set, this also updates the URL.

      if (location.hash != hash) {
        location.hash = hash;
      }

Each time the navigate function is called, the `onnavigate` function is called, 
if any is present. 
      
      if (this.onnavigate) {
        this.onnavigate(hash);
      }
      
To find the appropriate route, the routes array is traversed. Since this can 
either be a string, check the string first, this is more efficient. Then match
the regex with the hash. If the route is found, call the handler.
      
      var i = 0; 
      while (i < this.routes.length) {
        if (typeof this.routes[i].pattern === 'string' && this.routes[i].pattern === hash) {
          this.routes[i].handler(hash);
          return;
        }
        else if (hash.match(this.routes[i].pattern)) {
          this.routes[i].handler(hash);
          return;
        }
        i++;
      }
      
If no route was found, call the fallback function, if any.       
      
      if (this.fallback) {
        this.fallback(hash);
      }
    }

Code
----

You can see the entire code in this gist: [router.js][1]

Extending
---------

For my purposes this router is sufficient. But it may be interesting to forward 
the regex capture groups as arguments to the functions. This allows to prevent
having to reparse the hash again in the handler. 

[jquery]: https://jquery.com/
[swig]: http://paularmstrong.github.io/swig/
[1]: https://gist.github.com/rioki/9d904c7565bb43e9d849
