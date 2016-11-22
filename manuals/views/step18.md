[{]: <region> (header)
# Step 18: angular-material and custom Angular auth forms
[}]: #
[{]: <region> (body)
In this step we will consider switching from *Twitter Bootstrap* to [*angular-material*](https://material.angularjs.org/#/).

Angular-material is an Angular 1 implementation of Google's [Material Design specifications](http://www.google.com/design/spec/material-design/introduction.html). Material Design is a mobile-first design language used in many new Google's applications, especially on the Android platform.

# Removing Bootstrap 4

To start, first we have to remove bootstrap from our application. Type in the console:

    meteor npm uninstall bootstrap --save

We should also remove dependency from the main.js file:

[{]: <helper> (diff_step 18.4)
#### Step 18.4: Remove bootstrap from main.js

##### Changed client/main.js
```diff
@@ -1,5 +1,4 @@
 ┊1┊1┊import angular from 'angular';
-┊2┊ ┊import 'bootstrap/dist/css/bootstrap.css';
 ┊3┊2┊
 ┊4┊3┊import { Meteor } from 'meteor/meteor';
```
[}]: #

# Installing angular-material

Now we have to add the angular-material Meteor package:

    meteor npm install angular-aria angular-animate angular-material --save

We still need file with styles:

[{]: <helper> (diff_step 18.3)
#### Step 18.3: Add css

##### Changed client/index.html
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊  <title>Socially</title>
 ┊ 7┊ 7┊  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbphq9crcdpecbseKX3Yx2LPxMRqWK-rc"></script>
 ┊ 8┊ 8┊  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
+┊  ┊ 9┊  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.0.7/angular-material.min.css">
 ┊ 9┊10┊</head>
 ┊10┊11┊<body>
 ┊11┊12┊  <socially></socially>
```
[}]: #

Next, we want to inject the angular-material module into our Angular 1 application.

[{]: <helper> (diff_step 18.5)
#### Step 18.5: Add ngMaterial to Socially

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
+┊ ┊3┊import ngMaterial from 'angular-material';
 ┊3┊4┊import uiRouter from 'angular-ui-router';
 ┊4┊5┊
 ┊5┊6┊import template from './socially.html';
```
```diff
@@ -14,6 +15,7 @@
 ┊14┊15┊// create a module
 ┊15┊16┊export default angular.module(name, [
 ┊16┊17┊  angularMeteor,
+┊  ┊18┊  ngMaterial,
 ┊17┊19┊  uiRouter,
 ┊18┊20┊  PartiesList,
 ┊19┊21┊  PartyDetails,
```
[}]: #

That's it, now we can use `angular-material` in our application layout.

Let's add `Material Design Icons` and `Ionic Icons` to Socially:

    meteor add pagebakers:ionicons
    meteor add planettraining:material-design-icons

We have to define the `$mdIconProvider`.

[{]: <helper> (diff_step 18.20)
#### Step 18.20: Set icons

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -29,12 +29,30 @@
 ┊29┊29┊  .config(config)
 ┊30┊30┊  .run(run);
 ┊31┊31┊
-┊32┊  ┊function config($locationProvider, $urlRouterProvider) {
+┊  ┊32┊function config($locationProvider, $urlRouterProvider, $mdIconProvider) {
 ┊33┊33┊  'ngInject';
 ┊34┊34┊
 ┊35┊35┊  $locationProvider.html5Mode(true);
 ┊36┊36┊
 ┊37┊37┊  $urlRouterProvider.otherwise('/parties');
+┊  ┊38┊
+┊  ┊39┊  const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';
+┊  ┊40┊
+┊  ┊41┊  $mdIconProvider
+┊  ┊42┊    .iconSet('social',
+┊  ┊43┊      iconPath + 'svg-sprite-social.svg')
+┊  ┊44┊    .iconSet('action',
+┊  ┊45┊      iconPath + 'svg-sprite-action.svg')
+┊  ┊46┊    .iconSet('communication',
+┊  ┊47┊      iconPath + 'svg-sprite-communication.svg')
+┊  ┊48┊    .iconSet('content',
+┊  ┊49┊      iconPath + 'svg-sprite-content.svg')
+┊  ┊50┊    .iconSet('toggle',
+┊  ┊51┊      iconPath + 'svg-sprite-toggle.svg')
+┊  ┊52┊    .iconSet('navigation',
+┊  ┊53┊      iconPath + 'svg-sprite-navigation.svg')
+┊  ┊54┊    .iconSet('image',
+┊  ┊55┊      iconPath + 'svg-sprite-image.svg');
 ┊38┊56┊}
 ┊39┊57┊
 ┊40┊58┊function run($rootScope, $state) {
```
[}]: #

You don't have to define all these icon sets.
You just need to define those you need to use.
You can see a full list of available icons [here](http://google.github.io/material-design-icons/).

This is the example from `PartyRemove` component:

    <md-icon md-svg-icon="content:ic_clear_24px"></md-icon>

In the `md-svg-icon` attribute we used `<iconset>:<icon_name>` in our case `content:ic_clear_24px`.

You can read more about it by clicking [here](https://material.angularjs.org/latest/api/service/$mdIconProvider)

Great! So now in order get rid of all the bootstrap change we make, we need to remove some and modify some CSS and LESS.

Angular-material uses declarative syntax, i.e. directives, to utilize Material Design elements in HTML documents.

First we want to change our main component which is Socially

[{]: <helper> (diff_step 18.6)
#### Step 18.6: Clean up Socially template

##### Changed imports/ui/components/socially/socially.html
```diff
@@ -1,3 +1,3 @@
-┊1┊ ┊<navigation class="navbar navbar-static-top navbar-dark bg-inverse"></navigation>
+┊ ┊1┊<navigation></navigation>
 ┊2┊2┊
-┊3┊ ┊<div ui-view="" class="container-fluid"></div>
+┊ ┊3┊<div ui-view=""></div>
```
[}]: #

# Navigation

Use `md-toolbar` in Navigation:

[{]: <helper> (diff_step 18.7)
#### Step 18.7: Refactor Navigation

##### Changed imports/ui/components/navigation/navigation.html
```diff
@@ -1,6 +1,10 @@
-┊ 1┊  ┊<div class="fluid-container">
-┊ 2┊  ┊  <div class="navbar-header">
-┊ 3┊  ┊    <a href="/parties" class="navbar-brand">Socially</a>
-┊ 4┊  ┊    <login-buttons class="navbar-brand"></login-buttons>
+┊  ┊ 1┊<md-toolbar>
+┊  ┊ 2┊  <div class="md-toolbar-tools">
+┊  ┊ 3┊    <h2>
+┊  ┊ 4┊      <span ui-sref="parties">
+┊  ┊ 5┊        Socially
+┊  ┊ 6┊      </span>
+┊  ┊ 7┊    </h2>
+┊  ┊ 8┊    <login-buttons></login-buttons>
 ┊ 5┊ 9┊  </div>
-┊ 6┊  ┊</div>
+┊  ┊10┊</md-toolbar>
```
[}]: #

[{]: <helper> (diff_step 18.8)
#### Step 18.8: Add space before loginButtons

##### Changed imports/ui/components/navigation/navigation.less
```diff
@@ -1,3 +1,5 @@
 ┊1┊1┊navigation {
-┊2┊ ┊  display: block;
+┊ ┊2┊  login-buttons {
+┊ ┊3┊    margin-left: 15px;
+┊ ┊4┊  }
 ┊3┊5┊}
```
[}]: #

# PartiesList

You can see we use `layout="column"` in the first `div` tag, which tells angular-material to lay all inner layers vertically.

Element layout flex grid is very simple and intuitive in `angular-material` and you can read all about it [here](https://material.angularjs.org/#/layout/grid).

Later on, we use `layout-gt-sm="row"` which overrides `column` setting on screens greater than 960px wide.

[{]: <helper> (diff_step 18.9)
#### Step 18.9: Refactor PartiesList

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,65 +1,54 @@
-┊ 1┊  ┊<div class="container-fluid">
-┊ 2┊  ┊  <div class="row">
-┊ 3┊  ┊    <div class="col-md-12">
-┊ 4┊  ┊      <party-add ng-show="partiesList.isLoggedIn"></party-add>
+┊  ┊ 1┊<div layout="column" layout-padding>
+┊  ┊ 2┊  <party-add ng-show="partiesList.isLoggedIn"></party-add>
+┊  ┊ 3┊  <div ng-hide="partiesList.isLoggedIn">
+┊  ┊ 4┊    <i>Log in to create a party!</i>
+┊  ┊ 5┊  </div>
 ┊ 5┊ 6┊
-┊ 6┊  ┊      <div class="alert alert-warning" role="alert" ng-hide="partiesList.isLoggedIn">
-┊ 7┊  ┊        <strong>Warning!</strong>
-┊ 8┊  ┊        Log in to create a party!
-┊ 9┊  ┊      </div>
-┊10┊  ┊    </div>
+┊  ┊ 7┊  <div flex>
+┊  ┊ 8┊    <h2 class="md-display-1">List of the parties:</h2>
 ┊11┊ 9┊  </div>
-┊12┊  ┊  <div class="row">
-┊13┊  ┊    <div class="col-md-12">
-┊14┊  ┊      <h2>List of parties:</h2>
-┊15┊  ┊      <form class="form-inline">
-┊16┊  ┊        <div class="form-group">
-┊17┊  ┊          <input type="search" ng-model="partiesList.searchText" placeholder="Search" class="form-control"/>
-┊18┊  ┊        </div>
-┊19┊  ┊        <parties-sort class="form-group" on-change="partiesList.sortChanged(sort)" property="name" order="1"></parties-sort>
-┊20┊  ┊      </form>
-┊21┊  ┊    </div>
+┊  ┊10┊
+┊  ┊11┊  <div flex layout="row" layout-padding>
+┊  ┊12┊    <md-input-container>
+┊  ┊13┊      <label>Search</label>
+┊  ┊14┊      <input ng-model="partiesList.searchText">
+┊  ┊15┊    </md-input-container>
+┊  ┊16┊
+┊  ┊17┊    <parties-sort on-change="partiesList.sortChanged(sort)" property="name" order="1"></parties-sort>
 ┊22┊18┊  </div>
-┊23┊  ┊  <div class="row">
-┊24┊  ┊    <div class="col-md-6">
-┊25┊  ┊      <ul class="parties">
-┊26┊  ┊        <li dir-paginate="party in partiesList.parties | itemsPerPage: partiesList.perPage" total-items="partiesList.partiesCount">
-┊27┊  ┊          <div class="row">
-┊28┊  ┊            <div class="col-sm-8">
-┊29┊  ┊              <h3 class="party-name">
-┊30┊  ┊                <a ui-sref="partyDetails({ partyId: party._id })">{{party.name}}</a>
-┊31┊  ┊              </h3>
-┊32┊  ┊              <p class="party-description">
-┊33┊  ┊                {{party.description}}
-┊34┊  ┊              </p>
-┊35┊  ┊            </div>
-┊36┊  ┊            <div class="col-sm-4">
-┊37┊  ┊              <party-remove party="party" ng-show="partiesList.isOwner(party)"></party-remove>
-┊38┊  ┊            </div>
-┊39┊  ┊          </div>
-┊40┊  ┊          <div class="row">
-┊41┊  ┊            <div class="col-md-12">
-┊42┊  ┊              <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
-┊43┊  ┊              <div class="alert alert-warning" role="alert" ng-hide="partiesList.isLoggedIn">
-┊44┊  ┊                <strong>Warning!</strong>
-┊45┊  ┊                <i>Sign in to RSVP for this party.</i>
-┊46┊  ┊              </div>
-┊47┊  ┊            </div>
-┊48┊  ┊          </div>
-┊49┊  ┊          <div class="row">
-┊50┊  ┊            <div class="col-md-4">
-┊51┊  ┊              <party-creator party="party"></party-creator>
-┊52┊  ┊            </div>
-┊53┊  ┊            <div class="col-md-8">
-┊54┊  ┊              <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
-┊55┊  ┊            </div>
+┊  ┊19┊
+┊  ┊20┊  <div layout="column" layout-gt-sm="row">
+┊  ┊21┊    <div flex="50">
+┊  ┊22┊      <md-card dir-paginate="party in partiesList.parties | itemsPerPage: partiesList.perPage" total-items="partiesList.partiesCount">
+┊  ┊23┊        <md-card-title>
+┊  ┊24┊          <md-card-title-text>
+┊  ┊25┊            <span class="md-headline" ui-sref="partyDetails({ partyId: party._id })">
+┊  ┊26┊              {{party.name}}
+┊  ┊27┊              <party-remove party="party"></party-remove>
+┊  ┊28┊            </span>
+┊  ┊29┊            <span class="md-subhead">{{party.description}}</span>
+┊  ┊30┊          </md-card-title-text>
+┊  ┊31┊        </md-card-title>
+┊  ┊32┊        <md-card-content>
+┊  ┊33┊          <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
+┊  ┊34┊
+┊  ┊35┊          <party-unanswered party="party" ng-if="!party.public"></party-unanswered>
+┊  ┊36┊          <div ng-if="party.public">
+┊  ┊37┊            Everyone is invited
 ┊56┊38┊          </div>
-┊57┊  ┊        </li>
-┊58┊  ┊      </ul>
 ┊59┊39┊
+┊  ┊40┊          <party-creator party="party"></party-creator>
+┊  ┊41┊        </md-card-content>
+┊  ┊42┊        <md-card-actions>
+┊  ┊43┊          <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
+┊  ┊44┊          <div ng-hide="partiesList.isLoggedIn">
+┊  ┊45┊            <i>Sign in to RSVP for this party.</i>
+┊  ┊46┊          </div>
+┊  ┊47┊        </md-card-actions>
+┊  ┊48┊      </md-card>
 ┊60┊49┊      <dir-pagination-controls on-page-change="partiesList.pageChanged(newPageNumber)"></dir-pagination-controls>
 ┊61┊50┊    </div>
-┊62┊  ┊    <div class="col-md-6">
+┊  ┊51┊    <div flex="50">
 ┊63┊52┊      <parties-map parties="partiesList.parties"></parties-map>
 ┊64┊53┊    </div>
 ┊65┊54┊  </div>
```
[}]: #

[{]: <helper> (diff_step 18.10)
#### Step 18.10: Leave only one definition

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -1,36 +1,5 @@
 ┊ 1┊ 1┊parties-list {
-┊ 2┊  ┊  display: block;
-┊ 3┊  ┊  padding: 25px 0;
-┊ 4┊  ┊
-┊ 5┊  ┊  ul.parties {
-┊ 6┊  ┊    padding-left: 0;
-┊ 7┊  ┊    list-style-type: none;
-┊ 8┊  ┊
-┊ 9┊  ┊    > li {
-┊10┊  ┊      padding: 15px;
-┊11┊  ┊      background-color: #fff;
-┊12┊  ┊      margin: 15px 0;
-┊13┊  ┊      border: 3px solid #eaeaea;
-┊14┊  ┊
-┊15┊  ┊     .party-name {
-┊16┊  ┊       margin-top: 0px;
-┊17┊  ┊       margin-bottom: 20px;
-┊18┊  ┊       a {
-┊19┊  ┊         text-decoration: none !important;
-┊20┊  ┊         font-weight: 400;
-┊21┊  ┊       }
-┊22┊  ┊     }
-┊23┊  ┊     .party-description {
-┊24┊  ┊       font-weight: 300;
-┊25┊  ┊       padding-left: 18px;
-┊26┊  ┊       font-size: 14px;
-┊27┊  ┊     }
-┊28┊  ┊    }
+┊  ┊ 2┊  [ui-sref] {
+┊  ┊ 3┊    cursor: pointer;
 ┊29┊ 4┊  }
 ┊30┊ 5┊}
-┊31┊  ┊
-┊32┊  ┊@import "../partyAdd/partyAdd.less";
-┊33┊  ┊@import "../partiesMap/partiesMap.less";
-┊34┊  ┊@import "../partyCreator/partyCreator.less";
-┊35┊  ┊@import "../partyRsvp/partyRsvp.less";
-┊36┊  ┊@import "../partyRsvpsList/partyRsvpsList.less";
```
[}]: #

# PariesMap

Remove the heading:

[{]: <helper> (diff_step 18.11)
#### Step 18.11: Refactor PartiesMap

##### Changed imports/ui/components/partiesMap/partiesMap.html
```diff
@@ -1,6 +1,3 @@
-┊1┊ ┊<h4>
-┊2┊ ┊  See all the parties:
-┊3┊ ┊</h4>
 ┊4┊1┊<div class="angular-google-map-container">
 ┊5┊2┊  <ui-gmap-google-map center="partiesMap.map.center" zoom="partiesMap.map.zoom">
 ┊6┊3┊    <ui-gmap-markers models="partiesMap.parties" coords="'location'" fit="true" idkey="'_id'" doRebuildAll="true"></ui-gmap-markers>
```
[}]: #

[{]: <helper> (diff_step 18.12)
#### Step 18.12: Styles for PartiesMap

##### Changed imports/ui/components/partiesMap/partiesMap.less
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊parties-map {
 ┊2┊2┊  display: block;
-┊3┊ ┊  margin: 15px 5px;
+┊ ┊3┊  padding: 10px;
 ┊4┊4┊
 ┊5┊5┊  .angular-google-map-container {
 ┊6┊6┊    width: 100%;
```
[}]: #

[{]: <helper> (diff_step 18.13)
#### Step 18.13: Import in PartiesList

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -3,3 +3,5 @@
 ┊3┊3┊    cursor: pointer;
 ┊4┊4┊  }
 ┊5┊5┊}
+┊ ┊6┊
+┊ ┊7┊@import "../partiesMap/partiesMap.less";
```
[}]: #

# PartiesSort

Let's use `md-input-container` combined with `md-select`:

[{]: <helper> (diff_step 18.14)
#### Step 18.14: Refactor PartiesSort

##### Changed imports/ui/components/partiesSort/partiesSort.html
```diff
@@ -1,4 +1,10 @@
-┊ 1┊  ┊<select ng-model="partiesSort.order" ng-change="partiesSort.changed()" class="form-control">
-┊ 2┊  ┊  <option value="1">Ascending</option>
-┊ 3┊  ┊  <option value="-1">Descending</option>
-┊ 4┊  ┊</select>
+┊  ┊ 1┊<md-input-container>
+┊  ┊ 2┊  <md-select ng-model="partiesSort.order" ng-change="partiesSort.changed()">
+┊  ┊ 3┊    <md-option value="1">
+┊  ┊ 4┊      Ascending
+┊  ┊ 5┊    </md-option>
+┊  ┊ 6┊    <md-option value="-1">
+┊  ┊ 7┊      Descending
+┊  ┊ 8┊    </md-option>
+┊  ┊ 9┊  </md-select>
+┊  ┊10┊</md-input-container>
```
[}]: #

# PartyAdd

We won't be using `partyAdd.less` any longer, so it can be removed.

[{]: <helper> (diff_step 18.15)
#### Step 18.15: Refactor PartyAdd

##### Changed imports/ui/components/partyAdd/partyAdd.html
```diff
@@ -1,20 +1,22 @@
-┊ 1┊  ┊<form>
-┊ 2┊  ┊  <div class="form-group">
+┊  ┊ 1┊<div layout="column" layout-padding>
+┊  ┊ 2┊  <md-input-container>
 ┊ 3┊ 3┊    <label>
 ┊ 4┊ 4┊      Party Name:
 ┊ 5┊ 5┊    </label>
-┊ 6┊  ┊    <input type="text" ng-model="partyAdd.party.name" class="form-control"/>
-┊ 7┊  ┊  </div>
-┊ 8┊  ┊  <div class="form-group">
+┊  ┊ 6┊    <input type="text" ng-model="partyAdd.party.name"/>
+┊  ┊ 7┊  </md-input-container>
+┊  ┊ 8┊  <md-input-container>
 ┊ 9┊ 9┊    <label>
 ┊10┊10┊      Description:
 ┊11┊11┊    </label>
-┊12┊  ┊    <input type="text" ng-model="partyAdd.party.description" class="form-control"/>
+┊  ┊12┊    <input type="text" ng-model="partyAdd.party.description"/>
+┊  ┊13┊  </md-input-container>
+┊  ┊14┊  <div flex>
+┊  ┊15┊    <md-checkbox ng-model="partyAdd.party.public" aria-label="Public Party?">
+┊  ┊16┊      Public Party?
+┊  ┊17┊    </md-checkbox>
 ┊13┊18┊  </div>
-┊14┊  ┊  <div class="checkbox">
-┊15┊  ┊    <label>
-┊16┊  ┊      <input type="checkbox" ng-model="partyAdd.party.public"/> Public Party?
-┊17┊  ┊    </label>
+┊  ┊19┊  <div flex>
+┊  ┊20┊    <md-button ng-click="partyAdd.submit()" class="md-raised">Add Party!</md-button>
 ┊18┊21┊  </div>
-┊19┊  ┊  <button ng-click="partyAdd.submit()" class="btn btn-success">Add Party!</button>
-┊20┊  ┊</form>
+┊  ┊22┊</div>
```
[}]: #

# PartyCreator

We can now remove partyCreator.less since we no longer need it.

[{]: <helper> (diff_step 18.17)
#### Step 18.17: Refactor PartyCreator

##### Changed imports/ui/components/partyCreator/partyCreator.html
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊<p>
 ┊2┊2┊  <small>
-┊3┊ ┊    <i class="fa fa-user fa-lg"></i> {{ partyCreator.creator | displayNameFilter }}
+┊ ┊3┊    Posted by {{ partyCreator.creator | displayNameFilter }}
 ┊4┊4┊  </small>
 ┊5┊5┊</p>
```
[}]: #

# PartyRemove

Let's use `clear` icon from `content` set:

[{]: <helper> (diff_step 18.21)
#### Step 18.21: Refactor PartyRemove

##### Changed imports/ui/components/partyRemove/partyRemove.html
```diff
@@ -1 +1 @@
-┊1┊ ┊<button type="button" class="close" aria-label="Close" ng-click="partyRemove.remove()"><span aria-hidden="true">&times;</span></button>
+┊ ┊1┊<md-icon md-svg-icon="content:ic_clear_24px" ng-click="partyRemove.remove()"></md-icon>
```
[}]: #

Move component to the right:

[{]: <helper> (diff_step 18.22)
#### Step 18.22: Styles for PartyRemove

##### Added imports/ui/components/partyRemove/partyRemove.less
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊party-remove {
+┊ ┊2┊  float: right;
+┊ ┊3┊}
```
[}]: #

[{]: <helper> (diff_step 18.23)
#### Step 18.23: Import to PartiesList

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -5,3 +5,4 @@
 ┊5┊5┊}
 ┊6┊6┊
 ┊7┊7┊@import "../partiesMap/partiesMap.less";
+┊ ┊8┊@import "../partyRemove/partyRemove.less";
```
[}]: #

# PartyRsvp

Since we using only the angular-material directives you can remove .less file of PartyRsvp component:

[{]: <helper> (diff_step 18.24)
#### Step 18.24: Refactor PartyRsvp

##### Changed imports/ui/components/partyRsvp/partyRsvp.html
```diff
@@ -1,3 +1,5 @@
-┊1┊ ┊<input type="button" value="I'm going!" ng-click="partyRsvp.yes()" class="btn btn-default" ng-class="{'btn-primary' : partyRsvp.isYes()}"/>
-┊2┊ ┊<input type="button" value="Maybe" ng-click="partyRsvp.maybe()" class="btn btn-default" ng-class="{'btn-primary' : partyRsvp.isMaybe()}"/>
-┊3┊ ┊<input type="button" value="No" ng-click="partyRsvp.no()" class="btn btn-default" ng-class="{'btn-primary' : partyRsvp.isNo()}"/>
+┊ ┊1┊<div layout="row" layout-align="end center">
+┊ ┊2┊  <md-button ng-click="partyRsvp.yes()" ng-class="{'md-primary' : partyRsvp.isYes()}">I'm going!</md-button>
+┊ ┊3┊  <md-button ng-click="partyRsvp.maybe()" ng-class="{'md-primary' : partyRsvp.isMaybe()}">Maybe</md-button>
+┊ ┊4┊  <md-button ng-click="partyRsvp.no()" ng-class="{'md-primary' : partyRsvp.isNo()}">No</md-button>
+┊ ┊5┊</div>
```
[}]: #

# PartyUninvited

Thanks to the angular-material we no longer need partyUninvited.less:

[{]: <helper> (diff_step 18.26)
#### Step 18.26: Refactor PartyUninvited

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -1,10 +1,12 @@
-┊ 1┊  ┊<h4>Users to invite:</h4>
-┊ 2┊  ┊<ul>
-┊ 3┊  ┊  <li ng-repeat="user in partyUninvited.users | uninvitedFilter:partyUninvited.party">
-┊ 4┊  ┊    <button ng-click="partyUninvited.invite(user)" class="btn btn-primary-outline">Invite</button>
-┊ 5┊  ┊    {{ user | displayNameFilter }}
-┊ 6┊  ┊  </li>
-┊ 7┊  ┊</ul>
-┊ 8┊  ┊<div class="alert alert-success" role="alert" ng-if="(partyUninvited.users | uninvitedFilter:partyUninvited.party).length <= 0">
-┊ 9┊  ┊  Everyone are already invited.
-┊10┊  ┊</div>
+┊  ┊ 1┊<h4 class="md-headline">
+┊  ┊ 2┊  Users to invite:
+┊  ┊ 3┊</h4>
+┊  ┊ 4┊
+┊  ┊ 5┊<md-list>
+┊  ┊ 6┊  <md-list-item ng-repeat="user in partyUninvited.users | uninvitedFilter:partyUninvited.party" ng-click="partyUninvited.invite(user)">
+┊  ┊ 7┊    <p>{{ user | displayNameFilter }}</p>
+┊  ┊ 8┊  </md-list-item>
+┊  ┊ 9┊  <md-list-item ng-if="(partyUninvited.users | uninvitedFilter:partyUninvited.party).length <= 0">
+┊  ┊10┊    Everyone are already invited.
+┊  ┊11┊  </md-list-item>
+┊  ┊12┊</md-list>
```
[}]: #

# PartyRsvpsList

Let's import styles in PartiesList:

[{]: <helper> (diff_step 18.28)
#### Step 18.28: Add PartyRsvpsList less to PartiesList

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -6,3 +6,4 @@
 ┊6┊6┊
 ┊7┊7┊@import "../partiesMap/partiesMap.less";
 ┊8┊8┊@import "../partyRemove/partyRemove.less";
+┊ ┊9┊@import "../partyRsvpsList/partyRsvpsList.less";
```
[}]: #

# PartyMap

Add a little padding from each side:

[{]: <helper> (diff_step 18.29)
#### Step 18.29: Update styles of PartyMap

##### Changed imports/ui/components/partyMap/partyMap.less
```diff
@@ -1,7 +1,6 @@
 ┊1┊1┊party-map {
 ┊2┊2┊  display: block;
-┊3┊ ┊  width: 100%;
-┊4┊ ┊  margin: 25px 0;
+┊ ┊3┊  padding: 10px;
 ┊5┊4┊
 ┊6┊5┊  .angular-google-map-container {
 ┊7┊6┊    width: 100%;
```
[}]: #

# PartyDetails

As you can see, we used `md-input-container` in similar way as we did with PartyAdd:

[{]: <helper> (diff_step 18.30)
#### Step 18.30: Refactor PartyDetails

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -1,35 +1,28 @@
-┊ 1┊  ┊<div class="container-fluid">
-┊ 2┊  ┊  <div class="row">
-┊ 3┊  ┊    <div class="col-md-6">
-┊ 4┊  ┊      <form>
-┊ 5┊  ┊        <fieldset class="form-group">
-┊ 6┊  ┊          <label>Party name</label>
-┊ 7┊  ┊          <input type="text" ng-model="partyDetails.party.name" ng-disabled="!partyDetails.isOwner" class="form-control"/>
-┊ 8┊  ┊        </fieldset>
+┊  ┊ 1┊<div layout="column" layout-padding>
+┊  ┊ 2┊  <div layout="column" layout-gt-sm="row"  layout-padding>
+┊  ┊ 3┊    <form flex="50" layout="column">
+┊  ┊ 4┊      <md-input-container>
+┊  ┊ 5┊        <label>Party name</label>
+┊  ┊ 6┊        <input ng-model="partyDetails.party.name" ng-disabled="!partyDetails.isOwner">
+┊  ┊ 7┊      </md-input-container>
 ┊ 9┊ 8┊
-┊10┊  ┊        <fieldset class="form-group">
-┊11┊  ┊          <label>Description</label>
-┊12┊  ┊          <input type="text" ng-model="partyDetails.party.description" ng-disabled="!partyDetails.isOwner" class="form-control"/>
-┊13┊  ┊        </fieldset>
+┊  ┊ 9┊      <md-input-container>
+┊  ┊10┊        <label>Description</label>
+┊  ┊11┊        <input ng-model="partyDetails.party.description" ng-disabled="!partyDetails.isOwner">
+┊  ┊12┊      </md-input-container>
 ┊14┊13┊
-┊15┊  ┊        <div class="checkbox">
-┊16┊  ┊          <label>
-┊17┊  ┊            <input type="checkbox" ng-model="partyDetails.party.public" ng-disabled="!partyDetails.isOwner"/>
-┊18┊  ┊            Public Party?
-┊19┊  ┊          </label>
-┊20┊  ┊        </div>
+┊  ┊14┊      <div>
+┊  ┊15┊        <md-checkbox ng-model="partyDetails.party.public" ng-disabled="!partyDetails.isOwner" aria-label="Public Party?">
+┊  ┊16┊          Public Party?
+┊  ┊17┊        </md-checkbox>
+┊  ┊18┊      </div>
 ┊21┊19┊
-┊22┊  ┊        <button ng-click="partyDetails.save()" type="submit" class="btn btn-primary">Save</button>
-┊23┊  ┊      </form>
-┊24┊  ┊    </div>
-┊25┊  ┊    <div class="col-md-6">
-┊26┊  ┊      <party-map location="partyDetails.party.location"></party-map>
-┊27┊  ┊    </div>
+┊  ┊20┊      <div>
+┊  ┊21┊        <md-button ng-click="partyDetails.save()" class="md-primary md-raised">Save</md-button>
+┊  ┊22┊      </div>
+┊  ┊23┊    </form>
+┊  ┊24┊    <party-map flex="50" location="partyDetails.party.location"></party-map>
 ┊28┊25┊  </div>
 ┊29┊26┊
-┊30┊  ┊  <div class="row">
-┊31┊  ┊    <div class="col-md-6">
-┊32┊  ┊      <party-uninvited party="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
-┊33┊  ┊    </div>
-┊34┊  ┊  </div>
+┊  ┊27┊  <party-uninvited flex party="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
 ┊35┊28┊</div>
```
[}]: #

Make `partyDetails.less` to look like this:

[{]: <helper> (diff_step 18.31)
#### Step 18.31: Leave only PartyMap inside PartyDetails less

##### Changed imports/ui/components/partyDetails/partyDetails.less
```diff
@@ -1,10 +1 @@
-┊ 1┊  ┊party-details {
-┊ 2┊  ┊  display: block;
-┊ 3┊  ┊
-┊ 4┊  ┊  form {
-┊ 5┊  ┊    margin: 25px 0;
-┊ 6┊  ┊  }
-┊ 7┊  ┊}
-┊ 8┊  ┊
-┊ 9┊  ┊@import "../partyUninvited/partyUninvited.less";
 ┊10┊ 1┊@import "../partyMap/partyMap.less";
```
[}]: #

# Modal window for PartyAdd

It would be great to move PartyAdd outside PartiesList. It would be even greater to make modal window for it.

We need to create some sort of modal window trigger:

[{]: <helper> (diff_step 18.32)
#### Step 18.32: Create view for PartyAddButton

##### Added imports/ui/components/partyAddButton/partyAddButton.html
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊<md-button class="md-fab" aria-label="Add new party" ng-click="partyAddButton.open($event)">
+┊ ┊2┊  <md-icon md-svg-icon="content:ic_add_24px"></md-icon>
+┊ ┊3┊</md-button>
```
[}]: #

[{]: <helper> (diff_step 18.33)
#### Step 18.33: Create PartyAddButton component

##### Added imports/ui/components/partyAddButton/partyAddButton.js
```diff
@@ -0,0 +1,45 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import buttonTemplate from './partyAddButton.html';
+┊  ┊ 5┊import modalTemplate from './partyAddModal.html';
+┊  ┊ 6┊import { name as PartyAdd } from '../partyAdd/partyAdd';
+┊  ┊ 7┊
+┊  ┊ 8┊class PartyAddButton {
+┊  ┊ 9┊  constructor($mdDialog, $mdMedia) {
+┊  ┊10┊    'ngInject';
+┊  ┊11┊
+┊  ┊12┊    this.$mdDialog = $mdDialog;
+┊  ┊13┊    this.$mdMedia = $mdMedia
+┊  ┊14┊  }
+┊  ┊15┊
+┊  ┊16┊  open(event) {
+┊  ┊17┊    this.$mdDialog.show({
+┊  ┊18┊      controller($mdDialog) {
+┊  ┊19┊        'ngInject';
+┊  ┊20┊
+┊  ┊21┊        this.close = () => {
+┊  ┊22┊          $mdDialog.hide();
+┊  ┊23┊        }
+┊  ┊24┊      },
+┊  ┊25┊      controllerAs: 'partyAddModal',
+┊  ┊26┊      template: modalTemplate,
+┊  ┊27┊      targetEvent: event,
+┊  ┊28┊      parent: angular.element(document.body),
+┊  ┊29┊      clickOutsideToClose: true,
+┊  ┊30┊      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
+┊  ┊31┊    });
+┊  ┊32┊  }
+┊  ┊33┊}
+┊  ┊34┊
+┊  ┊35┊const name = 'partyAddButton';
+┊  ┊36┊
+┊  ┊37┊// create a module
+┊  ┊38┊export default angular.module(name, [
+┊  ┊39┊  angularMeteor,
+┊  ┊40┊  PartyAdd
+┊  ┊41┊]).component(name, {
+┊  ┊42┊  template: buttonTemplate,
+┊  ┊43┊  controllerAs: name,
+┊  ┊44┊  controller: PartyAddButton
+┊  ┊45┊});
```
[}]: #

What we did there?

* We used [$mdDialog](https://material.angularjs.org/latest/api/service/$mdDialog) to open a new dialog window.
* We used [$mdMedia](https://material.angularjs.org/latest/api/service/$mdMedia) to check if window has to be opened in fullscreen mode (on small screens it look much better).
* We defined a view *partyAddModal.html* which we will create in the next step.

[{]: <helper> (diff_step 18.34)
#### Step 18.34: Add view for modal window

##### Added imports/ui/components/partyAddButton/partyAddModal.html
```diff
@@ -0,0 +1,16 @@
+┊  ┊ 1┊<md-dialog aria-label="New party" ng-cloak>
+┊  ┊ 2┊  <md-toolbar>
+┊  ┊ 3┊    <div class="md-toolbar-tools">
+┊  ┊ 4┊      <h2>New party</h2>
+┊  ┊ 5┊      <span flex></span>
+┊  ┊ 6┊      <md-button ng-click="partyAddModal.close()">
+┊  ┊ 7┊        Close
+┊  ┊ 8┊      </md-button>
+┊  ┊ 9┊    </div>
+┊  ┊10┊  </md-toolbar>
+┊  ┊11┊  <md-dialog-content>
+┊  ┊12┊    <div class="md-dialog-content">
+┊  ┊13┊      <party-add done="partyAddModal.close()"></party-add>
+┊  ┊14┊    </div>
+┊  ┊15┊  </md-dialog-content>
+┊  ┊16┊</md-dialog>
```
[}]: #


[{]: <helper> (diff_step 18.35)
#### Step 18.35: Add some style

##### Added imports/ui/components/partyAddButton/partyAddButton.less
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊party-add-button {
+┊ ┊2┊  position: fixed;
+┊ ┊3┊  right: 15px;
+┊ ┊4┊  bottom: 15px;
+┊ ┊5┊}
```
[}]: #
As you can see we used `done` directive on `PartyAdd` component and for now it does nothing.

It would be an expression binding which invokes after a new party has been added.

[{]: <helper> (diff_step 18.36)
#### Step 18.36: Implement `done` expression to PartyAdd

##### Changed imports/ui/components/partyAdd/partyAdd.js
```diff
@@ -14,6 +14,11 @@
 ┊14┊14┊  submit() {
 ┊15┊15┊    this.party.owner = Meteor.userId();
 ┊16┊16┊    Parties.insert(this.party);
+┊  ┊17┊
+┊  ┊18┊    if(this.done) {
+┊  ┊19┊      this.done();
+┊  ┊20┊    }
+┊  ┊21┊
 ┊17┊22┊    this.reset();
 ┊18┊23┊  }
 ┊19┊24┊
```
```diff
@@ -29,6 +34,9 @@
 ┊29┊34┊  angularMeteor
 ┊30┊35┊]).component(name, {
 ┊31┊36┊  template,
+┊  ┊37┊  bindings: {
+┊  ┊38┊    done: '&?'
+┊  ┊39┊  },
 ┊32┊40┊  controllerAs: name,
 ┊33┊41┊  controller: PartyAdd
 ┊34┊42┊});
```
[}]: #

Great! Our new component is now working and cooperating with PartyAdd component.
Let's implement it into `PartiesList`:

[{]: <helper> (diff_step 18.37)
#### Step 18.37: Add PartyAddButton to PartiesList

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -9,7 +9,7 @@
 ┊ 9┊ 9┊import { Parties } from '../../../api/parties';
 ┊10┊10┊import { name as PartiesSort } from '../partiesSort/partiesSort';
 ┊11┊11┊import { name as PartiesMap } from '../partiesMap/partiesMap';
-┊12┊  ┊import { name as PartyAdd } from '../partyAdd/partyAdd';
+┊  ┊12┊import { name as PartyAddButton } from '../partyAddButton/partyAddButton';
 ┊13┊13┊import { name as PartyRemove } from '../partyRemove/partyRemove';
 ┊14┊14┊import { name as PartyCreator } from '../partyCreator/partyCreator';
 ┊15┊15┊import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
```
```diff
@@ -77,7 +77,7 @@
 ┊77┊77┊  utilsPagination,
 ┊78┊78┊  PartiesSort,
 ┊79┊79┊  PartiesMap,
-┊80┊  ┊  PartyAdd,
+┊  ┊80┊  PartyAddButton,
 ┊81┊81┊  PartyRemove,
 ┊82┊82┊  PartyCreator,
 ┊83┊83┊  PartyRsvp,
```
[}]: #

[{]: <helper> (diff_step 18.38)
#### Step 18.38: Implement PartyAddButton

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,8 +1,5 @@
 ┊1┊1┊<div layout="column" layout-padding>
-┊2┊ ┊  <party-add ng-show="partiesList.isLoggedIn"></party-add>
-┊3┊ ┊  <div ng-hide="partiesList.isLoggedIn">
-┊4┊ ┊    <i>Log in to create a party!</i>
-┊5┊ ┊  </div>
+┊ ┊2┊  <party-add-button ng-show="partiesList.isLoggedIn"></party-add-button>
 ┊6┊3┊
 ┊7┊4┊  <div flex>
 ┊8┊5┊    <h2 class="md-display-1">List of the parties:</h2>
```
[}]: #

[{]: <helper> (diff_step 18.39)
#### Step 18.39: Import styles

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -6,4 +6,5 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊@import "../partiesMap/partiesMap.less";
 ┊ 8┊ 8┊@import "../partyRemove/partyRemove.less";
+┊  ┊ 9┊@import "../partyAddButton/partyAddButton.less";
 ┊ 9┊10┊@import "../partyRsvpsList/partyRsvpsList.less";
```
[}]: #

Now try to click on a button displayed in the right bottom corner of the screen. You should see opened modal window with PartyAdd component!

# Custom Authentication Components

Our next step will replace the login-buttons which is a simple and non-styled login/register component - we will add our custom authentication component with custom style.

First, let's create `Auth` component:

[{]: <helper> (diff_step 18.40)
#### Step 18.40: Create view for Auth

##### Added imports/ui/components/auth/auth.html
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊<div layout="row">
+┊ ┊2┊  <md-button flex ui-sref="login" ng-hide="auth.isLoggedIn">Login</md-button>
+┊ ┊3┊  <md-button flex ui-sref="register" ng-hide="auth.isLoggedIn">Sign up</md-button>
+┊ ┊4┊  <md-button flex ng-click="auth.logout()" ng-show="auth.isLoggedIn">Logout</md-button>
+┊ ┊5┊  <div ng-show="auth.isLoggedIn">{{ auth.currentUser | displayNameFilter }}</div>
+┊ ┊6┊</div>
```
[}]: #

[{]: <helper> (diff_step 18.41)
#### Step 18.41: Create Auth component

##### Added imports/ui/components/auth/auth.js
```diff
@@ -0,0 +1,41 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 6┊
+┊  ┊ 7┊import template from './auth.html';
+┊  ┊ 8┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
+┊  ┊ 9┊
+┊  ┊10┊const name = 'auth';
+┊  ┊11┊
+┊  ┊12┊class Auth {
+┊  ┊13┊  constructor($scope, $reactive) {
+┊  ┊14┊    'ngInject';
+┊  ┊15┊
+┊  ┊16┊    $reactive(this).attach($scope);
+┊  ┊17┊
+┊  ┊18┊    this.helpers({
+┊  ┊19┊      isLoggedIn() {
+┊  ┊20┊        return !!Meteor.userId();
+┊  ┊21┊      },
+┊  ┊22┊      currentUser() {
+┊  ┊23┊        return Meteor.user();
+┊  ┊24┊      }
+┊  ┊25┊    });
+┊  ┊26┊  }
+┊  ┊27┊
+┊  ┊28┊  logout() {
+┊  ┊29┊    Accounts.logout();
+┊  ┊30┊  }
+┊  ┊31┊}
+┊  ┊32┊
+┊  ┊33┊// create a module
+┊  ┊34┊export default angular.module(name, [
+┊  ┊35┊  angularMeteor,
+┊  ┊36┊  DisplayNameFilter
+┊  ┊37┊]).component(name, {
+┊  ┊38┊  template,
+┊  ┊39┊  controllerAs: name,
+┊  ┊40┊  controller: Auth
+┊  ┊41┊});
```
[}]: #

As you can see, we're going to create components for few new states.

First state is a page with `Login` component.

In this component we use Meteor's accounts, and use the Accounts API to login our user with email and password.

[{]: <helper> (diff_step 18.42)
#### Step 18.42: View for Login

##### Added imports/ui/components/login/login.html
```diff
@@ -0,0 +1,72 @@
+┊  ┊ 1┊<md-content layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊
+┊  ┊ 3┊  <md-whiteframe layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 4┊
+┊  ┊ 5┊    <md-toolbar class="md-primary md-tall" layout="column" layout-align="end" layout-fill>
+┊  ┊ 6┊      <div layout="row" class="md-toolbar-tools md-toolbar-tools-bottom">
+┊  ┊ 7┊        <h3 class="md-display-1">
+┊  ┊ 8┊          Sign in
+┊  ┊ 9┊        </h3>
+┊  ┊10┊      </div>
+┊  ┊11┊    </md-toolbar>
+┊  ┊12┊
+┊  ┊13┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊14┊      <div layout="row" layout-fill layout-margin>
+┊  ┊15┊        <p class="md-body-2">
+┊  ┊16┊          Use existing account</p>
+┊  ┊17┊      </div>
+┊  ┊18┊      <div layout="row" layout-fill layout-margin layout-padding layout-wrap>
+┊  ┊19┊        <md-button class="md-raised">
+┊  ┊20┊          <i class="icon ion-social-google" style="color: #DC4A38; font-size: 24px;"></i>
+┊  ┊21┊          <span>
+┊  ┊22┊            Google</span>
+┊  ┊23┊        </md-button>
+┊  ┊24┊        <md-button class="md-raised">
+┊  ┊25┊          <i class="icon ion-social-facebook" style="color: #3F62B4; font-size: 24px;"></i>
+┊  ┊26┊          <span>Facebook
+┊  ┊27┊          </span>
+┊  ┊28┊        </md-button>
+┊  ┊29┊        <md-button class="md-raised">
+┊  ┊30┊          <i class="icon ion-social-twitter" style="color: #27AAE2; font-size: 24px;"></i>
+┊  ┊31┊          <span>Twitter
+┊  ┊32┊          </span>
+┊  ┊33┊        </md-button>
+┊  ┊34┊      </div>
+┊  ┊35┊      <md-divider class="inset"></md-divider>
+┊  ┊36┊
+┊  ┊37┊      <div layout="row" layout-fill layout-margin>
+┊  ┊38┊        <p class="md-body-2">
+┊  ┊39┊          Sign in with your email</p>
+┊  ┊40┊      </div>
+┊  ┊41┊
+┊  ┊42┊      <form name="loginForm" layout="column" layout-fill layout-padding layout-margin>
+┊  ┊43┊        <md-input-container>
+┊  ┊44┊          <label>
+┊  ┊45┊            Email
+┊  ┊46┊          </label>
+┊  ┊47┊          <input type="text" ng-model="login.credentials.email" aria-label="email" required/>
+┊  ┊48┊        </md-input-container>
+┊  ┊49┊        <md-input-container>
+┊  ┊50┊          <label>
+┊  ┊51┊            Password
+┊  ┊52┊          </label>
+┊  ┊53┊          <input type="password" ng-model="login.credentials.password" aria-label="password" required/>
+┊  ┊54┊        </md-input-container>
+┊  ┊55┊        <div layout="row" layout-align="space-between center">
+┊  ┊56┊          <a class="md-button" href="/password">Forgot password?</a>
+┊  ┊57┊          <md-button class="md-raised md-primary" ng-click="login.login()" aria-label="login" ng-disabled="login.loginForm.$invalid()">Sign In
+┊  ┊58┊          </md-button>
+┊  ┊59┊        </div>
+┊  ┊60┊      </form>
+┊  ┊61┊      <md-toolbar ng-show="login.error" class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊62┊        <p class="md-body-1">{{ login.error }}</p>
+┊  ┊63┊      </md-toolbar>
+┊  ┊64┊      <md-divider></md-divider>
+┊  ┊65┊      <div layout="row" layout-align="center">
+┊  ┊66┊        <a class="md-button" href="/register">Need an account?</a>
+┊  ┊67┊      </div>
+┊  ┊68┊
+┊  ┊69┊    </div>
+┊  ┊70┊
+┊  ┊71┊  </md-whiteframe>
+┊  ┊72┊</md-content>
```
[}]: #

[{]: <helper> (diff_step 18.43)
#### Step 18.43: Create Login

##### Added imports/ui/components/login/login.js
```diff
@@ -0,0 +1,61 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import uiRouter from 'angular-ui-router';
+┊  ┊ 4┊
+┊  ┊ 5┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 6┊
+┊  ┊ 7┊import template from './login.html';
+┊  ┊ 8┊
+┊  ┊ 9┊import { name as Register } from '../register/register';
+┊  ┊10┊
+┊  ┊11┊class Login {
+┊  ┊12┊  constructor($scope, $reactive, $state) {
+┊  ┊13┊    'ngInject';
+┊  ┊14┊
+┊  ┊15┊    this.$state = $state;
+┊  ┊16┊
+┊  ┊17┊    $reactive(this).attach($scope);
+┊  ┊18┊
+┊  ┊19┊    this.credentials = {
+┊  ┊20┊      email: '',
+┊  ┊21┊      password: ''
+┊  ┊22┊    };
+┊  ┊23┊
+┊  ┊24┊    this.error = '';
+┊  ┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  login() {
+┊  ┊28┊    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
+┊  ┊29┊      this.$bindToContext((err) => {
+┊  ┊30┊        if (err) {
+┊  ┊31┊          this.error = err;
+┊  ┊32┊        } else {
+┊  ┊33┊          this.$state.go('parties');
+┊  ┊34┊        }
+┊  ┊35┊      })
+┊  ┊36┊    );
+┊  ┊37┊  }
+┊  ┊38┊}
+┊  ┊39┊
+┊  ┊40┊const name = 'login';
+┊  ┊41┊
+┊  ┊42┊// create a module
+┊  ┊43┊export default angular.module(name, [
+┊  ┊44┊  angularMeteor,
+┊  ┊45┊  uiRouter
+┊  ┊46┊])
+┊  ┊47┊  .component(name, {
+┊  ┊48┊    template,
+┊  ┊49┊    controllerAs: name,
+┊  ┊50┊    controller: Login
+┊  ┊51┊  })
+┊  ┊52┊  .config(config);
+┊  ┊53┊
+┊  ┊54┊function config($stateProvider) {
+┊  ┊55┊  'ngInject';
+┊  ┊56┊
+┊  ┊57┊  $stateProvider.state('login', {
+┊  ┊58┊    url: '/login',
+┊  ┊59┊    template: '<login></login>'
+┊  ┊60┊  });
+┊  ┊61┊}
```
[}]: #

[{]: <helper> (diff_step 18.44)
#### Step 18.44: Add Login to Auth

##### Changed imports/ui/components/auth/auth.js
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import template from './auth.html';
 ┊ 8┊ 8┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
+┊  ┊ 9┊import { name as Login } from '../login/login';
 ┊ 9┊10┊
 ┊10┊11┊const name = 'auth';
 ┊11┊12┊
```
```diff
@@ -33,7 +34,8 @@
 ┊33┊34┊// create a module
 ┊34┊35┊export default angular.module(name, [
 ┊35┊36┊  angularMeteor,
-┊36┊  ┊  DisplayNameFilter
+┊  ┊37┊  DisplayNameFilter,
+┊  ┊38┊  Login
 ┊37┊39┊]).component(name, {
 ┊38┊40┊  template,
 ┊39┊41┊  controllerAs: name,
```
[}]: #

In `Register` component we use Meteor's accounts, and use the Accounts API to add a new user.

[{]: <helper> (diff_step 18.45)
#### Step 18.45: View for Register

##### Added imports/ui/components/register/register.html
```diff
@@ -0,0 +1,72 @@
+┊  ┊ 1┊<md-content layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <md-whiteframe layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊
+┊  ┊ 4┊    <md-toolbar class="md-primary md-tall" layout="column" layout-align="end" layout-fill>
+┊  ┊ 5┊      <div layout="row" class="md-toolbar-tools md-toolbar-tools-bottom">
+┊  ┊ 6┊        <h3 class="md-display-1">
+┊  ┊ 7┊          Register a new account</h3>
+┊  ┊ 8┊      </div>
+┊  ┊ 9┊    </md-toolbar>
+┊  ┊10┊
+┊  ┊11┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊12┊
+┊  ┊13┊      <div layout="row" layout-fill layout-margin>
+┊  ┊14┊        <p class="md-body-2">Use your email?</p>
+┊  ┊15┊      </div>
+┊  ┊16┊
+┊  ┊17┊      <form name="registerForm" layout="column" layout-fill layout-padding layout-margin>
+┊  ┊18┊        <md-input-container >
+┊  ┊19┊          <label>
+┊  ┊20┊            Email
+┊  ┊21┊          </label>
+┊  ┊22┊          <input type="text" ng-model="register.credentials.email" placeholder="email" aria-label="email" required/>
+┊  ┊23┊        </md-input-container>
+┊  ┊24┊        <md-input-container >
+┊  ┊25┊          <label>
+┊  ┊26┊            Password
+┊  ┊27┊          </label>
+┊  ┊28┊          <input type="password" ng-model="register.credentials.password" placeholder="password" aria-label="password" required/>
+┊  ┊29┊        </md-input-container>
+┊  ┊30┊        <div layout="row" layout-align="end center">
+┊  ┊31┊          <md-button class="md-raised md-primary" ng-click="register.register()" aria-label="login" ng-disabled="register.registerForm.$invalid()">Register</md-button>
+┊  ┊32┊        </div>
+┊  ┊33┊      </form>
+┊  ┊34┊
+┊  ┊35┊      <md-divider class="inset"></md-divider>
+┊  ┊36┊
+┊  ┊37┊      <div layout="row" layout-fill layout-margin>
+┊  ┊38┊        <p class="md-body-2">
+┊  ┊39┊          Want to use an existing account?
+┊  ┊40┊        </p>
+┊  ┊41┊      </div>
+┊  ┊42┊
+┊  ┊43┊      <div layout="row" layout-fill layout-margin layout-padding layout-wrap>
+┊  ┊44┊        <md-button class="md-raised">
+┊  ┊45┊          <md-icon md-svg-icon="social:ic_google_24px" style="color: #DC4A38;"></md-icon>
+┊  ┊46┊          <span>
+┊  ┊47┊            Google</span>
+┊  ┊48┊        </md-button>
+┊  ┊49┊        <md-button class="md-raised">
+┊  ┊50┊          <md-icon md-svg-icon="social:ic_facebook_24px" style="color: #3F62B4;"></md-icon>
+┊  ┊51┊          <span>Facebook
+┊  ┊52┊          </span>
+┊  ┊53┊        </md-button>
+┊  ┊54┊        <md-button class="md-raised">
+┊  ┊55┊          <md-icon md-svg-icon="social:ic_twitter_24px" style="color: #27AAE2;"></md-icon>
+┊  ┊56┊          <span>Twitter
+┊  ┊57┊          </span>
+┊  ┊58┊        </md-button>
+┊  ┊59┊      </div>
+┊  ┊60┊      <md-toolbar ng-show="register.error" class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊61┊        <p class="md-body-1">{{ register.error }}</p>
+┊  ┊62┊      </md-toolbar>
+┊  ┊63┊
+┊  ┊64┊      <md-divider></md-divider>
+┊  ┊65┊      <div layout="row" layout-align="center">
+┊  ┊66┊        <a class="md-button" href="/login">Already a user?</a>
+┊  ┊67┊      </div>
+┊  ┊68┊
+┊  ┊69┊    </div>
+┊  ┊70┊
+┊  ┊71┊  </md-whiteframe>
+┊  ┊72┊</md-content>
```
[}]: #

[{]: <helper> (diff_step 18.46)
#### Step 18.46: Create Register

##### Added imports/ui/components/register/register.js
```diff
@@ -0,0 +1,58 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import uiRouter from 'angular-ui-router';
+┊  ┊ 4┊
+┊  ┊ 5┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 6┊
+┊  ┊ 7┊import template from './register.html';
+┊  ┊ 8┊
+┊  ┊ 9┊class Register {
+┊  ┊10┊  constructor($scope, $reactive, $state) {
+┊  ┊11┊    'ngInject';
+┊  ┊12┊
+┊  ┊13┊    this.$state = $state;
+┊  ┊14┊
+┊  ┊15┊    $reactive(this).attach($scope);
+┊  ┊16┊
+┊  ┊17┊    this.credentials = {
+┊  ┊18┊      email: '',
+┊  ┊19┊      password: ''
+┊  ┊20┊    };
+┊  ┊21┊
+┊  ┊22┊    this.error = '';
+┊  ┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  register() {
+┊  ┊26┊    Accounts.createUser(this.credentials,
+┊  ┊27┊      this.$bindToContext((err) => {
+┊  ┊28┊        if (err) {
+┊  ┊29┊          this.error = err;
+┊  ┊30┊        } else {
+┊  ┊31┊          this.$state.go('parties');
+┊  ┊32┊        }
+┊  ┊33┊      })
+┊  ┊34┊    );
+┊  ┊35┊  }
+┊  ┊36┊}
+┊  ┊37┊
+┊  ┊38┊const name = 'register';
+┊  ┊39┊
+┊  ┊40┊// create a module
+┊  ┊41┊export default angular.module(name, [
+┊  ┊42┊  angularMeteor,
+┊  ┊43┊  uiRouter
+┊  ┊44┊])
+┊  ┊45┊  .component(name, {
+┊  ┊46┊    template,
+┊  ┊47┊    controllerAs: name,
+┊  ┊48┊    controller: Register
+┊  ┊49┊  })
+┊  ┊50┊  .config(config);
+┊  ┊51┊
+┊  ┊52┊function config($stateProvider) {
+┊  ┊53┊  'ngInject';
+┊  ┊54┊  $stateProvider.state('register', {
+┊  ┊55┊    url: '/register',
+┊  ┊56┊    template: '<register></register>'
+┊  ┊57┊  });
+┊  ┊58┊}
```
[}]: #

[{]: <helper> (diff_step 18.47)
#### Step 18.47: Add Register to Auth

##### Changed imports/ui/components/auth/auth.js
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊import template from './auth.html';
 ┊ 8┊ 8┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
 ┊ 9┊ 9┊import { name as Login } from '../login/login';
+┊  ┊10┊import { name as Register } from '../register/register';
 ┊10┊11┊
 ┊11┊12┊const name = 'auth';
 ┊12┊13┊
```
```diff
@@ -35,7 +36,8 @@
 ┊35┊36┊export default angular.module(name, [
 ┊36┊37┊  angularMeteor,
 ┊37┊38┊  DisplayNameFilter,
-┊38┊  ┊  Login
+┊  ┊39┊  Login,
+┊  ┊40┊  Register
 ┊39┊41┊]).component(name, {
 ┊40┊42┊  template,
 ┊41┊43┊  controllerAs: name,
```
[}]: #

We also have "Recover" button in the login page, so let's create a component that handles that, and call it `Password`:

[{]: <helper> (diff_step 18.48)
#### Step 18.48: View for Password

##### Added imports/ui/components/password/password.html
```diff
@@ -0,0 +1,40 @@
+┊  ┊ 1┊<md-content layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <md-whiteframe layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊
+┊  ┊ 4┊    <md-toolbar class="md-primary md-tall" layout="column" layout-align="end" layout-fill>
+┊  ┊ 5┊      <div layout="row" class="md-toolbar-tools md-toolbar-tools-bottom">
+┊  ┊ 6┊        <h3 class="md-display-1"> Reset Password</h3>
+┊  ┊ 7┊      </div>
+┊  ┊ 8┊    </md-toolbar>
+┊  ┊ 9┊
+┊  ┊10┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊11┊
+┊  ┊12┊      <div layout="row" layout-fill layout-margin>
+┊  ┊13┊        <p class="md-body-2">Enter your email so we can send you a reset link</p>
+┊  ┊14┊      </div>
+┊  ┊15┊
+┊  ┊16┊      <form name="resetForm" layout="column" layout-fill layout-padding layout-margin>
+┊  ┊17┊        <md-input-container>
+┊  ┊18┊          <label> Email </label>
+┊  ┊19┊          <input type="text" ng-model="password.credentials.email" placeholder="email" aria-label="email" required/>
+┊  ┊20┊        </md-input-container>
+┊  ┊21┊        <div layout="row" layout-align="end center">
+┊  ┊22┊          <md-button class="md-raised md-primary" ng-click="password.reset()" aria-label="reset"
+┊  ┊23┊                     ng-disabled="password.resetForm.$invalid()">Send Email
+┊  ┊24┊          </md-button>
+┊  ┊25┊        </div>
+┊  ┊26┊      </form>
+┊  ┊27┊
+┊  ┊28┊      <md-toolbar ng-show="password.error" class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊29┊        <p class="md-body-1">{{ password.error }}</p>
+┊  ┊30┊      </md-toolbar>
+┊  ┊31┊
+┊  ┊32┊      <md-divider></md-divider>
+┊  ┊33┊      <div layout="row" layout-align="center">
+┊  ┊34┊        <a class="md-button" href="/login">Sign in</a>
+┊  ┊35┊      </div>
+┊  ┊36┊
+┊  ┊37┊    </div>
+┊  ┊38┊
+┊  ┊39┊  </md-whiteframe>
+┊  ┊40┊</md-content>
```
[}]: #

[{]: <helper> (diff_step 18.49)
#### Step 18.49: Create Password

##### Added imports/ui/components/password/password.js
```diff
@@ -0,0 +1,56 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import uiRouter from 'angular-ui-router';
+┊  ┊ 4┊
+┊  ┊ 5┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 6┊
+┊  ┊ 7┊import template from './password.html';
+┊  ┊ 8┊
+┊  ┊ 9┊class Register {
+┊  ┊10┊  constructor($scope, $reactive, $state) {
+┊  ┊11┊    'ngInject';
+┊  ┊12┊
+┊  ┊13┊    this.$state = $state;
+┊  ┊14┊
+┊  ┊15┊    $reactive(this).attach($scope);
+┊  ┊16┊
+┊  ┊17┊    this.credentials = {
+┊  ┊18┊      email: ''
+┊  ┊19┊    };
+┊  ┊20┊
+┊  ┊21┊    this.error = '';
+┊  ┊22┊  }
+┊  ┊23┊
+┊  ┊24┊  reset() {
+┊  ┊25┊    Accounts.forgotPassword(this.credentials, this.$bindToContext((err) => {
+┊  ┊26┊      if (err) {
+┊  ┊27┊        this.error = err;
+┊  ┊28┊      } else {
+┊  ┊29┊        this.$state.go('parties');
+┊  ┊30┊      }
+┊  ┊31┊    }));
+┊  ┊32┊  }
+┊  ┊33┊}
+┊  ┊34┊
+┊  ┊35┊const name = 'password';
+┊  ┊36┊
+┊  ┊37┊// create a module
+┊  ┊38┊export default angular.module(name, [
+┊  ┊39┊  angularMeteor,
+┊  ┊40┊  uiRouter
+┊  ┊41┊])
+┊  ┊42┊  .component(name, {
+┊  ┊43┊    template,
+┊  ┊44┊    controllerAs: name,
+┊  ┊45┊    controller: Register
+┊  ┊46┊  })
+┊  ┊47┊  .config(config);
+┊  ┊48┊
+┊  ┊49┊function config($stateProvider) {
+┊  ┊50┊  'ngInject';
+┊  ┊51┊
+┊  ┊52┊  $stateProvider.state('password', {
+┊  ┊53┊    url: '/password',
+┊  ┊54┊    template: '<password></password>'
+┊  ┊55┊  });
+┊  ┊56┊}
```
[}]: #

[{]: <helper> (diff_step 18.50)
#### Step 18.50: Add Password to Auth

##### Changed imports/ui/components/auth/auth.js
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
 ┊ 9┊ 9┊import { name as Login } from '../login/login';
 ┊10┊10┊import { name as Register } from '../register/register';
+┊  ┊11┊import { name as Password } from '../password/password';
 ┊11┊12┊
 ┊12┊13┊const name = 'auth';
 ┊13┊14┊
```
```diff
@@ -37,7 +38,8 @@
 ┊37┊38┊  angularMeteor,
 ┊38┊39┊  DisplayNameFilter,
 ┊39┊40┊  Login,
-┊40┊  ┊  Register
+┊  ┊41┊  Register,
+┊  ┊42┊  Password
 ┊41┊43┊]).component(name, {
 ┊42┊44┊  template,
 ┊43┊45┊  controllerAs: name,
```
[}]: #

Since every component is ready, we can now implement Auth into Socially:

[{]: <helper> (diff_step 18.51)
#### Step 18.51: Add Auth to Socially

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊import { name as PartiesList } from '../partiesList/partiesList';
 ┊ 8┊ 8┊import { name as PartyDetails } from '../partyDetails/partyDetails';
 ┊ 9┊ 9┊import { name as Navigation } from '../navigation/navigation';
+┊  ┊10┊import { name as Auth } from '../auth/auth';
 ┊10┊11┊
 ┊11┊12┊class Socially {}
 ┊12┊13┊
```
```diff
@@ -20,6 +21,7 @@
 ┊20┊21┊  PartiesList,
 ┊21┊22┊  PartyDetails,
 ┊22┊23┊  Navigation,
+┊  ┊24┊  Auth,
 ┊23┊25┊  'accounts.ui'
 ┊24┊26┊]).component(name, {
 ┊25┊27┊  template,
```
[}]: #

[{]: <helper> (diff_step 18.52)
#### Step 18.52: Implement Auth

##### Changed imports/ui/components/navigation/navigation.html
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊        Socially
 ┊ 6┊ 6┊      </span>
 ┊ 7┊ 7┊    </h2>
-┊ 8┊  ┊    <login-buttons></login-buttons>
+┊  ┊ 8┊    <span flex></span>
+┊  ┊ 9┊    <auth></auth>
 ┊ 9┊10┊  </div>
 ┊10┊11┊</md-toolbar>
```
[}]: #

Inside the `md-toolbar` you see we used

    <span flex></span>

element which is actually a separator blank element which is used to fill all the available blank space between the first and third element in the toolbar.

We can now remove `navigation.less`, which we don't need any longer:

[{]: <helper> (diff_step 18.54)
#### Step 18.54: Remove import statement

##### Changed imports/ui/components/socially/socially.less
```diff
@@ -2,7 +2,5 @@
 ┊2┊2┊  display: block;
 ┊3┊3┊}
 ┊4┊4┊
-┊5┊ ┊
-┊6┊ ┊@import "../navigation/navigation.less";
 ┊7┊5┊@import "../partiesList/partiesList.less";
 ┊8┊6┊@import "../partyDetails/partyDetails.less";
```
[}]: #

That's it! we just implemented our own authentication components using Meteor's Accounts API and angular-material!


# Summary

In this chapter we two main things:

1. How to work with angular-material-design in our angular-meteor app
2. How to create custom Angular 1 forms for our application's auth

I hope one of you will create an accounts-ui package based on that code and will save us all tons of code!

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step17.md) | [Next Step >](step19.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #