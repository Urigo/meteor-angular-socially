import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './partyRsvpsList.html';
import { name as PartyRsvpUsers } from '../partyRsvpUsers/partyRsvpUsers';

class PartyRsvpsList { }

const name = 'partyRsvpsList';

// create a module
export default angular.module(name, [
  angularMeteor,
  PartyRsvpUsers
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: PartyRsvpsList
});
