---
title: "Worker Pool"
tags:
    - programming
    - cplusplus
---

I have recently been asked to write a worker pool and that is what I did. The
goal is to have a thread pool, that you can throw at arbitrary functions and 
they will be executed as resources allow. 

The worker pool has the following interface:

    class WorkPool
    {
    public:
        
        WorkPool(unsigned int concurency = std::thread::hardware_concurrency());
     
        ~WorkPool();
     
        template <typename Res, typename ... Args, typename Fun>
        std::future<Res> enqueue(Fun func, Args... args);  
        
    private:
        // ...
    };
    
To use the worker pool you would use the following code:

    WorkPool pool;
    
    addrinfo* google_com  = nullptr;
 
    std::future<int> fgcom = pool.enqueue<int, PCSTR, PCSTR, const ADDRINFOA*, PADDRINFOA*>(getaddrinfo, "google.com", NULL, NULL, &google_com);
 
    if (fgcom.get() == 0)
    {        
        // do something with the result
    }
    else
    {
        // print error message
    }

[See the full example code.][1]
    
But you can enqueue anything function like into the work pool; basically
anything that goes into a [std::packaged_task][pt]. Like with std::async, 
it is important to capture the future, even if it is void. The problem is that
the call will hang at enqueue until the function finishes, which renders the 
entire concept of a worker pool moot. 

<!--more-->

Writing a thread pool is fairly simple and I used a version of mine that
mimics [std::thread][st]. The interface is as follows:

    class ThreadPool
    {
    public:
        
        template <class Function, class... Args>     
        ThreadPool(unsigned int concurency, Function&& f, Args&&... args);
     
        void join();
     
        void detach();
     
    private:
        std::vector<std::thread> threads;
    };
   
The thread pools constructor does what you think it does, it spawns the requested
number of threads

    template <class Function, class... Args>     
    ThreadPool::ThreadPool(unsigned int concurency, Function&& f, Args&&... args)
    : threads(concurency) 
    {
        for (unsigned int i = 0; i < concurency; i++)
        {
            threads[i] = std::thread(f, args...);
        }
    }

Same as the join and detach functions:

    void ThreadPool::join()
    {
        for (auto& thread : threads)
        {
            thread.join();
        }
    }
     
    void ThreadPool::detach()
    {
        for (auto& thread : threads)
        {
            thread.detach();
        }
    }
    
These operations are not optimal, since they need to touch each thread 
individually, but with C++11 that is the only thing we have.

What did not implement from the `std::thread` interface was the move constructor
and move assignment operator. This was not required in this case, but is quite 
simple to implement. 

For the worker pool the work is captured with the help of std::packaged_task. 
But since the worker pool will handle tasks of arbitrary results, they 
must be combined into a common base class. (We will see later why only the
results and not the arguments.) This is done with the BasicTask and Task
structures in the WorkPool.

    struct BasicTask
    {
        virtual ~BasicTask() {};
        virtual void execute() = 0;        
    };
 
    template <typename Res>
    struct Task : public BasicTask 
    {
        std::packaged_task<Res ()> task;
        
        Task(std::function<Res ()> func)
        : task(func) {}
        
        void execute()
        {
            task();
        }
    };
    
The actual work is queued and scheduled through the use of a [std::queue][sq] and
synchronisation is done with the help of a [std::mutex][sm] and a 
[std::condition_variable][scv]. 

    std::mutex mutex;
    std::condition_variable work_cond;
    std::queue<std::unique_ptr<BasicTask>> queue;  

Enqueueing a task is fairly straight forward, the code locks the mutex
and the item is added to the queue. The arguments are captured with 
[std::bind][sb], which is the reason why the task needs only be typed
by the return value, since the std::packaged_task only sees an argument less
function. 
    
    template <typename Res, typename ... Args, typename Fun>
    std::future<Res> WorkPool::enqueue(Fun func, Args... args)
    {
        std::lock_guard<std::mutex> lock(mutex);
     
        auto task = std::make_unique<Task<Res>>(std::bind(func, args...));
        std::future<Res> f = task->task.get_future();
        queue.push(std::move(task));
     
        work_cond.notify_one();
     
        return f;
    }
    
The condition variable is finally set, so that one sleeping thread may be woken.

The actual core of the worker pool is the actual work function within the thread
pool. Here it is encapsulated into a lambda function. 

The runtime is controlled by the std::atomic&lt;bool&gt; running. This variable
is set destructor to false, which means that the worker breaks out of it's 
pseudo infinite loop.

The actual loop body and work function is split into two bits. The task 
retrieval and task execution. 

    WorkPool::WorkPool(unsigned int concurency)
    : running(true),
      threads(concurency, [this] {
        std::unique_ptr<BasicTask> task;
        while (running)    
        {            
            {
                std::unique_lock<std::mutex> lock(mutex);
     
                if (queue.empty()) 
                {
                    work_cond.wait(lock);
                }
 
                if (! queue.empty())
                {
                    task = std::move(queue.front());
                    queue.pop();                 
                }
            }
     
            if (task) 
            {
                task->execute();
            }
            task.release();
        }
      }) 
    {
    }
    
The retrieval code checks if work is present. If not it waits on the condition
variable to indicate either that new work is in the queue or the end of 
execution is reached. This is why the queue state is checked again, we 
may actually be in shutdown.

The execution code basically just calls execute and then releases the task 
object. Like with the retrieval code, during shutdown, the task may be empty.

Finally the worker pool's destructor is also quite straight forward: 

    WorkPool::~WorkPool() 
    {
        running = false;
        work_cond.notify_all();
        threads.join();
    }

That's it, one fully functional worker pool. [You can find the code in this gist][g].

**Considerations**

Finally there are some performance considerations I need to address before 
letting you off the hook. This implementation uses [std::futures][sf]; although 
they are a nice concept, they do not come free. No matter how they are 
implemented, they need some form of locking primitive. This means that when a 
future is created, so is a locking primitive. On most platforms creating a 
locking primitive means switching into kernel mode, which is never a cheap 
operation.

This implementation can easily pull it's own weight when the tasks it is given 
have a reasonably long execution time. But if it is spammed with many awesomely 
short running functions the overhead will outweigh any parallelisation benefit. 
In those cases where, batching multiple calls together may be sensible. 
    
[1]: https://gist.github.com/rioki/0ed85afc742020263975#file-main-cpp
[pt]: http://en.cppreference.com/w/cpp/thread/packaged_task
[st]: http://en.cppreference.com/w/cpp/thread/thread
[sm]: http://en.cppreference.com/w/cpp/thread/mutex
[scv]: http://en.cppreference.com/w/cpp/thread/condition_variable
[sq]: http://en.cppreference.com/w/cpp/container/queue
[sb]: http://en.cppreference.com/w/cpp/utility/functional/bind
[g]: https://gist.github.com/rioki/0ed85afc742020263975
[sf]: http://en.cppreference.com/w/cpp/thread/future
