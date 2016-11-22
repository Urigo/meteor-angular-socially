[{]: <region> (header)
# Step 17: CSS, LESS and Bootstrap
[}]: #
[{]: <region> (body)
In this chapter we will add Twitter's bootstrap to our project, and add some style and layout to the project.

At the moment, this tutorial we will use only Bootstrap's CSS file and not the JavaScript - but note that you can use all the features of Boostrap 4.

# Adding and importing Bootstrap 4

First, we need to add Boostrap 4 to our project - so let's do that.

Run the following command in your Terminal:

    $ meteor npm install bootstrap@4.0.0-alpha.2 --save

[{]: <helper> (diff_step 17.4)
#### Step 17.4: Import bootstrap

##### Changed client/main.js
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import angular from 'angular';
+┊ ┊2┊import 'bootstrap/dist/css/bootstrap.css';
 ┊2┊3┊
 ┊3┊4┊import { Meteor } from 'meteor/meteor';
```
[}]: #

And it will import Boostrap's CSS to your project.

# Add LESS

OK, simple styling works, but we want to be able to use [LESS](http://lesscss.org/).

We can't add LESS from NPM because it is a compiler and we want it to be a part of Meteor build - so we will add it from Atmosphere:

    $ meteor add less

We will use LESS in a few steps!

# First touch of style

Now let's add some style! We will set just a background color.

[{]: <helper> (diff_step 17.3)
#### Step 17.3: Add main.less

##### Added client/main.less
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊body {
+┊ ┊2┊  background-color: #f9f9f9;
+┊ ┊3┊}
```
[}]: #


Let's move loginButton to Navigation and set .container-fluid to the uiView directive.

[{]: <helper> (diff_step 17.6)
#### Step 17.6: Refactor Socially

##### Changed imports/ui/components/socially/socially.html
```diff
@@ -1,5 +1,3 @@
-┊1┊ ┊<login-buttons></login-buttons>
+┊ ┊1┊<navigation class="navbar navbar-static-top navbar-dark bg-inverse"></navigation>
 ┊2┊2┊
-┊3┊ ┊<navigation></navigation>
-┊4┊ ┊
-┊5┊ ┊<div ui-view=""></div>
+┊ ┊3┊<div ui-view="" class="container-fluid"></div>
```
[}]: #

Converting to Bootstrap doesn't stop here. By applying bootstrap styles to various other parts of our Socially app, our website will look better on different screens. Have a look at [Code Diff](https://github.com/Urigo/meteor-angular-socially/compare/step_16...step_17) to see how we changed the structure of the main files.

Now we can create .less file for Socially:

[{]: <helper> (diff_step 17.7)
#### Step 17.7: Styles for Socially

##### Added imports/ui/components/socially/socially.less
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊socially {
+┊ ┊2┊  display: block;
+┊ ┊3┊}
```
[}]: #

And apply it to main less file:

[{]: <helper> (diff_step 17.5)
#### Step 17.5: Import future Socially less file

##### Changed client/main.less
```diff
@@ -1,3 +1,5 @@
 ┊1┊1┊body {
 ┊2┊2┊  background-color: #f9f9f9;
 ┊3┊3┊}
+┊ ┊4┊
+┊ ┊5┊@import "../imports/ui/components/socially/socially.less";
```
[}]: #

To make bootstrap working with all sizes of screens:

[{]: <helper> (diff_step 17.8)
#### Step 17.8: Refactor index.html

##### Changed client/index.html
```diff
@@ -1,6 +1,11 @@
 ┊ 1┊ 1┊<head>
+┊  ┊ 2┊  <meta charset="utf-8">
+┊  ┊ 3┊  <meta http-equiv="X-UA-Compatible" content="IE=edge">
+┊  ┊ 4┊  <meta name="viewport" content="width=device-width, initial-scale=1">
 ┊ 2┊ 5┊  <base href="/">
+┊  ┊ 6┊  <title>Socially</title>
 ┊ 3┊ 7┊  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbphq9crcdpecbseKX3Yx2LPxMRqWK-rc"></script>
+┊  ┊ 8┊  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
 ┊ 4┊ 9┊</head>
 ┊ 5┊10┊<body>
 ┊ 6┊11┊  <socially></socially>
```
[}]: #

# Navigation

Move loginButtons under Navigation and set as a bootstrap's navbar:

[{]: <helper> (diff_step 17.9)
#### Step 17.9: Refactor Navigation

##### Changed imports/ui/components/navigation/navigation.html
```diff
@@ -1,3 +1,6 @@
-┊1┊ ┊<h1>
-┊2┊ ┊  <a href="/parties">Home</a>
-┊3┊ ┊</h1>
+┊ ┊1┊<div class="fluid-container">
+┊ ┊2┊  <div class="navbar-header">
+┊ ┊3┊    <a href="/parties" class="navbar-brand">Socially</a>
+┊ ┊4┊    <login-buttons class="navbar-brand"></login-buttons>
+┊ ┊5┊  </div>
+┊ ┊6┊</div>
```
[}]: #

[{]: <helper> (diff_step 17.10)
#### Step 17.10: Styles for Navigation

##### Added imports/ui/components/navigation/navigation.less
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊navigation {
+┊ ┊2┊  display: block;
+┊ ┊3┊}
```
[}]: #

# PartiesList

We will use bootstrap's grid system and make all warnings look a lot better:

[{]: <helper> (diff_step 17.11)
#### Step 17.11: Refactor PartiesList

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -1,36 +1,66 @@
-┊ 1┊  ┊<party-add ng-show="partiesList.isLoggedIn"></party-add>
-┊ 2┊  ┊<div ng-hide="partiesList.isLoggedIn">
-┊ 3┊  ┊  Log in to create a party!
-┊ 4┊  ┊</div>
-┊ 5┊  ┊
-┊ 6┊  ┊<input type="search" ng-model="partiesList.searchText" placeholder="Search" />
-┊ 7┊  ┊
-┊ 8┊  ┊<parties-sort on-change="partiesList.sortChanged(sort)" property="name" order="1"></parties-sort>
+┊  ┊ 1┊<div class="container-fluid">
+┊  ┊ 2┊  <div class="row">
+┊  ┊ 3┊    <div class="col-md-12">
+┊  ┊ 4┊      <party-add ng-show="partiesList.isLoggedIn"></party-add>
 ┊ 9┊ 5┊
-┊10┊  ┊<ul>
-┊11┊  ┊  <li dir-paginate="party in partiesList.parties | itemsPerPage: partiesList.perPage" total-items="partiesList.partiesCount">
-┊12┊  ┊    <a ui-sref="partyDetails({ partyId: party._id })">
-┊13┊  ┊      {{party.name}}
-┊14┊  ┊    </a>
-┊15┊  ┊    <p>{{party.description}}</p>
-┊16┊  ┊    <party-remove party="party" ng-show="partiesList.isOwner(party)"></party-remove>
-┊17┊  ┊    <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
-┊18┊  ┊    <div ng-hide="partiesList.isLoggedIn">
-┊19┊  ┊      <i>Sign in to RSVP for this party.</i>
+┊  ┊ 6┊      <div class="alert alert-warning" role="alert" ng-hide="partiesList.isLoggedIn">
+┊  ┊ 7┊        <strong>Warning!</strong>
+┊  ┊ 8┊        Log in to create a party!
+┊  ┊ 9┊      </div>
 ┊20┊10┊    </div>
-┊21┊  ┊
-┊22┊  ┊    <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
-┊23┊  ┊
-┊24┊  ┊    <party-unanswered party="party" ng-if="!party.public"></party-unanswered>
-┊25┊  ┊    <div ng-if="party.public">
-┊26┊  ┊      Everyone is invited
+┊  ┊11┊  </div>
+┊  ┊12┊  <div class="row">
+┊  ┊13┊    <div class="col-md-12">
+┊  ┊14┊      <h2>List of parties:</h2>
+┊  ┊15┊      <form class="form-inline">
+┊  ┊16┊        <div class="form-group">
+┊  ┊17┊          <input type="search" ng-model="partiesList.searchText" placeholder="Search" class="form-control"/>
+┊  ┊18┊        </div>
+┊  ┊19┊        <parties-sort class="form-group" on-change="partiesList.sortChanged(sort)" property="name" order="1"></parties-sort>
+┊  ┊20┊      </form>
 ┊27┊21┊    </div>
+┊  ┊22┊  </div>
+┊  ┊23┊  <div class="row">
+┊  ┊24┊    <div class="col-md-6">
+┊  ┊25┊      <ul class="parties">
+┊  ┊26┊        <li dir-paginate="party in partiesList.parties | itemsPerPage: partiesList.perPage" total-items="partiesList.partiesCount">
+┊  ┊27┊          <div class="row">
+┊  ┊28┊            <div class="col-sm-8">
+┊  ┊29┊              <h3 class="party-name">
+┊  ┊30┊                <a ui-sref="partyDetails({ partyId: party._id })">{{party.name}}</a>
+┊  ┊31┊              </h3>
+┊  ┊32┊              <p class="party-description">
+┊  ┊33┊                {{party.description}}
+┊  ┊34┊              </p>
+┊  ┊35┊            </div>
+┊  ┊36┊            <div class="col-sm-4">
+┊  ┊37┊              <party-remove party="party" ng-show="partiesList.isOwner(party)"></party-remove>
+┊  ┊38┊            </div>
+┊  ┊39┊          </div>
+┊  ┊40┊          <div class="row">
+┊  ┊41┊            <div class="col-md-12">
+┊  ┊42┊              <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
+┊  ┊43┊              <div class="alert alert-warning" role="alert" ng-hide="partiesList.isLoggedIn">
+┊  ┊44┊                <strong>Warning!</strong>
+┊  ┊45┊                <i>Sign in to RSVP for this party.</i>
+┊  ┊46┊              </div>
+┊  ┊47┊            </div>
+┊  ┊48┊          </div>
+┊  ┊49┊          <div class="row">
+┊  ┊50┊            <div class="col-md-4">
+┊  ┊51┊              <party-creator party="party"></party-creator>
+┊  ┊52┊            </div>
+┊  ┊53┊            <div class="col-md-8">
+┊  ┊54┊              <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
+┊  ┊55┊            </div>
+┊  ┊56┊          </div>
+┊  ┊57┊        </li>
+┊  ┊58┊      </ul>
 ┊28┊59┊
-┊29┊  ┊    <party-creator party="party"></party-creator>
-┊30┊  ┊  </li>
-┊31┊  ┊</ul>
-┊32┊  ┊
-┊33┊  ┊<dir-pagination-controls on-page-change="partiesList.pageChanged(newPageNumber)"></dir-pagination-controls>
-┊34┊  ┊
-┊35┊  ┊
-┊36┊  ┊<parties-map parties="partiesList.parties"></parties-map>
+┊  ┊60┊      <dir-pagination-controls on-page-change="partiesList.pageChanged(newPageNumber)"></dir-pagination-controls>
+┊  ┊61┊    </div>
+┊  ┊62┊    <div class="col-md-6">
+┊  ┊63┊      <parties-map parties="partiesList.parties"></parties-map>
+┊  ┊64┊    </div>
+┊  ┊65┊  </div>
+┊  ┊66┊</div>
```
[}]: #

[{]: <helper> (diff_step 17.12)
#### Step 17.12: Styles for PartiesList

##### Added imports/ui/components/partiesList/partiesList.less
```diff
@@ -0,0 +1,30 @@
+┊  ┊ 1┊parties-list {
+┊  ┊ 2┊  display: block;
+┊  ┊ 3┊  padding: 25px 0;
+┊  ┊ 4┊
+┊  ┊ 5┊  ul.parties {
+┊  ┊ 6┊    padding-left: 0;
+┊  ┊ 7┊    list-style-type: none;
+┊  ┊ 8┊
+┊  ┊ 9┊    > li {
+┊  ┊10┊      padding: 15px;
+┊  ┊11┊      background-color: #fff;
+┊  ┊12┊      margin: 15px 0;
+┊  ┊13┊      border: 3px solid #eaeaea;
+┊  ┊14┊
+┊  ┊15┊     .party-name {
+┊  ┊16┊       margin-top: 0px;
+┊  ┊17┊       margin-bottom: 20px;
+┊  ┊18┊       a {
+┊  ┊19┊         text-decoration: none !important;
+┊  ┊20┊         font-weight: 400;
+┊  ┊21┊       }
+┊  ┊22┊     }
+┊  ┊23┊     .party-description {
+┊  ┊24┊       font-weight: 300;
+┊  ┊25┊       padding-left: 18px;
+┊  ┊26┊       font-size: 14px;
+┊  ┊27┊     }
+┊  ┊28┊    }
+┊  ┊29┊  }
+┊  ┊30┊}
```
[}]: #

We will no longer be using PartyUnanswered, time to remove it:

[{]: <helper> (diff_step 17.42)
#### Step 17.42: Remove PartyUnanswered

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -14,7 +14,6 @@
 ┊14┊14┊import { name as PartyCreator } from '../partyCreator/partyCreator';
 ┊15┊15┊import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
 ┊16┊16┊import { name as PartyRsvpsList } from '../partyRsvpsList/partyRsvpsList';
-┊17┊  ┊import { name as PartyUnanswered } from '../partyUnanswered/partyUnanswered';
 ┊18┊17┊
 ┊19┊18┊class PartiesList {
 ┊20┊19┊  constructor($scope, $reactive) {
```
```diff
@@ -82,8 +81,7 @@
 ┊82┊81┊  PartyRemove,
 ┊83┊82┊  PartyCreator,
 ┊84┊83┊  PartyRsvp,
-┊85┊  ┊  PartyRsvpsList,
-┊86┊  ┊  PartyUnanswered
+┊  ┊84┊  PartyRsvpsList
 ┊87┊85┊]).component(name, {
 ┊88┊86┊  template,
 ┊89┊87┊  controllerAs: name,
```
[}]: #

# PartyAdd

Let's use .form-group and .form-control classes:

[{]: <helper> (diff_step 17.13)
#### Step 17.13: Refactor PartyAdd

##### Changed imports/ui/components/partyAdd/partyAdd.html
```diff
@@ -1,15 +1,20 @@
 ┊ 1┊ 1┊<form>
-┊ 2┊  ┊  <label>
-┊ 3┊  ┊    Party Name:
-┊ 4┊  ┊  </label>
-┊ 5┊  ┊  <input type="text" ng-model="partyAdd.party.name" />
-┊ 6┊  ┊  <label>
-┊ 7┊  ┊    Description:
-┊ 8┊  ┊  </label>
-┊ 9┊  ┊  <input type="text" ng-model="partyAdd.party.description" />
-┊10┊  ┊  <label>
-┊11┊  ┊    Public Party?
-┊12┊  ┊  </label>
-┊13┊  ┊  <input type="checkbox" ng-model="partyAdd.party.public">
-┊14┊  ┊  <button ng-click="partyAdd.submit()">Add Party!</button>
+┊  ┊ 2┊  <div class="form-group">
+┊  ┊ 3┊    <label>
+┊  ┊ 4┊      Party Name:
+┊  ┊ 5┊    </label>
+┊  ┊ 6┊    <input type="text" ng-model="partyAdd.party.name" class="form-control"/>
+┊  ┊ 7┊  </div>
+┊  ┊ 8┊  <div class="form-group">
+┊  ┊ 9┊    <label>
+┊  ┊10┊      Description:
+┊  ┊11┊    </label>
+┊  ┊12┊    <input type="text" ng-model="partyAdd.party.description" class="form-control"/>
+┊  ┊13┊  </div>
+┊  ┊14┊  <div class="checkbox">
+┊  ┊15┊    <label>
+┊  ┊16┊      <input type="checkbox" ng-model="partyAdd.party.public"/> Public Party?
+┊  ┊17┊    </label>
+┊  ┊18┊  </div>
+┊  ┊19┊  <button ng-click="partyAdd.submit()" class="btn btn-success">Add Party!</button>
 ┊15┊20┊</form>
```
[}]: #

[{]: <helper> (diff_step 17.14)
#### Step 17.14: Styles for PartyAdd

##### Added imports/ui/components/partyAdd/partyAdd.less
```diff
@@ -0,0 +1,10 @@
+┊  ┊ 1┊party-add {
+┊  ┊ 2┊  display: block;
+┊  ┊ 3┊}
+┊  ┊ 4┊
+┊  ┊ 5┊party-add > form {
+┊  ┊ 6┊  padding: 15px;
+┊  ┊ 7┊  margin-bottom: 25px;
+┊  ┊ 8┊  background-color: #fff;
+┊  ┊ 9┊  border: 3px solid #EAEAEC;
+┊  ┊10┊}
```
[}]: #

[{]: <helper> (diff_step 17.15)
#### Step 17.15: Import PartyAdd

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -28,3 +28,5 @@
 ┊28┊28┊    }
 ┊29┊29┊  }
 ┊30┊30┊}
+┊  ┊31┊
+┊  ┊32┊@import "../partyAdd/partyAdd.less";
```
[}]: #

# PartiesMap

[{]: <helper> (diff_step 17.16)
#### Step 17.16: Refactor PartiesMap

##### Changed imports/ui/components/partiesMap/partiesMap.html
```diff
@@ -1,3 +1,6 @@
+┊ ┊1┊<h4>
+┊ ┊2┊  See all the parties:
+┊ ┊3┊</h4>
 ┊1┊4┊<div class="angular-google-map-container">
 ┊2┊5┊  <ui-gmap-google-map center="partiesMap.map.center" zoom="partiesMap.map.zoom">
 ┊3┊6┊    <ui-gmap-markers models="partiesMap.parties" coords="'location'" fit="true" idkey="'_id'" doRebuildAll="true"></ui-gmap-markers>
```
[}]: #

[{]: <helper> (diff_step 17.17)
#### Step 17.17: Styles for PartiesMap

##### Added imports/ui/components/partiesMap/partiesMap.less
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊parties-map {
+┊ ┊2┊  display: block;
+┊ ┊3┊  margin: 15px 5px;
+┊ ┊4┊
+┊ ┊5┊  .angular-google-map-container {
+┊ ┊6┊    width: 100%;
+┊ ┊7┊    height: 400px;
+┊ ┊8┊  }
+┊ ┊9┊}
```
[}]: #

[{]: <helper> (diff_step 17.18)
#### Step 17.18: Import PartiesMap

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -30,3 +30,4 @@
 ┊30┊30┊}
 ┊31┊31┊
 ┊32┊32┊@import "../partyAdd/partyAdd.less";
+┊  ┊33┊@import "../partiesMap/partiesMap.less";
```
[}]: #


# PartiesSort

[{]: <helper> (diff_step 17.19)
#### Step 17.19: Refactor PartiesSort

##### Changed imports/ui/components/partiesSort/partiesSort.html
```diff
@@ -1,6 +1,4 @@
-┊1┊ ┊<div>
-┊2┊ ┊  <select ng-model="partiesSort.order" ng-change="partiesSort.changed()">
-┊3┊ ┊    <option value="1">Ascending</option>
-┊4┊ ┊    <option value="-1">Descending</option>
-┊5┊ ┊  </select>
-┊6┊ ┊</div>
+┊ ┊1┊<select ng-model="partiesSort.order" ng-change="partiesSort.changed()" class="form-control">
+┊ ┊2┊  <option value="1">Ascending</option>
+┊ ┊3┊  <option value="-1">Descending</option>
+┊ ┊4┊</select>
```
[}]: #

# PartyCreator

Let's add a icon:

[{]: <helper> (diff_step 17.20)
#### Step 17.20: Refactor PartyCreator

##### Changed imports/ui/components/partyCreator/partyCreator.html
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊<p>
 ┊2┊2┊  <small>
-┊3┊ ┊    Posted by {{ partyCreator.creator | displayNameFilter }}
+┊ ┊3┊    <i class="fa fa-user fa-lg"></i> {{ partyCreator.creator | displayNameFilter }}
 ┊4┊4┊  </small>
 ┊5┊5┊</p>
```
[}]: #

