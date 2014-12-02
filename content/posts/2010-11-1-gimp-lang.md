---
layout: post
title: "Fixing Gimp and Language Settings"
tags:
    - gimp
    - i18n
    - h4x
---
Ever used Gimp or any other tool that uses gettext for localization on 
Windows and the language does not turn out as it should?

I have that quite often. The thing is that my main system (Window 7 ) 
has the locale setting to German, since I have many contact points that 
need to conform to that, especially the default currency being Euros. Nevertheless 
my interface language is English.

<!--more-->

I wrote a sort program to check what ANSI C things my locale settings are. 
It looks like this:

    #include <stdio.h>
    #include <stdlib.h>
    #include <locale.h>

    int main()
    {
        printf("LC_ALL: %s\n", setlocale(LC_ALL, ""));
        printf("LC_COLLATE: %s\n", setlocale(LC_COLLATE, ""));
        printf("LC_CTYPE: %s\n", setlocale(LC_CTYPE, ""));
        printf("LC_MONETARY: %s\n", setlocale(LC_MONETARY, ""));
        printf("LC_NUMERIC: %s\n", setlocale(LC_NUMERIC, ""));
        printf("LC_TIME: %s\n", setlocale(LC_TIME, ""));
        return 0;
    }

    The results are what I expected:

    LC_ALL: German_Germany.1252
    LC_COLLATE: German_Germany.1252
    LC_CTYPE: German_Germany.1252
    LC_MONETARY: German_Germany.1252
    LC_NUMERIC: German_Germany.1252
    LC_TIME: German_Germany.1252

If you use ANSI C methods to access what "Language and Regional Settings" manage 
you are mostly lost. Many applications such as Notepad++ have the option to change 
the language explicitly, knowing that most user will not be able to fix it themselves. 
The bad news for Gimp users, is that gimp does not offer such a setting. My workaround 
is quite simple, change the LANG environment variable and launch gimp. But since I do not 
want to change all applications in my system I wrote a little bat file:

    SET LANG=en_US
    gimp-2.6

I put the file gimp.bat in the bin folder of Gimp and direct the start menu link to 
launch that. The only drawback I have is that now the default unit for lengths is inches. 
Man why isn't there a locale with English and metric units. Those imperial units must die!
