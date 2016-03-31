---
title: "C++11 Switch on String Literals" 
tags:
  - cplusplus
  - programming
---

C++11 is has many nifty improvements, one is that you can switch over string 
literals. The pedantic readers will note, that the standard says you can 
only switch over integral types and you are right. The following code will not 
work:

    void auth(const std::string& name)
    {
        switch (name)
        {
            case "Alice":
                std::cout << "Hello Alice, nice to meet you!" << std::endl;
                break;
            case "Bob":
                std::cout << "Yo Bob, what's up?" << std::endl;
                break;
            case "Charlie":
                throw std::runtime_error("Don't trust Charlie.");
                break;
            default:
                throw std::runtime_error("Who are you?");
                break;
                
        }
    }

But the C++11 standard also brought us the nifty feature of `constexpr`. This 
feature flags function as being able to evaluate at compile time. That is, if
the compiler can evaluate it to a constant expression, that the compiler will
replace the function call with the constant value.

Now take this little hash function from [strex][1]:

    constexpr 
    unsigned int hash(const char* str, int h = 0)
    {
        return !str[h] ? 5381 : (hash(str, h+1)*33) ^ str[h];
    }
    
Now with the help of this function we can hash the strings and thus make them 
integral types:

    void auth(const std::string& name)
    {
        switch (hash(name))
        {
            case hash("Alice"):
                std::cout << "Hello Alice, nice to meet you!" << std::endl;
                break;
            case hash("Bob"):
                std::cout << "Yo Bob, what's up?" << std::endl;
                break;
            case hash("Charlie"):
                throw std::runtime_error("Don't trust Charlie.");
                break;
            default:
                throw std::runtime_error("Who are you?");
                break;
        }
    }
    
Now, obviously you don't want to use it in authenticating users, like this 
little stupid example, but it can come in very handy in cases like [parsing input][2].

Finally, I want thank [Serhiy][3] for his/her [brilliant Stack Overflow answer][4]
    
[1]: https://github.com/rioki/rex/blob/master/strex.h#L71
[2]: https://github.com/rioki/pkzo/blob/master/pkzo3d/Material.cpp#L88
[3]: http://stackoverflow.com/users/1216629/serhiy
[4]: http://stackoverflow.com/a/16388610/178306