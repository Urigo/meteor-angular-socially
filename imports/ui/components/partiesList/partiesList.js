import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './partiesList.html';
import { Parties } from '../../../api/parties';
import { name as PartyAdd } from '../partyAdd/partyAdd';
import { name as PartyRemove } from '../partyRemove/partyRemove';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      parties() {
        return Parties.find({});
      }
    });
  }
}

const name = 'partiesList';

// create a module
export default angular.module(name, [
  angularMeteor,
  PartyAdd,
  PartyRemove
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartiesList
});
