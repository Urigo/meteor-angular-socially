[{]: <region> (header)
# Step 22: Ionic
[}]: #
[{]: <region> (body)
Ionic is a CSS and JavaScript framework. It is highly recommended that before starting this step you will get yourself familiar with its [documentation](http://ionicframework.com/docs/).

In this step we will learn how to add Ionic library into our project, and use its powerful directives to create cross platform mobile (Android & iOS) applications.

We will achieve this by creating separate views for web and for mobile  so be creating a separate view for the mobile applications, but we will keep the shared code parts as common code!

### Adding Ionic

Using ionic is pretty simple - first, we need to install it:

    $ meteor npm install ionic-sdk --save

To use ionic in our app we have to install `angular-sanitize`:

    $ meteor npm install angular-sanitize --save

Now we've got all of modules. Let's add the first module to Socially:

[{]: <helper> (diff_step 22.3)
#### Step 22.3: ngSanitize as a dependency

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import angular from 'angular';
 ┊2┊2┊import angularMeteor from 'angular-meteor';
 ┊3┊3┊import ngMaterial from 'angular-material';
+┊ ┊4┊import ngSanitize from 'angular-sanitize';
 ┊4┊5┊import uiRouter from 'angular-ui-router';
 ┊5┊6┊
 ┊6┊7┊import template from './socially.html';
```
```diff
@@ -17,6 +18,7 @@
 ┊17┊18┊export default angular.module(name, [
 ┊18┊19┊  angularMeteor,
 ┊19┊20┊  ngMaterial,
+┊  ┊21┊  ngSanitize,
 ┊20┊22┊  uiRouter,
 ┊21┊23┊  PartiesList,
 ┊22┊24┊  PartyDetails,
```
[}]: #

The second one is Ionic. We need to import not one but two files. It should look like this:

[{]: <helper> (diff_step 22.4)
#### Step 22.4: Import ionic and add as a dependency

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -3,6 +3,8 @@
 ┊ 3┊ 3┊import ngMaterial from 'angular-material';
 ┊ 4┊ 4┊import ngSanitize from 'angular-sanitize';
 ┊ 5┊ 5┊import uiRouter from 'angular-ui-router';
+┊  ┊ 6┊import 'ionic-sdk/release/js/ionic';
+┊  ┊ 7┊import 'ionic-sdk/release/js/ionic-angular';
 ┊ 6┊ 8┊
 ┊ 7┊ 9┊import template from './socially.html';
 ┊ 8┊10┊import { name as PartiesList } from '../partiesList/partiesList';
```
```diff
@@ -24,7 +26,8 @@
 ┊24┊26┊  PartyDetails,
 ┊25┊27┊  Navigation,
 ┊26┊28┊  Auth,
-┊27┊  ┊  'accounts.ui'
+┊  ┊29┊  'accounts.ui',
+┊  ┊30┊  'ionic'
 ┊28┊31┊]).component(name, {
 ┊29┊32┊  template,
 ┊30┊33┊  controllerAs: name,
```
[}]: #

Now's the time to add some style:

[{]: <helper> (diff_step 22.5)
#### Step 22.5: Import ionic styles

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊import uiRouter from 'angular-ui-router';
 ┊ 6┊ 6┊import 'ionic-sdk/release/js/ionic';
 ┊ 7┊ 7┊import 'ionic-sdk/release/js/ionic-angular';
+┊  ┊ 8┊import 'ionic-sdk/release/css/ionic.css';
 ┊ 8┊ 9┊
 ┊ 9┊10┊import template from './socially.html';
 ┊10┊11┊import { name as PartiesList } from '../partiesList/partiesList';
```
[}]: #


### Separate the Socially view

We will do the same thing as we did in previous chapter with `Login` component.

Let's create a view for the web. We can achieve this by copying the content of `socially.html`:

[{]: <helper> (diff_step 22.6)
#### Step 22.6: Create view of Socially for web

##### Added imports/ui/components/socially/web.html
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊<navigation></navigation>
+┊ ┊2┊
+┊ ┊3┊<div ui-view=""></div>
```
[}]: #

Now let's take care of mobile view:

[{]: <helper> (diff_step 22.7)
#### Step 22.7: Create mobile view

##### Added imports/ui/components/socially/mobile.html
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊<ion-nav-bar class="bar-positive" align-title="center">
+┊ ┊2┊</ion-nav-bar>
+┊ ┊3┊<ion-nav-view></ion-nav-view>
```
[}]: #

This is a simple navigation layout. As you can see it is pretty similar to the web view.

> The `ion-nav-view` tag is similar to the `ui-view` tag

Last thing to do is to implement these views:

[{]: <helper> (diff_step 22.8)
#### Step 22.8: Implement web and mobile views

##### Changed imports/ui/components/socially/socially.js
```diff
@@ -7,7 +7,10 @@
 ┊ 7┊ 7┊import 'ionic-sdk/release/js/ionic-angular';
 ┊ 8┊ 8┊import 'ionic-sdk/release/css/ionic.css';
 ┊ 9┊ 9┊
-┊10┊  ┊import template from './socially.html';
+┊  ┊10┊import { Meteor } from 'meteor/meteor';
+┊  ┊11┊
+┊  ┊12┊import webTemplate from './web.html';
+┊  ┊13┊import mobileTemplate from './mobile.html';
 ┊11┊14┊import { name as PartiesList } from '../partiesList/partiesList';
 ┊12┊15┊import { name as PartyDetails } from '../partyDetails/partyDetails';
 ┊13┊16┊import { name as Navigation } from '../navigation/navigation';
```
```diff
@@ -16,6 +19,7 @@
 ┊16┊19┊class Socially {}
 ┊17┊20┊
 ┊18┊21┊const name = 'socially';
+┊  ┊22┊const template = Meteor.isCordova ? mobileTemplate : webTemplate;
 ┊19┊23┊
 ┊20┊24┊// create a module
 ┊21┊25┊export default angular.module(name, [
```
[}]: #

We will no longer use `socially.html`, so let's remove it!

By now, the navigation bar is empty, we can change this by adding `ionNavTitle`:

[{]: <helper> (diff_step 22.10)
#### Step 22.10: Add title

##### Changed imports/ui/components/socially/mobile.html
```diff
@@ -1,3 +1,6 @@
 ┊1┊1┊<ion-nav-bar class="bar-positive" align-title="center">
+┊ ┊2┊  <ion-nav-title>
+┊ ┊3┊    Socially
+┊ ┊4┊  </ion-nav-title>
 ┊2┊5┊</ion-nav-bar>
 ┊3┊6┊<ion-nav-view></ion-nav-view>
```
[}]: #


### Running mobile app

We will use the techniques we learned in Step 21 of the tutorial and run the project in our favorite emulator, I used Android so

    $ meteor run android

Socially is working but the list of parties looks terrible!

### Use Ionic in list of parties

The web view stays the same so let's just copy `partiesList.html` to `web.html`:

[{]: <helper> (diff_step 22.11)
#### Step 22.11: Create web view of PartiesList

##### Added imports/ui/components/partiesList/web.html
```diff
@@ -0,0 +1,57 @@
+┊  ┊ 1┊<div layout="column" layout-padding>
+┊  ┊ 2┊  <party-add-button ng-show="partiesList.isLoggedIn"></party-add-button>
+┊  ┊ 3┊
+┊  ┊ 4┊  <div>
+┊  ┊ 5┊    <h2 class="md-display-1">List of the parties:</h2>
+┊  ┊ 6┊  </div>
+┊  ┊ 7┊
+┊  ┊ 8┊  <div layout="row" layout-padding>
+┊  ┊ 9┊    <md-input-container>
+┊  ┊10┊      <label>Search</label>
+┊  ┊11┊      <input ng-model="partiesList.searchText">
+┊  ┊12┊    </md-input-container>
+┊  ┊13┊
+┊  ┊14┊    <parties-sort on-change="partiesList.sortChanged(sort)" property="name" order="1"></parties-sort>
+┊  ┊15┊  </div>
+┊  ┊16┊
+┊  ┊17┊  <div layout="column" layout-gt-sm="row">
+┊  ┊18┊    <div class="list list-web" flex="50">
+┊  ┊19┊      <md-card dir-paginate="party in partiesList.parties | itemsPerPage: partiesList.perPage" total-items="partiesList.partiesCount">
+┊  ┊20┊        <md-card-title>
+┊  ┊21┊          <md-card-title-text>
+┊  ┊22┊            <span class="md-headline" ui-sref="partyDetails({ partyId: party._id })">
+┊  ┊23┊              {{party.name}}
+┊  ┊24┊              <party-remove party="party"></party-remove>
+┊  ┊25┊            </span>
+┊  ┊26┊            <span class="md-subhead">{{party.description}}</span>
+┊  ┊27┊          </md-card-title-text>
+┊  ┊28┊          <md-card-title-media ng-if="party.images">
+┊  ┊29┊            <div class="md-media-lg card-media">
+┊  ┊30┊              <party-image images="party.images"></party-image>
+┊  ┊31┊            </div>
+┊  ┊32┊          </md-card-title-media>
+┊  ┊33┊        </md-card-title>
+┊  ┊34┊        <md-card-content>
+┊  ┊35┊          <party-rsvps-list rsvps="party.rsvps"></party-rsvps-list>
+┊  ┊36┊
+┊  ┊37┊          <party-unanswered party="party" ng-if="!party.public"></party-unanswered>
+┊  ┊38┊          <div ng-if="party.public">
+┊  ┊39┊            Everyone is invited
+┊  ┊40┊          </div>
+┊  ┊41┊
+┊  ┊42┊          <party-creator party="party"></party-creator>
+┊  ┊43┊        </md-card-content>
+┊  ┊44┊        <md-card-actions>
+┊  ┊45┊          <party-rsvp party="party" ng-show="partiesList.isLoggedIn"></party-rsvp>
+┊  ┊46┊          <div ng-hide="partiesList.isLoggedIn">
+┊  ┊47┊            <i>Sign in to RSVP for this party.</i>
+┊  ┊48┊          </div>
+┊  ┊49┊        </md-card-actions>
+┊  ┊50┊      </md-card>
+┊  ┊51┊      <dir-pagination-controls on-page-change="partiesList.pageChanged(newPageNumber)"></dir-pagination-controls>
+┊  ┊52┊    </div>
+┊  ┊53┊    <div flex="50">
+┊  ┊54┊      <parties-map parties="partiesList.parties"></parties-map>
+┊  ┊55┊    </div>
+┊  ┊56┊  </div>
+┊  ┊57┊</div>
```
[}]: #

For the purpose of tutorial we want to keep mobile version of Socially as simple as possible.

Let's display only name, description, image and list of RSVPs.

[{]: <helper> (diff_step 22.13)
#### Step 22.13: Create mobile view

##### Added imports/ui/components/partiesList/mobile.html
```diff
@@ -0,0 +1,22 @@
+┊  ┊ 1┊<ion-view hide-back-button="true">
+┊  ┊ 2┊  <ion-content padding="true" class="has-header">
+┊  ┊ 3┊    <div class="list list-mobile">
+┊  ┊ 4┊      <div class="card" ng-repeat="party in partiesList.parties">
+┊  ┊ 5┊        <div class="item">
+┊  ┊ 6┊          <h2>
+┊  ┊ 7┊            {{party.name}}
+┊  ┊ 8┊          </h2>
+┊  ┊ 9┊          <p>
+┊  ┊10┊            {{party.description}}
+┊  ┊11┊          </p>
+┊  ┊12┊        </div>
+┊  ┊13┊
+┊  ┊14┊        <div class="item item-image">
+┊  ┊15┊          <party-image images="party.images"></party-image>
+┊  ┊16┊        </div>
+┊  ┊17┊
+┊  ┊18┊        <party-rsvps-list class="item" rsvps="party.rsvps"></party-rsvps-list>
+┊  ┊19┊      </div>
+┊  ┊20┊    </div>
+┊  ┊21┊  </ion-content>
+┊  ┊22┊</ion-view>
```
[}]: #

Ok! We have both views. It's time to implement them and remove the old `partiesList.html` file:

[{]: <helper> (diff_step 22.14)
#### Step 22.14: Implement new views

##### Changed imports/ui/components/partiesList/partiesList.js
```diff
@@ -4,8 +4,10 @@
 ┊ 4┊ 4┊import utilsPagination from 'angular-utils-pagination';
 ┊ 5┊ 5┊
 ┊ 6┊ 6┊import { Counts } from 'meteor/tmeasday:publish-counts';
+┊  ┊ 7┊import { Meteor } from 'meteor/meteor';
 ┊ 7┊ 8┊
-┊ 8┊  ┊import template from './partiesList.html';
+┊  ┊ 9┊import webTemplate from './web.html';
+┊  ┊10┊import mobileTemplate from './mobile.html';
 ┊ 9┊11┊import { Parties } from '../../../api/parties';
 ┊10┊12┊import { name as PartiesSort } from '../partiesSort/partiesSort';
 ┊11┊13┊import { name as PartiesMap } from '../partiesMap/partiesMap';
```
```diff
@@ -71,6 +73,7 @@
 ┊71┊73┊}
 ┊72┊74┊
 ┊73┊75┊const name = 'partiesList';
+┊  ┊76┊const template = Meteor.isCordova ? mobileTemplate : webTemplate;
 ┊74┊77┊
 ┊75┊78┊// create a module
 ┊76┊79┊export default angular.module(name, [
```
[}]: #

Since the layout of the view has changed, it's a bit broken and not functioning well. For example, in the mobile view we have a terribly looking margin at the top of the first party item, and in the web view we can't scroll the parties list. Here are some few adjustments which will make the layout work properly again:

[{]: <helper> (diff_step 22.15)
#### Step 22.15: Fix layout to match both mobile and web

##### Changed imports/ui/components/partiesList/partiesList.less
```diff
@@ -1,7 +1,20 @@
 ┊ 1┊ 1┊parties-list {
+┊  ┊ 2┊  > div:first-child {
+┊  ┊ 3┊    height: calc(~"100vh - 64px");
+┊  ┊ 4┊  }
+┊  ┊ 5┊
 ┊ 2┊ 6┊  [ui-sref] {
 ┊ 3┊ 7┊    cursor: pointer;
 ┊ 4┊ 8┊  }
+┊  ┊ 9┊
+┊  ┊10┊  .list-web {
+┊  ┊11┊    overflow-y: visible;
+┊  ┊12┊    overflow-x: hidden;
+┊  ┊13┊  }
+┊  ┊14┊
+┊  ┊15┊  .list-mobile > .card:first-child {
+┊  ┊16┊    margin-top: 0;
+┊  ┊17┊  }
 ┊ 5┊18┊}
 ┊ 6┊19┊
 ┊ 7┊20┊@import "../partiesMap/partiesMap.less";
```
[}]: #

You've probably noticed an issue with images. It happens because `jalik:ufs` package saves an absolute path of a file. So if you uploaded an image in the browser its path will contain `http://localhost:3000`.

But hey! We're on the mobile app so the port is different.

We can fix it by creating a filter. Let's call it `DisplayImageFilter`:

[{]: <helper> (diff_step 22.16)
#### Step 22.16: Create DisplayImageFilter

##### Added imports/ui/filters/displayImageFilter.js
```diff
@@ -0,0 +1,26 @@
+┊  ┊ 1┊import angular from 'angular';
+┊  ┊ 2┊
+┊  ┊ 3┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 4┊
+┊  ┊ 5┊const name = 'displayImageFilter';
+┊  ┊ 6┊
+┊  ┊ 7┊function DisplayImageFilter(image) {
+┊  ┊ 8┊  if (!image) {
+┊  ┊ 9┊    return image;
+┊  ┊10┊  }
+┊  ┊11┊
+┊  ┊12┊  // leave it as it is for the web view
+┊  ┊13┊  if (!Meteor.isCordova) {
+┊  ┊14┊    return image.url;
+┊  ┊15┊  }
+┊  ┊16┊
+┊  ┊17┊  // create new path of an image
+┊  ┊18┊  const path = `ufs/${image.store}/${image._id}/${image.name}`;
+┊  ┊19┊  return Meteor.absoluteUrl(path);
+┊  ┊20┊}
+┊  ┊21┊
+┊  ┊22┊// create a module
+┊  ┊23┊export default angular.module(name, [])
+┊  ┊24┊  .filter(name, () => {
+┊  ┊25┊    return DisplayImageFilter;
+┊  ┊26┊  });
```
[}]: #

Done, we have it! Now we want to use it:

[{]: <helper> (diff_step 22.17)
#### Step 22.17: Add new filter to PartyImage

##### Changed imports/ui/components/partyImage/partyImage.js
```diff
@@ -3,6 +3,7 @@
 ┊3┊3┊
 ┊4┊4┊import template from './partyImage.html';
 ┊5┊5┊import { Images } from '../../../api/images';
+┊ ┊6┊import { name as DisplayImageFilter } from '../../filters/displayImageFilter';
 ┊6┊7┊
 ┊7┊8┊class PartyImage {
 ┊8┊9┊  constructor($scope, $reactive) {
```
```diff
@@ -26,7 +27,8 @@
 ┊26┊27┊
 ┊27┊28┊// create a module
 ┊28┊29┊export default angular.module(name, [
-┊29┊  ┊  angularMeteor
+┊  ┊30┊  angularMeteor,
+┊  ┊31┊  DisplayImageFilter
 ┊30┊32┊]).component(name, {
 ┊31┊33┊  template,
 ┊32┊34┊  bindings: {
```
[}]: #

[{]: <helper> (diff_step 22.18)
#### Step 22.18: Implement DisplayImageFilter

##### Changed imports/ui/components/partyImage/partyImage.html
```diff
@@ -1 +1 @@
-┊1┊ ┊<img ng-src="{{partyImage.mainImage.url}}"/>
+┊ ┊1┊<img ng-src="{{partyImage.mainImage | displayImageFilter}}"/>
```
[}]: #

And... we're done!

## Summary

In this tutorial we showed how to use Ionic and how to separate the whole view for both, web and mobile.

We also learned how to share component between platforms, and change the view only!

We also used Ionic directives in order to provide user-experience of mobile platform instead of regular responsive layout of website.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step21.md) | [Next Step >](step23.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #