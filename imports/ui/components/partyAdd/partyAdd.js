import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './partyAdd.html';

class PartyAdd {
  constructor() {
    this.party = {};
  }

  submit() {
    console.log('submit:', this.party);
  }
}

const name = 'partyAdd';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartyAdd
});
