---
layout: post
title: "R-Value References"
tags:
    - cpp
    - coding
---

The new C++ standard C++11 brought many new and interesting features. Recently
I stumbled acorss one of the lesser discussed features, r-value references. 
At first r-value rerferences seam elusive and for the most part they are, but
I have found one use case that really changes everything and greatly simplifies
code. What I am talking about, is the constructor and assignment operator that
takes a r-value reference.

This aspect if often refered to move semantic and described as a way to greatly 
reduce perfomance costs when moving objects. But what is often left out of
the equasion is that you now can move objects that where not copyable before.

<!--more-->

Since I can not show you what I worked on, I will make up a similar example. 
For an example there is a TcpSocket class that wraps a BSD style socket socket. 

The interface is quite simple, you have 

* a constructor that creates a socket, but does nothing with it, 
* a destructor that cleans up memory, 
* a connect method that initiates a connection,
* a bind method that binds to a port,
* a accept method that waits on incomming connections,
* a send method to send data,
* a recive method to read data 
* and finally the class is not copyable.

So in code the interface would be expressed like this:

    class TcpSocket
    {
    public:
        TcpSocket();
        
        ~TcpSocket();
        
        void connect(const std::string& host, unsigned short port);
        
        void bind(unsigned short port);
        
        TcpSocket accept();
        
        void send(const std::string& data);
        
        std::string recive(unsigned short size);
    
    private:
        
        TcpSocket(const TcpSocket&);
        const TcpSocket& operator = (const TcpSocket&);
    };

The interesting thing here is the accept method. Like the C interface, it 
returns a new socket that then will be used for that connection. If you
compile the code with a C++98 compiler then you will get a compile error
when trying to use the accept method. This comes from the fact that the class
TcpSocket is not copyable.

To implement the same interface in C++98 you have different options. You can 
either create a new socket by allocating it and returning the pointer. But
that puts the buren on the client code to properly track the memory.
The next obvious way to to wrap that poiner into a smart pointer, but that 
still binds the user to use smart pointers. 

The final option is to either pass a raw socket or a socket wraped in some hand 
over objcet. This option has the greatest flexibility. The trublle now is that
you expose implemntation details to the client code and this creates the problem 
that the client code may not use the class as intended. 

But this is cleanly resolved in C++11 with r-value references and the move
semantic. By adding a constructor and assignment operator that takes a r-value
reference you can implement the third option without exposing implementation
details. 

The constructor is implemented like this:

    TcpSocket::TcpSocket(TcpSocket&& orig)
    : socket(orig.socket)
    {
        orig.socket = 0;
    }
    
And the assignment operator like this:

    const TcpSocket& TcpSocket::operator = (TcpSocket&& orig)
    {
        if (this != &orig)
        {
            std::swap(socket, orig.socket);
        }
        return *this;
    }

The basic idea, which comes from the move semantic, is that the contents of
the class is swaped with the given reference and any already allocated data
is destroyed with the temporary object.

Why this is a great feature should be clear, here are the obvious part. You
now move a uncopyable object. So now the following code is valid:

    TcpSocket server;
    server.bind(1337);
    
    TcpSocket connection = server.accept();

But in contrast to the C++98 solutions, where you where constrained to on type, 
you can use any you like, like a pointer:

    TcpSocket* connection = new TcpSocket(server.accept());
    
And if you can use a raw pointer you can also use a smart pointer:
    
    std::shared_ptr<TcpSocket> connection(new TcpSocket(server.accept()));

But you can alos use static arrays:

    TcpSocket connections[32];
    
    connections[0] = server.accept();
    connections[1] = server.accept();
    
You can also use STL containser:

    std::vector<TcpSocket> connections;
    connections.push_back(server.accept());

The other aspects of r-value references, such as basic move samantic and 
perfect forwarding are just performance enhancements, 
but this feature is really a game changer. 

If you want to look at real code, I have built a [small example].

[small example]: http://files.rioki.org/code/echo.tgz
