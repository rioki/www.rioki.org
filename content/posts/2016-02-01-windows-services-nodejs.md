---
title: "Windows Services with node.js"
tags:
  - node
  - windows  
---

node.js has become my go to technology when I need a quick and dirty solution
to automating a task. Occasionally these are tasks that run constantly
and monitor something to trigger an action. Now, (unfortunately) I work mostly 
with Windows systems and node does not integrate cleanly into the service 
architecture. Writing a service wrapper does not sound like to much fun...

But luckily, [NSSM][1] exists with it's rather bland website and meek appearance.
The Non Sucking Service Manager is a gem when it comes to wrapping programs to
act as Windows services.

To get a node instance running copy the nssm.exe, the [standalone node.exe][2] 
and your script with all required dependencies armed into one folder. Open 
a command line prompt with administrator rights and execute the following command:

    cd myservicedir
    nssm install MyNodeService node.exe myscript.js
    
That's it! As long as the system is running, so will the script be executed. 
Obviously you can read all the luscious details about NSSM in the rather good
[documentation][3].

[1]: http://nssm.cc/
[2]: https://nodejs.org/en/download/
[3]: https://nssm.cc/usage