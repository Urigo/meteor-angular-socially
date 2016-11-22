Our next mission is to invite users to private parties.

We have subscribed to list of all users, but we can't invite everyone.
We can't invite the owner of the party and we can't invite users who are already invited, so why not filter them out of the view?

To do so we will use the powerful [filter feature](https://docs.angularjs.org/guide/filter) of Angular 1.

Filters can work on array as well as single values.
We can aggregate any number of filters on top of each other.

Here is the list of all of Angular 1 built-in filters:
[https://docs.angularjs.org/api/ng/filter](https://docs.angularjs.org/api/ng/filter)

And here is a 3rd party library with many more filters:
[angular-filter](https://github.com/a8m/angular-filter)


Now let's create a custom filter that will filter out users that are the owners of a certain party and that are already invited to it.

Create a new folder named `filters` under the `imports/ui` folder.

Under that folder create a new file named `uninvitedFilter.js` and place that code inside:

{{{diff_step 13.1}}}

* First we create a module named `uninvitedFilter`
* Then we define a filter to the module with the same name
* Filters always get at least one parameter and the first parameter is always the object or array that we are filtering (like the parties in the previous example)
Here we are filtering the users array, so that's the first parameter
* The second parameter is the party we want to check
* The first if statement is to make sure we passed the initializing phase of the party and it's not undefined

At this point we need to return the filtered array.

We use `filter` method to remove each user that neither is the party's owner nor hasn't been invited.

To make our lives easier, we can just use `underscore` package.

    $ meteor npm install --save underscore

{{{diff_step 13.3}}}

So now let's use our new filter.

We will create a component to display list of uninvited users. Let's call it `PartyUninvited`.

First, we need a template. Use already exist one view from PartyDetails and move it to a separate file:

{{{diff_step 13.4}}}

Then, create the actual component:

{{{diff_step 13.5}}}

PartyUninvited has a one-way binding called `party`. Without a party we can't say who hasn't been invited!

Since we have `users` helper we have also add `UninvitedFilter`:

{{{diff_step 13.6}}}

Let's use the filter:

{{{diff_step 13.7}}}

And add it to the PartyDetails component

{{{diff_step 13.8}}}

{{{diff_step 13.9}}}

Run the app and see the users in each party.

We still don't have invites but you can see that the filter already filters the party owners out of the list.

But some of the users don't have emails (maybe some of them may have signed in with Facebook). In that case we want to display their name and not the empty email field.

But it's only in the display so its perfect for a filter.

So let's create another custom filter `DisplayNameFilter`.

Create a new file under the filters folder named `displayNameFiler.js` and place that code inside:

{{{diff_step 13.10}}}

Pretty simple logic but it's so much nicer to put it here and make the HTML shorter and more readable.

AngularJS can also display the return value of a function in the HTML.

To demonstrate let's use DisplayNameFilter in PartyUninvited:

{{{diff_step 13.11}}}

{{{diff_step 13.12}}}

We have now list of uninvited users but we don't have an information about owner of each party.

Let's create `PartyCreator` component:

{{{diff_step 13.13}}}

{{{diff_step 13.14}}}

We created a `creator` helper that tell the viewer who the owner is.
Now we have to implement it in the PartiesList component:

{{{diff_step 13.15}}}

{{{diff_step 13.16}}}

# Summary

In this chapter we learned about Angular 1 filters and how easy they are to use and to read from the HTML.

In the next step we will learn about Meteor methods, which enables us to run custom logic in the server, beyond the Mongo API and the allow/deny methods.

# Testing

{{{diff_step 13.17}}}
