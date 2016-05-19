import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import template from './navigation.html';

const name = 'navigation';

// create a module
export const NavigationNg1Module = angular.module(name, [
  angularMeteor
]);

export function registerNavigation() {
  NavigationNg1Module
    .component(name, {
      template,
      controllerAs: name
    });
}
