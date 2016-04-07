import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './partyRsvpsList.html';
import { name as PartyRsvpUsers } from '../partyRsvpUsers/partyRsvpUsers';

class PartyRsvpsList { }

const name = 'partyRsvpsList';

// create a module
export default angular.module(name, [
  angularMeteor,
  PartyRsvpUsers
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: PartyRsvpsList
});
