---
layout: post
title: "Designing spdr"
tags:
    - spdr
    - coding
---

While researching different solutions for networking games, I stumbled over
[Gaffer on Games][1]'s [UDP networking tutorial][2]. Amongst other, it describes
a really simple approach to connection handling and reliability. The basic
idea of connection handling is that a connection is established as long as
packets flow. This is a refreshing simple idea, when comparing to your standard
three way handshake. He simplifies reliability by acknowledging every packet 
with a special field on the packets returning and let's the application decide 
what to do. The appeal in this solution is the simplicity. But he fails to 
address some core issues that I want my networking system [spdr][3] to solve for me. 

<!--more-->

The first issue is how connections are established. The given approach fails to give 
any reason why a connection could not be established. The application can't 
distinguish between a protocol version mismatch and an incorrect address. In 
every case the application will need to wait until a timeout is reached. But
in defense, this is a minor issue that carries it's weight for the simpler 
implementation.

The second issue is related to keeping the connection alive. Although many 
scenarios accommodate the fact that no special keep alive is implemented, 
there are scenarios I can think of, were the connection will timeout without
additional code. The important fact is that I want my network code to handle
the issue, not the application.

The third issue is that there is no way to terminate the connection properly. 
It is impossible to determine a connection loss and a correct disconnect. This 
fact is ameliorated by considering that any application should signal proper 
disconnect rather than just closing the connection.

The fourth issue is reliability. When I want to send a message reliable, I just
want to send the message, I do not want to have to handle the loss of the message
in the application. This feature should be implemented in the networking system.

In defense of Gaffer's tutorial, I must say it opened my eyes to how simple a 
network protocol can be. I will probably build my networking library spdr with 
these core ideas and add a layer to accommodate issues I have with that 
simplistic approach. 

[1]: http://gafferongames.com
[2]: http://gafferongames.com/networking-for-game-programmers/virtual-connection-over-udp/
[3]: htttp://github.com/rioki/spdr

