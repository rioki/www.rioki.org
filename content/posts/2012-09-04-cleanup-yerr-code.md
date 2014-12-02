---
layout: post
title: "Cleanup Yerr Code"
tags:
    - coding
    - uncrustify
---

I have been given a body of code that is old. The copyright notice says 1995 and
the project name is something that was never released under that name. 
Knowing the developers here, probably some of the code base was copied from
previous projects, but I can't check since the code was imported into Clear
Case around 2000. The code is an amalgam for all the coding paradigms from that
time to now. It starts with classic Win32 / C code, then people started to use 
MFC, they learned that you can also use object in your code what resulted in
C with object and lately someone started to "apply" patterns. But that is
not the biggest problem that I have with the code, it is code that looks like
this:

      char                  returnedString[255];
    F_ConsistencyCheck*              fkt_F_ConsistencyCheck    = NULL;
      F_ConsistencyCheck_V60*   fkt_F_ConsistencyCheck_V60 = NULL;
    
            if (transactionId == TA_BASE)
            {
                om_ret = rom_IsSclInstalled();
            }
            else
            {
                om_ret = rom_IsSclInstalled_V701(transactionId);
            }
    if (om_ret != OM_OK)
    {
      delete pEsFile;
      pEsFile = NULL;

      sclError->write(MOD_MAIN | 0x01, 0);
    }        
    DWORD numberOfObjects;
    result = gen_ObjectsCount(
                                cpuId,           // (IN)  Database-Id.
                                ENTIRE,          // (IN)  Generation Type
                                numberOfObjects, // (OUT) Number of Objects
                                transactionId    // (IN)  Transaction ID
                               );
    switch (gl_ErrorIdGet(result))
    {
      case OK:  break;
      default:  glError->write(MOD_MAIN | 0x02, result);
                break;
    }

I am seriously offended by this code! Show me pictures of people torn to pieces 
and I will go "meh", but this code, I get foam around my mouth...

<!--more-->

At first I started to clean up the code by hand. Although the task has a certain
zen appeal, it started to bog me down. I decided to shop around for a code
formating tool. 

Although I did not find it at first, [UniversalIdentGui] is an interesting 
tool that can help you choose and fine tune the formatter you want to use. 

I tried out the available formatters that understand C++:

* [AStyle]
* [Uncrustify]
* [GreatCode]
* [GNU Indent]

AStyle
------

What is there to say about the venerable astyle? It just works. AStyle is tried
and true, but for my taste does not enough. AStyle tries to be very 
conservative about the changes it does to the source code. It focuses only 
on indentation and brace and bracket placement.

After some tweaking the code looks like so:

    char                  returnedString[255];
    F_ConsistencyCheck*              fkt_F_ConsistencyCheck    = NULL;
    F_ConsistencyCheck_V60*   fkt_F_ConsistencyCheck_V60 = NULL;

    if (transactionId == TA_BASE)
    {
        om_ret = rom_IsSclInstalled();
    }
    else
    {
        om_ret = rom_IsSclInstalled_V701(transactionId);
    }

    if (om_ret != OM_OK)
    {
        delete pEsFile;
        pEsFile = NULL;

        sclError->write(MOD_MAIN | 0x01, 0);
    }

    DWORD numberOfObjects;
    result = gen_ObjectsCount(
                 cpuId,           // (IN)  Database-Id.
                 ENTIRE,          // (IN)  Generation Type
                 numberOfObjects, // (OUT) Number of Objects
                 transactionId    // (IN)  Transaction ID
             );

    switch (gl_ErrorIdGet(result))
    {
        case OK:
            break;

        default:
            glError->write(MOD_MAIN | 0x02, result);
            break;
    }

You can't make much wrong with AStyle, choose you style and you are 80% there.

Uncrustify
----------

I did not know about Uncrustify and was pleasantly surprised. Just the default 
configuration did quite some magic. What's nice about uncrustify is that 
it has many rules, but most of them are in the ignore mode. So if you
don't have an opinion to a certain issue or are not sure what to do, leave
it on ignore. 

Uncrustify has **MANY** rules. That is the only downside, I took me the better 
part of the morning to configure the tool until it did all that I wanted. 
The resulting code now looks like this:

    char                    returnedString[255];
    F_ConsistencyCheck*     fkt_F_ConsistencyCheck     = NULL;
    F_ConsistencyCheck_V60* fkt_F_ConsistencyCheck_V60 = NULL;

    if (transactionId == TA_BASE)
    {
        om_ret = rom_IsSclInstalled();
    }
    else
    {
        om_ret = rom_IsSclInstalled_V701(transactionId);
    }
    if (om_ret != OM_OK)
    {
        delete pEsFile;
        pEsFile = NULL;

        sclError->write(MOD_MAIN | 0x01, 0);
    }
    DWORD numberOfObjects;
    result = gen_ObjectsCount(
        cpuId,                                   // (IN)  Database-Id.
        ENTIRE,                                  // (IN)  Generation Type
        numberOfObjects,                         // (OUT) Number of Objects
        transactionId                            // (IN)  Transaction ID
        );
    switch (gl_ErrorIdGet(result))
    {
        case OK:
            break;
        default:
            glError->write(MOD_MAIN | 0x02, result);
            break;
    }

I especially like the ability to align variable declarations. 

GreatCode
---------

I learned about GreatCode from the UniversalIndentGui. GreatCode has potential
and is the most aggressive reformatting rules. For example is has a rule
that moves all variable declarations to the top. It also has the most 
comprehensive comment handling; you can force an API doc comment on all functions. 

The danger with some rules in GreatCode are that you can actually break the code. 
The formatter has no semantic knowledge and does not know if a certain reordering
is valid. On one occasion I broke the code, though with a misplaced comment. 
In the end I disabled the comment modification and kept reordering as little as 
possible.

The code now looks like this:

    char                        returnedString[255];
    F_ConsistencyCheck *        fkt_F_ConsistencyCheck = NULL;
    F_ConsistencyCheck_V60 *    fkt_F_ConsistencyCheck_V60 = NULL;

    DWORD                       numberOfObjects;
    if (transactionId == TA_BASE)
    {
        om_ret = rom_IsSclInstalled();
    }
    else
    {
        om_ret = rom_IsSclInstalled_V701(transactionId);
    }

    if (om_ret != OM_OK)
    {
        delete pEsFile;
        pEsFile = NULL;

        sclError->write(MOD_MAIN | 0x01, 0);
    }

    result = gen_ObjectsCount(cpuId,            // (IN)  Database-Id.
                              ENTIRE,           // (IN)  Generation Type
                              numberOfObjects,  // (OUT) Number of Objects
                              transactionId     // (IN)  Transaction ID
                              );
    switch (gl_ErrorIdGet(result))
    {
        case OK:
            break;
        default:
            glError->write(MOD_MAIN | 0x02, result);
            break;
    }
    
GNU Indent
----------

No discussion would be complete with the other venerable tool, GNU indent. I
never was able to get indent to do what I want. Indent has three presents,
ANSI, GNU and K&R and none of them are my style. 

The code looks like so: 

    char returnedString[255];
    F_ConsistencyCheck *fkt_F_ConsistencyCheck = NULL;
    F_ConsistencyCheck_V60 *fkt_F_ConsistencyCheck_V60 = NULL;

    if (transactionId == TA_BASE)
      {
          om_ret = rom_IsSclInstalled();
    } else
      {
          om_ret = rom_IsSclInstalled_V701(transactionId);
      }
    if (om_ret != OM_OK)
      {
          delete pEsFile;
          pEsFile = NULL;

          sclError->write(MOD_MAIN | 0x01, 0);
      }
    DWORD numberOfObjects;
    result = gen_ObjectsCount(cpuId,    // (IN)  Database-Id.
                              ENTIRE,   // (IN)  Generation Type
                              numberOfObjects,  // (OUT) Number of Objects
                              transactionId     // (IN)  Transaction ID
        );
    switch (gl_ErrorIdGet(result))
      {
      case OK:
          break;
      default:
          glError->write(MOD_MAIN | 0x02, result);
          break;
      }
      
I don't know what to make of that. It is not really better.

Conclusion
----------

AStyle is a safe bet, I definitly don't want to break the code. It serves as 
a solid stepping stone for manual cleanup. Cleanup that can't be done by 
a code formating tool, such as changing that switch on the error code to an
if. 

I also took a liking of Uncrustify. I am quite certain that I can trust the 
tool; it did not do many odd things. I especially like the alignment options. 

The only thing that I want a tool for, but just can't find, is a formatter
that changes the multiline function call into one single line. The oh so obvious
comments don't help and I don't parse it intuitively as a function call.

  
[UniversalIdentGui]: http://universalindent.sourceforge.net/
[AStyle]: http://astyle.sourceforge.net/
[Uncrustify]: http://uncrustify.sourceforge.net/
[GreatCode]: http://sourceforge.net/projects/gcgreatcode/
[GNU Indent]: http://www.gnu.org/software/indent/
