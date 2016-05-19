import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import template from './partyRemove.html';
import { Parties } from '../../../api/parties';

class PartyRemove {
  remove() {
    if (this.party) {
      Parties.remove(this.party._id);
    }
  }
}

const name = 'partyRemove';

// create a module
export const PartyRemoveNg1Module = angular.module(name, [
  angularMeteor
]);

export function registerPartyRemove() {
  PartyRemoveNg1Module
    .component(name, {
      template,
      bindings: {
        party: '<'
      },
      controllerAs: name,
      controller: PartyRemove
    });
}
