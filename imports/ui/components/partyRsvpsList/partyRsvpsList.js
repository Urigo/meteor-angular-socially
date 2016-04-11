import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './partyRsvpsList.html';

class PartyRsvpsList { }

const name = 'partyRsvpsList';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: PartyRsvpsList
});
