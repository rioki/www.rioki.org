---
title: "Spritz Saber"
tags:
    - programing
    - cryptography
    - spritz
---

Cryptography is the cornerstone for a safe and free internet. This comes in form of
useful technologies, such as TLS, S/MIME, PGP and encryption standards such as 
AES. But it is important to have a simple fallback to remind powers that be 
that banning encryption is a futile task. 

This used to be ensured by the nimble [Cipher Saber], that use RC4. The
primary feature of Cipher Saber and RC4 was, that you could basically memorize 
the algorithm. This meant that any attempt at banning encryption is easily 
circumvented, since all you need to reproduce the program is a text editor and a 
compiler. Unfortunately RC4 is considered to be at the brink of being broken and 
without any replacement this basic premise is lost.

But luckily this Monday (27. Oct. 2014) the [Spritz] stream cipher was published. 
It is a stream cipher that is loosely based on RC4 and is almost a perfect drop 
in replacement for RC4.

<!--more-->

And in the spirit of building my own saber, I built [Spritz Saber][gh1]. I 
basically took my existing [Cipher Saber][gh2] and replaced the guts with my 
spritz implementation. 

**Please note, I do not know if my implementation is safe or even correct. Use 
at your own risk.**

But in the spirit of Cipher Saber, let us look and (and memorize) the spritz 
cipher.

The cipher itself is formulated for any N, but the sensible implementation is 
N=256. This means that we are operating a byte (8-bit) at a time. 

The cipher has 6 registers each unsigned N bits, so in our case an unsigned byte. 
It also contains a status array of size N with each value being N bits. 
In C code this would be:

    #define N 256
    typedef unsigned char byte;

    byte i, j, k, z, a, w;
    byte S[N];

The cipher is initialized with all registers to zero except w with 1 and the 
status array to it's index value. In C:

    void init()
    {
        byte v;

        i = j = k = z = a = 0;
        w = 1;

        for (v = 0; v < N; v++) 
        {
            S[v] = v;
        }
    }
    
To get keys and initialisation vector or nonces into the algorithm it defines
an "absorb" function. The absorb function will byte wise absorb any data. 
So in C:

    void absorb(byte* i, int ilen)
    {
        int v;
        
        for (v = 0; v < ilen; v++)
        {
            absorb_byte(state, i[v]);
        }
    }

The actual absorb is done in two steps, once for each nibble (half byte). The 
value of the nibble is used as an index in to the state array and drives the 
swap operation. The swap happens between the two halves of the state array, 
where a is used to index into first half and the nibbles value into the second. 
The register a is advanced each swap and if the value is outside of first half, 
the state array is shuffled and a is reset to 0. So in C this looks like such:
    
    void absorb_byte(byte b)
    {
        absorb_nibble(low(b));
        absorb_nibble(high(b));
    }

    void absorb_nibble(byte x)
    {
        if (a == N / 2)
        {
            shuffle();
        }
        swap(&S[a], &S[N / 2 + x]);
        a = a + 1;
    }    
    
The shuffle quite extensive. It is build up by the two function whip and and 
crush. It basically shuffles the state array [PRNG] style. In C code this looks
like such:

    void shuffle()
    {
        whip(N * 2);
        crush();
        whip(N * 2);
        crush();
        whip(N * 2);
        a = 0;
    }

The whip function is built up of two bits. This first runs the update function
on the state array for the given iteration count. The second looks for a new 
value of w, that has a greatest common divisor with N that is not 1. Code:
    
    void whip(int r)
    {
        int v;
        
        for (v = 0; v < r; v++)
        {
            update();
        }
        do 
        {
            w = w + 1;
        }    
        while (gcd(w, N) != 1);
    }

If you know RC4 you will have a deja vu with the update function. The core is 
quite close the the RC4 shuffle function. The primary difference is that the 
register k is added the equation. The index i is basically slowly moving over 
the state array and j and k are moving over it quite erratic. Theis the first 
bit of the algorithm that is hard to formulate in words, so here is the code: 
    
    void update()
    {
        i = i + w;
        j = k + S[j + S[i]];
        k = i + k + S[j];
        swap(&S[i], &S[j]);
    }
    
On the other hand the crush function is fairly simple. The state array is walked
from left and right to the centre and if the value in the left half is grater 
than the value in the right half the value are swapped. Honestly I don't know 
what the real purpose of this function is, since it appears to re add order,
but I am no cryptanalyst. Code:

    void crush()
    {
        int v;        
        for (v = 0; v < N / 2; v++)    
        {
            if (S[v] > S[N - 1 - v])
            {
                swap(&S[v], &S[N - 1 - v]);
            }
        }
    }    
    
There is a special absorb stop function, this is intended to denote when you
add multiple elements, such as a key and an IV. It actually does not add anything,
it just advances the register a and if necessary shuffles the state array. 
This bit, also beats me why you would want to do this, bit the paper is quite 
insistent. Here is the code:
    
    void absorb_stop(state* state)
    {
        if (a == N / 2)
        {
            shuffle();
        }
        a = a + 1;
    }    
    
The actual encryption is more straight that the absorb function. The core to 
this is the drip function. The drip function returns one 
byte at a time. Before returning anything first it is ensured that the state 
array is shuffled. With each call to drip the state array is updated with the 
update function and the actual value is determined through the used of i, j, k
and z. The interesting bit is that the register z is used in the lookup and 
contains the previous value. This is the drip function in C:

    byte drip()
    {
        if (a != 0)
        {
            shuffle();    
        }
        
        update();
        
        // output
        z = S[j + S[i + S[z + k]]];
        return z;    
    }

The encryption now is done by adding the value from drip to the clear text. 
Likewise decryption is done by subtracting the value from drip to the cipher 
text. Alternatively you could do an XOR, but since the paper wanted to be 
for any N they opted to use addition and subtraction. In spritz saber this looks
like such:

    init();
    absorb(key, strlen(key));
    absorb_stop();
    absorb(iv, 10);
        
    c = fgetc(in);
    while (c != EOF)
    {
        byte r;
        if (mode == ENCRYPT)
        {
            r = c + drip();
        }
        else
        {
            r = c - drip();
        }
        fputc(r, out);
        c = fgetc(in);
    } 

Please note that the code posted above omitted many casts to byte. Basically
each access into an array that can overflow must be forced to byte, since with
array access the compiler assumes size_t. This was done to improve readability
and understandability.
    
[RC4]: https://en.wikipedia.org/wiki/RC4
[Cipher Saber]: http://ciphersaber.gurus.org/
[Spritz]: http://people.csail.mit.edu/rivest/pubs/RS14.pdf
[gh1]: http://github.com/rioki/spritzsaber
[gh2]: http://github.com/rioki/ciphersaber
[PRNG]: http://en.wikipedia.org/wiki/Pseudorandom_number_generator

