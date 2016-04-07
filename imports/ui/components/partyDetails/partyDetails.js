import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './partyDetails.html';

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
  template,
  controllerAs: name,
  controller: PartyDetails
});
