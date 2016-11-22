[{]: <region> (header)
# Step 12: Search, sort, pagination and reactive vars
[}]: #
[{]: <region> (body)
Currently we are dealing with only a few parties, but we also need to support a large number of parties.

Therefore, we want to have `pagination` support.

With pagination we can break the array of parties down to pages so the user won't have to scroll down to find a party,
but also, and even more importantly, we can fetch only a few parties at a time instead of the entire parties collection for better performance.

The interesting thing about pagination is that it is dependent on the filters we want to put on top of the collection.
For example, if we are in page 3, but we change how we sort the collection, we should get different results.
Same thing with search: if we start a search, there might not be enough results for 3 pages.

For Angular 1 developers this chapter will show how powerful Meteor is.
In the official Angular 1 tutorial, we added sorting and search that only worked on the client side, which in real world scenarios is not very helpful.
Now, in this chapter we are going to perform a real-time search, sort and paginate that will run all the way to the server.

# angular-meteor pagination support

What we want to achieve with angular-meteor is *server-based reactive pagination*.
That is no simple task, but using angular-meteor could make life a lot simpler.

To achieve server-based reactive pagination we need to have support for pagination on the server as well as on the client.
This means that our publish function for the parties collection would have to change and so does the way that we subscribe to that publication.
So first let's take care of our server-side:

In our `publish.js` file in the parties directory we are going to add the `options` variable to the publish method like this:

[{]: <helper> (diff_step 12.1)
#### Step 12.1: Add options to the parties publish

##### Changed imports/api/parties/publish.js
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊import { Parties } from './collection';
 ┊4┊4┊
 ┊5┊5┊if (Meteor.isServer) {
-┊6┊ ┊  Meteor.publish('parties', function() {
+┊ ┊6┊  Meteor.publish('parties', function(options) {
 ┊7┊7┊    const selector = {
 ┊8┊8┊      $or: [{
 ┊9┊9┊        // the public parties
```
```diff
@@ -26,6 +26,6 @@
 ┊26┊26┊      }]
 ┊27┊27┊    };
 ┊28┊28┊
-┊29┊  ┊    return Parties.find(selector);
+┊  ┊29┊    return Parties.find(selector, options);
 ┊30┊30┊  });
 ┊31┊31┊}
```
[}]: #

Now our publish method receives an options argument which we then pass to the `Parties.find()` function call.
This will allow us to send arguments to the find function's modifier right from the subscribe call. The options object can
contain properties like `skip`, `sort` and `limit` which we will shortly use ourselves - [Collection Find](http://docs.meteor.com/#/full/find).

Let's get back to our client code. We now need to change our subscribe call with options we want to set for pagination.
What are those parameters that we want to set on the options argument? In order to have pagination in our
parties list we will need to save the current page, the number of parties per page and the sort order. So let's add these parameters to our PartiesList component.

We will `perPage`, `page` and `sort` variables will later effect our subscription and we want the subscription to re-run every time one of them changes.

[{]: <helper> (diff_step 12.2)
#### Step 12.2: Add the pagination default params

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -13,6 +13,12 @@
 ┊13┊13┊
 ┊14┊14┊    $reactive(this).attach($scope);
 ┊15┊15┊
+┊  ┊16┊    this.perPage = 3;
+┊  ┊17┊    this.page = 1;
+┊  ┊18┊    this.sort = {
+┊  ┊19┊      name: 1
+┊  ┊20┊    };
+┊  ┊21┊
 ┊16┊22┊    this.subscribe('parties');
 ┊17┊23┊
 ┊18┊24┊    this.helpers({
```
[}]: #

Right now, we just use `subscribe` without any parameters, but we need to provide some arguments to the subscriptions.

In order to do that, we will add a second parameter to the `subscribe` method, and we will provide a function that returns an array of arguments for the subscription.

We will use `getReactively` in order to get the current value, and this will also make them Reactive variables, and every change of them will effect the subscription parameters.

[{]: <helper> (diff_step 12.3)
#### Step 12.3: Add the params to the subscription

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -19,7 +19,11 @@
 ┊19┊19┊      name: 1
 ┊20┊20┊    };
 ┊21┊21┊
-┊22┊  ┊    this.subscribe('parties');
+┊  ┊22┊    this.subscribe('parties', () => [{
+┊  ┊23┊      limit: parseInt(this.perPage),
+┊  ┊24┊      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
+┊  ┊25┊      sort: this.getReactively('sort')}
+┊  ┊26┊    ]);
 ┊23┊27┊
 ┊24┊28┊    this.helpers({
 ┊25┊29┊      parties() {
```
[}]: #

That means that `this.page` and `this.sort` are now reactive and Meteor will re-run the subscription every time one of them will change.

Now we've built an object that contains 3 properties:

* **limit** - how many parties to send per page
* **skip**  - the number of parties we want to start with, which is the current page minus one, times the parties per page
* **sort**  - the sorting of the collection in [MongoDB syntax](http://docs.mongodb.org/manual/reference/method/cursor.sort/)

Now we also need to add the sort modifier to the way we get the collection data from the Minimongo.
That is because the sorting is not saved when the data is sent from the server to the client.
So to make sure our data is also sorted on the client, we need to define it again in the parties collection.

To do that we are going to add the `sort` variable, and use it again with `getReactively`, in order to run the helper each time the `sort` changes:

[{]: <helper> (diff_step 12.4)
#### Step 12.4: Add the sort parameter to the collection helper

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -27,7 +27,9 @@
 ┊27┊27┊
 ┊28┊28┊    this.helpers({
 ┊29┊29┊      parties() {
-┊30┊  ┊        return Parties.find({});
+┊  ┊30┊        return Parties.find({}, {
+┊  ┊31┊          sort : this.getReactively('sort')
+┊  ┊32┊        });
 ┊31┊33┊      }
 ┊32┊34┊    });
 ┊33┊35┊  }
```
[}]: #

# pagination directive

Now we need a UI to change pages and move between them.

In Angular 1's eco system there are a lot of directives for handling pagination.

Our personal favorite is [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination).

To add the directive add its Meteor package to the project:

    meteor npm install --save angular-utils-pagination

Add it as a dependency to our Socially app:

[{]: <helper> (diff_step 12.6)
#### Step 12.6: Add new dependency

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊import uiRouter from 'angular-ui-router';
+┊ ┊4┊import utilsPagination from 'angular-utils-pagination';
 ┊4┊5┊
 ┊5┊6┊import template from './partiesList.html';
 ┊6┊7┊import { Parties } from '../../../api/parties';
```
```diff
@@ -41,6 +42,7 @@
 ┊41┊42┊export default angular.module(name, [
 ┊42┊43┊  angularMeteor,
 ┊43┊44┊  uiRouter,
+┊  ┊45┊  utilsPagination,
 ┊44┊46┊  PartyAdd,
 ┊45┊47┊  PartyRemove
 ┊46┊48┊]).component(name, {
```
[}]: #

Now let's add the directive in `PartiesList`, change the `ng-repeat` of parties to this:

[{]: <helper> (diff_step 12.7)
#### Step 12.7: Add usage to the dir-pagination directive

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊<party-add></party-add>
 ┊2┊2┊
 ┊3┊3┊<ul>
-┊4┊ ┊  <li ng-repeat="party in partiesList.parties">
+┊ ┊4┊  <li dir-paginate="party in partiesList.parties | itemsPerPage: partiesList.perPage" total-items="partiesList.partiesCount">
 ┊5┊5┊    <a ui-sref="partyDetails({ partyId: party._id })">
 ┊6┊6┊      {{party.name}}
 ┊7┊7┊    </a>
```
[}]: #

and after the UL closes, add this directive:

[{]: <helper> (diff_step 12.8)
#### Step 12.8: Add the pagination controls to the view

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -9,3 +9,5 @@
 ┊ 9┊ 9┊    <party-remove party="party"></party-remove>
 ┊10┊10┊  </li>
 ┊11┊11┊</ul>
+┊  ┊12┊
+┊  ┊13┊<dir-pagination-controls on-page-change="partiesList.pageChanged(newPageNumber)"></dir-pagination-controls>
```
[}]: #

As you can see, `dir-paginate` list takes the number of objects in a page (that we defined before) but also takes the total number of items (we will get to that soon).
With this binding it calculates which page buttons it should display inside the `dir-pagination-controls` directive.

On the `dir-pagination-controls` directive there is a method `on-page-change` and there we can call our own function.

So we call the `pageChanged` function with the new selection as a parameter.

Let's create the `pageChanged` function inside the `PartiesList` component:

[{]: <helper> (diff_step 12.9)
#### Step 12.9: Add the pageChanged method to the component

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -34,6 +34,10 @@
 ┊34┊34┊      }
 ┊35┊35┊    });
 ┊36┊36┊  }
+┊  ┊37┊
+┊  ┊38┊  pageChanged(newPage) {
+┊  ┊39┊    this.page = newPage;
+┊  ┊40┊  }
 ┊37┊41┊}
 ┊38┊42┊
 ┊39┊43┊const name = 'partiesList';
```
[}]: #

Now every time we change the page, the scope variable will change accordingly and update the bind method that watches it.

* Note that, at this point, the pagination will *not* work until we add the missing `partiesCount` variable in the next step of the tutorial.

# Getting the total count of a collection

Getting a total count of a collection might seem easy, but there is a problem:
The client only holds the number of objects that it subscribed to. This means that, if the client is not subscribed to the whole array, calling find().count on a collection will result in a partial count.

So we need access on the client to the total count even if we are not subscribed to the whole collection.

For that we can use the [tmeasday:publish-counts](https://github.com/percolatestudio/publish-counts) package.
On the command line:

    meteor add tmeasday:publish-counts

This package helps to publish the count of a cursor in real-time, without any dependency on the subscribe method.

Inside the `imports/api/parties/publish.js` file, add the code that handles the count inside the `Meteor.publish('parties')` function, at the beginning of the function, before the existing return statement.
So the file should look like this now:

[{]: <helper> (diff_step 12.11)
#### Step 12.11: Add usage of Counts

##### Changed imports/api/parties/publish.js
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊import { Counts } from 'meteor/tmeasday:publish-counts';
 ┊2┊3┊
 ┊3┊4┊import { Parties } from './collection';
 ┊4┊5┊
```
```diff
@@ -26,6 +27,10 @@
 ┊26┊27┊      }]
 ┊27┊28┊    };
 ┊28┊29┊
+┊  ┊30┊    Counts.publish(this, 'numberOfParties', Parties.find(selector), {
+┊  ┊31┊      noReady: true
+┊  ┊32┊    });
+┊  ┊33┊
 ┊29┊34┊    return Parties.find(selector, options);
 ┊30┊35┊  });
 ┊31┊36┊}
```
[}]: #

As you can see, we query only the parties that should be available to that specific client, but without the options variable so we get the full number of parties.

* We are passing `{ noReady: true }` in the last argument so that the publication will be ready only after our main cursor is ready - [readiness](https://github.com/percolatestudio/publish-counts#readiness).

With this, we have access to the Counts collection from our client.

So let's create another helper that uses `Counts`:

[{]: <helper> (diff_step 12.12)
#### Step 12.12: Add the Count usage in the component

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -3,6 +3,8 @@
 ┊ 3┊ 3┊import uiRouter from 'angular-ui-router';
 ┊ 4┊ 4┊import utilsPagination from 'angular-utils-pagination';
 ┊ 5┊ 5┊
+┊  ┊ 6┊import { Counts } from 'meteor/tmeasday:publish-counts';
+┊  ┊ 7┊
 ┊ 6┊ 8┊import template from './partiesList.html';
 ┊ 7┊ 9┊import { Parties } from '../../../api/parties';
 ┊ 8┊10┊import { name as PartyAdd } from '../partyAdd/partyAdd';
```
```diff
@@ -31,6 +33,9 @@
 ┊31┊33┊        return Parties.find({}, {
 ┊32┊34┊          sort : this.getReactively('sort')
 ┊33┊35┊        });
+┊  ┊36┊      },
+┊  ┊37┊      partiesCount() {
+┊  ┊38┊        return Counts.get('numberOfParties');
 ┊34┊39┊      }
 ┊35┊40┊    });
 ┊36┊41┊  }
```
[}]: #

Now the `partiesCount` will hold the number of parties and will send it to the directive in `PartiesList` (which we've already defined earlier).

# Reactive variables

Meteor is relying deeply on the concept of [reactivity](http://docs.meteor.com/#/full/reactivity).

This means that, when a [reactive variable](http://docs.meteor.com/#/full/reactivevar) changes, Meteor is made aware of it via its [Tracker object](http://docs.meteor.com/#/full/tracker_autorun).

But Angular's scope variables are only watched by Angular and are not reactive vars for Meteor...

For that, angular-meteor provides the `helpers`, and each time you will defined a variable, a new `ReactiveVar` will be created and will cause the Tracker to update all the subscriptions!


# Changing the sort order reactively

We haven't placed a way to change sorting anywhere in the UI, so let's do that right now.

Create template for the new Component called `PartiesSort`:

[{]: <helper> (diff_step 12.13)
#### Step 12.13: Create view for PartiesSort component

##### Added imports/ui/components/partiesSort/partiesSort.html
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊<div>
+┊ ┊2┊  <select ng-model="partiesSort.order" ng-change="partiesSort.changed()">
+┊ ┊3┊    <option value="1">Ascending</option>
+┊ ┊4┊    <option value="-1">Descending</option>
+┊ ┊5┊  </select>
+┊ ┊6┊</div>
```
[}]: #

Now we can create actual component:

[{]: <helper> (diff_step 12.14)
#### Step 12.14: Create PartiesSort component

##### Added imports/ui/components/partiesSort/partiesSort.js
```diff
@@ -0,0 +1,36 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import template from './partiesSort.html';
+┊  ┊ 5┊
+┊  ┊ 6┊class PartiesSort {
+┊  ┊ 7┊  constructor($timeout) {
+┊  ┊ 8┊    'ngInject';
+┊  ┊ 9┊
+┊  ┊10┊    $timeout(() => this.changed());
+┊  ┊11┊  }
+┊  ┊12┊
+┊  ┊13┊  changed() {
+┊  ┊14┊    this.onChange({
+┊  ┊15┊      sort: {
+┊  ┊16┊        [this.property]: parseInt(this.order)
+┊  ┊17┊      }
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊}
+┊  ┊21┊
+┊  ┊22┊const name = 'partiesSort';
+┊  ┊23┊
+┊  ┊24┊// create a module
+┊  ┊25┊export default angular.module(name, [
+┊  ┊26┊  angularMeteor
+┊  ┊27┊]).component(name, {
+┊  ┊28┊  template,
+┊  ┊29┊  bindings: {
+┊  ┊30┊    onChange: '&',
+┊  ┊31┊    property: '@',
+┊  ┊32┊    order: '@'
+┊  ┊33┊  },
+┊  ┊34┊  controllerAs: name,
+┊  ┊35┊  controller: PartiesSort
+┊  ┊36┊});
```
[}]: #

Binding? Methods? Don't worry. Let me explain it.

PartiesSort uses 3 bindings:

* onChange - an expression that is called on every sort change
* property - a value with field's name that will be used in sorting
* order - a value with default order (1 or -1)

As you can see there is a changed() method. It is called when user changes sorting order. It calls onChange expression with one argument wich is the *sort* object. It contains just one property (you can expend it in the future!) with name of the sorted field as a key and the order as a value.

Let's now add our component to the PartiesList:

[{]: <helper> (diff_step 12.15)
#### Step 12.15: Add as a dependency

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊
 ┊ 8┊ 8┊import template from './partiesList.html';
 ┊ 9┊ 9┊import { Parties } from '../../../api/parties';
+┊  ┊10┊import { name as PartiesSort } from '../partiesSort/partiesSort';
 ┊10┊11┊import { name as PartyAdd } from '../partyAdd/partyAdd';
 ┊11┊12┊import { name as PartyRemove } from '../partyRemove/partyRemove';
 ┊12┊13┊
```
```diff
@@ -52,6 +53,7 @@
 ┊52┊53┊  angularMeteor,
 ┊53┊54┊  uiRouter,
 ┊54┊55┊  utilsPagination,
+┊  ┊56┊  PartiesSort,
 ┊55┊57┊  PartyAdd,
 ┊56┊58┊  PartyRemove
 ┊57┊59┊]).component(name, {
```
[}]: #

[{]: <helper> (diff_step 12.16)
#### Step 12.16: Implement component

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊<party-add></party-add>
 ┊2┊2┊
+┊ ┊3┊<parties-sort on-change="partiesList.sortChanged(sort)" property="name" order="1"></parties-sort>
+┊ ┊4┊
 ┊3┊5┊<ul>
 ┊4┊6┊  <li dir-paginate="party in partiesList.parties | itemsPerPage: partiesList.perPage" total-items="partiesList.partiesCount">
 ┊5┊7┊    <a ui-sref="partyDetails({ partyId: party._id })">
```
[}]: #

We made PartiesSort to use *name* field with ASC order by default. We also added onChange expression. It is just to handle changes.

[{]: <helper> (diff_step 12.17)
#### Step 12.17: Handle sort changes

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -44,6 +44,10 @@
 ┊44┊44┊  pageChanged(newPage) {
 ┊45┊45┊    this.page = newPage;
 ┊46┊46┊  }
+┊  ┊47┊
+┊  ┊48┊  sortChanged(sort) {
+┊  ┊49┊    this.sort = sort;
+┊  ┊50┊  }
 ┊47┊51┊}
 ┊48┊52┊
 ┊49┊53┊const name = 'partiesList';
```
[}]: #

And we don't have to do anything other than that, because we defined `sort` variable as helper, and when we will change it, Angular-Meteor will take care of updating the subscription for us.

So all we have left is to sit back and enjoy our pagination working like a charm.

We've made a lot of changes, so please check the step's code [here](https://github.com/Urigo/meteor-angular-socially/compare/step_11...step_12)
to make sure you have everything needed and can run the application.

# Reactive Search

Now that we have the basis for pagination, all we have left to do is add reactive full stack searching of parties. This means that we will be able to enter a search string, have the app search for parties that match that name in the server and return only the relevant results! This is pretty awesome, and we are going to do all that in only a few lines of code. So
let's get started!

As before, let's add the server-side support. We need to add a new argument to our publish method which will hold the
requested search string. We will call it... `searchString`! Here it goes:

[{]: <helper> (diff_step 12.18)
#### Step 12.18: Add searchString to `parties` publication

##### Changed imports/api/parties/publish.js
```diff
@@ -4,7 +4,7 @@
 ┊ 4┊ 4┊import { Parties } from './collection';
 ┊ 5┊ 5┊
 ┊ 6┊ 6┊if (Meteor.isServer) {
-┊ 7┊  ┊  Meteor.publish('parties', function(options) {
+┊  ┊ 7┊  Meteor.publish('parties', function(options, searchString) {
 ┊ 8┊ 8┊    const selector = {
 ┊ 9┊ 9┊      $or: [{
 ┊10┊10┊        // the public parties
```
```diff
@@ -27,6 +27,13 @@
 ┊27┊27┊      }]
 ┊28┊28┊    };
 ┊29┊29┊
+┊  ┊30┊    if (typeof searchString === 'string' && searchString.length) {
+┊  ┊31┊      selector.name = {
+┊  ┊32┊        $regex: `.*${searchString}.*`,
+┊  ┊33┊        $options : 'i'
+┊  ┊34┊      };
+┊  ┊35┊    }
+┊  ┊36┊
 ┊30┊37┊    Counts.publish(this, 'numberOfParties', Parties.find(selector), {
 ┊31┊38┊      noReady: true
 ┊32┊39┊    });
```
[}]: #

Now we are going to filter the correct results using mongo's regex ability. We are going to add this
line in those two places where we are using `find`: in publish Counts and in the return of the parties cursor:

    'name' : { '$regex' : `.*${searchString}.*`, '$options' : 'i' },

As you can see, this will filter all the parties whose name contains the searchString.

> We added also `if (typeof searchString === 'string' && searchString.length)` so that, if we don't get that parameter, we will just return the whole collection.

Now let's move on to the client-side.
First let's place a search input into our template and bind it to a 'searchText' component variable:

[{]: <helper> (diff_step 12.20)
#### Step 12.20: Add input with searchText as ngModel

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊<party-add></party-add>
 ┊2┊2┊
+┊ ┊3┊<input type="search" ng-model="partiesList.searchText" placeholder="Search" />
+┊ ┊4┊
 ┊3┊5┊<parties-sort on-change="partiesList.sortChanged(sort)" property="name" order="1"></parties-sort>
 ┊4┊6┊
 ┊5┊7┊<ul>
```
[}]: #

And all we have left to do is call the subscribe method with our reactive variable, and add the `searchText` as reactive helper:

[{]: <helper> (diff_step 12.19)
#### Step 12.19: Add searchText to subscription

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -22,11 +22,13 @@
 ┊22┊22┊    this.sort = {
 ┊23┊23┊      name: 1
 ┊24┊24┊    };
+┊  ┊25┊    this.searchText = '';
 ┊25┊26┊
 ┊26┊27┊    this.subscribe('parties', () => [{
-┊27┊  ┊      limit: parseInt(this.perPage),
-┊28┊  ┊      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
-┊29┊  ┊      sort: this.getReactively('sort')}
+┊  ┊28┊        limit: parseInt(this.perPage),
+┊  ┊29┊        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
+┊  ┊30┊        sort: this.getReactively('sort')
+┊  ┊31┊      }, this.getReactively('searchText')
 ┊30┊32┊    ]);
 ┊31┊33┊
 ┊32┊34┊    this.helpers({
```
[}]: #

# Testing

[{]: <helper> (diff_step 12.21)
#### Step 12.21: Tests of PartiesSort

##### Added imports/ui/components/partiesSort/client/partiesSort.tests.js
```diff
@@ -0,0 +1,54 @@
+┊  ┊ 1┊import { name as PartiesSort } from '../partiesSort';
+┊  ┊ 2┊import 'angular-mocks';
+┊  ┊ 3┊
+┊  ┊ 4┊describe('PartiesSort', () => {
+┊  ┊ 5┊  beforeEach(() => {
+┊  ┊ 6┊    window.module(PartiesSort);
+┊  ┊ 7┊  });
+┊  ┊ 8┊
+┊  ┊ 9┊  describe('controller', () => {
+┊  ┊10┊    let controller;
+┊  ┊11┊    const onChange = function() {};
+┊  ┊12┊    const property = 'name';
+┊  ┊13┊    const order = -1;
+┊  ┊14┊
+┊  ┊15┊
+┊  ┊16┊    beforeEach(() => {
+┊  ┊17┊      inject(($rootScope, $componentController) => {
+┊  ┊18┊        controller = $componentController(PartiesSort, {
+┊  ┊19┊          $scope: $rootScope.$new(true)
+┊  ┊20┊        }, {
+┊  ┊21┊          onChange,
+┊  ┊22┊          property,
+┊  ┊23┊          order
+┊  ┊24┊        });
+┊  ┊25┊      });
+┊  ┊26┊    });
+┊  ┊27┊
+┊  ┊28┊    it('should set property', () => {
+┊  ┊29┊      expect(controller.property).toEqual(property);
+┊  ┊30┊    });
+┊  ┊31┊
+┊  ┊32┊    it('should set order', () => {
+┊  ┊33┊      expect(controller.order).toEqual(order);
+┊  ┊34┊    });
+┊  ┊35┊
+┊  ┊36┊    it('should set onChange', () => {
+┊  ┊37┊      expect(controller.onChange).toBe(onChange);
+┊  ┊38┊    });
+┊  ┊39┊
+┊  ┊40┊    describe('changed()', () => {
+┊  ┊41┊      it('should call onChange expression', () => {
+┊  ┊42┊        spyOn(controller, 'onChange');
+┊  ┊43┊
+┊  ┊44┊        controller.changed();
+┊  ┊45┊
+┊  ┊46┊        expect(controller.onChange).toHaveBeenCalledWith({
+┊  ┊47┊          sort: {
+┊  ┊48┊            [property]: order
+┊  ┊49┊          }
+┊  ┊50┊        });
+┊  ┊51┊      });
+┊  ┊52┊    });
+┊  ┊53┊  });
+┊  ┊54┊});
```
[}]: #

[{]: <helper> (diff_step 12.22)
#### Step 12.22: Tests of PartiesList

##### Added imports/ui/components/partiesList/client/partiesList.tests.js
```diff
@@ -0,0 +1,50 @@
+┊  ┊ 1┊import { name as PartiesList } from '../partiesList';
+┊  ┊ 2┊import 'angular-mocks';
+┊  ┊ 3┊
+┊  ┊ 4┊describe('PartiesList', () => {
+┊  ┊ 5┊  beforeEach(() => {
+┊  ┊ 6┊    window.module(PartiesList);
+┊  ┊ 7┊  });
+┊  ┊ 8┊
+┊  ┊ 9┊  describe('controller', () => {
+┊  ┊10┊    let controller;
+┊  ┊11┊
+┊  ┊12┊    beforeEach(() => {
+┊  ┊13┊      inject(($rootScope, $componentController) => {
+┊  ┊14┊        controller = $componentController(PartiesList, {
+┊  ┊15┊          $scope: $rootScope.$new(true)
+┊  ┊16┊        });
+┊  ┊17┊      });
+┊  ┊18┊    });
+┊  ┊19┊
+┊  ┊20┊    it('should have perPage that equals 3 by default', () => {
+┊  ┊21┊      expect(controller.perPage).toEqual(3);
+┊  ┊22┊    });
+┊  ┊23┊
+┊  ┊24┊    it('should have page that equals 1 by default', () => {
+┊  ┊25┊      expect(controller.page).toEqual(1);
+┊  ┊26┊    });
+┊  ┊27┊
+┊  ┊28┊    it('should sort by name - ASC', () => {
+┊  ┊29┊      expect(controller.sort).toEqual({
+┊  ┊30┊        name: 1
+┊  ┊31┊      });
+┊  ┊32┊    });
+┊  ┊33┊
+┊  ┊34┊    it('should be able to change sorting', () => {
+┊  ┊35┊      controller.sortChanged({
+┊  ┊36┊        name: -1
+┊  ┊37┊      });
+┊  ┊38┊
+┊  ┊39┊      expect(controller.sort).toEqual({
+┊  ┊40┊        name: -1
+┊  ┊41┊      });
+┊  ┊42┊    });
+┊  ┊43┊
+┊  ┊44┊    it('should be able to change page', () => {
+┊  ┊45┊      controller.pageChanged(2);
+┊  ┊46┊
+┊  ┊47┊      expect(controller.page).toEqual(2);
+┊  ┊48┊    });
+┊  ┊49┊  });
+┊  ┊50┊});
```
[}]: #

Wow, that is all that's needed to have a fully reactive search with pagination! Quite amazing, right?

# Summary

So now we have full pagination with search and sorting for client and server-side, with the help of Meteor's options and Angular 1's directives.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step11.md) | [Next Step >](step13.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #