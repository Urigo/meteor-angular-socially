## How to edit this tutorial?

First, you need to understand how this tutorial works and the importance of the commits.
This tutorial is based on [Meteor's tutorial tools](http://meteor-tutorial-tools.readthedocs.org/en/latest/) and use it's tools to create a simple diff-boxes for code changes accross the commit.

So the very first thing you need to know it that this specific tutorial is used in [Angular1 Meteor tutorials](http://www.angular-meteor.com/tutorials/socially/angular1/bootstrapping) and every diff box you see there is generated automatically from the commits in this repository.

So what is the flow?
- Create commits with specific format - the format in use in this repository and in Meteor tutorial tools is:

  ````Step XX.XX: TEXT_TEXT_TEXT````

  (where XX.XX are numbers that relates to the step in the tutorial you write, and TEXT_TEXT_TEXT is the title of the generated diffbox you will get).

- Generate PATCH file, as described [here](http://meteor-tutorial-tools.readthedocs.org/en/latest/new-tutorial/), it's just running a simple `git` command that generates a file from all of you commits in the repository.

- Create a Meteor tutorial app and define the tutorial objects - also described [here](http://meteor-tutorial-tools.readthedocs.org/en/latest/new-tutorial/).

- Write your tutorial and use the `diffBox` helper to generate the actual HTML of the DiffBox.

**Note that commit without the speical format are also legal, but won't be available for creating diff-box!**

## How to add new steps to the tutorial?

Adding new steps to your tutorial is easy, just get the latest version of the repository, and do your changes and commit them.
It is recomended to make only ONE CHANGE in ONE FILE in ONE COMMIT, which means that after you make a simple change in only one file, commit that single file with a commit message with the right format, for example:

` Step 10.12: This is new!`

I recomend to perform multiple commit to your local repository, and just after you sure that they are fine, to `git push` them to the remote repository, because it is much easier to make change in the local repository.

## How to undo my lastest commit?

So you done a commit and you are not so sure about the change you made, or the order of it? you can just undo your lastest commit with the following command:

` git reset HEAD~1`

Note that the files you changes goes back to be uncommited change, and if it's a new file it will be removed from git and new you need to `git add` it again.

## How to edit existing commits?

So this is there it becomes interesting - we want to keep the order of the commits as it should be in the tutorial.

Let's understand it with this order of commits:

````
Step 1.4: Create a new service
Step 1.3: Create a new view
Step 1.2: Create a new component
Step 1.1: Add the application dependencies
Step 1.0: Create new application
````

So now we created our tutorial, and we noticed that we have a bug in `Step 1.2` - our instinct is to go to the latest commit (most updated state of the repository) and add a new commit, and this will be the result:

````
Fix for step 1.2
Step 1.4: Create a new service
Step 1.3: Create a new view
Step 1.2: Create a new component
Step 1.1: Add the application dependencies
Step 1.0: Create new application
````

So now we have a commit on top of the rest of the commit and if we get the lastest repository commit - everything will work great and we will have the bug fixed we just applied.

This is good for regular applications or projects - but in case of a tutorial it isn't good at all - if we generate the diff box for the commit with `Step 1.2` we will see the code with the bug!

So as you might already understand - we need to edit the actual `Step 1.2` commit, without adding new commits!

In order to edit existing commits, we need to get the actual commit with the bug, edit it, keep the same commit message and the same commit id and then generate a new PATCH file.

This might sound complicated but it isn't, it just requires from you to know how to use some `git` commands and basic `vi` commands. I also recommend to use [SourceTree](https://www.sourcetreeapp.com/) - it's great Git GUI tool, but it is not enough and note that you **must** know how to use the command line git.


So let's edit the commit:

- Go the the project's repository after you clone it, make sure you all up-to-date (`git pull`) and make sure that you do not have any commits that you did not pushed, or any other uncomitted changes! (**This is VERY important**)
- Find the commit id you want to edit, you can simply do it in SourceTree. For example, here:
![1](http://s10.postimg.org/qs4f1d2nd/image.png)

- So in our case, we want to edit commit id `d002ba8`, so we need to go back in time and to set our local repository to that commit. This done by running the following command:

````
  git rebase -i d002ba8~1
````

- Now you will get the Interactive Rebase screen of git - you will see your commit in the first line:

![2](http://s8.postimg.org/sz0avbymt/Screen_Shot_2016_02_08_at_16_42_51.png)


- Notice the `pick` near you commit? great! we want to edit that commit, so use your `vi` skills and change the word `pick` to `edit`, than exit and save your changes in `vi` (ESC, `:`, and then `wq!`).

- Great, now you in edit mode, and the repository is set to the commit you want to edit! ** so now make your changes to the file / files **

- Done with that file? Great. to keep the original commit and apply the changes to it, run:

`  git commit --all --no-edit --amend`

That command will commit **all** the files you changed, without **edit the commit message**, and it will **amend** you changes into the original commit.

- So now you are done with the changes and updating the commit, you will need to add the next commits on top of the new commit you edited. so you need to continue with the rebase process, do it by running:

`  git rebase --continue`

And if you noticed in any step on the change the you made a mistake, you can always abort the rebase by running:

`  git rebase --abort`

- In some cases, this is the last step, but in most of the times, you notice that after you continue the rebase operation, git stops and tells you that you have to merge because of conflicts. This makes sense - you changed a file in some point of the repository, but the commits that comes next, also changes it and it depends on the previous version of the file.

- So in order to merge your conflict, I recommend to open your working directory in WebStorm, right click on the root of your project, and select "Git > Resolve Conflicts":
![3](http://s12.postimg.org/4yxlr4llp/Screen_Shot_2016_02_08_at_16_58_04.png)

- In the next screen, resolve you conflicts and ** DO NOT MAKE ANY GIT ACTION FROM WEBSTORM**

- Now go back to the command line, and run: `git rebase --continue`, and you will get a screen that tells you to modify your commit message, you can just ignore it and save it as-is (ESC, `:` and then `wq!`).

- If it's compilicated file that changes a lot of time, you might have multiple merges that needed to be done!
- And you are done now! you just need to update your remote repository with the changes, but in order to do it, you need to `git push` with the `--force` flag, because now that you changed the history of you commits, the repositories no longer match! So run `git push --force origin YOUR_BRANCH` (replace YOUR_BRANCH with the branch you want to push to, **be carful! if you do not specify it, you will push it to the master and you might override the whole repo!**

## How to only edit the commit message?

So if you know how to edit commint (read the previous explaination), changing a commit message is much easier.

You just need to perform the same `git rebase` as in the previous question, and instead of using `edit`, use `reword` (or just `r`), note that you can do it to multiple commits in the same time.

Then you will see the commit message in the git shell screen, just change it and then exit and save from the vi.

Then just continue the rebase (`git rebase --continue`) and push it.

## How to remove entire commit?

You just need to perform the same `git rebase` as in the previous question, and in the `vi` screen you get, just removed the entire line of the commit you want to remove (vi shortcut: `dd`), and then continue the rebase.

## How to split commit into two or more commits?

Splitting commits is a tricky one - there are some ways to to it, but I recommend to undo the commit if you still can (if it's the last one) and do it again in splitted commits.

But if you can't undo it, you can still solve this issue:

- Do `git rebase` to your commit minus two commits, that means for example: `git rebase d0021ab~2` (note the 2 instead of 1 in the end of the line), now the commit you want to split will be second in the commits list.
- Remove the commit you want to split by removing it's line (vi shortcut: `dd`).
- Go to the first commit in the list now (which is the commit that comes before the one you want to split), and set it to `edit` mode.
- Now make you changes in a different commits, instead of one, perform them manually, and to commit each single change, use: `git commit --all` (Note that we did not use `amend` flag so we do not change the commit we set to edit mode!), and in that screen that opens, set the commit message. do that for each one of the commits.
- Now just continue your rebase with `git rebase --continue` and finish it like any other change you made in the git history.

## How to handle Meteor packages and versions?

Actually, changing versions and packages in Meteor app should be the same, but there is a file that Meteor manages by it self, called `.meteor/versions` - this file contains the versions of all the packages you use in your app.

So if you `git rebase` to specific commit and modify the packages or update a package version, make sure to run your app as you used to (for example: `meteor`) and wait until Meteor done with the build - in this point, a new `.meteor/versions` file will be generated, so make sure that you commit and update it aswell.

But now you will notice that in every step that you done some change with the packages, you have a conflict and you have to merge - this merge will be very hard to perform because of two generated files with a lot of lines and versions of packages - you do not have to deal with it that way!

First, mark the `.meteor/versions` file as resolved conflict (does matter it's content right now) , and then set the content of the file to empty content.

Now run your app and wait for it to finish the build, and you will notice that Meteor generated the correct and updates `versions` file! Just commit that file now and continue the rebase!


## How to create a new tutorial app?

Creating a new tutorial described [here](http://meteor-tutorial-tools.readthedocs.org/en/latest/new-tutorial/).

## Another goods

#### Step tag and step diff

So after creating a few steps in your tutorial, you can create a link that shown that entire diff between two steps (not sub-steps!), the actual does not related to the tutorial tools but very useful if you want to provide your users the ability to see the whole changes for each step of the tutorial.

So in order to do that, make sure you create a Git Tag for each steps you finish (In the last commit of the step), you can do it with SourceTree or in GitHub, it does not matter.

So after adding more that one step and one tag, you can add to your tutotial link to page that shows the entire diff, for example:

https://github.com/Urigo/meteor-angular-socially/compare/step_01...step_02

This link shows the entire diff between the tag `step_01` and `step_02`.

Note that after each change you made in the commits that required a force `push`, you need to create the tags again!

#### Download link for a step

Another good you get is the ability to get a link to download the entire tutorial example, so users can jump to step and start it from there with the updated code!

To do that, just add a link in your tutorial, like this:

https://github.com/Urigo/meteor-angular-socially/archive/step_21.zip

You need ofcourse to change the repository url, and replace `step_21` with the name of the tag you created (explained in the previous section).

Thanks it! now you can just download the entire project in each step!