[{]: <helper> (diff_step 17.21)
#### Step 17.21: Styles for PartyCreator

##### Added imports/ui/components/partyCreator/partyCreator.less
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊party-creator {
+┊ ┊2┊  i.fa {
+┊ ┊3┊    margin-left: 5px;
+┊ ┊4┊    margin-right: 10px;
+┊ ┊5┊  }
+┊ ┊6┊}
```
[}]: #

[{]: <helper> (diff_step 17.22)
#### Step 17.22: Import PartyCreator

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -31,3 +31,4 @@
 ┊31┊31┊
 ┊32┊32┊@import "../partyAdd/partyAdd.less";
 ┊33┊33┊@import "../partiesMap/partiesMap.less";
+┊  ┊34┊@import "../partyCreator/partyCreator.less";
```
[}]: #

# PartyRemove

We will use icon of X provided by bootstrap v4:

[{]: <helper> (diff_step 17.23)
#### Step 17.23: Refactor PartyRemove

##### Changed imports/ui/components/partyRemove/partyRemove.html
```diff
@@ -1 +1 @@
-┊1┊ ┊<button ng-click="partyRemove.remove()">X</button>
+┊ ┊1┊<button type="button" class="close" aria-label="Close" ng-click="partyRemove.remove()"><span aria-hidden="true">&times;</span></button>
```
[}]: #

# PartyRsvp

Let's make RSVP a lot prettier! User will be able to see how he responded:

[{]: <helper> (diff_step 17.24)
#### Step 17.24: Refactor PartyRsvp

##### Changed imports/ui/components/partyRsvp/partyRsvp.html
```diff
@@ -1,3 +1,3 @@
-┊1┊ ┊<input type="button" value="I'm going!" ng-click="partyRsvp.yes()"/>
-┊2┊ ┊<input type="button" value="Maybe" ng-click="partyRsvp.maybe()"/>
-┊3┊ ┊<input type="button" value="No" ng-click="partyRsvp.no()"/>
+┊ ┊1┊<input type="button" value="I'm going!" ng-click="partyRsvp.yes()" class="btn btn-default" ng-class="{'btn-primary' : partyRsvp.isYes()}"/>
+┊ ┊2┊<input type="button" value="Maybe" ng-click="partyRsvp.maybe()" class="btn btn-default" ng-class="{'btn-primary' : partyRsvp.isMaybe()}"/>
+┊ ┊3┊<input type="button" value="No" ng-click="partyRsvp.no()" class="btn btn-default" ng-class="{'btn-primary' : partyRsvp.isNo()}"/>
```
[}]: #

[{]: <helper> (diff_step 17.25)
#### Step 17.25: Styles for PartyRsvp

##### Added imports/ui/components/partyRsvp/partyRsvp.less
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊party-rsvp {
+┊ ┊2┊  display: block;
+┊ ┊3┊  margin: 15px 0;
+┊ ┊4┊}
```
[}]: #

[{]: <helper> (diff_step 17.26)
#### Step 17.26: Import PartyRsvp

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -32,3 +32,4 @@
 ┊32┊32┊@import "../partyAdd/partyAdd.less";
 ┊33┊33┊@import "../partiesMap/partiesMap.less";
 ┊34┊34┊@import "../partyCreator/partyCreator.less";
+┊  ┊35┊@import "../partyRsvp/partyRsvp.less";
```
[}]: #

And create few methods to check the answer:

[{]: <helper> (diff_step 17.39)
#### Step 17.39: Add checking methods

##### Changed imports/ui/components/partyRsvp/partyRsvp.js
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
+┊ ┊3┊import _ from 'underscore';
 ┊3┊4┊
 ┊4┊5┊import { Meteor } from 'meteor/meteor';
 ┊5┊6┊
```
```diff
@@ -9,14 +10,23 @@
 ┊ 9┊10┊  yes() {
 ┊10┊11┊    this.answer('yes');
 ┊11┊12┊  }
+┊  ┊13┊  isYes() {
+┊  ┊14┊    return this.isAnswer('yes');
+┊  ┊15┊  }
 ┊12┊16┊
 ┊13┊17┊  maybe() {
 ┊14┊18┊    this.answer('maybe');
 ┊15┊19┊  }
+┊  ┊20┊  isMaybe() {
+┊  ┊21┊    return this.isAnswer('maybe');
+┊  ┊22┊  }
 ┊16┊23┊
 ┊17┊24┊  no() {
 ┊18┊25┊    this.answer('no');
 ┊19┊26┊  }
+┊  ┊27┊  isNo() {
+┊  ┊28┊    return this.isAnswer('no');
+┊  ┊29┊  }
 ┊20┊30┊
 ┊21┊31┊  answer(answer) {
 ┊22┊32┊    Meteor.call('rsvp', this.party._id, answer, (error) => {
```
```diff
@@ -27,6 +37,14 @@
 ┊27┊37┊      }
 ┊28┊38┊    });
 ┊29┊39┊  }
