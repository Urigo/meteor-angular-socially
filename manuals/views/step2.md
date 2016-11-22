[{]: <region> (header)
# Step 2: Dynamic Template
[}]: #
[{]: <region> (body)
It's time to make our web app dynamic — with Angular 1.

This step is focused on client side Angular 1 tools. The next one will show you the power of Meteor.

# View and Template

In Angular 1, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular 1 refreshes the appropriate binding points, which updates the view.

Let's change our template to be dynamic:

[{]: <helper> (diff_step 2.1)
#### Step 2.1: Use dynamic template instead of static

##### Changed client/main.html
```diff
@@ -1,14 +1,8 @@
-┊ 1┊  ┊<ul>
-┊ 2┊  ┊  <li>
-┊ 3┊  ┊    <span>Dubstep-Free Zone</span>
-┊ 4┊  ┊    <p>
-┊ 5┊  ┊      Can we please just for an evening not listen to dubstep.
-┊ 6┊  ┊    </p>
-┊ 7┊  ┊  </li>
-┊ 8┊  ┊  <li>
-┊ 9┊  ┊    <span>All dubstep all the time</span>
-┊10┊  ┊    <p>
-┊11┊  ┊      Get it on!
-┊12┊  ┊    </p>
-┊13┊  ┊  </li>
-┊14┊  ┊</ul>
+┊  ┊ 1┊<div ng-controller="PartiesListCtrl">
+┊  ┊ 2┊  <ul>
+┊  ┊ 3┊    <li ng-repeat="party in parties">
+┊  ┊ 4┊      {{party.name}}
+┊  ┊ 5┊      <p>{{party.description}}</p>
+┊  ┊ 6┊    </li>
+┊  ┊ 7┊  </ul>
+┊  ┊ 8┊</div>
```
[}]: #

We replaced the hard-coded party list with the [ngRepeat](https://docs.angularjs.org/api/ng/directive/ngRepeat) directive and two Angular 1 expressions:

* The `ng-repeat="party in parties"` attribute in the `li` tag is an Angular 1 repeater directive. The repeater tells Angular 1 to create a `li` element for each party in the list using the `li` tag as the template.
* The expressions wrapped in double-curly-braces ( `party.name}}` and `party.description}}` ) will be replaced by the value of the expressions.

We have added a new directive, called `ng-controller`, which attaches the `PartiesListCtrl` controller to the `div` tag. At this point *the expressions in double-curly-braces are referring to our application model, which is set up in our `PartiesListCtrl` controller.*


# Model and Controller

To create our controller and model we start with `PartiesListCtrl` controller and place data in it.

[{]: <helper> (diff_step 2.2)
#### Step 2.2: Add the parties controller

##### Changed client/main.js
```diff
@@ -2,5 +2,17 @@
 ┊ 2┊ 2┊import angularMeteor from 'angular-meteor';
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊angular.module('socially', [
-┊ 5┊  ┊  angularMeteor
-┊ 6┊  ┊]);
+┊  ┊ 5┊    angularMeteor
+┊  ┊ 6┊  ])
+┊  ┊ 7┊  .controller('PartiesListCtrl', ['$scope', function($scope) {
+┊  ┊ 8┊    $scope.parties = [{
+┊  ┊ 9┊      'name': 'Dubstep-Free Zone',
+┊  ┊10┊      'description': 'Can we please just for an evening not listen to dubstep.'
+┊  ┊11┊    }, {
+┊  ┊12┊      'name': 'All dubstep all the time',
+┊  ┊13┊      'description': 'Get it on!'
+┊  ┊14┊    }, {
+┊  ┊15┊      'name': 'Savage lounging',
+┊  ┊16┊      'description': 'Leisure suit required. And only fiercest manners.'
+┊  ┊17┊    }];
+┊  ┊18┊  }]);
```
[}]: #

We declared a controller called `PartiesListCtrl` and registered it in our Angular 1 module app - `socially`.

The data model is now instantiated within the `PartiesListCtrl` controller.

Although the controller is not yet doing very much, it plays a crucial role. By providing context for our data model, the controller allows us to establish data-binding between the model and the view. We connected the dots between the presentation, the data, and the logic components as follows:

* The ngController directive, located on the `div` tag, references the name of our controller, `PartiesListCtrl` (located in the JavaScript file `main.js`).
* The `PartiesListCtrl` controller attaches the party data to the `$scope` that was injected into our controller function. This controller scope is available to all bindings located within the `div ng-controller="PartiesListCtrl">` tag.

# ng-annotate

As you may know, when using AngularJS dependency injection, we used strings for [dependency annotations](https://docs.angularjs.org/guide/di#dependency-annotation) that avoids minification problems:

    angular.module('socially').controller('PartiesListCtrl', ['$scope',
      function($scope){
        // ...
    }]);

There is a very popular Angular 1 tool that's called [ng-annotate](https://github.com/olov/ng-annotate) that takes care of that for us so we can write regular code that won't get mangled in minification.

angular-meteor uses that process automatically so you do not need to add those extra definitions and just write your app without minification issues!

So let's change our code to the regular and shorter declaration way:

[{]: <helper> (diff_step 2.3)
#### Step 2.3: Remove the DI manual decleration

##### Changed client/main.js
```diff
@@ -4,7 +4,9 @@
 ┊ 4┊ 4┊angular.module('socially', [
 ┊ 5┊ 5┊    angularMeteor
 ┊ 6┊ 6┊  ])
-┊ 7┊  ┊  .controller('PartiesListCtrl', ['$scope', function($scope) {
+┊  ┊ 7┊  .controller('PartiesListCtrl', function($scope) {
+┊  ┊ 8┊    'ngInject';
+┊  ┊ 9┊    
 ┊ 8┊10┊    $scope.parties = [{
 ┊ 9┊11┊      'name': 'Dubstep-Free Zone',
 ┊10┊12┊      'description': 'Can we please just for an evening not listen to dubstep.'
```
```diff
@@ -15,4 +17,4 @@
 ┊15┊17┊      'name': 'Savage lounging',
 ┊16┊18┊      'description': 'Leisure suit required. And only fiercest manners.'
 ┊17┊19┊    }];
-┊18┊  ┊  }]);
+┊  ┊20┊  });
```
[}]: #

and let's add the `ng-strict-di` directive so that if case there is a minification problem, we will find in already in development and not only after minification in production:

[{]: <helper> (diff_step 2.4)
#### Step 2.4: Add ng-strict-di directive to the app

##### Changed client/index.html
```diff
@@ -1,3 +1,3 @@
-┊1┊ ┊<body ng-app="socially">
+┊ ┊1┊<body ng-app="socially" ng-strict-di="">
 ┊2┊2┊  <div ng-include src="'client/main.html'"></div>
 ┊3┊3┊</body>
```
[}]: #

# Summary

You now have a dynamic app that features separate model, view and controller components.

But, this is all client side, which is nice for tutorials, but in a real application we need to persist the data on the server and sync all the clients with it.

Go to [step 3](/tutorial/step_03) to learn how to bind our application to the great power of Meteor.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step1.md) | [Next Step >](step3.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #