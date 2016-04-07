import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './partyRsvpsList.html';

class PartyRsvpsList { }

const name = 'partyRsvpsList';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: PartyRsvpsList
});