+┊  ┊40┊  isAnswer(answer) {
+┊  ┊41┊    if(this.party) {
+┊  ┊42┊      return !!_.findWhere(this.party.rsvps, {
+┊  ┊43┊        user: Meteor.userId(),
+┊  ┊44┊        rsvp: answer
+┊  ┊45┊      });
+┊  ┊46┊    }
+┊  ┊47┊  }
 ┊30┊48┊}
 ┊31┊49┊
 ┊32┊50┊const name = 'partyRsvp';
```
[}]: #

# PartyRsvpsList

We will no longer use PartyRsvpUsers, so we can remove it:

[{]: <helper> (diff_step 17.43)
#### Step 17.43: Remove PartyRsvpUsers

##### Changed imports/ui/components/partyRsvpsList/partyRsvpsList.js
```diff
@@ -2,7 +2,6 @@
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊
 ┊4┊4┊import template from './partyRsvpsList.html';
-┊5┊ ┊import { name as PartyRsvpUsers } from '../partyRsvpUsers/partyRsvpUsers';
 ┊6┊5┊
 ┊7┊6┊class PartyRsvpsList { }
 ┊8┊7┊
```
```diff
@@ -10,8 +9,7 @@
 ┊10┊ 9┊
 ┊11┊10┊// create a module
 ┊12┊11┊export default angular.module(name, [
-┊13┊  ┊  angularMeteor,
-┊14┊  ┊  PartyRsvpUsers
+┊  ┊12┊  angularMeteor
 ┊15┊13┊]).component(name, {
 ┊16┊14┊  template,
 ┊17┊15┊  controllerAs: name,
```
[}]: #

[{]: <helper> (diff_step 17.27)
#### Step 17.27: Refactor PartyRsvpsList

##### Changed imports/ui/components/partyRsvpsList/partyRsvpsList.html
```diff
@@ -1,10 +1,26 @@
-┊ 1┊  ┊Who is coming: Yes -
-┊ 2┊  ┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'yes'}).length }}
-┊ 3┊  ┊Maybe -
-┊ 4┊  ┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'maybe'}).length }}
-┊ 5┊  ┊No -
-┊ 6┊  ┊{{ (partyRsvpsList.rsvps | filter:{rsvp:'no'}).length }}
-┊ 7┊  ┊
-┊ 8┊  ┊<party-rsvp-users rsvps="partyRsvpsList.rsvps" type="yes"></party-rsvp-users>
-┊ 9┊  ┊<party-rsvp-users rsvps="partyRsvpsList.rsvps" type="maybe"></party-rsvp-users>
-┊10┊  ┊<party-rsvp-users rsvps="partyRsvpsList.rsvps" type="no"></party-rsvp-users>
+┊  ┊ 1┊<div class="rsvp-sum">
+┊  ┊ 2┊  <div class="rsvp-amount">
+┊  ┊ 3┊    <div class="amount">
+┊  ┊ 4┊      {{ (partyRsvpsList.rsvps | filter:{rsvp:'yes'}).length || 0 }}
+┊  ┊ 5┊    </div>
+┊  ┊ 6┊    <div class="rsvp-title">
+┊  ┊ 7┊      YES
+┊  ┊ 8┊    </div>
+┊  ┊ 9┊  </div>
+┊  ┊10┊  <div class="rsvp-amount">
+┊  ┊11┊    <div class="amount">
+┊  ┊12┊      {{ (partyRsvpsList.rsvps | filter:{rsvp:'maybe'}).length || 0 }}
+┊  ┊13┊    </div>
+┊  ┊14┊    <div class="rsvp-title">
+┊  ┊15┊      MAYBE
+┊  ┊16┊    </div>
+┊  ┊17┊  </div>
+┊  ┊18┊  <div class="rsvp-amount">
+┊  ┊19┊    <div class="amount">
+┊  ┊20┊      {{ (partyRsvpsList.rsvps | filter:{rsvp:'no'}).length || 0 }}
+┊  ┊21┊    </div>
+┊  ┊22┊    <div class="rsvp-title">
+┊  ┊23┊      NO
+┊  ┊24┊    </div>
+┊  ┊25┊  </div>
+┊  ┊26┊</div>
```
[}]: #

[{]: <helper> (diff_step 17.28)
#### Step 17.28: Styles for PartyRsvpsList

##### Added imports/ui/components/partyRsvpsList/partyRsvpsList.less
```diff
@@ -0,0 +1,24 @@
+┊  ┊ 1┊.rsvp-sum {
+┊  ┊ 2┊  width: 160px;
+┊  ┊ 3┊  @media (min-width: 400px) {
+┊  ┊ 4┊    float: right;
+┊  ┊ 5┊  }
+┊  ┊ 6┊  @media (max-width: 400px) {
+┊  ┊ 7┊    margin: 0 auto;
+┊  ┊ 8┊  }
+┊  ┊ 9┊  > .rsvp-amount {
+┊  ┊10┊    display: inline-block;
+┊  ┊11┊    text-align: center;
+┊  ┊12┊    width: 50px;
+┊  ┊13┊
+┊  ┊14┊    > .amount {
+┊  ┊15┊      font-weight: bold;
+┊  ┊16┊      font-size: 20px;
+┊  ┊17┊    }
+┊  ┊18┊    > .rsvp-title {
+┊  ┊19┊      font-size: 11px;
+┊  ┊20┊      color: #aaa;
+┊  ┊21┊      text-transform: uppercase;
+┊  ┊22┊    }
+┊  ┊23┊  }
+┊  ┊24┊}
```
[}]: #

[{]: <helper> (diff_step 17.29)
#### Step 17.29: Import PartyRsvpsList

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -33,3 +33,4 @@
 ┊33┊33┊@import "../partiesMap/partiesMap.less";
 ┊34┊34┊@import "../partyCreator/partyCreator.less";
 ┊35┊35┊@import "../partyRsvp/partyRsvp.less";
+┊  ┊36┊@import "../partyRsvpsList/partyRsvpsList.less";
```
[}]: #

# PartyUninvited

[{]: <helper> (diff_step 17.30)
#### Step 17.30: Refactor PartyUninvited

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -1,10 +1,10 @@
+┊  ┊ 1┊<h4>Users to invite:</h4>
 ┊ 1┊ 2┊<ul>
-┊ 2┊  ┊  Users to invite:
 ┊ 3┊ 3┊  <li ng-repeat="user in partyUninvited.users | uninvitedFilter:partyUninvited.party">
-┊ 4┊  ┊    <div>{{ user | displayNameFilter }}</div>
-┊ 5┊  ┊    <button ng-click="partyUninvited.invite(user)">Invite</button>
-┊ 6┊  ┊  </li>
-┊ 7┊  ┊  <li ng-if="(partyUninvited.users | uninvitedFilter:partyUninvited.party).length <= 0">
-┊ 8┊  ┊    Everyone are already invited.
+┊  ┊ 4┊    <button ng-click="partyUninvited.invite(user)" class="btn btn-primary-outline">Invite</button>
+┊  ┊ 5┊    {{ user | displayNameFilter }}
 ┊ 9┊ 6┊  </li>
 ┊10┊ 7┊</ul>
+┊  ┊ 8┊<div class="alert alert-success" role="alert" ng-if="(partyUninvited.users | uninvitedFilter:partyUninvited.party).length <= 0">
+┊  ┊ 9┊  Everyone are already invited.
+┊  ┊10┊</div>
```
[}]: #

[{]: <helper> (diff_step 17.31)
#### Step 17.31: Styles for PartyUninvited

##### Added imports/ui/components/partyUninvited/partyUninvited.less
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊party-uninvited {
+┊ ┊2┊  display: block;
+┊ ┊3┊
+┊ ┊4┊  ul {
+┊ ┊5┊    padding-left: 0;
+┊ ┊6┊    list-style-type: none;
+┊ ┊7┊  }
+┊ ┊8┊}
```
[}]: #

# PartyDetails

Let's do pretty much the same as we did with PartyAdd and PartyDetails:

