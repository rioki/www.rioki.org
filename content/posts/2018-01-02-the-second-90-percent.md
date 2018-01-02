--- 
title: "The Second 90%" 
--- 

A few years back I read a long lost article for indy game devs, that you 
should: 

> "Take your worst case estimate, double it and use that as your best 
> case estimate." 

This puts it mildly, but humans are for the most part really bad at 
estimating effort. 

<!--more--> 

The standard project management aproach to managing large tasks with a 
high degree of uncertainty is to [break down the large task][1] into 
smaller and smaller tasks. The idea is that each task can be reasoned 
about and thus estimated to a higher degree of certainty. This is true, 
but... 

In many project management software, you can show single task progress 
in percent. Unfortunately, [almost all tasks in progress are pegged at 
90%][2] and the software will helpfully show nice charts. But this is 
misleading, since a task that is not done, is not done. A task has 
exactly 3 relevant states: 

* not started 
* in progress 
* done 

If you have a kanban, any task that is not in the done column is in 
progress. The task may be in testing or acceptance, but unless it is 
actually approved, there is a chance that the developer did miss some 
edge case or misunderstood some requirement. 

This is further aggravated, by the circumstances that without a doubt, 
we tend to gloss over the small but relevant details. 

For example actually useful software needs: 

* an installer 
* undo for all actions 
* crash recovery 
* updates 
* [an uninstall that actually does something][5] 
* localization 

This is what separates a production ready piece of software from a 
prototype. 

Unfortunately, only a few of these tasks are thought about when doing 
the initial project plan and even seasoned project managers oversee at 
least half of these tasks. That is why many projects have months of QA 
before release. 

This has prompted me to keep saying: 

> "Once you are done with the first 90%, you need to sit down and do the 
> remaining 90%." 

I don't recall where I picked it up (probably [THE Wiki][3]), but it is 
loosly based on the [90/10 rule][4] by Tom Cargill of Bell Labs: 

> "The first 90 percent of the code accounts for the first 90 percent of 
> the development time. The remaining 10 percent of the code accounts for 
> the other 90 percent of the development time." 

This has prompted me to see the end date on any larger project estimate 
as between half and two thirds of the actual delivery date and 
communicating the final delivery as such. 

[1]: https://www.jrothman.com/pragmaticmanager/2008/07/refocusing-90-done-is-not-almost-done/ 
[2]: http://itsadeliverything.com/90-percent-complete-not-equal-done 
[3]: http://wiki.c2.com/ 
[4]: https://en.wikipedia.org/wiki/Ninety-ninety_rule 
[5]: https://support.industry.siemens.com/cs/document/189025/how-do-you-uninstall-step-7-completely-including-all-the-software-packages-?dti=0&lc=en-US 
