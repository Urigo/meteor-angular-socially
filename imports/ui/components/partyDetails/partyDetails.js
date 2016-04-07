import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './partyDetails.html';
import { Parties } from '../../../api/parties';

class PartyDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.partyId = $stateParams.partyId;

    this.helpers({
      party() {
        return Parties.findOne({
          _id: $stateParams.partyId
        });
      }
    });
  }
}

const name = 'partyDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
]).component(name, {
  template,
  controllerAs: name,
  controller: PartyDetails
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('partyDetails', {
    url: '/parties/:partyId',
    template: '<party-details></party-details>'
  });
}
