---
title: "Resize Canvas Update"
tags:
  - webgl
  - threejs
---

A while back I made an article about resizing a canvas automatically. Well I 
made a mistake, the canvas element does not have a resize event; something I
completely missed. Here is an update on how to solve the problem.

After searching the internet, I did not find a good solution. The best solution 
I found was a [stackoverflow question][1], but they also made some mistakes.

So here is my revised solution, that actually works with the canvas:

    function onResize(element, callback) {
      var height = element.clientHeight;
      var width  = element.clientWidth;
      
      return setInterval(function() {
          if (element.clientHeight != height || element.clientWidth != width) {
            height = element.clientHeight;
            width  = element.clientWidth;
            callback();
          }
      }, 500);
    }

<!--more-->    
    
So what is the difference?

* The code uses clientHeight and clientWidth, since the properties width and 
height of the canvas mean the resolution.
* The interval id is returned, this is good, since this ensures that you can
call clearInterval on it.
* The code is written by me and better formatted. (Important!)
    
So in the case of resizing a canvas driven by three.js use the following code:

    onResize(canvas, function () {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    });
    

[1]: http://stackoverflow.com/questions/5825447/javascript-event-for-canvas-resize
