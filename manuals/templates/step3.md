We now have a nice client side application that creates and renders its own data.

If we were in any framework other than Meteor, we would start implementing a series of REST endpoints to connect the server to the client.
Also, we would need to create a database and functions to connect to it.

And we haven't talked about realtime, in which case we would need to add sockets, and a local DB for cache and handle latency compensation (or just ignore those features and create a not - so - good and modern app...)

But luckily, we're using Meteor!


Meteor makes writing distributed client code as simple as talking to a local database.

Every Meteor client includes an in-memory database cache. To manage the client cache, the server publishes sets of JSON documents, and the client subscribes to these sets. As documents in a set change, the server patches each client's cache automatically.

That introduces us to a new concept - **Full Stack Reactivity**.

In an Angularish language we might call it **3 way data binding**.

The way to handle data in Meteor is through the `Mongo.Collection` class. It is used to declare MongoDB collections and to manipulate them.

Thanks to minimongo, Meteor's client-side Mongo emulator, `Mongo.Collection` can be used from both client and server code.

# Declare a collection

So first, let's define the parties collection that will store all our parties.

Create new file, like this:

{{{diff_step 3.1}}}

> Note that the `Mongo.Collection` has been used in a file that is outside /client or /server folders. This is because we want this file to be loaded in both client and server, and AngularJS files are loaded in the client side only.

> That means that this collection and the actions on it will run both on the client (minimongo) and the server (Mongo), you only have to write it once, and Meteor will take care of syncing both of them.

# Binding to Angular 1

Now that we've created the collection, our client needs to subscribe to its changes and bind it to our parties array.

To bind them we are going to use the built-in angular-meteor feature called [helpers](/api/1.3.2/helpers).

Those of you who used Meteor before, should be familiar with the concept of Helpers - these are definitions that will be available in the view, and will also have [reactive](http://docs.meteor.com/#/full/reactivity).

We are going to replace the declaration of `$scope.parties` with the following command inside the `PartiesListCtrl` controller:

{{{diff_step 3.2}}}

This line declares a new `$scope.parties` variable (so we don't need to do something like `$scope.parties = [];` ) and then binds it to the Parties Mongo collection.

So you can access that `$scope.parties` exactly like you did before.

In this example, we return a MongoDB Cursor (the return value of `find`), which is a function, and Angular-Meteor wraps it as array, so when we will use `$scope.parties` (in view or in a controller) - it would be a regular JavaScript array!

A `helper` could be a function or any other variable type.

* Functions will re-run every time something inside has changed and will bind the returned value to a scope variable and to the view
* Regular values will be declared both as [Reactive Vars](http://docs.meteor.com/#/full/reactivevar_pkg) and scope variable. That means that they will bind directly to the view with Angular and also fire a Meteor change event to trigger a re-run if they are used inside a helper function or a Meteor.autorun  

> Example for two helpers with relationship: function that fetches search results (function helper) and string that used as search parameter (string helper). we will show more of those examples in the next chapters of the tutorials.

Now every change that happens to the `$scope.parties` variable will automatically be saved to the local minimongo and synced to the MongoDB server DB and all the other clients in realtime!

But we still don't have data in that collection, so let's add some by initializing our server with the same parties we had before.

Let's create a file named `main.js` in the server folder, and add this content:

{{{diff_step 3.3}}}

As you can probably understand, this code runs only on the server, and when Meteor starts it initializes the DB with these sample parties.

Run the app and you should see the list of parties on the screen.

In the next chapter we will see how easy it is to manipulate the data, save and publish changes to the server, and how by doing so, all the connected clients will automatically get updated.

# Inserting parties from the console

Items inside collections are called documents. Let's use the server database console to insert some documents into our collection.
In a new terminal tab, go to your app directory and type:

    meteor mongo

This opens a console into your app's local development database. At the prompt, type:

    db.parties.insert({ name: "A new party", description: "From the mongo console!" });

In your web browser, you will see the UI of your app immediately update to show the new party.
As you see we didn't have to write any code to connect the server-side database to our front-end code — it just happened automatically.

Insert a few more parties from the database console with different text.

Now let's do the same but with remove. At the prompt, type the following command to look at all the parties and their properties:

    db.parties.find();

Now choose one party you want to remove and copy it's `id` property.
Remove it using that id (replace `N4KzMEvtm4dYvk2TF` with your party's id value):

    db.parties.remove( {"_id": "N4KzMEvtm4dYvk2TF"});

Again, you will see the UI of your app immediately update with that party removed.

Try running more actions like updating an object from the console and so on. Check out the mongodb documentation to explore <a href="http://docs.mongodb.org/manual/tutorial/getting-started-with-the-mongo-shell/">the mongodb shell</a>.

# Upgrading to controllerAs syntax

As a best practice, and as preparation for the future Angular 2.0, we recommend use `controllerAs` syntax, you can find more information about why and how to use it in [JohnPapa's styleguide](https://github.com/johnpapa/angular-styleguide#style-y030)

So first, let's give a name to our controller in the view:

{{{diff_step 3.4}}}

Great, now we need to make some changes in the implementation of the controller - the first step is use `this` instead of `$scope` inside the controller.

We also need to call [$reactive](/api/1.3.0/reactive) now and attach the `$scope` in order to declare and extend the controller, and turn it to Reactive controller.

> You do not need to do this when using just `$scope` without `controllerAs` because Angular-Meteor does this for you.

{{{diff_step 3.5}}}

Great! Now let's move on and improve our code skills even more!

# Upgrading to Components syntax

In order to use best practices we will implement our controller inside an Component.

A Component is a regular directive, with controller and with specific logic that connects the view and the controller logic into one HTML tag.

This is a better pattern that let's you reuse code more easily but you can continue using your current way of writing Angular apps because the controller code stays the same.

You can find some more information about this approach [here](http://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html).

First, let's create a template for our Component:

{{{diff_step 3.8}}}

* We copied the code from `main.html`
* We removed the `ng-controller` because we no longer need it
* We renamed `vm` to `partiesList` which we defined in the Component here
* We removed all contents from `main.html`

Now, let's convert our Controller into a Component:

{{{diff_step 3.6}}}

* We used `component` method to define new Component
* We named the Component very similar to the previous Controller
* We connect the Component to a template with `templateUrl`
* We named the Component's controller like we did with `controllerAs`
* We copied the same controller code into`controller`  

> In Angular 1.5 there is a new `component` function that is not exactly the same thing as a `directive`. You should [read more](https://docs.angularjs.org/guide/component) about it in the official guide.

We can now just delete the code in `main.html` and instead call out Component:

{{{diff_step 3.7}}}

That's it!

Now we can use `<parties-list>` tag anywhere, and we will get the list of parties!

# Full advantage of ES2015 support in Meteor 1.3

Since we're serious developers and Meteor gives us ability to use things from the future, let's move Socially to the next level!

To make Socially easier to maintain we can use es6 classes and modules.

Let's create an `imports` folder. It allows us to lazy-load modules.

To fully move PartiesList component we have to create space for it.

This is a structure of the Socially app:

    client/
    imports/
      ui/
        components/ - put here every component
          partiesList/
          .../
    server/

{{{diff_step 3.9}}}

{{{diff_step 3.10}}}

* We transformed Controller to be a es6 class instead of just a function (it will be easier to move things to Angular2 in the future)
* We create angular module with the same name as the Component
* We export angular module
* We changed `templateUrl`


Because `PartiesList` module is in `imports` and it's lazy-loaded we have to import it into Socially:

{{{diff_step 3.11}}}


As you can see in your browser, template is missing. It's also lazy-loaded.

{{{diff_step 3.14}}}

Let me explain to you what happened there.

You could just import the html file but with the latest version of `angular-templates` it's possible to get a full path of a used file. See the example below:

```js
// You're inside: imports/ui/button.js

import templateUrl from './button.html';

console.log(templateUrl); // outputs: imports/ui/button.html
```

# Templates as strings

There is no component without a template so instead of asynchronously loading an html file we can use `urigo:static-templates` package. It allows you to import template as a string.

Okay, so first step will be to remove `angular-templates`:

```bash
$ meteor remove angular-templates
```

Then we can add `urigo:static-templates` package:

```bash
$ meteor add urigo:static-templates
```

Let me show you how it works:

```js
import template from './button.html';

console.log(template); // outputs: contents of button.html as a minified string
```

Okay, now you understand what's going on, so we can move on and implement it inside PartiesList:

{{{diff_step 3.16}}}

Since we want to use components in Socially we still have to create a main component, just like we had a main controller.

Let's do the same steps as we did with PartiesList.

{{{diff_step 3.17}}}

{{{diff_step 3.18}}}

Now we can update main view in index.html file and load Socially in main.js

{{{diff_step 3.19}}}

Here, change the main.js file like this : (remove "import { name as PartiesList } ..." and "angular.module('socially', [...")

{{{diff_step 3.20}}}

# Summary

In this chapter you saw how easy and fast it is to create a full connection between our client data, the server and all the other connected clients.

Also, we improved our code quality and used AngularJS best practices.

In the next step, we'll see how to add functionality to our app's UI so that we can add parties without using the database console.