[{]: <helper> (diff_step 17.32)
#### Step 17.32: Refactor PartyDetails

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -1,13 +1,35 @@
-┊ 1┊  ┊The party you selected is:
-┊ 2┊  ┊<form>
-┊ 3┊  ┊  Party name: <input type="text" ng-model="partyDetails.party.name" ng-disabled="!partyDetails.isOwner"/>
-┊ 4┊  ┊  Description: <input type="text" ng-model="partyDetails.party.description" ng-disabled="!partyDetails.isOwner"/>
-┊ 5┊  ┊  Public Party? <input type="checkbox" ng-model="partyDetails.party.public" ng-disabled="!partyDetails.isOwner"/>
-┊ 6┊  ┊  <button ng-click="partyDetails.save()">Save</button>
-┊ 7┊  ┊</form>
+┊  ┊ 1┊<div class="container-fluid">
+┊  ┊ 2┊  <div class="row">
+┊  ┊ 3┊    <div class="col-md-6">
+┊  ┊ 4┊      <form>
+┊  ┊ 5┊        <fieldset class="form-group">
+┊  ┊ 6┊          <label>Party name</label>
+┊  ┊ 7┊          <input type="text" ng-model="partyDetails.party.name" ng-disabled="!partyDetails.isOwner" class="form-control"/>
+┊  ┊ 8┊        </fieldset>
 ┊ 8┊ 9┊
-┊ 9┊  ┊<button ui-sref="parties">Back</button>
+┊  ┊10┊        <fieldset class="form-group">
+┊  ┊11┊          <label>Description</label>
+┊  ┊12┊          <input type="text" ng-model="partyDetails.party.description" ng-disabled="!partyDetails.isOwner" class="form-control"/>
+┊  ┊13┊        </fieldset>
 ┊10┊14┊
-┊11┊  ┊<party-uninvited party="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
+┊  ┊15┊        <div class="checkbox">
+┊  ┊16┊          <label>
+┊  ┊17┊            <input type="checkbox" ng-model="partyDetails.party.public" ng-disabled="!partyDetails.isOwner"/>
+┊  ┊18┊            Public Party?
+┊  ┊19┊          </label>
+┊  ┊20┊        </div>
 ┊12┊21┊
-┊13┊  ┊<party-map location="partyDetails.party.location"></party-map>
+┊  ┊22┊        <button ng-click="partyDetails.save()" type="submit" class="btn btn-primary">Save</button>
+┊  ┊23┊      </form>
+┊  ┊24┊    </div>
+┊  ┊25┊    <div class="col-md-6">
+┊  ┊26┊      <party-map location="partyDetails.party.location"></party-map>
+┊  ┊27┊    </div>
+┊  ┊28┊  </div>
+┊  ┊29┊
+┊  ┊30┊  <div class="row">
+┊  ┊31┊    <div class="col-md-6">
+┊  ┊32┊      <party-uninvited party="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
+┊  ┊33┊    </div>
+┊  ┊34┊  </div>
+┊  ┊35┊</div>
```
[}]: #

[{]: <helper> (diff_step 17.33)
#### Step 17.33: Styles for PartyDetails

##### Added imports/ui/components/partyDetails/partyDetails.less
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊party-details {
+┊ ┊2┊  display: block;
+┊ ┊3┊
+┊ ┊4┊  form {
+┊ ┊5┊    margin: 25px 0;
+┊ ┊6┊  }
+┊ ┊7┊}
+┊ ┊8┊
+┊ ┊9┊@import "../partyUninvited/partyUninvited.less";
```
[}]: #

# PartyMap

We will remove partyMap.css and replace it with partyMap.less:

[{]: <helper> (diff_step 17.34)
#### Step 17.34: Styles for PartyMap

##### Added imports/ui/components/partyMap/partyMap.less
```diff
@@ -0,0 +1,10 @@
+┊  ┊ 1┊party-map {
+┊  ┊ 2┊  display: block;
+┊  ┊ 3┊  width: 100%;
+┊  ┊ 4┊  margin: 25px 0;
+┊  ┊ 5┊
+┊  ┊ 6┊  .angular-google-map-container {
+┊  ┊ 7┊    width: 100%;
+┊  ┊ 8┊    height: 400px;
+┊  ┊ 9┊  }
+┊  ┊10┊}
```
[}]: #

[{]: <helper> (diff_step 17.35)
#### Step 17.35: Remove old css

##### Changed imports/ui/components/partyMap/partyMap.js
```diff
@@ -3,7 +3,6 @@
 ┊3┊3┊import 'angular-simple-logger';
 ┊4┊4┊import 'angular-google-maps';
 ┊5┊5┊
-┊6┊ ┊import './partyMap.css';
 ┊7┊6┊import template from './partyMap.html';
 ┊8┊7┊
 ┊9┊8┊class PartyMap {
```
[}]: #

[{]: <helper> (diff_step 17.37)
#### Step 17.37: Import PartyMap

##### Changed imports/ui/components/partyDetails/partyDetails.less
```diff
@@ -7,3 +7,4 @@
 ┊ 7┊ 7┊}
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊@import "../partyUninvited/partyUninvited.less";
+┊  ┊10┊@import "../partyMap/partyMap.less";
```
[}]: #

# Update Socially

Now we can import all less files of direct Socially dependencies:

[{]: <helper> (diff_step 17.38)
#### Step 17.38: Import missing files

##### Changed imports/ui/components/socially/socially.less
```diff
@@ -1,3 +1,8 @@
 ┊1┊1┊socially {
 ┊2┊2┊  display: block;
 ┊3┊3┊}
+┊ ┊4┊
+┊ ┊5┊
+┊ ┊6┊@import "../navigation/navigation.less";
+┊ ┊7┊@import "../partiesList/partiesList.less";
+┊ ┊8┊@import "../partyDetails/partyDetails.less";
```
[}]: #

That's it! Now we have a nice style with a better looking CSS using Bootstrap and LESS!

# Summary

We learned how to use CSS, LESS and Bootstrap in Meteor.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step16.md) | [Next Step >](step18.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #