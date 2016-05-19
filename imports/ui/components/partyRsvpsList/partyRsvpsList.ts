import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import template from './partyRsvpsList.html';

class PartyRsvpsList { }

const name = 'partyRsvpsList';

// create a module
export const PartyRsvpsListNg1Module = angular.module(name, [
  angularMeteor
]);

export function registerPartyRsvpsList() {
  PartyRsvpsListNg1Module
    .component(name, {
      template,
      controllerAs: name,
      bindings: {
        rsvps: '<'
      },
      controller: PartyRsvpsList
    });
}
