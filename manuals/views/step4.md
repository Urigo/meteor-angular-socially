[{]: <region> (header)
# Step 4: Adding/removing objects and Angular event handling
[}]: #
[{]: <region> (body)
Now that we have full data binding from server to client, let's interact with the data and see the updates in action.

In this chapter you will add the ability to insert a new party and delete an existing one from the UI.

First, let's create a simple `PartyAdd` component with a form and a button that will add a new party, we will add it above the list, inside the `PartiesList` Component view.

[{]: <helper> (diff_step 4.1)
#### Step 4.1: Create template for PartyAdd component

##### Added imports/ui/components/partyAdd/partyAdd.html
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊<form>
+┊  ┊ 2┊  <label>
+┊  ┊ 3┊    Party Name:
+┊  ┊ 4┊  </label>
+┊  ┊ 5┊  <input type="text"/>
+┊  ┊ 6┊  <label>
+┊  ┊ 7┊    Description:
+┊  ┊ 8┊  </label>
+┊  ┊ 9┊  <input type="text"/>
+┊  ┊10┊  <button>Add Party!</button>
+┊  ┊11┊</form>
```
[}]: #

[{]: <helper> (diff_step 4.2)
#### Step 4.2: Create PartyAdd component

##### Added imports/ui/components/partyAdd/partyAdd.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import template from './partyAdd.html';
+┊  ┊ 5┊
+┊  ┊ 6┊class PartyAdd {}
+┊  ┊ 7┊
+┊  ┊ 8┊const name = 'partyAdd';
+┊  ┊ 9┊
+┊  ┊10┊// create a module
+┊  ┊11┊export default angular.module(name, [
+┊  ┊12┊  angularMeteor
+┊  ┊13┊]).component(name, {
+┊  ┊14┊  template,
+┊  ┊15┊  controllerAs: name,
+┊  ┊16┊  controller: PartyAdd
+┊  ┊17┊});
```
[}]: #

Add `PartyAdd` to the `PartiesList` component

[{]: <helper> (diff_step 4.3)
#### Step 4.3: Implement PartyAdd to the view

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,3 +1,5 @@
+┊ ┊1┊<party-add></party-add>
+┊ ┊2┊
 ┊1┊3┊<ul>
 ┊2┊4┊  <li ng-repeat="party in partiesList.parties">
 ┊3┊5┊    {{party.name}}
```
[}]: #

[{]: <helper> (diff_step 4.4)
#### Step 4.4: Add PartyAdd to PartiesList

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊
 ┊4┊4┊import template from './partiesList.html';
+┊ ┊5┊import { name as PartyAdd } from '../partyAdd/partyAdd';
 ┊5┊6┊
 ┊6┊7┊class PartiesList {
 ┊7┊8┊  constructor($scope, $reactive) {
```
```diff
@@ -21,7 +22,8 @@
 ┊21┊22┊
 ┊22┊23┊// create a module
 ┊23┊24┊export default angular.module(name, [
-┊24┊  ┊  angularMeteor
+┊  ┊25┊  angularMeteor,
+┊  ┊26┊  PartyAdd
 ┊25┊27┊]).component(name, {
 ┊26┊28┊  template,
 ┊27┊29┊  controllerAs: name,
```
[}]: #

Now we need to make this form functional.

## ng-model

First things first, let's bind the value of the inputs into a new party variable.

To do that we'll use the simple and powerful [ng-model](https://docs.angularjs.org/api/ng/directive/ngModel) Angular 1 directive.

Add `ng-model` to the form like this:

[{]: <helper> (diff_step 4.5)
#### Step 4.5: Add ng-model to the form inputs

##### Changed imports/ui/components/partyAdd/partyAdd.html
```diff
@@ -2,10 +2,10 @@
 ┊ 2┊ 2┊  <label>
 ┊ 3┊ 3┊    Party Name:
 ┊ 4┊ 4┊  </label>
-┊ 5┊  ┊  <input type="text"/>
+┊  ┊ 5┊  <input type="text" ng-model="partyAdd.party.name" />
 ┊ 6┊ 6┊  <label>
 ┊ 7┊ 7┊    Description:
 ┊ 8┊ 8┊  </label>
-┊ 9┊  ┊  <input type="text"/>
+┊  ┊ 9┊  <input type="text" ng-model="partyAdd.party.description" />
 ┊10┊10┊  <button>Add Party!</button>
 ┊11┊11┊</form>
```
[}]: #

Now each time the user types inside these inputs, the value of the `party` variable will be automatically updated.  Conversely, if `partyAdd.party` is changed outside of the HTML, the input values will be updated accordingly.

## ng-click

Now let's bind a click event to the add button with Angular 1's [ng-click](https://docs.angularjs.org/api/ng/directive/ngClick) directive.

[{]: <helper> (diff_step 4.6)
#### Step 4.6: Add submit method to the button

##### Changed imports/ui/components/partyAdd/partyAdd.html
```diff
@@ -7,5 +7,5 @@
 ┊ 7┊ 7┊    Description:
 ┊ 8┊ 8┊  </label>
 ┊ 9┊ 9┊  <input type="text" ng-model="partyAdd.party.description" />
-┊10┊  ┊  <button>Add Party!</button>
+┊  ┊10┊  <button ng-click="partyAdd.submit()">Add Party!</button>
 ┊11┊11┊</form>
```
[}]: #

`ng-click` binds the click event to an expression - we just call a method that we will implement soon on the `PartyAdd`!

Now let's implement the logic on the controller of the Component:

[{]: <helper> (diff_step 4.7)
#### Step 4.7: Add submit method

##### Changed imports/ui/components/partyAdd/partyAdd.js
```diff
@@ -3,7 +3,15 @@
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊import template from './partyAdd.html';
 ┊ 5┊ 5┊
-┊ 6┊  ┊class PartyAdd {}
+┊  ┊ 6┊class PartyAdd {
+┊  ┊ 7┊  constructor() {
+┊  ┊ 8┊    this.party = {};
+┊  ┊ 9┊  }
+┊  ┊10┊
+┊  ┊11┊  submit() {
+┊  ┊12┊    console.log('submit:', this.party);
+┊  ┊13┊  }
+┊  ┊14┊}
 ┊ 7┊15┊
 ┊ 8┊16┊const name = 'partyAdd';
```
[}]: #

Since we're using modules, let's take care of `Parties` collection:

[{]: <helper> (diff_step 4.8)
#### Step 4.8: Move Parties to imports

##### Added imports/api/parties.js
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊import { Mongo } from 'meteor/mongo';
+┊ ┊2┊
+┊ ┊3┊export const Parties = new Mongo.Collection('parties');
```
[}]: #

[{]: <helper> (diff_step 4.10)
#### Step 4.10: Import new module with Parties collection

##### Changed server/main.js
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
-┊2┊ ┊import { Parties } from '../collections/parties';
+┊ ┊2┊import { Parties } from '../imports/api/parties';
 ┊3┊3┊
 ┊4┊4┊Meteor.startup(() => {
 ┊5┊5┊  if (Parties.find().count() === 0) {
```
[}]: #

Then, we remove all contents from `collections/parties.js`

[{]: <helper> (diff_step 4.11)
#### Step 4.11: Import new module with Parties to PartiesList

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊
 ┊4┊4┊import template from './partiesList.html';
+┊ ┊5┊import { Parties } from '../../../api/parties';
 ┊5┊6┊import { name as PartyAdd } from '../partyAdd/partyAdd';
 ┊6┊7┊
 ┊7┊8┊class PartiesList {
```
[}]: #

[{]: <helper> (diff_step 4.12)
#### Step 4.12: Insert new party

##### Changed imports/ui/components/partyAdd/partyAdd.js
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊
 ┊4┊4┊import template from './partyAdd.html';
+┊ ┊5┊import { Parties } from '../../../api/parties';
 ┊5┊6┊
 ┊6┊7┊class PartyAdd {
 ┊7┊8┊  constructor() {
```
```diff
@@ -9,7 +10,12 @@
 ┊ 9┊10┊  }
 ┊10┊11┊
 ┊11┊12┊  submit() {
-┊12┊  ┊    console.log('submit:', this.party);
+┊  ┊13┊    Parties.insert(this.party);
+┊  ┊14┊    this.reset();
+┊  ┊15┊  }
+┊  ┊16┊
+┊  ┊17┊  reset() {
+┊  ┊18┊    this.party = {};
 ┊13┊19┊  }
 ┊14┊20┊}
```
[}]: #

> Parties is a Mongo.Collection object, and the [insert method](http://docs.meteor.com/#/full/insert) inserts a new object to the collection and assign an id for the new object.

> Meteor supports Javascript ES2015 by default so we can take advantage of that and define our `save` method as a method of PartyAdd class.

Open a different browser, click the button and see how the party is added on both clients. So simple!

Now, let's add the ability to delete parties.

First, we have to create a Component, let's call it `PartyRemove`!

[{]: <helper> (diff_step 4.13)
#### Step 4.13: Create view for PartyRemove component

##### Added imports/ui/components/partyRemove/partyRemove.html
```diff
@@ -0,0 +1 @@
+┊ ┊1┊<button ng-click="partyRemove.remove()">X</button>
```
[}]: #

[{]: <helper> (diff_step 4.14)
#### Step 4.14: Create PartyRemove component

##### Added imports/ui/components/partyRemove/partyRemove.js
```diff
@@ -0,0 +1,21 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import template from './partyRemove.html';
+┊  ┊ 5┊
+┊  ┊ 6┊class PartyRemove {
+┊  ┊ 7┊  remove() {
+┊  ┊ 8┊    console.log('remove party');
+┊  ┊ 9┊  }
+┊  ┊10┊}
+┊  ┊11┊
+┊  ┊12┊const name = 'partyRemove';
+┊  ┊13┊
+┊  ┊14┊// create a module
+┊  ┊15┊export default angular.module(name, [
+┊  ┊16┊  angularMeteor
+┊  ┊17┊]).component(name, {
+┊  ┊18┊  template,
+┊  ┊19┊  controllerAs: name,
+┊  ┊20┊  controller: PartyRemove
+┊  ┊21┊});
```
[}]: #

## Bindings

Bindings are the way to use an external data in a component and to add communication between components.

There are four types of binding:

**Value**

`@` - Passing a string value to a component.

```html
<my-component my-attr="hello ">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '@'
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.showName = () => {
        console.log(this.myAttr); // outputs a value of `hello `
      };
    }
  });
```

**Two-way**

`=` - It means that you're setting up bidirectional binding between components. Any change of `myAttr` variable will reflect the value of `name`, and vice versa.

```html
<my-component my-attr="name">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '='
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.showName = () => {
        console.log(this.myAttr); // outputs name's value
      };

      this.changeName = () => {
        this.myAttr = 'Kamil'; // also changes a value of `name` variable
      };
    }
  });
```

**One-way**

`>` - It means that you're setting up one-directional binding components. Any changes to `name` will be reflected in `myAttr`, but changes in `myAttr` will not reflect in `name`.

```html
<my-component my-attr="name">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '>'
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.showName = () => {
        console.log(this.myAttr); // outputs name's value
      };

      this.changeName = () => {
        this.myAttr = 'Kamil'; // does not change a value of `name` variable
      };
    }
  });
```

**Expression**

`&` - An expression. Provides a way to execute an expression in the context of the parent component.

```html
<my-component my-attr="setName(newName)">
```

```js
angular.module('demo')
  .component('myComponent', {
    bindings: {
      myAttr: '&'
    },
    controllerAs: 'myComponent',
    controller: function() {
      // on some action
      this.submit = () => {
        // execute the myAttr expression
        this.myAttr({
          newName: 'Donald'
        });
      };
    }
  });
```

> You can read more about bindings on [Official Angular's documentation](https://docs.angularjs.org/api/ng/service/$compile#-scope-).

Since you know how something about bindings we can continue our work!

Use one-way binding since this is available in AngularJS 1.5:

[{]: <helper> (diff_step 4.15)
#### Step 4.15: Add party binding

##### Changed imports/ui/components/partyRemove/partyRemove.js
```diff
@@ -16,6 +16,9 @@
 ┊16┊16┊  angularMeteor
 ┊17┊17┊]).component(name, {
 ┊18┊18┊  template,
+┊  ┊19┊  bindings: {
+┊  ┊20┊    party: '<'
+┊  ┊21┊  },
 ┊19┊22┊  controllerAs: name,
 ┊20┊23┊  controller: PartyRemove
 ┊21┊24┊});
```
[}]: #


Now, we can add some logic to remove() method:

[{]: <helper> (diff_step 4.16)
#### Step 4.16: Remove party from collection

##### Changed imports/ui/components/partyRemove/partyRemove.js
```diff
@@ -2,10 +2,13 @@
 ┊ 2┊ 2┊import angularMeteor from 'angular-meteor';
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊import template from './partyRemove.html';
+┊  ┊ 5┊import { Parties } from '../../../api/parties';
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊class PartyRemove {
 ┊ 7┊ 8┊  remove() {
-┊ 8┊  ┊    console.log('remove party');
+┊  ┊ 9┊    if (this.party) {
+┊  ┊10┊      Parties.remove(this.party._id);
+┊  ┊11┊    }
 ┊ 9┊12┊  }
 ┊10┊13┊}
```
[}]: #

It's not yet available in `PartiesList`:

[{]: <helper> (diff_step 4.17)
#### Step 4.17: Add PartyRemove

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import template from './partiesList.html';
 ┊ 5┊ 5┊import { Parties } from '../../../api/parties';
 ┊ 6┊ 6┊import { name as PartyAdd } from '../partyAdd/partyAdd';
+┊  ┊ 7┊import { name as PartyRemove } from '../partyRemove/partyRemove';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊class PartiesList {
 ┊ 9┊10┊  constructor($scope, $reactive) {
```
```diff
@@ -24,7 +25,8 @@
 ┊24┊25┊// create a module
 ┊25┊26┊export default angular.module(name, [
 ┊26┊27┊  angularMeteor,
-┊27┊  ┊  PartyAdd
+┊  ┊28┊  PartyAdd,
+┊  ┊29┊  PartyRemove
 ┊28┊30┊]).component(name, {
 ┊29┊31┊  template,
 ┊30┊32┊  controllerAs: name,
```
[}]: #

[{]: <helper> (diff_step 4.18)
#### Step 4.18: Implement component

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -4,5 +4,6 @@
 ┊4┊4┊  <li ng-repeat="party in partiesList.parties">
 ┊5┊5┊    {{party.name}}
 ┊6┊6┊    <p>{{party.description}}</p>
+┊ ┊7┊    <party-remove party="party"></party-remove>
 ┊7┊8┊  </li>
 ┊8┊9┊</ul>
```
[}]: #

# Summary

So now you've seen how easy it is to manipulate the data using Angular 1's powerful directives and sync that data with Meteor's powerful Mongo.Collection API.

## Testing

One of the new features of Meteor 1.3 is support for testing. In Socially we want to use Jasmine. Let's add it to our app!

    $ meteor add sanjo:jasmine

You probably want to see result of tests:

    $ meteor add velocity:html-reporter
    $ meteor add velocity:console-reporter

We also have to use `angular-mocks`:

    $ meteor npm install --save-dev angular-mocks

Now, add a script to run unit-tests:

[{]: <helper> (diff_step 4.20)
#### Step 4.20: Add `test:watch` npm script

##### Changed package.json
```diff
@@ -2,7 +2,8 @@
 ┊2┊2┊  "name": "socially",
 ┊3┊3┊  "private": true,
 ┊4┊4┊  "scripts": {
-┊5┊ ┊    "start": "meteor run"
+┊ ┊5┊    "start": "meteor run",
+┊ ┊6┊    "test:watch": "meteor test --driver-package sanjo:jasmine"
 ┊6┊7┊  },
 ┊7┊8┊  "dependencies": {
 ┊8┊9┊    "angular": "^1.5.3",
```
[}]: #

Use this command to run tests:

    $ meteor npm run test:watch

[{]: <helper> (diff_step 4.22)
#### Step 4.22: Tests of PartyAdd

##### Added imports/ui/components/partyAdd/client/partyAdd.tests.js
```diff
@@ -0,0 +1,53 @@
+┊  ┊ 1┊import { name as PartyAdd } from '../partyAdd';
+┊  ┊ 2┊import { Parties } from '../../../../api/parties';
+┊  ┊ 3┊import 'angular-mocks';
+┊  ┊ 4┊
+┊  ┊ 5┊describe('PartyAdd', () => {
+┊  ┊ 6┊  beforeEach(() => {
+┊  ┊ 7┊    window.module(PartyAdd);
+┊  ┊ 8┊  });
+┊  ┊ 9┊
+┊  ┊10┊  describe('controller', () => {
+┊  ┊11┊    let controller;
+┊  ┊12┊    const party = {
+┊  ┊13┊      name: 'Foo',
+┊  ┊14┊      description: 'Birthday of Foo'
+┊  ┊15┊    };
+┊  ┊16┊
+┊  ┊17┊    beforeEach(() => {
+┊  ┊18┊      inject(($rootScope, $componentController) => {
+┊  ┊19┊        controller = $componentController(PartyAdd, {
+┊  ┊20┊          $scope: $rootScope.$new(true)
+┊  ┊21┊        });
+┊  ┊22┊      });
+┊  ┊23┊    });
+┊  ┊24┊
+┊  ┊25┊    describe('reset()', () => {
+┊  ┊26┊      it('should clean up party object', () => {
+┊  ┊27┊        controller.party = party;
+┊  ┊28┊        controller.reset();
+┊  ┊29┊
+┊  ┊30┊        expect(controller.party).toEqual({});
+┊  ┊31┊      });
+┊  ┊32┊    });
+┊  ┊33┊
+┊  ┊34┊    describe('submit()', () => {
+┊  ┊35┊      beforeEach(() => {
+┊  ┊36┊        spyOn(Parties, 'insert');
+┊  ┊37┊        spyOn(controller, 'reset').and.callThrough();
+┊  ┊38┊
+┊  ┊39┊        controller.party = party;
+┊  ┊40┊
+┊  ┊41┊        controller.submit();
+┊  ┊42┊      });
+┊  ┊43┊
+┊  ┊44┊      it('should insert a new party', () => {
+┊  ┊45┊        expect(Parties.insert).toHaveBeenCalledWith(party);
+┊  ┊46┊      });
+┊  ┊47┊
+┊  ┊48┊      it('should call reset()', () => {
+┊  ┊49┊        expect(controller.reset).toHaveBeenCalled();
+┊  ┊50┊      });
+┊  ┊51┊    });
+┊  ┊52┊  });
+┊  ┊53┊});
```
[}]: #

[{]: <helper> (diff_step 4.23)
#### Step 4.23: Tests of PartyRemove

##### Added imports/ui/components/partyRemove/client/partyRemove.tests.js
```diff
@@ -0,0 +1,37 @@
+┊  ┊ 1┊import { name as PartyRemove } from '../partyRemove';
+┊  ┊ 2┊import { Parties } from '../../../../api/parties';
+┊  ┊ 3┊import 'angular-mocks';
+┊  ┊ 4┊
+┊  ┊ 5┊describe('PartyRemove', () => {
+┊  ┊ 6┊  beforeEach(() => {
+┊  ┊ 7┊    window.module(PartyRemove);
+┊  ┊ 8┊  });
+┊  ┊ 9┊
+┊  ┊10┊  describe('controller', () => {
+┊  ┊11┊    let controller;
+┊  ┊12┊    const party = {
+┊  ┊13┊      _id: 'partyId'
+┊  ┊14┊    };
+┊  ┊15┊
+┊  ┊16┊    beforeEach(() => {
+┊  ┊17┊      inject(($rootScope, $componentController) => {
+┊  ┊18┊        controller = $componentController(PartyRemove, {
+┊  ┊19┊          $scope: $rootScope.$new(true)
+┊  ┊20┊        }, {
+┊  ┊21┊          party
+┊  ┊22┊        });
+┊  ┊23┊      });
+┊  ┊24┊    });
+┊  ┊25┊
+┊  ┊26┊    describe('remove()', () => {
+┊  ┊27┊      beforeEach(() => {
+┊  ┊28┊        spyOn(Parties, 'remove');
+┊  ┊29┊        controller.remove();
+┊  ┊30┊      });
+┊  ┊31┊
+┊  ┊32┊      it('should remove a party', () => {
+┊  ┊33┊        expect(Parties.remove).toHaveBeenCalledWith(party._id);
+┊  ┊34┊      });
+┊  ┊35┊    });
+┊  ┊36┊  });
+┊  ┊37┊});
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step3.md) | [Next Step >](step5.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #