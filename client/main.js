import angular from 'angular';
import angularMeteor from 'angular-meteor';

angular.module('socially', [
    angularMeteor
  ])
  .controller('PartiesListCtrl', function($scope) {
    'ngInject';

    $scope.helpers({
      parties() {
        return Parties.find({});
      }
    });
  });
