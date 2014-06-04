---
layout: post
title: "Axis Double Tap (Unreal Engine 4)"
tags:
    - gamedev
    - ue4    
    - ut2014
---

As I am working on implementing [Unreal Tournament 2004][3] style movement for 
my little [UT2014 challenge][1], I found a tricky bit to implement: 
capturing double tap on axis inputs. 

The template projects in the [Unreal Engine 4][2] use axis inputs for movement.
This is done so that you can use a gamepad's analogue stick for movement. The 
tricky bit, in comparison to input actions, is that the axis fires each 
frame and you need to read out the value. The execution needs to trigger on
the value rising over a threshold and not the execution tick. 

<img class="img-responsive" src="/images/adt/hookup.jpg" alt="How to hookup the Axis Double Tap selector." />

This is about how you would integrate the `AxisDoubleTap`. Since we want to 
preserve "normal" movement the sequence splits out to the `AddMovementInput`
on the one side and the `AxisDoubleTap` selector on the other. The 
value `AxisThreshold` (0.75) and `DogeTimeout` (0.4) are variables that are
exposed on the Character, so that they can easily be tweaked later on.

As you can see, I have not yet implemented the doge, so for now we will 
just print "Doge Left" and "Doge Right". 

<!--more-->

<img class="img-responsive" src="/images/adt/AxisDoubleTap.jpg" alt="The AxisDoubleTap macro." />

The `AxisDoubleTap` selector works in three stages. The first stage 
(`AxisSplit`) take the axis value and separates it into three execution pulses.
The `Positive` pulse is when the value is above the threshold, the `Negative` 
pulse is when the value is below the negative threshold and the `Neutral`
pulse when the value is between the positive and the negative thresholds.

The second stage is a flank trigger. That is the continuous execution pulse
is converted into one single pulse. This is done with the help of a `DoOnce`
node. The impulse is routed into the that node and only passes through once, 
any further pulses are dropped. Only until the input goes back to neural,
the `DoOnce` is reset and thus a new pulse will be let through. 

The third stage is the `DoubleTap` selector. This basically take the pulses
and only emits a pulse if two consecutive pulses came in.

<img class="img-responsive" src="/images/adt/AxisSplit.jpg" alt="The AxisSplit macro." />

The `AxisSplit` is quite straight forward. Two chained `Branch` nodes each 
comparing the value to the threshold and the inverted threshold. 

<img class="img-responsive" src="/images/adt/DoubleTap.jpg" alt="The DoubleTap macro." />

The `DoubleTap` is basically implemented through a `DoN` node. The `DoN` lets 
two execution pulses through, but the flowing `Branch` only evaluates to true
when the second pulse is emitted. The `Delay` is used to ensure that two pulses
come without too much delay. If the delay is completed it will reset the `DoN`
for a new round of impulses. 

So you have it, once it is spelled out like this, it seems obvious. 

[1]: /2014/03/21/ut2014.html
[2]: http://www.unrealengine.com/
[3]: http://en.wikipedia.org/wiki/Unreal_Tournament_2004


