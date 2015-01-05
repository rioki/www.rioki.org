---
title: EventEmitter in C++
tags: 
  - cpp
  - programing
---

**Note:** *While writing this article I noticed in flaw how the listeners are
stored. You can read everything about the [Revised EventEmitter][4].*

When it comes to C++ callback / event handling I have for a long time relied on 
[sigc++][1]. But since the release and mainstream adoption of C++11, I have more 
and more relied on lambda function for event handling. I have mostly just used 
the pattern where a `std::function` is stored for each event and you can set them 
through a `on_event` function, like so:

    class Widget
    {
    public:
        void on_something(std::function<void (int)>cb) 
        {
            something_cb = cb;            
        }
        
        void do_something()
        {
            if (something_cb)
            {
                something_cb(42);
            }
        }
        
    private:
        std::function<void (int)> something_cb;
    };
    
    widget.on_something([&] (int info) {
        // react to event
    });

This takes some queues form [node.js][2] and has a high degree of readability. 
The pattern only has one severe drawbacks. First you can only register one 
handler at any time.

<!--more-->

Now you can use C++11 lambda functions with sigc++, but since I got accustomed to 
node.js, I have gotten somewhat weary of the usage pattern. The primary problem 
are, how do you connect to the signals? The simple one is, make the signals 
public:

    class Widget
    {
    public:
        sigc::signal<void, int> something_signal;
        
        void do_something()
        {
            something_signal.emit(42);
        }
    };
    
    widget.something_signal.connect([&] (int info) {
        // react to event
    });

This is bad because the signal is public. It can not be moved somewhere else, 
like an inner class. 

The alternate usage pattern is by providing an accessor:

    class Widget
    {
    public:
    
        sigc::signal<void, int>& get_something_signal()
        {
            return something_signal;
        }
    
        void do_something()
        {
            something_signal.emit(42);
        }
    
    private:
        sigc::signal<void, int> something_signal;
    };
    
    widget.get_something_signal().connect([&] (int info) {
        // react to event
    });
    
This is technically better, but it looks quite unreadable. Especially the line, 
where the signal gets connected; is the handler connected to a temporary signal?
In addition that for each signal a new accessor needs to be written. 

So I have decided to write node.js' [EventEmitter in C++][3]. This is the third 
revision and has already seen some use in my hobby projects.

The interface is almost the same as node.js' EventEmitter, only some concessions
needed to be done to accommodate C++. It looks something like this:

    class EventEmitter
    {
    public:
        
        EventEmitter();
     
        ~EventEmitter();
     
        unsigned int add_listener(unsigned int event_id, std::function<void (...)> cb);
         
        unsigned int on(unsigned int event_id, std::function<void (...)> cb);
     
        void remove_listener(unsigned int listener_id);
                
        void emit(unsigned int event_id, ...);
    };
    
To use the event emitter, you simply need to derive from the class:

    enum WidgetEvent
    {
        SOMETHING_EVENT,
        SOMETHING_ELSE_EVENT
    };

    class Widget : public EventEmitter
    {
    public:
        void do_something()
        {
            emit<int>(42);
        }
    };
    
    widget.on<int>(SOMETHING_EVENT, [&] (int info) {
        // react to event
    });
    
It is that simple and since events are integers, you can add as many as you like
(or rather up to 4294967295). Each event can have it own signature. The only 
little quirk is that, C++ being C++, you need to specify EXACTLY the correct 
signature. The second drawback is that the exact signature is not enforced 
at compile time, but at runtime. But these are things I can live with.

The implementation is fairly simple, the functions are stored through a
polymorphic class:

    struct ListenerBase
    {
        virtual ~ListenerBase() {}
 
        unsigned int event_id;            
    };
 
    template <typename... Args>
    struct Listener : public ListenerBase
    {
        std::function<void (Args...)> cb;
    };

The listeners are then stored in a map and the memory is managed through a 
smart pointer. Why it must be a smart pointer, we will see later. 
    
    std::map<unsigned int, std::shared_ptr<ListenerBase>> listeners;
    
The key is the handle to the listener, which will can be used to remove the 
listener. The next handle is determined by simple `unsigned int` called 
`last_listener`. The last listener could be a std::auto, but everything
is protected by one mutex, so no need (for now).

Adding a listener is a simple case of adding the right struct into the map:

    template <typename... Args>
    unsigned int EventEmitter::add_listener(unsigned int event_id, std::function<void (Args...)> cb)
    {
        if (!cb)
        {
            throw std::invalid_argument("EventEmitter::add_listener: No callbak provided.");
        }
     
        auto l = std::make_unique<Listener<Args...>>();
        l->event_id = event_id;
        l->cb       = cb;
     
        {
            std::lock_guard<std::mutex> lock(mutex);
     
            unsigned int listener_id = ++last_listener;
            listeners[listener_id] = std::move(l);
            return listener_id;
        }        
    }

Of course the `on` function is only a synonym for `add_listener`, so:

    template <typename... Args>
    unsigned int EventEmitter::on(unsigned int event_id, std::function<void (Args...)> cb)
    {
        return add_listener(event_id, cb);
    }

Removing a listener is as simple as removing an item from the map:

    void EventEmitter::remove_listener(unsigned int listener_id)
    {
        std::lock_guard<std::mutex> lock(mutex);
     
        auto i = listeners.find(listener_id);
        if (i != listeners.end())
        {
            listeners.erase(i);
        }
        else
        {
            throw std::invalid_argument("EventEmitter::remove_listener: Invalid listener id.");
        }
    }   

The emit function is a little bit more tricky. It need to accommodate for the 
fact that a listener may remove itself from the event emitter. This is done by 
moving all required listeners into a separate list and then calling them.
This gives the added advantages that long running listeners do not stall other
threads.

    template <typename... Args>
    void EventEmitter::emit(unsigned int event_id, Args... args)
    {
        std::list<std::shared_ptr<Listener<Args...>>> handlers;
        
        {
            std::lock_guard<std::mutex> lock(mutex);
     
            for (auto& il : listeners)   
            {
                if (il.second->event_id == event_id)
                {
                    auto l = std::dynamic_pointer_cast<Listener<Args...>>(il.second);
                    if (l != nullptr)
                    {
                        handlers.push_back(l);
                    }
                    else
                    {
                        throw std::logic_error("Invalid event signature.");
                    }
                }
            }
        }
     
        for (auto& h : handlers)
        {
            h->cb(args...);
        }        
    }
    
The implementation also contains special cases of `add_listener` and `on` for
the case with no arguments. This is has to do with the oddity that C++ has
trouble specifying empty variadtic template arguments. 

[You can find the whole code in this gist][3].

## Optimization

As I wrote this, I noticed that the map of listeners is wrongly structured. It 
is optimized for efficiently removing listeners. But in normal operation the 
`emit` is called really often and listeners are removed farly seldom. It should 
be a multimap, that uses the event id as key. When I have a working copy of 
this implementation, I will show it off here. 

    
[1]: http://libsigc.sourceforge.net/
[2]: http://nodejs.org/
[3]: https://gist.github.com/rioki/1290004d7505380f2b1d
[4]: /2015/01/05/revised-eventemitter.html
