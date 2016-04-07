import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './partyDetails.html';

class PartyDetails {
  constructor($stateParams) {
    'ngInject';
    
    this.partyId = $stateParams.partyId;
  }
}

const name = 'partyDetails';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PartyDetails
});
