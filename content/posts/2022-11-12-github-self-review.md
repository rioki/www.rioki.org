
# Github Self Review

Git and github have developed the well known pull request workflow. In that the
master branch is only pulled and any code changes are brought back through a
pull request that will be approved by a contributor or colleague. Part of the
pull request workflow also contains automated checks, such as building the
software, running unit tests or static code analysis. This has become the first
line of defense for code quality and an industry standard procedure.

The code review process also has an interesting tenagential benefit. Because you
will be presenting your code to someone else, you want to ensure a consistent
scope. This makes sure that each commit actually contains one change and this
forces you to think through and plan your code changes.

<!--more-->

When you work on your own on a project you may want to do the same. That is to
set up the master branch to only be changeable through pull requests. You
probably want to do that to run all automated checks and self review your code.
It is amazing how many TODO and code issues can be found by simply looking at
the code through the code review dialog with a fresh pair of eyes.

But there is a snag; github will not let you approve your own pull requests. In
general this makes sense, you post a code review for someone else to review and
this prevents you sneaking code past the system. Unfortunately this reasoning
fails, when the team size is one.

This is obviously not the end, the simple solution is not to require code
reviews. This allows you to merge without approvals. The downside is that you
lose some beneficial constraints and features of the pull request.

For example you can not enable auto-merge. That is requesting a merge before
all merge conditions are met and automatically merging when they are.

Another example is triggering workflows on the pull request approval, such as
only building the software only after it has passed code review.

It would be nice if github allowed the option to unlock self review and there
is a long [feature request ](https://github.com/orgs/community/discussions/6292)
already posted. But so far nothing has happened with this feature request.

So I developed a workaround or rather a workflow. The auto-approve workflow,
that approves pull requests on your behalf based on a trigger comment.

<script src="https://gist.github.com/rioki/0f9c49582bd868af25ea802107dc7a05.js"></script>

I looked for a while for a way to approve pull requests and there are a few
workflow tasks available; but for some reason or other they did not work as
intended. Luckily I came across the option to use github-script. This is a
JavaScript environment with a pre-authenticated octokit in the github variable.
Using the github object allows you to interact with the guthub API and as a
result alter anything you like.

This script is a quick hack and works fine for me. An improvemnt would be to
extract the user, the trigger word and the comment into variables. Futhermore
I could not get it to trigger on code review comments. So if you want to impove
on it, I would like to hear from you.
