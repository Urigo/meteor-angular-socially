import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './partyRemove.html';

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
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartyRemove
});
