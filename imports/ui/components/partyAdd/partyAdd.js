import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './partyAdd.html';

class PartyAdd {}

const name = 'partyAdd';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: PartyAdd
});
