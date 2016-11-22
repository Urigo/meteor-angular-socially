[{]: <region> (header)
# Step 6: Bind one object
[}]: #
[{]: <region> (body)
In this step, we will implement the party details view, which is displayed when a user clicks on a party in the parties list.
The user will also be able to change the party's details.

To implement the party details view we will use `helpers`.

We used `helpers` in the previous Component we implemented, but now we will demonstrate how to use it with a single object instead of a Mongo.Collection cursor.

# Implement the component

We'll expand the `PartyDetails` by using `helpers` method, and we will use [findOne](http://docs.meteor.com/#/full/findone) method from the Mongo.Collection, which returns a single object.

[{]: <helper> (diff_step 6.1)
#### Step 6.1: Add party helper

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -3,12 +3,23 @@
 ┊ 3┊ 3┊import uiRouter from 'angular-ui-router';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import template from './partyDetails.html';
+┊  ┊ 6┊import { Parties } from '../../../api/parties';
 ┊ 6┊ 7┊
 ┊ 7┊ 8┊class PartyDetails {
-┊ 8┊  ┊  constructor($stateParams) {
+┊  ┊ 9┊  constructor($stateParams, $scope, $reactive) {
 ┊ 9┊10┊    'ngInject';
 ┊10┊11┊
+┊  ┊12┊    $reactive(this).attach($scope);
+┊  ┊13┊
 ┊11┊14┊    this.partyId = $stateParams.partyId;
+┊  ┊15┊
+┊  ┊16┊    this.helpers({
+┊  ┊17┊      party() {
+┊  ┊18┊        return Parties.findOne({
+┊  ┊19┊          _id: $stateParams.partyId
+┊  ┊20┊        });
+┊  ┊21┊      }
+┊  ┊22┊    });
 ┊12┊23┊  }
 ┊13┊24┊}
```
[}]: #

In our example we find our relevant party by its id, and used a regular MongoDB syntax to create our `findOne` query, which is explained in Meteor's [collection.findOne](http://docs.meteor.com/#/full/findone) documentation.

So after declaring this helper, we can just use `this.party` in our Component's Controller, or `partyDetails.party` in our HTML view.

# Component template

In `partyDetails.html` let's replace the binding to the `partyDetails.partyId` with a binding to `partyDetails.party.name` and `partyDetails.party.description`:

[{]: <helper> (diff_step 6.2)
#### Step 6.2: Add form with the party details to the party details page

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -1 +1,5 @@
-┊1┊ ┊The party you selected is: {{ partyDetails.partyId }}
+┊ ┊1┊The party you selected is:
+┊ ┊2┊<form>
+┊ ┊3┊  Party name: <input type="text" ng-model="partyDetails.party.name" />
+┊ ┊4┊  Description: <input type="text" ng-model="partyDetails.party.description" />
+┊ ┊5┊</form>
```
[}]: #

We used `ng-model` and created a form with the party details, now we just missing the "Save" button!

# Add Save logic

First, let's add a button, and we will use `ng-click` with the name of the method that we will later implement:

[{]: <helper> (diff_step 6.3)
#### Step 6.3: Add save and back buttons to the view

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -2,4 +2,7 @@
 ┊2┊2┊<form>
 ┊3┊3┊  Party name: <input type="text" ng-model="partyDetails.party.name" />
 ┊4┊4┊  Description: <input type="text" ng-model="partyDetails.party.description" />
+┊ ┊5┊  <button ng-click="partyDetails.save()">Save</button>
 ┊5┊6┊</form>
+┊ ┊7┊
+┊ ┊8┊<button ui-sref="parties">Back</button>
```
[}]: #

> We also added a "Back" button with uses `ui-sref` attribute, which is a shorthand for creating a link for a state.

And now let's implement the logic of the "Save" button on the controller:

[{]: <helper> (diff_step 6.4)
#### Step 6.4: Implement save button on the component logic

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -21,6 +21,17 @@
 ┊21┊21┊      }
 ┊22┊22┊    });
 ┊23┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  save() {
+┊  ┊26┊    Parties.update({
+┊  ┊27┊      _id: this.party._id
+┊  ┊28┊    }, {
+┊  ┊29┊      $set: {
+┊  ┊30┊        name: this.party.name,
+┊  ┊31┊        description: this.party.description
+┊  ┊32┊      }
+┊  ┊33┊    });
+┊  ┊34┊  }
 ┊24┊35┊}
 ┊25┊36┊
 ┊26┊37┊const name = 'partyDetails';
```
[}]: #

We used [Parties.update](http://docs.meteor.com/#/full/update) method which is a method that comes from the Mongo.Collection object.

The first parameter is the parties we want to update, in this case, we send the specific party's id, just like we did with `findOne`.

In the second parameter we specify the action we want to perform, in our case we used the `$set` operator to update the actual relevant fields.

We can also handle success or fail when using `Parties.update` by adding a callback as the third argument, for example:

[{]: <helper> (diff_step 6.5)
#### Step 6.5: Handle success and fail for data actions

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -30,6 +30,12 @@
 ┊30┊30┊        name: this.party.name,
 ┊31┊31┊        description: this.party.description
 ┊32┊32┊      }
+┊  ┊33┊    }, (error) => {
+┊  ┊34┊      if (error) {
+┊  ┊35┊        console.log('Oops, unable to update the party...');
+┊  ┊36┊      } else {
+┊  ┊37┊        console.log('Done!');
+┊  ┊38┊      }
 ┊33┊39┊    });
 ┊34┊40┊  }
 ┊35┊41┊}
```
[}]: #

# Testing

[{]: <helper> (diff_step 6.6)
#### Step 6.6: Tests of PartyDetails

##### Added imports/ui/components/partyDetails/client/partyDetails.tests.js
```diff
@@ -0,0 +1,49 @@
+┊  ┊ 1┊import { name as PartyDetails } from '../partyDetails';
+┊  ┊ 2┊import { Parties } from '../../../../api/parties';
+┊  ┊ 3┊import 'angular-mocks';
+┊  ┊ 4┊
+┊  ┊ 5┊describe('PartyDetails', () => {
+┊  ┊ 6┊  beforeEach(() => {
+┊  ┊ 7┊    window.module(PartyDetails);
+┊  ┊ 8┊  });
+┊  ┊ 9┊
+┊  ┊10┊  describe('controller', () => {
+┊  ┊11┊    let controller;
+┊  ┊12┊    const party = {
+┊  ┊13┊      _id: 'partyId',
+┊  ┊14┊      name: 'Foo',
+┊  ┊15┊      description: 'Birthday of Foo'
+┊  ┊16┊    };
+┊  ┊17┊
+┊  ┊18┊    beforeEach(() => {
+┊  ┊19┊      inject(($rootScope, $componentController) => {
+┊  ┊20┊        controller = $componentController(PartyDetails, {
+┊  ┊21┊          $scope: $rootScope.$new(true)
+┊  ┊22┊        });
+┊  ┊23┊      });
+┊  ┊24┊    });
+┊  ┊25┊
+┊  ┊26┊    describe('save()', () => {
+┊  ┊27┊      beforeEach(() => {
+┊  ┊28┊        spyOn(Parties, 'update');
+┊  ┊29┊        controller.party = party;
+┊  ┊30┊        controller.save();
+┊  ┊31┊      });
+┊  ┊32┊
+┊  ┊33┊      it('should update a proper party', () => {
+┊  ┊34┊        expect(Parties.update.calls.mostRecent().args[0]).toEqual({
+┊  ┊35┊          _id: party._id
+┊  ┊36┊        });
+┊  ┊37┊      });
+┊  ┊38┊
+┊  ┊39┊      it('should update with proper modifier', () => {
+┊  ┊40┊        expect(Parties.update.calls.mostRecent().args[1]).toEqual({
+┊  ┊41┊          $set: {
+┊  ┊42┊            name: party.name,
+┊  ┊43┊            description: party.description
+┊  ┊44┊          }
+┊  ┊45┊        });
+┊  ┊46┊      });
+┊  ┊47┊    });
+┊  ┊48┊  });
+┊  ┊49┊});
```
[}]: #


# Summary

We've seen the power of using Meteor.Collection API and how we can get single object from the collections.

We also learned how to update an object with the user's data!

Let's move on to provide some order and structure in our application.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step5.md) | [Next Step >](step7.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #