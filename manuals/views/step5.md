[{]: <region> (header)
# Step 5: Routing & Multiple Views
[}]: #
[{]: <region> (body)
In this step, you will learn how to create a layout template and how to build an app that has multiple views by adding routing, using an Angular 1 module called `ui-router`.

The goals for this step:

* When you navigate to `index.html`, you will be redirected to `/parties` and the party list should appear in the browser.
* When you click on a party link the URL should change to one specific to that party and the stub of a party detail page is displayed.

# Dependencies

The routing functionality added by this step is provided by the [ui-router](https://github.com/angular-ui/ui-router) module, which is distributed separately from the core Angular 1 framework.

Type in the command line:

    meteor npm install --save angular-ui-router

[{]: <helper> (diff_step 5.1)
#### Step 5.1: Add ui-router

##### Changed package.json
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊  "dependencies": {
 ┊ 9┊ 9┊    "angular": "^1.5.3",
 ┊10┊10┊    "angular-meteor": "^1.3.9",
+┊  ┊11┊    "angular-ui-router": "^0.2.18",
 ┊11┊12┊    "meteor-node-stubs": "~0.2.0"
 ┊12┊13┊  },
 ┊13┊14┊  "devDependencies": {
```
[}]: #

Then add the ui-router as a dependency to our Socially app in `socially.js`:

[{]: <helper> (diff_step 5.2)
#### Step 5.2: Add uiRouter to Socially

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
+┊ ┊3┊import uiRouter from 'angular-ui-router';
 ┊3┊4┊
 ┊4┊5┊import template from './socially.html';
 ┊5┊6┊import { name as PartiesList } from '../partiesList/partiesList';
```
```diff
@@ -11,6 +12,7 @@
 ┊11┊12┊// create a module
 ┊12┊13┊export default angular.module(name, [
 ┊13┊14┊  angularMeteor,
+┊  ┊15┊  uiRouter,
 ┊14┊16┊  PartiesList
 ┊15┊17┊]).component(name, {
 ┊16┊18┊  template,
```
[}]: #

# Multiple Views, Routing and Layout Template

Our app is slowly growing and becoming more complex.
Until now, the app provided our users with a single view (the list of all parties), and all of the template code was located in the `main.html` file.

The next step in building the app is to add a view that will show detailed information about each of the parties on our list.

To add the detailed view, we could expand the `main.html` file to contain template code for both views, but that would get messy very quickly.

Instead, we are going to turn the `index.html` template into what we call a "layout template". This is a template that is common for all views in our application.
Other "partial templates" are then included into this layout template depending on the current "route" — the view that is currently displayed to the user.

Application routes in Angular 1 are declared via the [$stateProvider](https://github.com/angular-ui/ui-router/wiki), which is the provider of the $state service.
This service makes it easy to wire together controllers, view templates, and the current URL location in the browser.
Using this feature we can implement deep linking, which lets us utilize the browser's history (back and forward navigation) and bookmarks.


# Template

The `$state` service is normally used in conjunction with the uiView directive.
The role of the `ui-view` directive is to include the view template for the current route into the layout template.
This makes it a perfect fit for our `main.html` file.

Now let's go back to `index.html` to add base tag to our main html file:

[{]: <helper> (diff_step 5.3)
#### Step 5.3: Add base tag to main template

##### Changed client/index.html
```diff
@@ -1,3 +1,6 @@
+┊ ┊1┊<head>
+┊ ┊2┊  <base href="/">
+┊ ┊3┊</head>
 ┊1┊4┊<body ng-app="socially" ng-strict-di="">
 ┊2┊5┊  <socially></socially>
 ┊3┊6┊</body>
```
[}]: #

We still need to add uiView directive, Socially is the best place for it:

[{]: <helper> (diff_step 5.4)
#### Step 5.4: Add uiView to Socially view

##### Changed imports/ui/components/socially/socially.html
```diff
@@ -1 +1 @@
-┊1┊ ┊<parties-list></parties-list>
+┊ ┊1┊<div ui-view=""></div>
```
[}]: #

Let's define a default route and use html5 mode to make urls look a lot fancier:

[{]: <helper> (diff_step 5.6)
#### Step 5.6: Set html5Mode and `parties` as default route

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -18,4 +18,13 @@
 ┊18┊18┊  template,
 ┊19┊19┊  controllerAs: name,
 ┊20┊20┊  controller: Socially
-┊21┊  ┊});
+┊  ┊21┊})
+┊  ┊22┊  .config(config);
+┊  ┊23┊
+┊  ┊24┊function config($locationProvider, $urlRouterProvider) {
+┊  ┊25┊  'ngInject';
+┊  ┊26┊
+┊  ┊27┊  $locationProvider.html5Mode(true);
+┊  ┊28┊
+┊  ┊29┊  $urlRouterProvider.otherwise('/parties');
+┊  ┊30┊}
```
[}]: #

It would be nice to have a navigation. Create one! Let's call our new component `Navigation`:

[{]: <helper> (diff_step 5.7)
#### Step 5.7: Create view for Navigation component

##### Added imports/ui/components/navigation/navigation.html
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊<h1>
+┊ ┊2┊  <a href="/parties">Home</a>
+┊ ┊3┊</h1>
```
[}]: #

