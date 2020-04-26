---
title: "Immutable Containers and Thread Safety"
---

I have been using [immutable.js](https://immutable-js.github.io/immutable-js/) 
recently and in the context of JavaScript it makes a lot of sense. The problem I 
am trying to solve with immutable.js is the aliasing problem. That is, I get a 
list of widgets from somewhere and I need to alter the list before I can display 
it. Doing this in-place is not a good idea, because this may break some other 
code that holds onto the list.

I like this programming idiom so much that I am seriously considering 
mplementing it in C++. While I am tinkering with my C++ experimental code and 
my research I keep coming across the assertion that immutable objects are thread 
safe. The [original presentation](https://www.youtube.com/watch?v=I7IdS-PbEgI&feature=youtu.be) 
or [this rather nice article](https://hackernoon.com/how-immutable-data-structures-e-g-immutable-js-are-optimized-using-structural-sharing-e4424a866d56)
mention it as if it was an immutable truth.

But they are just wrong. It is true that with the right use of atomics you can 
create immutable containers that will not have memory races or crash, but that 
does not make them functionally correct. 

Take a well known example from multi-threading programming, the humble bank 
account. In our case we will represent the bank account as  an immutable ledger 
of all transactions that occurred. All you can do to the ledger is add 
transactions, so the naive implementation would be as follows:
	
	class Account
    {
    public:
        void append(const Transaction& transaction)
        {
            ledger = ledger.push_back(transaction);
        }

    private:
        i7e::imutable_list<Transaction> ledger;
    };

<!--more-->

The problem here is when two threads start to invoke the append method at the 
same time. Both threads will make a copy of the ledger, append their transaction 
and overwrite the value on the Account object.

This is multi-threading programming 101. You add mutexes:

	class Account
    {
    public:
        void append(const Transaction& transaction)
        {
            auto sl = std::lock<std::mutex>{mutex}
            ledger = ledger.push_back(transaction);
        }

    private:
	    std::mutex                      mutex;
		i7e::imutable_list<Transaction> ledger;
    };

But can you do better? 

Well this is part of my deliberations, what the API should look like. An 
alternate API is one where the actual container object is immutable and any 
modifying operations return a smart pointer to a copy. Like so:

    class Account
    {
	public:
		Account()
        {
            ledger = i7e::imutable_list<Transaction>::create();
        }

		void append(const Transaction& transaction)
		{
			ledger = ledger->push_back(transaction);
        }

    private:
		std::smart_ptr<i7e::imutable_list<Transaction>> ledger;
    };

But this code is clearly not safe in any way, it actually even has a memory race, 
since [smart_ptr is not thread safe](https://www.modernescpp.com/index.php/atomic-smart-pointers).
But we can make it thread safe if we implement optimistic atomic exchange. 

    class Account
    {
	public:
		Account()
        {
            ledger = i7e::imutable_list<Transaction>::create();
        }

		void append(const Transaction& transaction)
		{
			std::smart_ptr<i7e::imutable_list<Transaction>> orig_ledger, new_ledger;
			do
            {
				orig_ledger = std::atomic_load(&ledger);
			    new_ledger = orig_ledger->push_back(transaction);	
			}
			while (std::atomic_compare_exchange_weak(&ledger, orig_ledger, new_ledger));
        }

    private:
		std::smart_ptr<i7e::imutable_list<Transaction>> ledger;
    };

This operation will add the transaction onto the ledger and only replace the 
ledger, if the current ledger is the ledger it started with. If that is not the 
case it starts over. The assumption here is that the contention on this function 
will be so low that in all but a few cases the loop is executed only once.

Immutable objects are a nifty basis for lock less algorithms, but they still 
require you to switch on your brain and look for data races resulting from the 
copy semantic. 
