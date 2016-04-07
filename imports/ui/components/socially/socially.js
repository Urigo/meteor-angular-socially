import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './socially.html';
import { name as PartiesList } from '../partiesList/partiesList';

class Socially {}

const name = 'socially';

// create a module
export default angular.module(name, [
  angularMeteor,
  PartiesList
]).component(name, {
  template,
  controllerAs: name,
  controller: Socially
});
