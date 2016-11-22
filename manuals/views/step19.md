[{]: <region> (header)
# Step 19: 3rdParty Libraries
[}]: #
[{]: <region> (body)
This part of the tutorial will cover the usage of third-party libraries with angular-meteor.

Parts of this tutorial are also relevant for users who uses only Meteor, without angular-meteor, because the solution for third-party libraries comes from Meteor packaging manager - [Atmosphere](atmospherejs.com).

With release of Meteor 1.3 it is also possible to use [NPM](npmjs.com)! It opens a lot of new opportunities since most JavasScript third-party libraries are hosted by this package manager. In fact, if it possible you should always use packages from NPM instead of Atmosphere.

In this part of the tutorial we will show multiple solution for the same problem - using third-party libraries with Meteor and angular-meteor.

Every Angular 1 developer knows and uses third-party libraries (like angular-ui-bootstrap, ui-router, etc..), but because we do not have the ability to easily include the ".js" file on our "head" tag - we need another solutions.

# NPM

To use third-party libraries in your Meteor project - you can easily use

    meteor npm install PACKAGE_NAME --save

command to add the new package.

For example, in order to use **[angular-ui-router](https://www.npmjs.com/package/angular-ui-router)** in your project, easily run this command:

    meteor npm install angular-ui-router --save

And then just use the angular-ui-router on your angular-meteor project, by adding it to the Angular 1 module initialization:

```
  import angular from 'angular';
  import angularMeteor from 'angular-meteor';
  import uiRouter from 'angular-ui-router';

  angular.module('myModule', [
    angularMeteor,
    uiRouter
  ]);
```

# Atmosphere

In order to add third-party libraries to your Meteor project - you can use the `meteor add PACKAGE_NAME` command to add the package.

Also, for **most** of the Angular 1 third-party libraries - there's already a Meteor package (which is an equivalent to bower or NPM).

You can search for those packages using the [Atmosphere](https://atmospherejs.com/) website.

But as we said before, the most recommended practice is to use a package from NPM, instead of its equivalent in Atmopshere which in the most cases is just a wrapper package.

For example, in order to use **[angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router)** in your project, easily run this command:

```
meteor add angularui:angular-ui-router
```

And then just use the angular-ui-router on your angular-meteor project, by adding it to the Angular 1 module initialization:

```
angular.module('myModule', [
  'angular-meteor',
  'ui.router'
]);
```

# More about packages

Atmosphere packages are packages written specifically for Meteor and have several advantages over NPM when used with Meteor. Despite the encouragement of using NPM packages you might need to use Atmosphere packages from time to time when for example you wanna include non-javascript files including style sheets and different assets, or you want to modify Meteor's build process. A full comparison between the two can be found in [Meteor's docs](http://docs.meteor.com/#/full/packagejs).

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step18.md) | [Next Step >](step20.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #