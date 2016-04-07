import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './partyRemove.html';

class PartyRemove {
  remove() {
    console.log('remove party');
  }
}

const name = 'partyRemove';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    party: '<'
  },
  controllerAs: name,
  controller: PartyRemove
});
