[{]: <region> (header)
# Step 8: User accounts, authentication and permissions
[}]: #
[{]: <region> (body)
One of Meteor's most powerful packages is the Meteor account system.

Right now, our app is publishing all the parties to all the clients, and all the clients can change those parties. The changes are then reflected back to all
the other clients automatically.

This is super powerful and easy, but what about security?  We don't want any user to be able to change any party...

First thing we should do is to remove the `insecure` package that automatically added to any new Meteor application.

The 'insecure' package makes the default behaviour of Meteor collections to permit all.

By removing that package the default behaviour is changed to deny all.

Execute this command in the command line:

    $ meteor remove insecure

Now let's try to change the parties array or a specific party.  We get

    remove failed: Access denied

In the console because we don't have permissions to do that.    

Now, we need to write an explicit security rule for each operation we want to allow the client to do on the Mongo collection.

So first, let's add the `accounts-password` Meteor package.
It's a very powerful package for all the user operations you can think of: login, sign-up, change password, password recovery, email confirmation and more.

    $ meteor add accounts-password

Now we will also add the `dotansimha:accounts-ui-angular` package.  This package contains all the HTML and CSS we need for the user operation forms.

Later on in this tutorial we will replace those default account-ui forms with custom Angular 1 forms.

    $ meteor add dotansimha:accounts-ui-angular

Now let's add dependency to the `accounts.ui` module in our module definition:

[{]: <helper> (diff_step 8.4)
#### Step 8.4: Add a dependecy for accounts-ui package

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -17,7 +17,8 @@
 ┊17┊17┊  uiRouter,
 ┊18┊18┊  PartiesList,
 ┊19┊19┊  PartyDetails,
-┊20┊  ┊  Navigation
+┊  ┊20┊  Navigation,
+┊  ┊21┊  'accounts.ui'
 ┊21┊22┊]).component(name, {
 ┊22┊23┊  template,
 ┊23┊24┊  controllerAs: name,
```
[}]: #

Now let's add the `login-buttons` directive (part of `accounts.ui` module) into Socially.

So the `socially.html` will look like this:

[{]: <helper> (diff_step 8.5)
#### Step 8.5: Add usage for login-buttons directive

##### Changed imports/ui/components/socially/socially.html
```diff
@@ -1,3 +1,5 @@
+┊ ┊1┊<login-buttons></login-buttons>
+┊ ┊2┊
 ┊1┊3┊<navigation></navigation>
 ┊2┊4┊
 ┊3┊5┊<div ui-view=""></div>
```
[}]: #

Run the code, create an account, login, logout...

Now that we have our account system, we can start defining our security rules for the parties.

Let's go to the model folder and change the file to look like this:

[{]: <helper> (diff_step 8.6)
#### Step 8.6: Add allow logic to the model

##### Changed imports/api/parties.js
```diff
@@ -1,3 +1,15 @@
 ┊ 1┊ 1┊import { Mongo } from 'meteor/mongo';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊export const Parties = new Mongo.Collection('parties');
+┊  ┊ 4┊
+┊  ┊ 5┊Parties.allow({
+┊  ┊ 6┊  insert(userId, party) {
+┊  ┊ 7┊    return userId && party.owner === userId;
+┊  ┊ 8┊  },
+┊  ┊ 9┊  update(userId, party, fields, modifier) {
+┊  ┊10┊    return userId && party.owner === userId;
+┊  ┊11┊  },
+┊  ┊12┊  remove(userId, party) {
+┊  ┊13┊    return userId && party.owner === userId;
+┊  ┊14┊  }
+┊  ┊15┊});
```
[}]: #

The [collection.allow Meteor function](http://docs.meteor.com/#/full/allow) defines the permissions that the client needs to write directly to the collection (like we did until now).

In each callback of action type (insert, update, remove) the functions should return true if they think the operation should be allowed.
Otherwise they should return false, or nothing at all (undefined).

The available callbacks are:

* `insert(userId, doc)`

  The user userId wants to insert the document doc into the collection. Return true if this should be allowed.

  doc will contain the _id field if one was explicitly set by the client, or if there is an active transform. You can use this to prevent users from specifying arbitrary _id fields.

* `update(userId, doc, fieldNames, modifier)`

  The user userId wants to update a document doc. (doc is the current version of the document from the database, without the proposed update.) Return true to permit the change.

  fieldNames is an array of the (top-level) fields in doc that the client wants to modify, for example ['name', 'score'].

  modifier is the raw Mongo modifier that the client wants to execute; for example, {$set: {'name.first': "Alice"}, $inc: {score: 1}}.

  Only Mongo modifiers are supported (operations like $set and $push). If the user tries to replace the entire document rather than use $-modifiers, the request will be denied without checking the allow functions.

* `remove(userId, doc)`

  The user userId wants to remove doc from the database. Return true to permit this.


In our example:

* insert - only if the user who makes the insert is the party owner.
* update - only if the user who makes the update is the party owner.
* remove - only if the user who deletes the party is the party owner.


OK, right now none of the parties has an owner so we can't change any of them.

So let's add the following simple code to define an owner for each party that gets created.

We can use `Meteor.userId()` method which returns the current user id.

We will use this id that add it to our new party:

[{]: <helper> (diff_step 8.7)
#### Step 8.7: Add current user to the new party

##### Changed imports/ui/components/partyAdd/partyAdd.js
```diff
@@ -1,6 +1,8 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊
+┊ ┊4┊import { Meteor } from 'meteor/meteor';
+┊ ┊5┊
 ┊4┊6┊import template from './partyAdd.html';
 ┊5┊7┊import { Parties } from '../../../api/parties';
 ┊6┊8┊
```
```diff
@@ -10,6 +12,7 @@
 ┊10┊12┊  }
 ┊11┊13┊
 ┊12┊14┊  submit() {
+┊  ┊15┊    this.party.owner = Meteor.userId();
 ┊13┊16┊    Parties.insert(this.party);
 ┊14┊17┊    this.reset();
 ┊15┊18┊  }
```
[}]: #

So first we set the new party's owner to our current user's id and then insert it to the parties collection like before.

Now, start the app in 2 different browsers and login with 2 different users.

Test edit and remove your own parties, and try to do the same for parties owned by another user.

# Social login

We also want to let users login with their Facebook and Twitter accounts.

To do this, we simply need to add the right packages in the console:

    meteor add accounts-facebook accounts-twitter

Now run the app.  When you first press the login buttons of the social login, meteor will show you a wizard that will help you define your app.

You can also skip the wizard and configure it manually like the explanation here: [http://docs.meteor.com/#meteor_loginwithexternalservice](http://docs.meteor.com/#meteor_loginwithexternalservice)

There are more social login services you can use:

* Facebook
* Github
* Google
* Meetup
* Twitter
* Weibo
* Meteor developer account


# Authentication With Routers

Now that we prevented authorized users from changing parties they don't own,
there is no reason for them to go into the party details page.

We can easily prevent them from going into that view using our routes.

We will use Meteor's API again, and we will use AngularJS `$q` to easily create promises.

Our promise will resolve it there is a user logged in, and otherwise we will reject it.

We are going to use the [resolve](https://github.com/angular-ui/ui-router/wiki#resolve) object of ui-router and ngRoute:

[{]: <helper> (diff_step 8.9)
#### Step 8.9: Add permissions limit to the party details page

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -2,6 +2,8 @@
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊import uiRouter from 'angular-ui-router';
 ┊4┊4┊
+┊ ┊5┊import { Meteor } from 'meteor/meteor';
+┊ ┊6┊
 ┊5┊7┊import template from './partyDetails.html';
 ┊6┊8┊import { Parties } from '../../../api/parties';
 ┊7┊9┊
```
```diff
@@ -58,6 +60,15 @@
 ┊58┊60┊
 ┊59┊61┊  $stateProvider.state('partyDetails', {
 ┊60┊62┊    url: '/parties/:partyId',
-┊61┊  ┊    template: '<party-details></party-details>'
+┊  ┊63┊    template: '<party-details></party-details>',
+┊  ┊64┊    resolve: {
+┊  ┊65┊      currentUser($q) {
+┊  ┊66┊        if (Meteor.userId() === null) {
+┊  ┊67┊          return $q.reject();
+┊  ┊68┊        } else {
+┊  ┊69┊          return $q.resolve();
+┊  ┊70┊        }
+┊  ┊71┊      }
+┊  ┊72┊    }
 ┊62┊73┊  });
 ┊63┊74┊}
```
[}]: #

Now, if a user is not logged in to the system, it won't be able to access that route.

We also want to handle that scenario and redirect the user to the main page.

on the top of the routes file, let's add these lines (the `run` block), and we will also add a "reason" for the `reject()` call, to detect if it's our reject that cause the route error.

[{]: <helper> (diff_step 8.10)
#### Step 8.10: Add the reason of rejection

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -64,7 +64,7 @@
 ┊64┊64┊    resolve: {
 ┊65┊65┊      currentUser($q) {
 ┊66┊66┊        if (Meteor.userId() === null) {
-┊67┊  ┊          return $q.reject();
+┊  ┊67┊          return $q.reject('AUTH_REQUIRED');
 ┊68┊68┊        } else {
 ┊69┊69┊          return $q.resolve();
 ┊70┊70┊        }
```
[}]: #

[{]: <helper> (diff_step 8.11)
#### Step 8.11: Handle `AUTH_REQUIRED`

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -24,7 +24,8 @@
 ┊24┊24┊  controllerAs: name,
 ┊25┊25┊  controller: Socially
 ┊26┊26┊})
-┊27┊  ┊  .config(config);
+┊  ┊27┊  .config(config)
+┊  ┊28┊  .run(run);
 ┊28┊29┊
 ┊29┊30┊function config($locationProvider, $urlRouterProvider) {
 ┊30┊31┊  'ngInject';
```
```diff
@@ -33,3 +34,15 @@
 ┊33┊34┊
 ┊34┊35┊  $urlRouterProvider.otherwise('/parties');
 ┊35┊36┊}
+┊  ┊37┊
+┊  ┊38┊function run($rootScope, $state) {
+┊  ┊39┊  'ngInject';
+┊  ┊40┊
+┊  ┊41┊  $rootScope.$on('$stateChangeError',
+┊  ┊42┊    (event, toState, toParams, fromState, fromParams, error) => {
+┊  ┊43┊      if (error === 'AUTH_REQUIRED') {
+┊  ┊44┊        $state.go('parties');
+┊  ┊45┊      }
+┊  ┊46┊    }
+┊  ┊47┊  );
+┊  ┊48┊}
```
[}]: #

# Summary

Amazing, only a few lines of code and we have a secure application!

Please note it is possible for someone with malicious intent to override your route on the client (in the client/routes.js).
As that is where we are validating the user is authenticated, they can remove the check and get access.
You should never restrict access to sensitive data, sensitive areas, using the client router.  
This is the reason we also made restrictions on the server using the allow/deny functionality, so even if someone gets in they cannot make updates.
While this prevents writes from happening from unintended sources, reads can still be an issue.
The next step will take care of privacy, not showing users parties they are not allowed to see.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step7.md) | [Next Step >](step9.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #