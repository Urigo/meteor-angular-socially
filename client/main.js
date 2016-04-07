import angular from 'angular';
import angularMeteor from 'angular-meteor';

angular.module('socially', [
    angularMeteor
  ])
  .component('partiesList', {
    templateUrl: 'client/partiesList.html',
    controllerAs: 'partiesList',
    controller($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.helpers({
        parties() {
          return Parties.find({});
        }
      });
    }
  });