[{]: <helper> (diff_step 5.8)
#### Step 5.8: Create Navigation component

##### Added imports/ui/components/navigation/navigation.js
```diff
@@ -0,0 +1,14 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import template from './navigation.html';
+┊  ┊ 5┊
+┊  ┊ 6┊const name = 'navigation';
+┊  ┊ 7┊
+┊  ┊ 8┊// create a module
+┊  ┊ 9┊export default angular.module(name, [
+┊  ┊10┊  angularMeteor
+┊  ┊11┊]).component(name, {
+┊  ┊12┊  template,
+┊  ┊13┊  controllerAs: name
+┊  ┊14┊});
```
[}]: #

And implement it in `Socially`:

[{]: <helper> (diff_step 5.9)
#### Step 5.9: Implement Navigation in the view

##### Changed imports/ui/components/socially/socially.html
```diff
@@ -1 +1,3 @@
+┊ ┊1┊<navigation></navigation>
+┊ ┊2┊
 ┊1┊3┊<div ui-view=""></div>
```
[}]: #

[{]: <helper> (diff_step 5.10)
#### Step 5.10: Add Navigation to Socially

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import template from './socially.html';
 ┊ 6┊ 6┊import { name as PartiesList } from '../partiesList/partiesList';
+┊  ┊ 7┊import { name as Navigation } from '../navigation/navigation';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊class Socially {}
 ┊ 9┊10┊
```
```diff
@@ -13,7 +14,8 @@
 ┊13┊14┊export default angular.module(name, [
 ┊14┊15┊  angularMeteor,
 ┊15┊16┊  uiRouter,
-┊16┊  ┊  PartiesList
+┊  ┊17┊  PartiesList,
+┊  ┊18┊  Navigation
 ┊17┊19┊]).component(name, {
 ┊18┊20┊  template,
 ┊19┊21┊  controllerAs: name,
```
[}]: #

Notice we did 3 things:

1. Replaced all the content inside Socially component with ui-view (this will be responsible for including the right content according to the current URL).
2. Defined default route.
3. Created navigation.
4. We also added a `base` tag in the head (required when using HTML5 location mode - would be explained a bit further).

> Note that you can remove `main.html` now, because it's no longer in use!

# Routes definition

Now let's configure our routes.
There are no states at this stage, so let's add `parties` inside `PartiesList` component:

[{]: <helper> (diff_step 5.5)
#### Step 5.5: Define `parties` route

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
+┊ ┊3┊import uiRouter from 'angular-ui-router';
 ┊3┊4┊
 ┊4┊5┊import template from './partiesList.html';
 ┊5┊6┊import { Parties } from '../../../api/parties';
```
```diff
@@ -25,10 +26,21 @@
 ┊25┊26┊// create a module
 ┊26┊27┊export default angular.module(name, [
 ┊27┊28┊  angularMeteor,
+┊  ┊29┊  uiRouter,
 ┊28┊30┊  PartyAdd,
 ┊29┊31┊  PartyRemove
 ┊30┊32┊]).component(name, {
 ┊31┊33┊  template,
 ┊32┊34┊  controllerAs: name,
 ┊33┊35┊  controller: PartiesList
-┊34┊  ┊});
+┊  ┊36┊})
+┊  ┊37┊  .config(config);
+┊  ┊38┊
+┊  ┊39┊function config($stateProvider) {
+┊  ┊40┊  'ngInject';
+┊  ┊41┊  $stateProvider
+┊  ┊42┊    .state('parties', {
+┊  ┊43┊      url: '/parties',
+┊  ┊44┊      template: '<parties-list></parties-list>'
+┊  ┊45┊    });
+┊  ┊46┊}
```
[}]: #

And we will also add a state for a new page that will display the party details.

Our application routes are defined as follows:

* **('/parties')**: The parties list view will be shown when the URL hash fragment is /parties. To construct this view, Angular 1 will use the parties-list Component.
* **('/parties/:partyId')**: The party details view will be shown when the URL hash fragment matches '/parties/:partyId', where `:partyId` is a variable part of the URL. To construct the party details view, Angular will use the party-details Component.
* **$urlRouterProvider.otherwise('/parties')**: Triggers a redirection to /parties when the browser address doesn't match either of our routes.
* **$locationProvider.html5Mode(true)**: Sets the URL to look like a regular one. More about it [here](https://docs.angularjs.org/guide/$location#hashbang-and-html5-modes).
* Each template is just a regular usage of our components.

Note the use of the `:partyId` parameter in the second route declaration.
The $state service uses the route declaration — `/parties/:partyId` — as a template that is matched against the current URL.
All variables defined with the : notation are passed into the Component through the `$stateParams` object.

# Components

I mentioned a state with party details. We have to define our `partyDetails` component.

Let's create the view for this Component in a new file:

[{]: <helper> (diff_step 5.11)
#### Step 5.11: Create view for the PartyDetails

##### Added imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -0,0 +1 @@
+┊ ┊1┊The party you selected is: {{ partyDetails.partyId }}
```
[}]: #

Now we can create actual component:

[{]: <helper> (diff_step 5.12)
#### Step 5.12: Create PartyDetails

##### Added imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -0,0 +1,24 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import uiRouter from 'angular-ui-router';
+┊  ┊ 4┊
+┊  ┊ 5┊import template from './partyDetails.html';
+┊  ┊ 6┊
+┊  ┊ 7┊class PartyDetails {
+┊  ┊ 8┊  constructor($stateParams) {
+┊  ┊ 9┊    'ngInject';
+┊  ┊10┊
+┊  ┊11┊    this.partyId = $stateParams.partyId;
+┊  ┊12┊  }
+┊  ┊13┊}
+┊  ┊14┊
+┊  ┊15┊const name = 'partyDetails';
+┊  ┊16┊
+┊  ┊17┊// create a module
+┊  ┊18┊export default angular.module(name, [
+┊  ┊19┊  angularMeteor
+┊  ┊20┊]).component(name, {
+┊  ┊21┊  template,
+┊  ┊22┊  controllerAs: name,
+┊  ┊23┊  controller: PartyDetails
+┊  ┊24┊});
```
[}]: #

And also define new route which was mentioned before as `/parties/:partyId`:

[{]: <helper> (diff_step 5.13)
#### Step 5.13: Set partyDetails state

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -16,9 +16,20 @@
 ┊16┊16┊
 ┊17┊17┊// create a module
 ┊18┊18┊export default angular.module(name, [
-┊19┊  ┊  angularMeteor
+┊  ┊19┊  angularMeteor,
+┊  ┊20┊  uiRouter
 ┊20┊21┊]).component(name, {
 ┊21┊22┊  template,
 ┊22┊23┊  controllerAs: name,
 ┊23┊24┊  controller: PartyDetails
-┊24┊  ┊});
+┊  ┊25┊})
+┊  ┊26┊  .config(config);
+┊  ┊27┊
+┊  ┊28┊function config($stateProvider) {
+┊  ┊29┊  'ngInject';
+┊  ┊30┊
+┊  ┊31┊  $stateProvider.state('partyDetails', {
+┊  ┊32┊    url: '/parties/:partyId',
+┊  ┊33┊    template: '<party-details></party-details>'
+┊  ┊34┊  });
+┊  ┊35┊}
```
[}]: #

Now let's add a link from each party in the parties list to it's details page:

[{]: <helper> (diff_step 5.14)
#### Step 5.14: Add PartyDetails to Socially

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import template from './socially.html';
 ┊ 6┊ 6┊import { name as PartiesList } from '../partiesList/partiesList';
+┊  ┊ 7┊import { name as PartyDetails } from '../partyDetails/partyDetails';
 ┊ 7┊ 8┊import { name as Navigation } from '../navigation/navigation';
 ┊ 8┊ 9┊
 ┊ 9┊10┊class Socially {}
```
```diff
@@ -15,6 +16,7 @@
 ┊15┊16┊  angularMeteor,
 ┊16┊17┊  uiRouter,
 ┊17┊18┊  PartiesList,
+┊  ┊19┊  PartyDetails,
 ┊18┊20┊  Navigation
 ┊19┊21┊]).component(name, {
 ┊20┊22┊  template,
```
[}]: #

[{]: <helper> (diff_step 5.15)
#### Step 5.15: Add link

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -2,7 +2,9 @@
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊<ul>
 ┊ 4┊ 4┊  <li ng-repeat="party in partiesList.parties">
-┊ 5┊  ┊    {{party.name}}
+┊  ┊ 5┊    <a ui-sref="partyDetails({ partyId: party._id })">
+┊  ┊ 6┊      {{party.name}}
+┊  ┊ 7┊    </a>
 ┊ 6┊ 8┊    <p>{{party.description}}</p>
 ┊ 7┊ 9┊    <party-remove party="party"></party-remove>
 ┊ 8┊10┊  </li>
```
[}]: #

Now all is in place.  Run the app and you'll notice a few things:

* Click on the link in the name of a party - notice that you moved into a different view and that the party's id appears in both the browser's url and in the template.
* Click back - you are back to the main list, this is because of ui-router's integration with the browser's history.
* Try to put arbitrary text in the URL - something like [http://localhost:3000/strange-url](http://localhost:3000/strange-url).  You should to be automatically redirected to the main parties list.

# Summary

With the routing set up and the parties list view implemented, we're ready to go to the next step and implement the party details view.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step4.md) | [Next Step >](step6.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #