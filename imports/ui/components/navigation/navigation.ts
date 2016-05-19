import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import * as template from './navigation.html';

const name = 'navigation';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name
});
