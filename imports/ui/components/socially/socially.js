import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './socially.html';
import { name as PartiesList } from '../partiesList/partiesList';

class Socially {}

const name = 'socially';

// create a module
export default angular.module(name, [
  angularMeteor,
  PartiesList
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Socially
});
