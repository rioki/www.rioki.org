---
title: Revised EventEmitter
tags: 
  - cpp
  - design
---

I wrote a [C++ incarnation of node.js' EventEmitter][1]. But as things are, 
when you communicate a subject, often you find new insight and flaws in the 
topic. One of the reasons why [rubber ducking][2] is a useful tool, while 
designing software. 

My insight was that the listeners are stored is optimized in the wrong way. I 
used the standard way when you have handle to things, the handle is the key into
a map that holds things. This makes sense when most of the time the outside world 
calls functions with this handle. But in the case of the EventEmitter, the 
handle to the listener is only relevant when you want to remove it. But what is 
done most of the time is emitting events. So it just plainly makes sense to 
order the map by the event. 

<!--more-->

And that I have done (and used it for a couple days). I employ a `std::multimap`
with the event as the key to listeners. The listener struct looses it's event 
member and gains the id member. 

The emit function now loses the loop over the map, which is replaced by a 
call to `equal_range`. The code now looks as folows:

    template <typename... Args>
    void EventEmitter::emit(unsigned int event_id, Args... args)
    {
        std::list<std::shared_ptr<Listener<Args...>>> handlers;
        
        {
            std::lock_guard<std::mutex> lock(mutex);
     
            auto range = listeners.equal_range(event_id);
            handlers.resize(std::distance(range.first, range.second));
            std::transform(range.first, range.second, handlers.begin(), [] (std::pair<const unsigned int, std::shared_ptr<ListenerBase>> p) {
                auto l = std::dynamic_pointer_cast<Listener<Args...>>(p.second);
                if (l)
                {
                    return l;
                }
                else
                {
                    throw std::logic_error("EventEmitter::emit: Invalid event signature.");
                }
            });
        }
     
        for (auto& h : handlers)
        {
            h->cb(args...);
        }        
    }

The remainder of the code did not change significantly. But I cleaned up the 
`add_listener` method a little:

    template <typename... Args>
    unsigned int EventEmitter::add_listener(unsigned int event_id, std::function<void (Args...)> cb)
    {
        if (!cb)
        {
            throw std::invalid_argument("EventEmitter::add_listener: No callbak provided.");
        }
     
        std::lock_guard<std::mutex> lock(mutex);
     
        unsigned int listener_id = ++last_listener;
        listeners.insert(std::make_pair(event_id, std::make_shared<Listener<Args...>>(listener_id, cb)));
     
        return listener_id;        
    }
    
The `remove_listener` now uses a `std::find_if`:

    void EventEmitter::remove_listener(unsigned int listener_id)
    {
        std::lock_guard<std::mutex> lock(mutex);
     
        auto i = std::find_if(listeners.begin(), listeners.end(), [&] (std::pair<const unsigned int, std::shared_ptr<ListenerBase>> p) {
            return p.second->id == listener_id;
        });
        if (i != listeners.end())
        {
            listeners.erase(i);
        }
        else
        {
            throw std::invalid_argument("EventEmitter::remove_listener: Invalid listener id.");
        }
    }
    
[You can find the whole code in this gist][3].

[1]: /2014/12/29/eventemitter-in-c.html
[2]: http://c2.com/cgi/wiki?RubberDucking
[3]: https://gist.github.com/rioki/1290004d7505380f2b1d
