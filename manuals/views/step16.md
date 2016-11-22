[{]: <region> (header)
# Step 16: Google Maps
[}]: #
[{]: <region> (body)
Let's add location to our parties.

The most popular maps widget is Google Maps so let's use that.

First, let's add the angular-google-maps Meteor package:

    meteor npm install --save angular-google-maps

We also have to install another package:

    meteor npm install --save angular-simple-logger

Then let's create a `PartyMap` component:

[{]: <helper> (diff_step 16.3)
#### Step 16.3: Create template for PartyMap

##### Added imports/ui/components/partyMap/partyMap.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<div class="angular-google-map-container">
+┊ ┊2┊  <ui-gmap-google-map center="partyMap.location || partyMap.map.center" events="partyMap.map.events" zoom="partyMap.map.zoom">
+┊ ┊3┊    <ui-gmap-marker coords="partyMap.location" options="partyMap.marker.options" events="partyMapmarker.events" idKey="party-location"></ui-gmap-marker>
+┊ ┊4┊  </ui-gmap-google-map>
+┊ ┊5┊</div>
```
[}]: #

[{]: <helper> (diff_step 16.4)
#### Step 16.4: Create component

##### Added imports/ui/components/partyMap/partyMap.js
```diff
@@ -0,0 +1,44 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import 'angular-simple-logger';
+┊  ┊ 4┊import 'angular-google-maps';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './partyMap.html';
+┊  ┊ 7┊
+┊  ┊ 8┊class PartyMap {
+┊  ┊ 9┊  constructor($scope) {
+┊  ┊10┊    'ngInject';
+┊  ┊11┊
+┊  ┊12┊    this.map = {
+┊  ┊13┊      center: {
+┊  ┊14┊        latitude: 45,
+┊  ┊15┊        longitude: -73
+┊  ┊16┊      },
+┊  ┊17┊      zoom: 8,
+┊  ┊18┊      events: {}
+┊  ┊19┊    };
+┊  ┊20┊
+┊  ┊21┊    this.marker = {
+┊  ┊22┊      options: {
+┊  ┊23┊        draggable: true
+┊  ┊24┊      },
+┊  ┊25┊      events: {}
+┊  ┊26┊    };
+┊  ┊27┊  }
+┊  ┊28┊}
+┊  ┊29┊
+┊  ┊30┊const name = 'partyMap';
+┊  ┊31┊
+┊  ┊32┊// create a module
+┊  ┊33┊export default angular.module(name, [
+┊  ┊34┊  angularMeteor,
+┊  ┊35┊  'nemLogging', // https://github.com/angular-ui/angular-google-maps/issues/1633
+┊  ┊36┊  'uiGmapgoogle-maps'
+┊  ┊37┊]).component(name, {
+┊  ┊38┊  template,
+┊  ┊39┊  controllerAs: name,
+┊  ┊40┊  bindings: {
+┊  ┊41┊    location: '='
+┊  ┊42┊  },
+┊  ┊43┊  controller: PartyMap
+┊  ┊44┊});
```
[}]: #

Here we created the google-map directive with attributes for binding the center, handling events and zoom of the map.
We created the `this.map` variable to hold the properties on the map.

To display a Google Map widget we have to define it's height and width. Let's do that now.
Create a new file named `partyMap.css` inside a the same folder as the component.

[{]: <helper> (diff_step 16.5)
#### Step 16.5: Add some class

##### Added imports/ui/components/partyMap/partyMap.css
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊.angular-google-map-container {
+┊ ┊2┊  height: 400px;
+┊ ┊3┊  width: 400px;
+┊ ┊4┊}
```
[}]: #

We still have to import this file:

[{]: <helper> (diff_step 16.6)
#### Step 16.6: Import styles

##### Changed imports/ui/components/partyMap/partyMap.js
```diff
@@ -3,6 +3,7 @@
 ┊3┊3┊import 'angular-simple-logger';
 ┊4┊4┊import 'angular-google-maps';
 ┊5┊5┊
+┊ ┊6┊import './partyMap.css';
 ┊6┊7┊import template from './partyMap.html';
 ┊7┊8┊
 ┊8┊9┊class PartyMap {
```
[}]: #

Now we have to add it to the PartyDetails:

[{]: <helper> (diff_step 16.7)
#### Step 16.7: Add as a dependency to PartyDetails

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -7,6 +7,7 @@
 ┊ 7┊ 7┊import template from './partyDetails.html';
 ┊ 8┊ 8┊import { Parties } from '../../../api/parties';
 ┊ 9┊ 9┊import { name as PartyUninvited } from '../partyUninvited/partyUninvited';
+┊  ┊10┊import { name as PartyMap } from '../partyMap/partyMap';
 ┊10┊11┊
 ┊11┊12┊class PartyDetails {
 ┊12┊13┊  constructor($stateParams, $scope, $reactive) {
```
```diff
@@ -74,7 +75,8 @@
 ┊74┊75┊export default angular.module(name, [
 ┊75┊76┊  angularMeteor,
 ┊76┊77┊  uiRouter,
-┊77┊  ┊  PartyUninvited
+┊  ┊78┊  PartyUninvited,
+┊  ┊79┊  PartyMap
 ┊78┊80┊]).component(name, {
 ┊79┊81┊  template,
 ┊80┊82┊  controllerAs: name,
```
[}]: #

[{]: <helper> (diff_step 16.8)
#### Step 16.8: Use in the view

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -9,3 +9,5 @@
 ┊ 9┊ 9┊<button ui-sref="parties">Back</button>
 ┊10┊10┊
 ┊11┊11┊<party-uninvited party="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
+┊  ┊12┊
+┊  ┊13┊<party-map location="partyDetails.party.location"></party-map>
```
[}]: #

Now run the app and go to the party details page. You should see a new Google Map widget, but it doesn't do anything yet.

Let's add a marker that will be bound to the party's location.

Inside `PartyMap` template:

[{]: <helper> (diff_step 16.3)
#### Step 16.3: Create template for PartyMap

##### Added imports/ui/components/partyMap/partyMap.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<div class="angular-google-map-container">
+┊ ┊2┊  <ui-gmap-google-map center="partyMap.location || partyMap.map.center" events="partyMap.map.events" zoom="partyMap.map.zoom">
+┊ ┊3┊    <ui-gmap-marker coords="partyMap.location" options="partyMap.marker.options" events="partyMapmarker.events" idKey="party-location"></ui-gmap-marker>
+┊ ┊4┊  </ui-gmap-google-map>
+┊ ┊5┊</div>
```
[}]: #

The `ui-gmap-marker` directive represents a marker inside the map. We use the following attributes:

* coords - where is the scope the marker location will be bound to.
* options - object that holds the marker options. We are going to use the draggable option.
* events - handling the events on the marker. We will use the click event.
* idKey - where in the scope there exists the unique id of the object that the marker represent.

We already extended `this.map` variable to include handling those options.

Inside `PartyMap` component:

[{]: <helper> (diff_step 16.9)
#### Step 16.9: Add actions

##### Changed imports/ui/components/partyMap/partyMap.js
```diff
@@ -16,14 +16,31 @@
 ┊16┊16┊        longitude: -73
 ┊17┊17┊      },
 ┊18┊18┊      zoom: 8,
-┊19┊  ┊      events: {}
+┊  ┊19┊      events: {
+┊  ┊20┊        click: (mapModel, eventName, originalEventArgs) => {
+┊  ┊21┊          this.setLocation(originalEventArgs[0].latLng.lat(), originalEventArgs[0].latLng.lng());
+┊  ┊22┊          $scope.$apply();
+┊  ┊23┊        }
+┊  ┊24┊      }
 ┊20┊25┊    };
 ┊21┊26┊
 ┊22┊27┊    this.marker = {
 ┊23┊28┊      options: {
 ┊24┊29┊        draggable: true
 ┊25┊30┊      },
-┊26┊  ┊      events: {}
+┊  ┊31┊      events: {
+┊  ┊32┊        dragend: (marker, eventName, args) => {
+┊  ┊33┊          this.setLocation(marker.getPosition().lat(), marker.getPosition().lng());
+┊  ┊34┊          $scope.$apply();
+┊  ┊35┊        }
+┊  ┊36┊      }
+┊  ┊37┊    };
+┊  ┊38┊  }
+┊  ┊39┊
+┊  ┊40┊  setLocation(latitude, longitude) {
+┊  ┊41┊    this.location = {
+┊  ┊42┊      latitude,
+┊  ┊43┊      longitude
 ┊27┊44┊    };
 ┊28┊45┊  }
 ┊29┊46┊}
```
[}]: #

What happened here:

* We created method to set a new value of location binding.
* We added the click event to the map. Every time the user clicks the map, we take the location from the click event's params and save it as the party's new location.
* We defined the options object under the marker to specify the marker is draggable.
* We handled the dragend event that happens when the marker is dropped to a new location. We take the location from the event's params and save it as the party's new location.

Now is the time to use it in the PartyDetails.

Insert `location` value:

[{]: <helper> (diff_step 16.10)
#### Step 16.10: Add location to be updated with a party

##### Changed imports/ui/components/partyDetails/partyDetails.js
```diff
@@ -57,7 +57,8 @@
 ┊57┊57┊      $set: {
 ┊58┊58┊        name: this.party.name,
 ┊59┊59┊        description: this.party.description,
-┊60┊  ┊        public: this.party.public
+┊  ┊60┊        public: this.party.public,
+┊  ┊61┊        location: this.party.location
 ┊61┊62┊      }
 ┊62┊63┊    }, (error) => {
 ┊63┊64┊      if (error) {
```
[}]: #

Again, with the great Meteor platform there is no need for sync or save function. We just set it and it syncs in all other clients.

Test it to see clicking and dragging works.

# Multiple markers

Now let's add a map to the parties list to show all the parties on the map.

So let's create the `PartiesMap` component:

[{]: <helper> (diff_step 16.11)
#### Step 16.11: Create view for PartiesMap

##### Added imports/ui/components/partiesMap/partiesMap.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<div class="angular-google-map-container">
+┊ ┊2┊  <ui-gmap-google-map center="partiesMap.map.center" zoom="partiesMap.map.zoom">
+┊ ┊3┊    <ui-gmap-markers models="partiesMap.parties" coords="'location'" fit="true" idkey="'_id'" doRebuildAll="true"></ui-gmap-markers>
+┊ ┊4┊  </ui-gmap-google-map>
+┊ ┊5┊</div>
```
[}]: #

[{]: <helper> (diff_step 16.12)
#### Step 16.12: Create component

##### Added imports/ui/components/partiesMap/partiesMap.js
```diff
@@ -0,0 +1,37 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊import angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import 'angular-simple-logger';
+┊  ┊ 4┊import 'angular-google-maps';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './partiesMap.html';
+┊  ┊ 7┊
+┊  ┊ 8┊/**
+┊  ┊ 9┊ * PartiesMap component
+┊  ┊10┊ */
+┊  ┊11┊class PartiesMap {
+┊  ┊12┊  constructor() {
+┊  ┊13┊    this.map = {
+┊  ┊14┊      center: {
+┊  ┊15┊        latitude: 45,
+┊  ┊16┊        longitude: -73
+┊  ┊17┊      },
+┊  ┊18┊      zoom: 8
+┊  ┊19┊    };
+┊  ┊20┊  }
+┊  ┊21┊}
+┊  ┊22┊
+┊  ┊23┊const name = 'partiesMap';
+┊  ┊24┊
+┊  ┊25┊// create a module
+┊  ┊26┊export default angular.module(name, [
+┊  ┊27┊  angularMeteor,
+┊  ┊28┊  'nemLogging', // https://github.com/angular-ui/angular-google-maps/issues/1633
+┊  ┊29┊  'uiGmapgoogle-maps'
+┊  ┊30┊]).component(name, {
+┊  ┊31┊  template,
+┊  ┊32┊  controllerAs: name,
+┊  ┊33┊  bindings: {
+┊  ┊34┊    parties: '='
+┊  ┊35┊  },
+┊  ┊36┊  controller: PartiesMap
+┊  ┊37┊});
```
[}]: #

You can see that the difference between the directive we used in `PartyMap` is that `ui-gmap-markers` is plural.

The attributes we use:

* models - the scope array that the markers represent.
* coords - the property that holds the location.
* click - handler for the click event on a marker
* fit - a boolean to automatically zoom the map to fit all the markers inside
* idKey - the property that holds the unique id of the array
* doRebuildAll - a refresh option, will help us to refresh the markers in search

And use it in the `PartiesList`:

[{]: <helper> (diff_step 16.13)
#### Step 16.13: Add as a dependency

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊import template from './partiesList.html';
 ┊ 9┊ 9┊import { Parties } from '../../../api/parties';
 ┊10┊10┊import { name as PartiesSort } from '../partiesSort/partiesSort';
+┊  ┊11┊import { name as PartiesMap } from '../partiesMap/partiesMap';
 ┊11┊12┊import { name as PartyAdd } from '../partyAdd/partyAdd';
 ┊12┊13┊import { name as PartyRemove } from '../partyRemove/partyRemove';
 ┊13┊14┊import { name as PartyCreator } from '../partyCreator/partyCreator';
```
```diff
@@ -76,6 +77,7 @@
 ┊76┊77┊  uiRouter,
 ┊77┊78┊  utilsPagination,
 ┊78┊79┊  PartiesSort,
+┊  ┊80┊  PartiesMap,
 ┊79┊81┊  PartyAdd,
 ┊80┊82┊  PartyRemove,
 ┊81┊83┊  PartyCreator,
```
[}]: #

[{]: <helper> (diff_step 16.14)
#### Step 16.14: Implement in the view

##### Changed imports/ui/components/partiesList/partiesList.html
```diff
@@ -31,3 +31,6 @@
 ┊31┊31┊</ul>
 ┊32┊32┊
 ┊33┊33┊<dir-pagination-controls on-page-change="partiesList.pageChanged(newPageNumber)"></dir-pagination-controls>
+┊  ┊34┊
+┊  ┊35┊
+┊  ┊36┊<parties-map parties="partiesList.parties"></parties-map>
```
[}]: #

Depends on which version of google-maps you use, by now you might have encountered the following error message when trying to load the map component:

    Oops! Something went wrong. This page didn't load Google Maps correctly. See the JavaScript console for technical details.

The map fails to load because in the newer versions of google-maps an API key is mandatory. An API key is a code passed in by computer programs calling an API to identify the calling program, its developer, or its user to the Web site. To generate an API key go to [Google Maps API documentation page](https://developers.google.com/maps/documentation/javascript/get-api-key) and follow the instructions. **Each app should have it's own API key**, as for now we can just use an API key we generated for the sake of this tutorial, but once you go production mode, **replace the API key in the script below**:

[{]: <helper> (diff_step 16.15)
#### Step 16.15: Add Google Maps API key

##### Changed client/index.html
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊<head>
 ┊2┊2┊  <base href="/">
+┊ ┊3┊  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbphq9crcdpecbseKX3Yx2LPxMRqWK-rc"></script>
 ┊3┊4┊</head>
 ┊4┊5┊<body>
 ┊5┊6┊  <socially></socially>
```
[}]: #

# Summary

Run the app.  Look at how little code we needed to add maps support to our app.

Angular 1 has a huge eco system full of great directives like the angular-google-maps one.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step15.md) | [Next Step >](step17.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #