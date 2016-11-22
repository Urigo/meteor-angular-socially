[{]: <region> (header)
# Step 13: Using and creating AngularJS filters
[}]: #
[{]: <region> (body)
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

[{]: <helper> (diff_step 13.1)
#### Step 13.1: Create UninvitedFilter

##### Added imports/ui/filters/uninvitedFilter.js
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊
+┊  ┊ 3┊const name = 'uninvitedFilter';
+┊  ┊ 4┊
+┊  ┊ 5┊function UninvitedFilter(users, party) {
+┊  ┊ 6┊  if (!party) {
+┊  ┊ 7┊    return false;
+┊  ┊ 8┊  }
+┊  ┊ 9┊
+┊  ┊10┊  return users.filter((user) => {
+┊  ┊11┊    // if not the owner and not invited
+┊  ┊12┊    return user._id !== party.owner && (party.invited || []).indexOf(user._id) === -1;
+┊  ┊13┊  });
+┊  ┊14┊}
+┊  ┊15┊
+┊  ┊16┊// create a module
+┊  ┊17┊export default angular.module(name, [])
+┊  ┊18┊  .filter(name, () => {
+┊  ┊19┊    return UninvitedFilter;
+┊  ┊20┊  });
```
[}]: #

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

[{]: <helper> (diff_step 13.3)
#### Step 13.3: Use underscore

##### Changed imports/ui/filters/uninvitedFilter.js
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import angular from 'angular';
+┊ ┊2┊import _ from 'underscore';
 ┊2┊3┊
 ┊3┊4┊const name = 'uninvitedFilter';
 ┊4┊5┊
```
```diff
@@ -9,7 +10,7 @@
 ┊ 9┊10┊
 ┊10┊11┊  return users.filter((user) => {
 ┊11┊12┊    // if not the owner and not invited
-┊12┊  ┊    return user._id !== party.owner && (party.invited || []).indexOf(user._id) === -1;
+┊  ┊13┊    return user._id !== party.owner && !_.contains(party.invited, user._id);
 ┊13┊14┊  });
 ┊14┊15┊}
```
[}]: #

So now let's use our new filter.

We will create a component to display list of uninvited users. Let's call it `PartyUninvited`.

First, we need a template. Use already exist one view from PartyDetails and move it to a separate file:

[{]: <helper> (diff_step 13.4)
#### Step 13.4: Move list of users to separate component

##### Added imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊<ul>
+┊ ┊2┊  Users:
+┊ ┊3┊  <li ng-repeat="user in partyUninvited.users">
+┊ ┊4┊    <div>{{ user.emails[0].address }}</div>
+┊ ┊5┊  </li>
+┊ ┊6┊</ul>
```
[}]: #

Then, create the actual component:

[{]: <helper> (diff_step 13.5)
#### Step 13.5: Create PartyUninvited component

##### Added imports/ui/components/partyUninvited/partyUninvited.js
```diff
@@ -0,0 +1,34 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './partyUninvited.html';
+┊  ┊ 7┊
+┊  ┊ 8┊class PartyUninvited {
+┊  ┊ 9┊  constructor($scope) {
+┊  ┊10┊    'ngInject';
+┊  ┊11┊
+┊  ┊12┊    $scope.viewModel(this);
+┊  ┊13┊
+┊  ┊14┊    this.helpers({
+┊  ┊15┊      users() {
+┊  ┊16┊        return Meteor.users.find({});
+┊  ┊17┊      }
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊}
+┊  ┊21┊
+┊  ┊22┊const name = 'partyUninvited';
+┊  ┊23┊
+┊  ┊24┊// create a module
+┊  ┊25┊export default angular.module(name, [
+┊  ┊26┊  angularMeteor
+┊  ┊27┊]).component(name, {
+┊  ┊28┊  template,
+┊  ┊29┊  controllerAs: name,
+┊  ┊30┊  bindings: {
+┊  ┊31┊    party: '<'
+┊  ┊32┊  },
+┊  ┊33┊  controller: PartyUninvited
+┊  ┊34┊});
```
[}]: #

PartyUninvited has a one-way binding called `party`. Without a party we can't say who hasn't been invited!

Since we have `users` helper we have also add `UninvitedFilter`:

[{]: <helper> (diff_step 13.6)
#### Step 13.6: Add UninvitedFilter

##### Changed imports/ui/components/partyUninvited/partyUninvited.js
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import { Meteor } from 'meteor/meteor';
 ┊ 5┊ 5┊
 ┊ 6┊ 6┊import template from './partyUninvited.html';
+┊  ┊ 7┊import { name as UninvitedFilter } from '../../filters/uninvitedFilter';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊class PartyUninvited {
 ┊ 9┊10┊  constructor($scope) {
```
```diff
@@ -23,7 +24,8 @@
 ┊23┊24┊
 ┊24┊25┊// create a module
 ┊25┊26┊export default angular.module(name, [
-┊26┊  ┊  angularMeteor
+┊  ┊27┊  angularMeteor,
+┊  ┊28┊  UninvitedFilter
 ┊27┊29┊]).component(name, {
 ┊28┊30┊  template,
 ┊29┊31┊  controllerAs: name,
```
[}]: #

Let's use the filter:

[{]: <helper> (diff_step 13.7)
#### Step 13.7: Implement filter

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊<ul>
-┊2┊ ┊  Users:
-┊3┊ ┊  <li ng-repeat="user in partyUninvited.users">
+┊ ┊2┊  Users to invite:
+┊ ┊3┊  <li ng-repeat="user in partyUninvited.users | uninvitedFilter:partyUninvited.party">
 ┊4┊4┊    <div>{{ user.emails[0].address }}</div>
 ┊5┊5┊  </li>
 ┊6┊6┊</ul>
```
[}]: #

And add it to the PartyDetails component

[{]: <helper> (diff_step 13.8)
#### Step 13.8: Implement component in PartyDetails view

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -8,9 +8,4 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊<button ui-sref="parties">Back</button>
 ┊10┊10┊
-┊11┊  ┊<ul>
-┊12┊  ┊  Users:
-┊13┊  ┊  <li ng-repeat="user in partyDetails.users">
-┊14┊  ┊    <div>{{ user.emails[0].address }}</div>
-┊15┊  ┊  </li>
-┊16┊  ┊</ul>
+┊  ┊11┊<party-uninvited party="partyDetails.party"></party-uninvited>
```
[}]: #

[{]: <helper> (diff_step 13.9)
#### Step 13.9: Add to dependencies

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import template from './partyDetails.html';
 ┊ 8┊ 8┊import { Parties } from '../../../api/parties';
+┊  ┊ 9┊import { name as PartyUninvited } from '../partyUninvited/partyUninvited';
 ┊ 9┊10┊
 ┊10┊11┊class PartyDetails {
 ┊11┊12┊  constructor($stateParams, $scope, $reactive) {
```
```diff
@@ -54,7 +55,8 @@
 ┊54┊55┊// create a module
 ┊55┊56┊export default angular.module(name, [
 ┊56┊57┊  angularMeteor,
-┊57┊  ┊  uiRouter
+┊  ┊58┊  uiRouter,
+┊  ┊59┊  PartyUninvited
 ┊58┊60┊]).component(name, {
 ┊59┊61┊  template,
 ┊60┊62┊  controllerAs: name,
```
[}]: #

Run the app and see the users in each party.

We still don't have invites but you can see that the filter already filters the party owners out of the list.

But some of the users don't have emails (maybe some of them may have signed in with Facebook). In that case we want to display their name and not the empty email field.

But it's only in the display so its perfect for a filter.

So let's create another custom filter `DisplayNameFilter`.

Create a new file under the filters folder named `displayNameFiler.js` and place that code inside:

[{]: <helper> (diff_step 13.10)
#### Step 13.10: Create DisplayNameFilter

##### Added imports/ui/filters/displayNameFilter.js
```diff
@@ -0,0 +1,25 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊
+┊  ┊ 3┊const name = 'displayNameFilter';
+┊  ┊ 4┊
+┊  ┊ 5┊function DisplayNameFilter(user) {
+┊  ┊ 6┊  if (!user) {
+┊  ┊ 7┊    return '';
+┊  ┊ 8┊  }
+┊  ┊ 9┊
+┊  ┊10┊  if (user.profile && user.profile.name) {
+┊  ┊11┊    return user.profile.name;
+┊  ┊12┊  }
+┊  ┊13┊
+┊  ┊14┊  if (user.emails) {
+┊  ┊15┊    return user.emails[0].address;
+┊  ┊16┊  }
+┊  ┊17┊
+┊  ┊18┊  return user;
+┊  ┊19┊}
+┊  ┊20┊
+┊  ┊21┊// create a module
+┊  ┊22┊export default angular.module(name, [])
+┊  ┊23┊  .filter(name, () => {
+┊  ┊24┊    return DisplayNameFilter;
+┊  ┊25┊  });
```
[}]: #

Pretty simple logic but it's so much nicer to put it here and make the HTML shorter and more readable.

AngularJS can also display the return value of a function in the HTML.

To demonstrate let's use DisplayNameFilter in PartyUninvited:

[{]: <helper> (diff_step 13.11)
#### Step 13.11: Add as a dependency

##### Changed imports/ui/components/partyUninvited/partyUninvited.js
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊
 ┊ 6┊ 6┊import template from './partyUninvited.html';
 ┊ 7┊ 7┊import { name as UninvitedFilter } from '../../filters/uninvitedFilter';
+┊  ┊ 8┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
 ┊ 8┊ 9┊
 ┊ 9┊10┊class PartyUninvited {
 ┊10┊11┊  constructor($scope) {
```
```diff
@@ -25,7 +26,8 @@
 ┊25┊26┊// create a module
 ┊26┊27┊export default angular.module(name, [
 ┊27┊28┊  angularMeteor,
-┊28┊  ┊  UninvitedFilter
+┊  ┊29┊  UninvitedFilter,
+┊  ┊30┊  DisplayNameFilter
 ┊29┊31┊]).component(name, {
 ┊30┊32┊  template,
 ┊31┊33┊  controllerAs: name,
```
[}]: #

[{]: <helper> (diff_step 13.12)
#### Step 13.12: Use filter

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊<ul>
 ┊2┊2┊  Users to invite:
 ┊3┊3┊  <li ng-repeat="user in partyUninvited.users | uninvitedFilter:partyUninvited.party">
-┊4┊ ┊    <div>{{ user.emails[0].address }}</div>
+┊ ┊4┊    <div>{{ user | displayNameFilter }}</div>
 ┊5┊5┊  </li>
 ┊6┊6┊</ul>
```
[}]: #

We have now list of uninvited users but we don't have an information about owner of each party.

Let's create `PartyCreator` component:

[{]: <helper> (diff_step 13.13)
#### Step 13.13: Create template for PartyCreator component

##### Added imports/ui/components/partyCreator/partyCreator.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<p>
+┊ ┊2┊  <small>
+┊ ┊3┊    Posted by {{ partyCreator.creator | displayNameFilter }}
+┊ ┊4┊  </small>
+┊ ┊5┊</p>
```
[}]: #

[{]: <helper> (diff_step 13.14)
#### Step 13.14: Create PartyCreator component

##### Added imports/ui/components/partyCreator/partyCreator.js
```diff
@@ -0,0 +1,51 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './partyCreator.html';
+┊  ┊ 7┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
+┊  ┊ 8┊
+┊  ┊ 9┊/**
+┊  ┊10┊ * PartyCreator component
+┊  ┊11┊ */
+┊  ┊12┊class PartyCreator {
+┊  ┊13┊  constructor($scope) {
+┊  ┊14┊    'ngInject';
+┊  ┊15┊
+┊  ┊16┊    $scope.viewModel(this);
+┊  ┊17┊
+┊  ┊18┊    this.subscribe('users');
+┊  ┊19┊
+┊  ┊20┊    this.helpers({
+┊  ┊21┊      creator() {
+┊  ┊22┊        if (!this.party) {
+┊  ┊23┊          return '';
+┊  ┊24┊        }
+┊  ┊25┊
+┊  ┊26┊        const owner = this.party.owner;
+┊  ┊27┊
+┊  ┊28┊        if (Meteor.userId() !== null && owner === Meteor.userId()) {
+┊  ┊29┊          return 'me';
+┊  ┊30┊        }
+┊  ┊31┊
+┊  ┊32┊        return Meteor.users.findOne(owner) || 'nobody';
+┊  ┊33┊      }
+┊  ┊34┊    });
+┊  ┊35┊  }
+┊  ┊36┊}
+┊  ┊37┊
+┊  ┊38┊const name = 'partyCreator';
+┊  ┊39┊
+┊  ┊40┊// create a module
+┊  ┊41┊export default angular.module(name, [
+┊  ┊42┊  angularMeteor,
+┊  ┊43┊  DisplayNameFilter
+┊  ┊44┊]).component(name, {
+┊  ┊45┊  template,
+┊  ┊46┊  controllerAs: name,
+┊  ┊47┊  bindings: {
+┊  ┊48┊    party: '<'
+┊  ┊49┊  },
+┊  ┊50┊  controller: PartyCreator
+┊  ┊51┊});
```
[}]: #

We created a `creator` helper that tell the viewer who the owner is.
Now we have to implement it in the PartiesList component:

[{]: <helper> (diff_step 13.15)
#### Step 13.15: Implement component

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -11,6 +11,7 @@
 ┊11┊11┊    </a>
 ┊12┊12┊    <p>{{party.description}}</p>
 ┊13┊13┊    <party-remove party="party"></party-remove>
+┊  ┊14┊    <party-creator party="party"></party-creator>
 ┊14┊15┊  </li>
 ┊15┊16┊</ul>
```
[}]: #

[{]: <helper> (diff_step 13.16)
#### Step 13.16: Add as a dependency

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -10,6 +10,7 @@
 ┊10┊10┊import { name as PartiesSort } from '../partiesSort/partiesSort';
 ┊11┊11┊import { name as PartyAdd } from '../partyAdd/partyAdd';
 ┊12┊12┊import { name as PartyRemove } from '../partyRemove/partyRemove';
+┊  ┊13┊import { name as PartyCreator } from '../partyCreator/partyCreator';
 ┊13┊14┊
 ┊14┊15┊class PartiesList {
 ┊15┊16┊  constructor($scope, $reactive) {
```
```diff
@@ -61,7 +62,8 @@
 ┊61┊62┊  utilsPagination,
 ┊62┊63┊  PartiesSort,
 ┊63┊64┊  PartyAdd,
-┊64┊  ┊  PartyRemove
+┊  ┊65┊  PartyRemove,
+┊  ┊66┊  PartyCreator
 ┊65┊67┊]).component(name, {
 ┊66┊68┊  template,
 ┊67┊69┊  controllerAs: name,
```
[}]: #

# Summary

In this chapter we learned about Angular 1 filters and how easy they are to use and to read from the HTML.

In the next step we will learn about Meteor methods, which enables us to run custom logic in the server, beyond the Mongo API and the allow/deny methods.

# Testing

[{]: <helper> (diff_step 13.17)
#### Step 13.17: Tests of PartyCreator

##### Added imports/ui/components/partyCreator/client/partyCreator.tests.js
```diff
@@ -0,0 +1,81 @@
+┊  ┊ 1┊import { name as PartyCreator } from '../partyCreator';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import 'angular-mocks';
+┊  ┊ 4┊
+┊  ┊ 5┊describe('PartyCreator', () => {
+┊  ┊ 6┊  beforeEach(() => {
+┊  ┊ 7┊    window.module(PartyCreator);
+┊  ┊ 8┊  });
+┊  ┊ 9┊
+┊  ┊10┊  describe('controller', () => {
+┊  ┊11┊    let $rootScope;
+┊  ┊12┊    let $componentController;
+┊  ┊13┊    const party = {
+┊  ┊14┊      _id: 'partyId'
+┊  ┊15┊    };
+┊  ┊16┊
+┊  ┊17┊    beforeEach(() => {
+┊  ┊18┊      inject((_$rootScope_, _$componentController_) => {
+┊  ┊19┊        $rootScope = _$rootScope_;
+┊  ┊20┊        $componentController = _$componentController_;
+┊  ┊21┊      });
+┊  ┊22┊    });
+┊  ┊23┊
+┊  ┊24┊    function component(bindings) {
+┊  ┊25┊      return $componentController(PartyCreator, {
+┊  ┊26┊        $scope: $rootScope.$new(true)
+┊  ┊27┊      }, bindings);
+┊  ┊28┊    }
+┊  ┊29┊
+┊  ┊30┊    it('should return an empty string if there is no party', () => {
+┊  ┊31┊      const controller = component({
+┊  ┊32┊        party: undefined
+┊  ┊33┊      });
+┊  ┊34┊
+┊  ┊35┊      expect(controller.creator).toEqual('');
+┊  ┊36┊    });
+┊  ┊37┊
+┊  ┊38┊    it('should say `me` if logged in is the owner', () => {
+┊  ┊39┊      const owner = 'userId';
+┊  ┊40┊      // logged in
+┊  ┊41┊      spyOn(Meteor, 'userId').and.returnValue(owner);
+┊  ┊42┊      const controller = component({
+┊  ┊43┊        party: {
+┊  ┊44┊          owner
+┊  ┊45┊        }
+┊  ┊46┊      });
+┊  ┊47┊
+┊  ┊48┊      expect(controller.creator).toEqual('me');
+┊  ┊49┊    });
+┊  ┊50┊
+┊  ┊51┊    it('should say `nobody` if user does not exist', () => {
+┊  ┊52┊      const owner = 'userId';
+┊  ┊53┊      // not logged in
+┊  ┊54┊      spyOn(Meteor, 'userId').and.returnValue(null);
+┊  ┊55┊      // no user found
+┊  ┊56┊      spyOn(Meteor.users, 'findOne').and.returnValue(undefined);
+┊  ┊57┊      const controller = component({
+┊  ┊58┊        party: {
+┊  ┊59┊          owner
+┊  ┊60┊        }
+┊  ┊61┊      });
+┊  ┊62┊
+┊  ┊63┊      expect(controller.creator).toEqual('nobody');
+┊  ┊64┊    });
+┊  ┊65┊
+┊  ┊66┊    it('should return user data if user exists and it is not logged one', () => {
+┊  ┊67┊      const owner = 'userId';
+┊  ┊68┊      // not logged in
+┊  ┊69┊      spyOn(Meteor, 'userId').and.returnValue(null);
+┊  ┊70┊      // user found
+┊  ┊71┊      spyOn(Meteor.users, 'findOne').and.returnValue('found');
+┊  ┊72┊      const controller = component({
+┊  ┊73┊        party: {
+┊  ┊74┊          owner
+┊  ┊75┊        }
+┊  ┊76┊      });
+┊  ┊77┊
+┊  ┊78┊      expect(controller.creator).toEqual('found');
+┊  ┊79┊    });
+┊  ┊80┊  });
+┊  ┊81┊});
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step12.md) | [Next Step >](step14.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #