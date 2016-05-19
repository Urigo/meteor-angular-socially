import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import * as template from './partyRemove.html';
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
