---
title: "Plausible Deniability in Threema"
---

[Threema]’s private chat feature is worse than useless and desperately needs 
plausible deniability. The hidden chat feature must be implemented in a way 
that allows the user to plausibly deny that the a private chat actually exists, 
up to the point to unlock the application and “prove” it.

In the current implementation of threema, the following problems exist:
 
**Problem 1: One Passcode**
 
Threema uses the same passcode to unlock the application user interface and to 
show private chats. The problem here is that this only one security token, that 
once revealed basically renders the remaining safeguards null.
 
**Problem 2; Show Private Chats Leaks Information**
 
The “Show Private Chats” divulges the current state of the application. First 
this user interface element is only visible when there are private chats. This 
leaks the information that there is more to get. 

<!--more-->

**Problem 3: Contact List Leaks Information**
 
When private chats are hidden, you can find out with which contacts private 
chats are in progress, by “starting a new chat” with them. This will 
automatically show the password prompt for the private chat.
 
**Problem 4: Message Notification Leaks Information**
 
Although notifications can be occluded or disabled, the fact that a notification 
was present, but there are no new messages hints at the existence of private chats.
 
I think the developers of threema are using the wrong threat model. The current 
implementation only protects you when someone picks up your unlocked phone. It 
is true that you don’t give your passcode to random strangers, but in a 
relationship reveal of passwords under duress is the normal state of affairs. 
And honestly, that is the only scenario I know where I would want to use private 
chats.
 
A functional implementation of private chats needs the following properties:
 
**Property 1: Safe Mode**
 
The application needs a safe mode, that is a mode in which private chats are 
hidden. In safe mode the application should behave normally and behave as if 
no hidden chats exists. This can either be a specially prepare mode or a normal 
mode of operation of the application.
 
**Property 1b: Reveal of the Safe Mode Credentials Grants no Further Privileges**
 
“Honney, here is my password, go see for yourself”, needs to be an option. Safe 
mode and the credentials to access it should possible to divulge “under duress”. 
 
**Property 2: New Chats Can be Initiated with Hidden Private Chats**
 
Is a private chat hidden, then it should be possible to initiate a new chat with 
that contact. This ensures that it impossible to probe the contact list for 
hidden chats. 
 
**Property 3: New Private Chats Can be Created Even With Existing Ones**
 
Is a private chat hidden, a newly created chat should be able to be hidden, even 
though a different hidden chat with that contact exists. This ensures that the 
existence of a hidden chat can not be revealed by creating and hiding the chat.
 
**Property 4: Is a Second Chat Initiated With a Contact, it Must be Obvious**
 
Two apps operating in safe mode, with a hidden private chat existing between 
them, should behave as normal. But no matter of the private chat is hidden or 
visible on the receiving end, it should be obvious that it is a new second chat, 
yet only if you know that a private chat exists. This could be merely by the 
fact that it really is a new chat, with no previous messages or a obvious “Alice 
wants to chat with you” opening message.
 
**Property 5: Notifications are only Emitted for Visible Chats**
 
The application should only emit notifications for chats that are currently 
visible. This removes the hint at a hidden chat, when a notification comes in, 
but no new messages are visible. But this should be optionally, since most 
probably can live with this flaw.
 
A reasonably simple implementation could be as follows:
 
*The application has one unlock password, this is the safe mode password. Chats 
can be set to private and an additional password can be set. This password also 
acts as password to unlock the application and when that password is used, all 
chats with that password are shown. This allows to have multiple sets of visible 
chats, depending on the password used. A requirement to implement property 2 
and 3, needs to be that you can have multiple chats per contact, even multiple 
private chats, with different passwords associated.*
 
I would really like to see a sensible implementation of private chats in threema 
and hope the developers agree with my assertions.

[Threema]: https://threema.ch/en
