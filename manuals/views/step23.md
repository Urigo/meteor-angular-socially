[{]: <region> (header)
# Step 23: Migration to Angular2
[}]: #
[{]: <region> (body)
In this chapter we will be upgrading Socially from Angular1 to Angular2 using Angular's [Upgrade Adapter](https://angular.io/docs/ts/latest/guide/upgrade.html). Why upgrading? Because Angular2 is the next major version of the framework and it will surely be the version we want to go with when building web apps in the future, and we can enjoy many of its benefits like better performance, server-side rendering, more powerful templating, better ecosystem and more. We will also be transforming our JavaScript code into [TypeScript](https://www.typescriptlang.org/) inspired by Angular2 team's recommendation.

## Switching to TypeScript

First, we will remove the JavaScript compiler, whos belonging Meteor package is `pbastowski:angular-babel`:

    meteor remove pbastowski:angular-babel

Although it is possible to just replace the old JavaScript compiler with a TypeScript compiler, we would like to reserve `ng-annotate`'s compiler as well, since the updating process is gonna be done gradually and our app is gonna be a hybrid of Angular1 and Angular2. Thus, we're gonna install the following package:

    meteor add mys:typescript-ng-annotate

Once our app is fully migrated to Angular2, we will replace `mys:typescript-ng-annotate` with `barbatus:typescript`, a package which will provide you with a pure TypeScript compiler. TypeScript compiler also relies on [declerations](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html), which can be installed via package manager called `typings`. Further informations about `typings` and how to install it can be found [here](https://github.com/typings/typings). As for now just add the following configuration files:

[{]: <helper> (diff_step 23.3)
#### Step 23.3: Add typings configuration files

##### Changed .gitignore
```diff
@@ -1,3 +1,4 @@
 ┊1┊1┊node_modules/
+┊ ┊2┊typings/
 ┊2┊3┊.idea
-┊3┊ ┊npm-debug.log🚫↵
+┊ ┊4┊npm-debug.log
```

##### Added typings.d.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊declare module '*.html' {
+┊ ┊2┊  const template: string;
+┊ ┊3┊  export default template;
+┊ ┊4┊}🚫↵
```

##### Added typings.json
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊{
+┊  ┊ 2┊  "name": "angular2-meteor-base",
+┊  ┊ 3┊  "version": false,
+┊  ┊ 4┊  "dependencies": {
+┊  ┊ 5┊    "chai-spies": "registry:npm/chai-spies#0.7.1+20160614064916"
+┊  ┊ 6┊  },
+┊  ┊ 7┊  "globalDependencies": {
+┊  ┊ 8┊    "meteor": "github:meteor-typings/meteor/1.3#955b89a4e2af892d1736bc570b490a97e860d5b7",
+┊  ┊ 9┊    "node": "registry:env/node#6.0.0+20161019193037"
+┊  ┊10┊  }
+┊  ┊11┊}
```
[}]: #

And run the following command which will install the declarations defined in the configuration files we've just added:

    $ typings install

By now if will you run the app you will receive warning notifications by the TypeScript compiler. This is caused due to our app not being fully migrated to TypeScript. Once you finish the upgrading process and your app is purely based on Angular2 with proper declarations you shall receive no warnings.

Now that the compiler is ready we will start by switching our entry file into TypeScript:

[{]: <helper> (diff_step 23.4)
#### Step 23.4: Rename main file and make few changes to support typescript

##### Deleted client/main.js
```diff
@@ -1,19 +0,0 @@
-┊ 1┊  ┊import angular from 'angular';
-┊ 2┊  ┊
-┊ 3┊  ┊import { Meteor } from 'meteor/meteor';
-┊ 4┊  ┊
-┊ 5┊  ┊import { name as Socially } from '../imports/ui/components/socially/socially';
-┊ 6┊  ┊
-┊ 7┊  ┊function onReady() {
-┊ 8┊  ┊  angular.bootstrap(document, [
-┊ 9┊  ┊    Socially
-┊10┊  ┊  ], {
-┊11┊  ┊    strictDi: true
-┊12┊  ┊  });
-┊13┊  ┊}
-┊14┊  ┊
-┊15┊  ┊if (Meteor.isCordova) {
-┊16┊  ┊  angular.element(document).on('deviceready', onReady);
-┊17┊  ┊} else {
-┊18┊  ┊  angular.element(document).ready(onReady);
-┊19┊  ┊}
```

##### Added client/main.ts
```diff
@@ -0,0 +1,57 @@
+┊  ┊ 1┊import * as angular from 'angular';
+┊  ┊ 2┊
+┊  ┊ 3┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 4┊
+┊  ┊ 5┊import { registerAuth } from '../imports/ui/components/auth/auth';
+┊  ┊ 6┊import { registerLogin } from '../imports/ui/components/login/login';
+┊  ┊ 7┊import { registerNavigation } from '../imports/ui/components/navigation/navigation';
+┊  ┊ 8┊import { registerPartiesList } from '../imports/ui/components/partiesList/partiesList';
+┊  ┊ 9┊import { registerPartiesMap } from '../imports/ui/components/partiesMap/partiesMap';
+┊  ┊10┊import { registerPartiesSort } from '../imports/ui/components/partiesSort/partiesSort';
+┊  ┊11┊import { registerPartyAdd } from '../imports/ui/components/partyAdd/partyAdd';
+┊  ┊12┊import { registerPartyAddButton } from '../imports/ui/components/partyAddButton/partyAddButton';
+┊  ┊13┊import { registerPartyCreator } from '../imports/ui/components/partyCreator/partyCreator';
+┊  ┊14┊import { registerPartyDetails } from '../imports/ui/components/partyDetails/partyDetails';
+┊  ┊15┊import { registerPartyImage } from '../imports/ui/components/partyImage/partyImage';
+┊  ┊16┊import { registerPartyMap } from '../imports/ui/components/partyMap/partyMap';
+┊  ┊17┊import { registerPartyRemove } from '../imports/ui/components/partyRemove/partyRemove';
+┊  ┊18┊import { registerPartyRsvp } from '../imports/ui/components/partyRsvp/partyRsvp';
+┊  ┊19┊import { registerPartyRsvpsList } from '../imports/ui/components/partyRsvpsList/partyRsvpsList';
+┊  ┊20┊import { registerPartyUninvited } from '../imports/ui/components/partyUninvited/partyUninvited';
+┊  ┊21┊import { registerPartyUpload } from '../imports/ui/components/partyUpload/partyUpload';
+┊  ┊22┊import { registerPassword } from '../imports/ui/components/password/password';
+┊  ┊23┊import { registerRegister } from '../imports/ui/components/register/register';
+┊  ┊24┊import { registerSocially, SociallyNg1Module } from '../imports/ui/components/socially/socially';
+┊  ┊25┊
+┊  ┊26┊registerAuth();
+┊  ┊27┊registerLogin();
+┊  ┊28┊registerNavigation();
+┊  ┊29┊registerPartiesList();
+┊  ┊30┊registerPartiesMap();
+┊  ┊31┊registerPartiesSort();
+┊  ┊32┊registerPartyAdd();
+┊  ┊33┊registerPartyAddButton();
+┊  ┊34┊registerPartyCreator();
+┊  ┊35┊registerPartyDetails();
+┊  ┊36┊registerPartyImage();
+┊  ┊37┊registerPartyMap();
+┊  ┊38┊registerPartyRemove();
+┊  ┊39┊registerPartyRsvp();
+┊  ┊40┊registerPartyRsvpsList();
+┊  ┊41┊registerPartyUninvited();
+┊  ┊42┊registerPartyUpload();
+┊  ┊43┊registerPassword();
+┊  ┊44┊registerRegister();
+┊  ┊45┊registerSocially();
+┊  ┊46┊
+┊  ┊47┊function onReady() {
+┊  ┊48┊  angular.bootstrap(document, [
+┊  ┊49┊    SociallyNg1Module.name
+┊  ┊50┊  ]);
+┊  ┊51┊}
+┊  ┊52┊
+┊  ┊53┊if (Meteor.isCordova) {
+┊  ┊54┊  angular.element(document).on('deviceready', onReady);
+┊  ┊55┊} else {
+┊  ┊56┊  angular.element(document).ready(onReady);
+┊  ┊57┊}
```
[}]: #

Not only we changed the extension of the file, but we also made some adjustments to its content. All Angular1 modules registrations are now manually invoked, due to dependency on the upgrade who's gonna take part further in this tutorial. In addition, the way we import the `angular` library have changed.

Before:

```js
import angular from 'angular';
```

After:

```js
import * as angular from 'angular';
```

Now we gonna go through a component transformation. We will start with the Socially component since it is the root component of our app. We will first change the way we import Angular-related libraries, just like demonstrated above:

[{]: <helper> (diff_step 23.5)
#### Step 23.5: Default imports of libraries inside Socially component

##### Deleted imports/ui/components/socially/socially.js
```diff
@@ -1,82 +0,0 @@
-┊ 1┊  ┊import angular from 'angular';
-┊ 2┊  ┊import angularMeteor from 'angular-meteor';
-┊ 3┊  ┊import ngMaterial from 'angular-material';
-┊ 4┊  ┊import ngSanitize from 'angular-sanitize';
-┊ 5┊  ┊import uiRouter from 'angular-ui-router';
-┊ 6┊  ┊import 'ionic-sdk/release/js/ionic';
-┊ 7┊  ┊import 'ionic-sdk/release/js/ionic-angular';
-┊ 8┊  ┊import 'ionic-sdk/release/css/ionic.css';
-┊ 9┊  ┊
-┊10┊  ┊import { Meteor } from 'meteor/meteor';
-┊11┊  ┊
-┊12┊  ┊import webTemplate from './web.html';
-┊13┊  ┊import mobileTemplate from './mobile.html';
-┊14┊  ┊import { name as PartiesList } from '../partiesList/partiesList';
-┊15┊  ┊import { name as PartyDetails } from '../partyDetails/partyDetails';
-┊16┊  ┊import { name as Navigation } from '../navigation/navigation';
-┊17┊  ┊import { name as Auth } from '../auth/auth';
-┊18┊  ┊
-┊19┊  ┊class Socially {}
-┊20┊  ┊
-┊21┊  ┊const name = 'socially';
-┊22┊  ┊const template = Meteor.isCordova ? mobileTemplate : webTemplate;
-┊23┊  ┊
-┊24┊  ┊// create a module
-┊25┊  ┊export default angular.module(name, [
-┊26┊  ┊  angularMeteor,
-┊27┊  ┊  ngMaterial,
-┊28┊  ┊  ngSanitize,
-┊29┊  ┊  uiRouter,
-┊30┊  ┊  PartiesList,
-┊31┊  ┊  PartyDetails,
-┊32┊  ┊  Navigation,
-┊33┊  ┊  Auth,
-┊34┊  ┊  'accounts.ui',
-┊35┊  ┊  'ionic'
-┊36┊  ┊]).component(name, {
-┊37┊  ┊  template,
-┊38┊  ┊  controllerAs: name,
-┊39┊  ┊  controller: Socially
-┊40┊  ┊})
-┊41┊  ┊  .config(config)
-┊42┊  ┊  .run(run);
-┊43┊  ┊
-┊44┊  ┊function config($locationProvider, $urlRouterProvider, $qProvider, $mdIconProvider) {
-┊45┊  ┊  'ngInject';
-┊46┊  ┊
-┊47┊  ┊  $locationProvider.html5Mode(true);
-┊48┊  ┊
-┊49┊  ┊  $urlRouterProvider.otherwise('/parties');
-┊50┊  ┊
-┊51┊  ┊  $qProvider.errorOnUnhandledRejections(false);
-┊52┊  ┊
-┊53┊  ┊  const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';
-┊54┊  ┊
-┊55┊  ┊  $mdIconProvider
-┊56┊  ┊    .iconSet('social',
-┊57┊  ┊      iconPath + 'svg-sprite-social.svg')
-┊58┊  ┊    .iconSet('action',
-┊59┊  ┊      iconPath + 'svg-sprite-action.svg')
-┊60┊  ┊    .iconSet('communication',
-┊61┊  ┊      iconPath + 'svg-sprite-communication.svg')
-┊62┊  ┊    .iconSet('content',
-┊63┊  ┊      iconPath + 'svg-sprite-content.svg')
-┊64┊  ┊    .iconSet('toggle',
-┊65┊  ┊      iconPath + 'svg-sprite-toggle.svg')
-┊66┊  ┊    .iconSet('navigation',
-┊67┊  ┊      iconPath + 'svg-sprite-navigation.svg')
-┊68┊  ┊    .iconSet('image',
-┊69┊  ┊      iconPath + 'svg-sprite-image.svg');
-┊70┊  ┊}
-┊71┊  ┊
-┊72┊  ┊function run($rootScope, $state) {
-┊73┊  ┊  'ngInject';
-┊74┊  ┊
-┊75┊  ┊  $rootScope.$on('$stateChangeError',
-┊76┊  ┊    (event, toState, toParams, fromState, fromParams, error) => {
-┊77┊  ┊      if (error === 'AUTH_REQUIRED') {
-┊78┊  ┊        $state.go('parties');
-┊79┊  ┊      }
-┊80┊  ┊    }
-┊81┊  ┊  );
-┊82┊  ┊}
```

##### Added imports/ui/components/socially/socially.ts
```diff
@@ -0,0 +1,82 @@
+┊  ┊ 1┊import * as angular from 'angular';
+┊  ┊ 2┊import * as angularMeteor from 'angular-meteor';
+┊  ┊ 3┊import * as ngMaterial from 'angular-material';
+┊  ┊ 4┊import * as ngSanitize from 'angular-sanitize';
+┊  ┊ 5┊import * as uiRouter from 'angular-ui-router';
+┊  ┊ 6┊import 'ionic-sdk/release/js/ionic';
+┊  ┊ 7┊import 'ionic-sdk/release/js/ionic-angular';
+┊  ┊ 8┊import 'ionic-sdk/release/css/ionic.css';
+┊  ┊ 9┊
+┊  ┊10┊import { Meteor } from 'meteor/meteor';
+┊  ┊11┊
+┊  ┊12┊import webTemplate from './web.html';
+┊  ┊13┊import mobileTemplate from './mobile.html';
+┊  ┊14┊import { name as PartiesList } from '../partiesList/partiesList';
+┊  ┊15┊import { name as PartyDetails } from '../partyDetails/partyDetails';
+┊  ┊16┊import { name as Navigation } from '../navigation/navigation';
+┊  ┊17┊import { name as Auth } from '../auth/auth';
+┊  ┊18┊
+┊  ┊19┊class Socially {}
+┊  ┊20┊
+┊  ┊21┊const name = 'socially';
+┊  ┊22┊const template = Meteor.isCordova ? mobileTemplate : webTemplate;
+┊  ┊23┊
+┊  ┊24┊// create a module
+┊  ┊25┊export default angular.module(name, [
+┊  ┊26┊  angularMeteor,
+┊  ┊27┊  ngMaterial,
+┊  ┊28┊  ngSanitize,
+┊  ┊29┊  uiRouter,
+┊  ┊30┊  PartiesList,
+┊  ┊31┊  PartyDetails,
+┊  ┊32┊  Navigation,
+┊  ┊33┊  Auth,
+┊  ┊34┊  'accounts.ui',
+┊  ┊35┊  'ionic'
+┊  ┊36┊]).component(name, {
+┊  ┊37┊  template,
+┊  ┊38┊  controllerAs: name,
+┊  ┊39┊  controller: Socially
+┊  ┊40┊})
+┊  ┊41┊  .config(config)
+┊  ┊42┊  .run(run);
+┊  ┊43┊
+┊  ┊44┊function config($locationProvider, $urlRouterProvider, $qProvider, $mdIconProvider) {
+┊  ┊45┊  'ngInject';
+┊  ┊46┊
+┊  ┊47┊  $locationProvider.html5Mode(true);
+┊  ┊48┊
+┊  ┊49┊  $urlRouterProvider.otherwise('/parties');
+┊  ┊50┊
+┊  ┊51┊  $qProvider.errorOnUnhandledRejections(false);
+┊  ┊52┊
+┊  ┊53┊  const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';
+┊  ┊54┊
+┊  ┊55┊  $mdIconProvider
+┊  ┊56┊    .iconSet('social',
+┊  ┊57┊      iconPath + 'svg-sprite-social.svg')
+┊  ┊58┊    .iconSet('action',
+┊  ┊59┊      iconPath + 'svg-sprite-action.svg')
+┊  ┊60┊    .iconSet('communication',
+┊  ┊61┊      iconPath + 'svg-sprite-communication.svg')
+┊  ┊62┊    .iconSet('content',
+┊  ┊63┊      iconPath + 'svg-sprite-content.svg')
+┊  ┊64┊    .iconSet('toggle',
+┊  ┊65┊      iconPath + 'svg-sprite-toggle.svg')
+┊  ┊66┊    .iconSet('navigation',
+┊  ┊67┊      iconPath + 'svg-sprite-navigation.svg')
+┊  ┊68┊    .iconSet('image',
+┊  ┊69┊      iconPath + 'svg-sprite-image.svg');
+┊  ┊70┊}
+┊  ┊71┊
+┊  ┊72┊function run($rootScope, $state) {
+┊  ┊73┊  'ngInject';
+┊  ┊74┊
+┊  ┊75┊  $rootScope.$on('$stateChangeError',
+┊  ┊76┊    (event, toState, toParams, fromState, fromParams, error) => {
+┊  ┊77┊      if (error === 'AUTH_REQUIRED') {
+┊  ┊78┊        $state.go('parties');
+┊  ┊79┊      }
+┊  ┊80┊    }
+┊  ┊81┊  );
+┊  ┊82┊}
```
[}]: #

Second, we will specify the exported module as an Angular1 module, since we're dealing with two module systems which come both from Angular1 and Angular2, and we will implement a registration which is called from the entry file like we showed earlier:

[{]: <helper> (diff_step 23.6)
#### Step 23.6: Default imports of components

##### Changed imports/ui/components/socially/socially.ts
```diff
@@ -11,10 +11,10 @@
 ┊11┊11┊
 ┊12┊12┊import webTemplate from './web.html';
 ┊13┊13┊import mobileTemplate from './mobile.html';
-┊14┊  ┊import { name as PartiesList } from '../partiesList/partiesList';
-┊15┊  ┊import { name as PartyDetails } from '../partyDetails/partyDetails';
-┊16┊  ┊import { name as Navigation } from '../navigation/navigation';
-┊17┊  ┊import { name as Auth } from '../auth/auth';
+┊  ┊14┊import { PartiesListNg1Module } from '../partiesList/partiesList';
+┊  ┊15┊import { PartyDetailsNg1Module } from '../partyDetails/partyDetails';
+┊  ┊16┊import { NavigationNg1Module } from '../navigation/navigation';
+┊  ┊17┊import { AuthNg1Module } from '../auth/auth';
 ┊18┊18┊
 ┊19┊19┊class Socially {}
 ┊20┊20┊
```
```diff
@@ -22,24 +22,29 @@
 ┊22┊22┊const template = Meteor.isCordova ? mobileTemplate : webTemplate;
 ┊23┊23┊
 ┊24┊24┊// create a module
-┊25┊  ┊export default angular.module(name, [
+┊  ┊25┊export const SociallyNg1Module = angular.module(name, [
 ┊26┊26┊  angularMeteor,
 ┊27┊27┊  ngMaterial,
 ┊28┊28┊  ngSanitize,
 ┊29┊29┊  uiRouter,
-┊30┊  ┊  PartiesList,
-┊31┊  ┊  PartyDetails,
-┊32┊  ┊  Navigation,
-┊33┊  ┊  Auth,
+┊  ┊30┊  PartiesListNg1Module.name,
+┊  ┊31┊  PartyDetailsNg1Module.name,
+┊  ┊32┊  NavigationNg1Module.name,
+┊  ┊33┊  AuthNg1Module.name,
 ┊34┊34┊  'accounts.ui',
 ┊35┊35┊  'ionic'
-┊36┊  ┊]).component(name, {
-┊37┊  ┊  template,
-┊38┊  ┊  controllerAs: name,
-┊39┊  ┊  controller: Socially
-┊40┊  ┊})
-┊41┊  ┊  .config(config)
-┊42┊  ┊  .run(run);
+┊  ┊36┊]);
+┊  ┊37┊
+┊  ┊38┊export function registerSocially() {
+┊  ┊39┊  SociallyNg1Module
+┊  ┊40┊    .component(name, {
+┊  ┊41┊      template,
+┊  ┊42┊      controllerAs: name,
+┊  ┊43┊      controller: Socially
+┊  ┊44┊    })
+┊  ┊45┊    .config(config)
+┊  ┊46┊    .run(run);
+┊  ┊47┊}
 ┊43┊48┊
 ┊44┊49┊function config($locationProvider, $urlRouterProvider, $qProvider, $mdIconProvider) {
 ┊45┊50┊  'ngInject';
```
[}]: #

Now we gonna simply switch **all** the file extensions from `.js` to `.ts` and repeat the recent process for each component. This process is a pain so if you don't wanna deal with it just git-checkout the next step of this tutorial.

Once your'e done we shall change the way we import the `underscore` library otherwise our app might break:

[{]: <helper> (diff_step 23.8)
#### Step 23.8: Import underscore correctly inside Parties Methods

##### Changed imports/api/parties/methods.ts
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import _ from 'underscore';
+┊ ┊1┊import * as _ from 'underscore';
 ┊2┊2┊import { Meteor } from 'meteor/meteor';
 ┊3┊3┊import { check } from 'meteor/check';
 ┊4┊4┊import { Email } from 'meteor/email';
```
[}]: #

## Upgrading to Angular2

Since we wanna use Angular2 we will have to install its essential packages:

[{]: <helper> (diff_step 23.9)
#### Step 23.9: Install angular2 modules

##### Changed package.json
```diff
@@ -6,6 +6,13 @@
 ┊ 6┊ 6┊    "test:watch": "meteor test --driver-package sanjo:jasmine"
 ┊ 7┊ 7┊  },
 ┊ 8┊ 8┊  "dependencies": {
+┊  ┊ 9┊    "@angular/common": "^2.1.0",
+┊  ┊10┊    "@angular/compiler": "^2.1.0",
+┊  ┊11┊    "@angular/core": "^2.1.0",
+┊  ┊12┊    "@angular/forms": "^2.1.0",
+┊  ┊13┊    "@angular/platform-browser": "^2.1.0",
+┊  ┊14┊    "@angular/platform-browser-dynamic": "^2.1.0",
+┊  ┊15┊    "@angular/upgrade": "^2.1.0",
 ┊ 9┊16┊    "angular": "^1.5.3",
 ┊10┊17┊    "angular-animate": "^1.5.3",
 ┊11┊18┊    "angular-aria": "^1.5.3",
```
```diff
@@ -13,17 +20,23 @@
 ┊13┊20┊    "angular-material": "^1.0.7",
 ┊14┊21┊    "angular-messages": "^1.5.3",
 ┊15┊22┊    "angular-meteor": "^1.3.9",
-┊16┊  ┊    "angular-ui-router": "^0.2.18",
 ┊17┊23┊    "angular-sanitize": "^1.5.5",
 ┊18┊24┊    "angular-simple-logger": "^0.1.7",
 ┊19┊25┊    "angular-sortable-view": "0.0.15",
+┊  ┊26┊    "angular-ui-router": "^0.2.18",
 ┊20┊27┊    "angular-utils-pagination": "^0.11.1",
+┊  ┊28┊    "angular2-meteor": "^0.7.0",
+┊  ┊29┊    "angular2-meteor-polyfills": "^0.1.1",
+┊  ┊30┊    "es6-shim": "^0.35.1",
 ┊21┊31┊    "gm": "^1.22.0",
 ┊22┊32┊    "ionic-sdk": "^1.2.4",
 ┊23┊33┊    "meteor-node-stubs": "~0.2.0",
 ┊24┊34┊    "ng-file-upload": "^12.0.4",
 ┊25┊35┊    "ng-img-crop": "^0.2.0",
-┊26┊  ┊    "underscore": "^1.8.3"
+┊  ┊36┊    "reflect-metadata": "^0.1.8",
+┊  ┊37┊    "rxjs": "^5.0.0-beta.12",
+┊  ┊38┊    "underscore": "^1.8.3",
+┊  ┊39┊    "zone.js": "^0.6.21"
 ┊27┊40┊  },
 ┊28┊41┊  "devDependencies": {
 ┊29┊42┊    "angular-mocks": "^1.5.3"
```
[}]: #

Raw commands are listed below:

    $ npm install --save @angular/common
    $ npm install --save @angular/compiler
    $ npm install --save @angular/core
    $ npm install --save @angular/forms
    $ npm install --save @angular/platform-browser
    $ npm install --save @angular/platform-browser-dynamic
    $ npm install --save @angular/upgrade
    $ npm install --save angular2-meteor
    $ npm install --save angular2-meteor-polyfills
    $ npm install --save es6-shim
    $ npm install --save reflect-metadata
    $ npm install --save rxjs
    $ npm install --save underscore
    $ npm install --save zone.js

> `angular2-meteor-polyfills` will load `rxjs`, `reflect-metadata` and `zone.js` in their chronological order.

Now will start replacing our Angular1 components with Angular2 components, and it would be helpful if we could just do it gradually and not all at once, one component at a time. This is where the [Upgrade Adapter]([Upgrade Adapter](https://angular.io/docs/ts/latest/guide/upgrade.html) kicks in. The adapter will give us the ability to downgrade Angular2 so they can be registered to Angular1 modules, and upgrade Angular1 components so they can be registered to Angular2 modules, thereby we can have a hybrid app. Let's get into business by initializing a new instance of the `UpgradeAdapter` and passing it as an argument to each module registration:

[{]: <helper> (diff_step 23.10)
#### Step 23.10: Create module with instance of UpgradeAdapter

##### Changed client/main.ts
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import * as angular from 'angular';
+┊ ┊2┊import { UpgradeAdapter } from '@angular/upgrade';
 ┊2┊3┊
 ┊3┊4┊import { Meteor } from 'meteor/meteor';
 ┊4┊5┊
```
```diff
@@ -23,26 +24,28 @@
 ┊23┊24┊import { registerRegister } from '../imports/ui/components/register/register';
 ┊24┊25┊import { registerSocially, SociallyNg1Module } from '../imports/ui/components/socially/socially';
 ┊25┊26┊
-┊26┊  ┊registerAuth();
-┊27┊  ┊registerLogin();
-┊28┊  ┊registerNavigation();
-┊29┊  ┊registerPartiesList();
-┊30┊  ┊registerPartiesMap();
-┊31┊  ┊registerPartiesSort();
-┊32┊  ┊registerPartyAdd();
-┊33┊  ┊registerPartyAddButton();
-┊34┊  ┊registerPartyCreator();
-┊35┊  ┊registerPartyDetails();
-┊36┊  ┊registerPartyImage();
-┊37┊  ┊registerPartyMap();
-┊38┊  ┊registerPartyRemove();
-┊39┊  ┊registerPartyRsvp();
-┊40┊  ┊registerPartyRsvpsList();
-┊41┊  ┊registerPartyUninvited();
-┊42┊  ┊registerPartyUpload();
-┊43┊  ┊registerPassword();
-┊44┊  ┊registerRegister();
-┊45┊  ┊registerSocially();
+┊  ┊27┊const adapter = new UpgradeAdapter();
+┊  ┊28┊
+┊  ┊29┊registerAuth(adapter);
+┊  ┊30┊registerLogin(adapter);
+┊  ┊31┊registerNavigation(adapter);
+┊  ┊32┊registerPartiesList(adapter);
+┊  ┊33┊registerPartiesMap(adapter);
+┊  ┊34┊registerPartiesSort(adapter);
+┊  ┊35┊registerPartyAdd(adapter);
+┊  ┊36┊registerPartyAddButton(adapter);
+┊  ┊37┊registerPartyCreator(adapter);
+┊  ┊38┊registerPartyDetails(adapter);
+┊  ┊39┊registerPartyImage(adapter);
+┊  ┊40┊registerPartyMap(adapter);
+┊  ┊41┊registerPartyRemove(adapter);
+┊  ┊42┊registerPartyRsvp(adapter);
+┊  ┊43┊registerPartyRsvpsList(adapter);
+┊  ┊44┊registerPartyUninvited(adapter);
+┊  ┊45┊registerPartyUpload(adapter);
+┊  ┊46┊registerPassword(adapter);
+┊  ┊47┊registerRegister(adapter);
+┊  ┊48┊registerSocially(adapter);
 ┊46┊49┊
 ┊47┊50┊function onReady() {
 ┊48┊51┊  angular.bootstrap(document, [
```
[}]: #

**Note that you have to share the same instance of the adapter otherwise the application might not work as expected**. Once we have our adapter we will create an Angular2 module which will represent our Angular2 app's module, and bootstrap our application using the adapter:

[{]: <helper> (diff_step 23.11)
#### Step 23.11: bootstrap using UpgradeAdapter

##### Changed client/main.ts
```diff
@@ -1,4 +1,8 @@
+┊ ┊1┊import 'angular2-meteor-polyfills/browser';
 ┊1┊2┊import * as angular from 'angular';
+┊ ┊3┊import { NgModule } from '@angular/core';
+┊ ┊4┊import { BrowserModule } from '@angular/platform-browser';
+┊ ┊5┊import { FormsModule } from '@angular/forms';
 ┊2┊6┊import { UpgradeAdapter } from '@angular/upgrade';
 ┊3┊7┊
 ┊4┊8┊import { Meteor } from 'meteor/meteor';
```
```diff
@@ -24,7 +28,15 @@
 ┊24┊28┊import { registerRegister } from '../imports/ui/components/register/register';
 ┊25┊29┊import { registerSocially, SociallyNg1Module } from '../imports/ui/components/socially/socially';
 ┊26┊30┊
-┊27┊  ┊const adapter = new UpgradeAdapter();
+┊  ┊31┊@NgModule({
+┊  ┊32┊  imports: [
+┊  ┊33┊    BrowserModule,
+┊  ┊34┊    FormsModule
+┊  ┊35┊  ]
+┊  ┊36┊})
+┊  ┊37┊class AppNg2Module {}
+┊  ┊38┊
+┊  ┊39┊const adapter = new UpgradeAdapter(AppNg2Module);
 ┊28┊40┊
 ┊29┊41┊registerAuth(adapter);
 ┊30┊42┊registerLogin(adapter);
```
```diff
@@ -48,7 +60,7 @@
 ┊48┊60┊registerSocially(adapter);
 ┊49┊61┊
 ┊50┊62┊function onReady() {
-┊51┊  ┊  angular.bootstrap(document, [
+┊  ┊63┊  adapter.bootstrap(document.body, [
 ┊52┊64┊    SociallyNg1Module.name
 ┊53┊65┊  ]);
 ┊54┊66┊}
```
[}]: #

## Filters to Pipes

Angular1 filters have the same functionality as Angular2 pipes. Further details about the relation between filters pipes can be found in [Angular's docs](https://angular.io/docs/ts/latest/cookbook/a1-a2-quick-reference.html#!#filters-pipes). Filters should be registered to Angular1 modules as normal and pipes should be registered to Angular2 modules, so even though they are almost identical they will have to be duplicated for now.

We will start with the `displayName` pipe. This is how it should look like, and after we create a pipe it should be declared our app's Angular2 module:

[{]: <helper> (diff_step 23.12)
#### Step 23.12: Create displayNamePipe based on displayNameFilter

##### Changed client/main.ts
```diff
@@ -27,8 +27,12 @@
 ┊27┊27┊import { registerPassword } from '../imports/ui/components/password/password';
 ┊28┊28┊import { registerRegister } from '../imports/ui/components/register/register';
 ┊29┊29┊import { registerSocially, SociallyNg1Module } from '../imports/ui/components/socially/socially';
+┊  ┊30┊import { DisplayNamePipe } from '../imports/ui/filters/displayNamePipe';
 ┊30┊31┊
 ┊31┊32┊@NgModule({
+┊  ┊33┊  declarations: [
+┊  ┊34┊    DisplayNamePipe
+┊  ┊35┊  ],
 ┊32┊36┊  imports: [
 ┊33┊37┊    BrowserModule,
 ┊34┊38┊    FormsModule
```

##### Added imports/ui/filters/displayNamePipe.ts
```diff
@@ -0,0 +1,24 @@
+┊  ┊ 1┊import { Pipe } from '@angular/core';
+┊  ┊ 2┊
+┊  ┊ 3┊const name = 'displayName';
+┊  ┊ 4┊
+┊  ┊ 5┊@Pipe({
+┊  ┊ 6┊  name
+┊  ┊ 7┊})
+┊  ┊ 8┊export class DisplayNamePipe {
+┊  ┊ 9┊  transform(user) {
+┊  ┊10┊    if (!user) {
+┊  ┊11┊      return '';
+┊  ┊12┊    }
+┊  ┊13┊
+┊  ┊14┊    if (user.profile && user.profile.name) {
+┊  ┊15┊      return user.profile.name;
+┊  ┊16┊    }
+┊  ┊17┊
+┊  ┊18┊    if (user.emails) {
+┊  ┊19┊      return user.emails[0].address;
+┊  ┊20┊    }
+┊  ┊21┊
+┊  ┊22┊    return user;
+┊  ┊23┊  }
+┊  ┊24┊}
```
[}]: #

The key concepts of this convertion are:

* import Pipe decorator.
* change name to *displayName*.
* move a function to be a class with `transform` method.
* remove everything related to Angular1.

The same process should be applied for `uninvited` pipe as well:

[{]: <helper> (diff_step 23.13)
#### Step 23.13: Create UninvitedPipe based on UninvitedFilter

##### Changed client/main.ts
```diff
@@ -28,10 +28,12 @@
 ┊28┊28┊import { registerRegister } from '../imports/ui/components/register/register';
 ┊29┊29┊import { registerSocially, SociallyNg1Module } from '../imports/ui/components/socially/socially';
 ┊30┊30┊import { DisplayNamePipe } from '../imports/ui/filters/displayNamePipe';
+┊  ┊31┊import { UninvitedPipe } from '../imports/ui/filters/uninvitedPipe';
 ┊31┊32┊
 ┊32┊33┊@NgModule({
 ┊33┊34┊  declarations: [
-┊34┊  ┊    DisplayNamePipe
+┊  ┊35┊    DisplayNamePipe,
+┊  ┊36┊    UninvitedPipe
 ┊35┊37┊  ],
 ┊36┊38┊  imports: [
 ┊37┊39┊    BrowserModule,
```

##### Added imports/ui/filters/uninvitedPipe.ts
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊import { Pipe } from '@angular/core';
+┊  ┊ 2┊import * as _ from 'underscore';
+┊  ┊ 3┊
+┊  ┊ 4┊const name = 'uninvited';
+┊  ┊ 5┊
+┊  ┊ 6┊@Pipe({
+┊  ┊ 7┊  name
+┊  ┊ 8┊})
+┊  ┊ 9┊export class UninvitedPipe {
+┊  ┊10┊  transform(users, party) {
+┊  ┊11┊    if (!party) {
+┊  ┊12┊      return false;
+┊  ┊13┊    }
+┊  ┊14┊
+┊  ┊15┊    return users.filter((user) => {
+┊  ┊16┊      // if not the owner and not invited
+┊  ┊17┊      return user._id !== party.owner && !_.contains(party.invited, user._id);
+┊  ┊18┊    });
+┊  ┊19┊  }
+┊  ┊20┊}
```
[}]: #


We can't return `false` inside an `ngFor` directive so let's replace it with an empty array:

[{]: <helper> (diff_step 23.14)
#### Step 23.14: Return an empty array instead of false

##### Changed imports/ui/filters/uninvitedPipe.ts
```diff
@@ -9,7 +9,7 @@
 ┊ 9┊ 9┊export class UninvitedPipe {
 ┊10┊10┊  transform(users, party) {
 ┊11┊11┊    if (!party) {
-┊12┊  ┊      return false;
+┊  ┊12┊      return [];
 ┊13┊13┊    }
 ┊14┊14┊
 ┊15┊15┊    return users.filter((user) => {
```
[}]: #

## Preparing Angular1 component for migration

We will focus on the `PartyUninvited` to start with. Let's decorate it with a [Component decorator](https://angular.io/docs/ts/latest/cookbook/a1-a2-quick-reference.html#!#controllers-components), And like the pipe creation process we will also have to declare a component whenever we create it:

[{]: <helper> (diff_step 23.15)
#### Step 23.15: Use Component decorator

##### Changed client/main.ts
```diff
@@ -22,7 +22,7 @@
 ┊22┊22┊import { registerPartyRemove } from '../imports/ui/components/partyRemove/partyRemove';
 ┊23┊23┊import { registerPartyRsvp } from '../imports/ui/components/partyRsvp/partyRsvp';
 ┊24┊24┊import { registerPartyRsvpsList } from '../imports/ui/components/partyRsvpsList/partyRsvpsList';
-┊25┊  ┊import { registerPartyUninvited } from '../imports/ui/components/partyUninvited/partyUninvited';
+┊  ┊25┊import { registerPartyUninvited, PartyUninvited } from '../imports/ui/components/partyUninvited/partyUninvited';
 ┊26┊26┊import { registerPartyUpload } from '../imports/ui/components/partyUpload/partyUpload';
 ┊27┊27┊import { registerPassword } from '../imports/ui/components/password/password';
 ┊28┊28┊import { registerRegister } from '../imports/ui/components/register/register';
```
```diff
@@ -33,7 +33,8 @@
 ┊33┊33┊@NgModule({
 ┊34┊34┊  declarations: [
 ┊35┊35┊    DisplayNamePipe,
-┊36┊  ┊    UninvitedPipe
+┊  ┊36┊    UninvitedPipe,
+┊  ┊37┊    PartyUninvited
 ┊37┊38┊  ],
 ┊38┊39┊  imports: [
 ┊39┊40┊    BrowserModule,
```

##### Changed imports/ui/components/partyUninvited/partyUninvited.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import * as angular from 'angular';
 ┊2┊2┊import * as angularMeteor from 'angular-meteor';
+┊ ┊3┊import { Component } from '@angular/core';
 ┊3┊4┊
 ┊4┊5┊import { Meteor } from 'meteor/meteor';
 ┊5┊6┊
```
```diff
@@ -7,7 +8,11 @@
 ┊ 7┊ 8┊import UninvitedFilter from '../../filters/uninvitedFilter';
 ┊ 8┊ 9┊import DisplayNameFilter from '../../filters/displayNameFilter';
 ┊ 9┊10┊
-┊10┊  ┊class PartyUninvited {
+┊  ┊11┊@Component({
+┊  ┊12┊  template,
+┊  ┊13┊  selector: 'party-uninvited'
+┊  ┊14┊})
+┊  ┊15┊export class PartyUninvited {
 ┊11┊16┊  constructor($scope) {
 ┊12┊17┊    'ngInject';
```
[}]: #

Since this is an Angular2 component it relies on pipes rather than filters, so we can remove the filters' importations:

[{]: <helper> (diff_step 23.16)
#### Step 23.16: Use Pipes instead of Filters

##### Changed imports/ui/components/partyUninvited/partyUninvited.ts
```diff
@@ -5,8 +5,6 @@
 ┊ 5┊ 5┊import { Meteor } from 'meteor/meteor';
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import template from './partyUninvited.html';
-┊ 8┊  ┊import UninvitedFilter from '../../filters/uninvitedFilter';
-┊ 9┊  ┊import DisplayNameFilter from '../../filters/displayNameFilter';
 ┊10┊ 8┊
 ┊11┊ 9┊@Component({
 ┊12┊10┊  template,
```
```diff
@@ -42,9 +40,7 @@
 ┊42┊40┊
 ┊43┊41┊// create a module
 ┊44┊42┊export const PartyUninvitedNg1Module = angular.module(name, [
-┊45┊  ┊  angularMeteor,
-┊46┊  ┊  UninvitedFilter.name,
-┊47┊  ┊  DisplayNameFilter.name
+┊  ┊43┊  angularMeteor
 ┊48┊44┊]);
 ┊49┊45┊
 ┊50┊46┊export function registerPartyUninvited() {
```
[}]: #

## Switching to angular2-meteor

Switching to `angular2-meteor` would be an integral part of the migration. We will extend our component by `MeteorComponent` so angular2-meteor's API would be available for use

[{]: <helper> (diff_step 23.17)
#### Step 23.17: Extend by MeteorComponent

##### Changed imports/ui/components/partyUninvited/partyUninvited.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import * as angular from 'angular';
 ┊2┊2┊import * as angularMeteor from 'angular-meteor';
 ┊3┊3┊import { Component } from '@angular/core';
+┊ ┊4┊import { MeteorComponent } from 'angular2-meteor';
 ┊4┊5┊
 ┊5┊6┊import { Meteor } from 'meteor/meteor';
 ┊6┊7┊
```
```diff
@@ -10,9 +11,10 @@
 ┊10┊11┊  template,
 ┊11┊12┊  selector: 'party-uninvited'
 ┊12┊13┊})
-┊13┊  ┊export class PartyUninvited {
+┊  ┊14┊export class PartyUninvited extends MeteorComponent {
 ┊14┊15┊  constructor($scope) {
 ┊15┊16┊    'ngInject';
+┊  ┊17┊    super();
 ┊16┊18┊
 ┊17┊19┊    $scope.viewModel(this);
```
[}]: #

Once it's done we will replace angular-meteor's API with angular2-meteor's.

[{]: <helper> (diff_step 23.18)
#### Step 23.18: Switch to MeteorComponent API

##### Changed imports/ui/components/partyUninvited/partyUninvited.ts
```diff
@@ -12,16 +12,11 @@
 ┊12┊12┊  selector: 'party-uninvited'
 ┊13┊13┊})
 ┊14┊14┊export class PartyUninvited extends MeteorComponent {
-┊15┊  ┊  constructor($scope) {
-┊16┊  ┊    'ngInject';
+┊  ┊15┊  constructor() {
 ┊17┊16┊    super();
 ┊18┊17┊
-┊19┊  ┊    $scope.viewModel(this);
-┊20┊  ┊
-┊21┊  ┊    this.helpers({
-┊22┊  ┊      users() {
-┊23┊  ┊        return Meteor.users.find({});
-┊24┊  ┊      }
+┊  ┊18┊    this.autorun(() => {
+┊  ┊19┊      this.users = Meteor.users.find({}).fetch();
 ┊25┊20┊    });
 ┊26┊21┊  }
```
[}]: #

Now that we have our Angular2 component ready, we need to use it in our Angular1 module. The UpgradeAdapter's prototype contains a function called `downgradeNg2Component` which will transform an Angular2 component into an Angular1 directive, once it is transformed we can declare it in our Angular1 module:

[{]: <helper> (diff_step 23.19)
#### Step 23.19: Use downgraded Ng2 Component

##### Changed imports/ui/components/partyUninvited/partyUninvited.ts
```diff
@@ -40,14 +40,7 @@
 ┊40┊40┊  angularMeteor
 ┊41┊41┊]);
 ┊42┊42┊
-┊43┊  ┊export function registerPartyUninvited() {
+┊  ┊43┊export function registerPartyUninvited(adapter) {
 ┊44┊44┊  PartyUninvitedNg1Module
-┊45┊  ┊    .component(name, {
-┊46┊  ┊      template,
-┊47┊  ┊      controllerAs: name,
-┊48┊  ┊      bindings: {
-┊49┊  ┊        party: '<'
-┊50┊  ┊      },
-┊51┊  ┊      controller: PartyUninvited
-┊52┊  ┊    });
+┊  ┊45┊    .directive(name, adapter.downgradeNg2Component(PartyUninvited))
 ┊53┊46┊}
```
[}]: #

**Note that a component is a actually a directive so registering a directive achieves the same result**.

The bindings of our Angular1 component can be translated to Angular2 using the [Input](https://angular.io/docs/ts/latest/cookbook/component-communication.html) decorator.

[{]: <helper> (diff_step 23.20)
#### Step 23.20: Define binding

##### Changed imports/ui/components/partyUninvited/partyUninvited.ts
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊import * as angular from 'angular';
 ┊2┊2┊import * as angularMeteor from 'angular-meteor';
-┊3┊ ┊import { Component } from '@angular/core';
+┊ ┊3┊import { Component, Input } from '@angular/core';
 ┊4┊4┊import { MeteorComponent } from 'angular2-meteor';
 ┊5┊5┊
 ┊6┊6┊import { Meteor } from 'meteor/meteor';
```
```diff
@@ -12,6 +12,8 @@
 ┊12┊12┊  selector: 'party-uninvited'
 ┊13┊13┊})
 ┊14┊14┊export class PartyUninvited extends MeteorComponent {
+┊  ┊15┊  @Input() party: any;
+┊  ┊16┊
 ┊15┊17┊  constructor() {
 ┊16┊18┊    super();
```
[}]: #

We will no longer use prefixed variables inside our template since Angular2's template engine doesn't support it:

[{]: <helper> (diff_step 23.21)
#### Step 23.21: Remove prefix in template

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -3,10 +3,10 @@
 ┊ 3┊ 3┊</h4>
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊<md-list>
-┊ 6┊  ┊  <md-list-item ng-repeat="user in partyUninvited.users | uninvitedFilter:partyUninvited.party" ng-click="partyUninvited.invite(user)">
+┊  ┊ 6┊  <md-list-item ng-repeat="user in users | uninvitedFilter:party" ng-click="invite(user)">
 ┊ 7┊ 7┊    <p>{{ user | displayNameFilter }}</p>
 ┊ 8┊ 8┊  </md-list-item>
-┊ 9┊  ┊  <md-list-item ng-if="(partyUninvited.users | uninvitedFilter:partyUninvited.party).length <= 0">
+┊  ┊ 9┊  <md-list-item ng-if="(users | uninvitedFilter:party).length <= 0">
 ┊10┊10┊    Everyone are already invited.
 ┊11┊11┊  </md-list-item>
 ┊12┊12┊</md-list>
```
[}]: #

Our template uses Pipes instead of Filters, so we will make the following adjustments:

[{]: <helper> (diff_step 23.22)
#### Step 23.22: Switch to pipes

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -3,10 +3,10 @@
 ┊ 3┊ 3┊</h4>
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊<md-list>
-┊ 6┊  ┊  <md-list-item ng-repeat="user in users | uninvitedFilter:party" ng-click="invite(user)">
-┊ 7┊  ┊    <p>{{ user | displayNameFilter }}</p>
+┊  ┊ 6┊  <md-list-item ng-repeat="user in users | uninvited:party" ng-click="invite(user)">
+┊  ┊ 7┊    <p>{{ user | displayName }}</p>
 ┊ 8┊ 8┊  </md-list-item>
-┊ 9┊  ┊  <md-list-item ng-if="(users | uninvitedFilter:party).length <= 0">
+┊  ┊ 9┊  <md-list-item ng-if="(users | uninvited:party).length <= 0">
 ┊10┊10┊    Everyone are already invited.
 ┊11┊11┊  </md-list-item>
 ┊12┊12┊</md-list>
```
[}]: #

The `ngFor` directive of Angular2 is equivalent to Angular1's `ng-for`:

[{]: <helper> (diff_step 23.23)
#### Step 23.23: Switch to ngFor

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊</h4>
 ┊4┊4┊
 ┊5┊5┊<md-list>
-┊6┊ ┊  <md-list-item ng-repeat="user in users | uninvited:party" ng-click="invite(user)">
+┊ ┊6┊  <md-list-item *ngFor="let user of users | uninvited:party" ng-click="invite(user)">
 ┊7┊7┊    <p>{{ user | displayName }}</p>
 ┊8┊8┊  </md-list-item>
 ┊9┊9┊  <md-list-item ng-if="(users | uninvited:party).length <= 0">
```
[}]: #

And `ng-if` directive is now `ngIf`:

[{]: <helper> (diff_step 23.24)
#### Step 23.24: Switch to ngIf

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -6,7 +6,7 @@
 ┊ 6┊ 6┊  <md-list-item *ngFor="let user of users | uninvited:party" ng-click="invite(user)">
 ┊ 7┊ 7┊    <p>{{ user | displayName }}</p>
 ┊ 8┊ 8┊  </md-list-item>
-┊ 9┊  ┊  <md-list-item ng-if="(users | uninvited:party).length <= 0">
+┊  ┊ 9┊  <md-list-item *ngIf="(users | uninvited:party).length <= 0">
 ┊10┊10┊    Everyone are already invited.
 ┊11┊11┊  </md-list-item>
 ┊12┊12┊</md-list>
```
[}]: #

Events are registered using (parenthesis) rather than an `ng` prefix:

[{]: <helper> (diff_step 23.25)
#### Step 23.25: Switch to (click)

##### Changed imports/ui/components/partyUninvited/partyUninvited.html
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊</h4>
 ┊4┊4┊
 ┊5┊5┊<md-list>
-┊6┊ ┊  <md-list-item *ngFor="let user of users | uninvited:party" ng-click="invite(user)">
+┊ ┊6┊  <md-list-item *ngFor="let user of users | uninvited:party" (click)="invite(user)">
 ┊7┊7┊    <p>{{ user | displayName }}</p>
 ┊8┊8┊  </md-list-item>
 ┊9┊9┊  <md-list-item *ngIf="(users | uninvited:party).length <= 0">
```
[}]: #

Since PartyUninvited is a Angular2 component we have to change the way we're passing a value:

Bound attributes should be notated with \[square brackets\]:

[{]: <helper> (diff_step 23.26)
#### Step 23.26: Use one-way binding

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -24,5 +24,5 @@
 ┊24┊24┊    <party-map flex="50" location="partyDetails.party.location"></party-map>
 ┊25┊25┊  </div>
 ┊26┊26┊
-┊27┊  ┊  <party-uninvited flex party="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
+┊  ┊27┊  <party-uninvited flex [party]="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
 ┊28┊28┊</div>
```
[}]: #

Now let's do the same for `PartyDetails`. First we will turn it into a component:

[{]: <helper> (diff_step 23.27)
#### Step 23.27: Implement Component decorator in PartyDetails

##### Changed client/main.ts
```diff
@@ -16,7 +16,7 @@
 ┊16┊16┊import { registerPartyAdd } from '../imports/ui/components/partyAdd/partyAdd';
 ┊17┊17┊import { registerPartyAddButton } from '../imports/ui/components/partyAddButton/partyAddButton';
 ┊18┊18┊import { registerPartyCreator } from '../imports/ui/components/partyCreator/partyCreator';
-┊19┊  ┊import { registerPartyDetails } from '../imports/ui/components/partyDetails/partyDetails';
+┊  ┊19┊import { registerPartyDetails, PartyDetails } from '../imports/ui/components/partyDetails/partyDetails';
 ┊20┊20┊import { registerPartyImage } from '../imports/ui/components/partyImage/partyImage';
 ┊21┊21┊import { registerPartyMap } from '../imports/ui/components/partyMap/partyMap';
 ┊22┊22┊import { registerPartyRemove } from '../imports/ui/components/partyRemove/partyRemove';
```
```diff
@@ -34,6 +34,7 @@
 ┊34┊34┊  declarations: [
 ┊35┊35┊    DisplayNamePipe,
 ┊36┊36┊    UninvitedPipe,
+┊  ┊37┊    PartyDetails,
 ┊37┊38┊    PartyUninvited
 ┊38┊39┊  ],
 ┊39┊40┊  imports: [
```

##### Changed imports/ui/components/partyDetails/partyDetails.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import * as angular from 'angular';
 ┊2┊2┊import * as angularMeteor from 'angular-meteor';
 ┊3┊3┊import * as uiRouter from 'angular-ui-router';
+┊ ┊4┊import { Component } from '@angular/core';
 ┊4┊5┊
 ┊5┊6┊import { Meteor } from 'meteor/meteor';
 ┊6┊7┊
```
```diff
@@ -9,7 +10,11 @@
 ┊ 9┊10┊import { PartyUninvitedNg1Module } from '../partyUninvited/partyUninvited';
 ┊10┊11┊import { PartyMapNg1Module } from '../partyMap/partyMap';
 ┊11┊12┊
-┊12┊  ┊class PartyDetails {
+┊  ┊13┊@Component({
+┊  ┊14┊  template,
+┊  ┊15┊  selector: 'party-details'
+┊  ┊16┊})
+┊  ┊17┊export class PartyDetails {
 ┊13┊18┊  constructor($stateParams, $scope, $reactive) {
 ┊14┊19┊    'ngInject';
```
[}]: #

Since `PartyDetails` component is dependent on an Angular1 component which outside our project's scope, we will have to upgrade it using the `upgradeNg1Component` method:

[{]: <helper> (diff_step 23.28)
#### Step 23.28: upgrade PartyMap to be used inside Ng2 Component

##### Changed client/main.ts
```diff
@@ -46,6 +46,8 @@
 ┊46┊46┊
 ┊47┊47┊const adapter = new UpgradeAdapter(AppNg2Module);
 ┊48┊48┊
+┊  ┊49┊adapter.upgradeNg1Component('partyMap');
+┊  ┊50┊
 ┊49┊51┊registerAuth(adapter);
 ┊50┊52┊registerLogin(adapter);
 ┊51┊53┊registerNavigation(adapter);
```
[}]: #

Then again, we will extend the `MeteorComponent`:

[{]: <helper> (diff_step 23.29)
#### Step 23.29: Use MeteorComponent

##### Changed imports/ui/components/partyDetails/partyDetails.ts
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import * as angularMeteor from 'angular-meteor';
 ┊3┊3┊import * as uiRouter from 'angular-ui-router';
 ┊4┊4┊import { Component } from '@angular/core';
+┊ ┊5┊import { MeteorComponent } from 'angular2-meteor';
 ┊5┊6┊
 ┊6┊7┊import { Meteor } from 'meteor/meteor';
 ┊7┊8┊
```
```diff
@@ -14,37 +15,27 @@
 ┊14┊15┊  template,
 ┊15┊16┊  selector: 'party-details'
 ┊16┊17┊})
-┊17┊  ┊export class PartyDetails {
-┊18┊  ┊  constructor($stateParams, $scope, $reactive) {
-┊19┊  ┊    'ngInject';
+┊  ┊18┊export class PartyDetails extends MeteorComponent {
+┊  ┊19┊  partyId: string;
+┊  ┊20┊  party: Object = {};
+┊  ┊21┊  users: Object[];
+┊  ┊22┊  isLoggedIn: boolean;
 ┊20┊23┊
-┊21┊  ┊    $reactive(this).attach($scope);
-┊22┊  ┊
-┊23┊  ┊    this.partyId = $stateParams.partyId;
+┊  ┊24┊  constructor() {
+┊  ┊25┊    super();
 ┊24┊26┊
 ┊25┊27┊    this.subscribe('parties');
 ┊26┊28┊    this.subscribe('users');
 ┊27┊29┊
-┊28┊  ┊    this.helpers({
-┊29┊  ┊      party() {
-┊30┊  ┊        return Parties.findOne({
-┊31┊  ┊          _id: $stateParams.partyId
-┊32┊  ┊        });
-┊33┊  ┊      },
-┊34┊  ┊      users() {
-┊35┊  ┊        return Meteor.users.find({});
-┊36┊  ┊      },
-┊37┊  ┊      isLoggedIn() {
-┊38┊  ┊        return !!Meteor.userId();
-┊39┊  ┊      },
-┊40┊  ┊      isOwner() {
-┊41┊  ┊        if (!this.party) {
-┊42┊  ┊          return false;
-┊43┊  ┊        }
+┊  ┊30┊    this.autorun(() => {
+┊  ┊31┊      this.party = Parties.findOne({
+┊  ┊32┊        _id: this.partyId
+┊  ┊33┊      });
 ┊44┊34┊
-┊45┊  ┊        return this.party.owner === Meteor.userId();
-┊46┊  ┊      }
-┊47┊  ┊    });
+┊  ┊35┊      this.users = Meteor.users.find({}).fetch();
+┊  ┊36┊
+┊  ┊37┊      this.isOwner = this.party && this.party.owner === Meteor.userId();
+┊  ┊38┊    }, true);
 ┊48┊39┊  }
 ┊49┊40┊
 ┊50┊41┊  canInvite() {
```
[}]: #

And we will downgrade our newly created component so it can be loaded with Angular1's module system:

[{]: <helper> (diff_step 23.30)
#### Step 23.30: Downgrade PartyDetails to ng1 directive

##### Changed imports/ui/components/partyDetails/partyDetails.ts
```diff
@@ -76,13 +76,9 @@
 ┊76┊76┊  PartyMapNg1Module.name
 ┊77┊77┊]);
 ┊78┊78┊
-┊79┊  ┊export function registerPartyDetails() {
+┊  ┊79┊export function registerPartyDetails(adapter) {
 ┊80┊80┊  PartyDetailsNg1Module
-┊81┊  ┊    .component(name, {
-┊82┊  ┊      template,
-┊83┊  ┊      controllerAs: name,
-┊84┊  ┊      controller: PartyDetails
-┊85┊  ┊    })
+┊  ┊81┊    .directive(name, adapter.downgradeNg2Component(PartyDetails))
 ┊86┊82┊    .config(config);
 ┊87┊83┊}
```
[}]: #

Our router might be implemented using Angular1's router, but the template can be Angular2's:

[{]: <helper> (diff_step 23.31)
#### Step 23.31: Implement ng2 component inside ui-router template

##### Changed imports/ui/components/partyDetails/partyDetails.ts
```diff
@@ -87,7 +87,12 @@
 ┊87┊87┊
 ┊88┊88┊  $stateProvider.state('partyDetails', {
 ┊89┊89┊    url: '/parties/:partyId',
-┊90┊  ┊    template: '<party-details></party-details>',
+┊  ┊90┊    template: '<party-details [party-id]="partyDetailsRoute.partyId"></party-details>',
+┊  ┊91┊    controllerAs: 'partyDetailsRoute',
+┊  ┊92┊    controller: function($stateParams, $scope) {
+┊  ┊93┊      'ngInject';
+┊  ┊94┊      this.partyId = $stateParams.partyId;
+┊  ┊95┊    },
 ┊91┊96┊    resolve: {
 ┊92┊97┊      currentUser($q) {
 ┊93┊98┊        if (Meteor.userId() === null) {
```
[}]: #

Let's take care of the properties binding in the `PartyDetails` component:

[{]: <helper> (diff_step 23.32)
#### Step 23.32: Define bindings

##### Changed imports/ui/components/partyDetails/partyDetails.ts
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import * as angular from 'angular';
 ┊2┊2┊import * as angularMeteor from 'angular-meteor';
 ┊3┊3┊import * as uiRouter from 'angular-ui-router';
-┊4┊ ┊import { Component } from '@angular/core';
+┊ ┊4┊import { Component, Input, Output } from '@angular/core';
 ┊5┊5┊import { MeteorComponent } from 'angular2-meteor';
 ┊6┊6┊
 ┊7┊7┊import { Meteor } from 'meteor/meteor';
```
```diff
@@ -16,8 +16,8 @@
 ┊16┊16┊  selector: 'party-details'
 ┊17┊17┊})
 ┊18┊18┊export class PartyDetails extends MeteorComponent {
-┊19┊  ┊  partyId: string;
-┊20┊  ┊  party: Object = {};
+┊  ┊19┊  @Input() partyId: string;
+┊  ┊20┊  @Output() party: Object = {};
 ┊21┊21┊  users: Object[];
 ┊22┊22┊  isLoggedIn: boolean;
```
[}]: #

Further information about the `Output` decorator can be found [here](https://angular.io/docs/ts/latest/cookbook/component-communication.html).

## Removing Angular1 support

Once a component is fully integrated with Angular2, everything related to Angular1 can be removed, in this case, the `PartyUninvited` component:

[{]: <helper> (diff_step 23.33)
#### Step 23.33: Remove ng1 from PartyUninvited

##### Changed client/main.ts
```diff
@@ -22,7 +22,7 @@
 ┊22┊22┊import { registerPartyRemove } from '../imports/ui/components/partyRemove/partyRemove';
 ┊23┊23┊import { registerPartyRsvp } from '../imports/ui/components/partyRsvp/partyRsvp';
 ┊24┊24┊import { registerPartyRsvpsList } from '../imports/ui/components/partyRsvpsList/partyRsvpsList';
-┊25┊  ┊import { registerPartyUninvited, PartyUninvited } from '../imports/ui/components/partyUninvited/partyUninvited';
+┊  ┊25┊import { PartyUninvited } from '../imports/ui/components/partyUninvited/partyUninvited';
 ┊26┊26┊import { registerPartyUpload } from '../imports/ui/components/partyUpload/partyUpload';
 ┊27┊27┊import { registerPassword } from '../imports/ui/components/password/password';
 ┊28┊28┊import { registerRegister } from '../imports/ui/components/register/register';
```
```diff
@@ -63,7 +63,6 @@
 ┊63┊63┊registerPartyRemove(adapter);
 ┊64┊64┊registerPartyRsvp(adapter);
 ┊65┊65┊registerPartyRsvpsList(adapter);
-┊66┊  ┊registerPartyUninvited(adapter);
 ┊67┊66┊registerPartyUpload(adapter);
 ┊68┊67┊registerPassword(adapter);
 ┊69┊68┊registerRegister(adapter);
```

##### Changed imports/ui/components/partyDetails/partyDetails.ts
```diff
@@ -8,7 +8,6 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊import template from './partyDetails.html';
 ┊10┊10┊import { Parties } from '../../../api/parties';
-┊11┊  ┊import { PartyUninvitedNg1Module } from '../partyUninvited/partyUninvited';
 ┊12┊11┊import { PartyMapNg1Module } from '../partyMap/partyMap';
 ┊13┊12┊
 ┊14┊13┊@Component({
```
```diff
@@ -72,7 +71,6 @@
 ┊72┊71┊export const PartyDetailsNg1Module = angular.module(name, [
 ┊73┊72┊  angularMeteor,
 ┊74┊73┊  uiRouter,
-┊75┊  ┊  PartyUninvitedNg1Module.name,
 ┊76┊74┊  PartyMapNg1Module.name
 ┊77┊75┊]);
 ┊78┊76┊
```

##### Changed imports/ui/components/partyUninvited/partyUninvited.ts
```diff
@@ -1,5 +1,3 @@
-┊1┊ ┊import * as angular from 'angular';
-┊2┊ ┊import * as angularMeteor from 'angular-meteor';
 ┊3┊1┊import { Component, Input } from '@angular/core';
 ┊4┊2┊import { MeteorComponent } from 'angular2-meteor';
 ┊5┊3┊
```
```diff
@@ -34,15 +32,3 @@
 ┊34┊32┊    );
 ┊35┊33┊  }
 ┊36┊34┊}
-┊37┊  ┊
-┊38┊  ┊const name = 'partyUninvited';
-┊39┊  ┊
-┊40┊  ┊// create a module
-┊41┊  ┊export const PartyUninvitedNg1Module = angular.module(name, [
-┊42┊  ┊  angularMeteor
-┊43┊  ┊]);
-┊44┊  ┊
-┊45┊  ┊export function registerPartyUninvited(adapter) {
-┊46┊  ┊  PartyUninvitedNg1Module
-┊47┊  ┊    .directive(name, adapter.downgradeNg2Component(PartyUninvited))
-┊48┊  ┊}
```
[}]: #

## Using Material2

Indeed, We can also move our app's design structure to Angular2 and reserve the API. Let's install the necessary packages

[{]: <helper> (diff_step 23.34)
#### Step 23.34: Install material2

##### Changed package.json
```diff
@@ -10,6 +10,8 @@
 ┊10┊10┊    "@angular/compiler": "^2.1.0",
 ┊11┊11┊    "@angular/core": "^2.1.0",
 ┊12┊12┊    "@angular/forms": "^2.1.0",
+┊  ┊13┊    "@angular/http": "^2.1.0",
+┊  ┊14┊    "@angular/material": "^2.0.0-alpha.9-3",
 ┊13┊15┊    "@angular/platform-browser": "^2.1.0",
 ┊14┊16┊    "@angular/platform-browser-dynamic": "^2.1.0",
 ┊15┊17┊    "@angular/upgrade": "^2.1.0",
```
[}]: #

Raw commands are listed below:

    $ npm install --save @angular/http
    $ npm install --save @angular/material

> `@angular/http` is just a peer dependency of `@angular/material`

We now have `md-checkbox`, `md-button` and `md-input` available for us. But will first need to declare those:

[{]: <helper> (diff_step 23.35)
#### Step 23.35: Import material2 directives

##### Changed client/main.ts
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import { BrowserModule } from '@angular/platform-browser';
 ┊ 5┊ 5┊import { FormsModule } from '@angular/forms';
 ┊ 6┊ 6┊import { UpgradeAdapter } from '@angular/upgrade';
+┊  ┊ 7┊import { MaterialModule } from '@angular/material';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊import { Meteor } from 'meteor/meteor';
 ┊ 9┊10┊
```
```diff
@@ -39,7 +40,8 @@
 ┊39┊40┊  ],
 ┊40┊41┊  imports: [
 ┊41┊42┊    BrowserModule,
-┊42┊  ┊    FormsModule
+┊  ┊43┊    FormsModule,
+┊  ┊44┊    MaterialModule
 ┊43┊45┊  ]
 ┊44┊46┊})
 ┊45┊47┊class AppNg2Module {}
```
[}]: #

Now that material2 is fully registered we can safely replace `PartyDetails` template with Angular2's:

[{]: <helper> (diff_step 23.36)
#### Step 23.36: Implement material2

##### Changed imports/ui/components/partyDetails/partyDetails.html
```diff
@@ -1,28 +1,22 @@
-┊ 1┊  ┊<div layout="column" layout-padding>
+┊  ┊ 1┊<div *ngIf="party" layout="column" layout-padding>
 ┊ 2┊ 2┊  <div layout="column" layout-gt-sm="row"  layout-padding>
 ┊ 3┊ 3┊    <form flex="50" layout="column">
-┊ 4┊  ┊      <md-input-container>
-┊ 5┊  ┊        <label>Party name</label>
-┊ 6┊  ┊        <input ng-model="partyDetails.party.name" ng-disabled="!partyDetails.isOwner">
-┊ 7┊  ┊      </md-input-container>
+┊  ┊ 4┊      <md-input [(ngModel)]="party.name" [disabled]="!isOwner" placeholder="Party name"></md-input>
 ┊ 8┊ 5┊
-┊ 9┊  ┊      <md-input-container>
-┊10┊  ┊        <label>Description</label>
-┊11┊  ┊        <input ng-model="partyDetails.party.description" ng-disabled="!partyDetails.isOwner">
-┊12┊  ┊      </md-input-container>
+┊  ┊ 6┊      <md-input [(ngModel)]="party.description" [disabled]="!isOwner" placeholder="Description"></md-input>
 ┊13┊ 7┊
 ┊14┊ 8┊      <div>
-┊15┊  ┊        <md-checkbox ng-model="partyDetails.party.public" ng-disabled="!partyDetails.isOwner" aria-label="Public Party?">
+┊  ┊ 9┊        <md-checkbox [checked]="party.public">
 ┊16┊10┊          Public Party?
 ┊17┊11┊        </md-checkbox>
 ┊18┊12┊      </div>
 ┊19┊13┊
 ┊20┊14┊      <div>
-┊21┊  ┊        <md-button ng-click="partyDetails.save()" class="md-primary md-raised">Save</md-button>
+┊  ┊15┊        <md-button md-raised-button color="primary" (click)="save()">Save</md-button>
 ┊22┊16┊      </div>
 ┊23┊17┊    </form>
-┊24┊  ┊    <party-map flex="50" location="partyDetails.party.location"></party-map>
+┊  ┊18┊    <party-map flex="50" [location]="party.location"></party-map>
 ┊25┊19┊  </div>
 ┊26┊20┊
-┊27┊  ┊  <party-uninvited flex [party]="partyDetails.party" ng-show="partyDetails.canInvite()"></party-uninvited>
+┊  ┊21┊  <party-uninvited flex [party]="party" *ngIf="canInvite()"></party-uninvited>
 ┊28┊22┊</div>
```
[}]: #

The upgrading process for Socially might take a while and can be done in many different ways, but hopefully you got the concept. If your'e not familiar with Angular2-Metoer the following [tutorial](/tutorials/socially/angular2/bootstrapping) might come in handy.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step22.md) | [Next Step >](step24.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #