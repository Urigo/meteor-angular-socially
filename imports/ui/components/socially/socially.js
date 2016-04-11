import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';

import './socially.html';
import { name as PartiesList } from '../partiesList/partiesList';
import { name as PartyDetails } from '../partyDetails/partyDetails';
import { name as Navigation } from '../navigation/navigation';

class Socially {}

const name = 'socially';

// create a module
export default angular.module(name, [
  angularMeteor,
  ngMaterial,
  uiRouter,
  PartiesList,
  PartyDetails,
  Navigation,
  'accounts.ui'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Socially
})
  .config(config)
  .run(run);

function config($locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/parties');
}

function run($rootScope, $state) {
  'ngInject';

  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      if (error === 'AUTH_REQUIRED') {
        $state.go('parties');
      }
    }
  );
}
