import angular from 'angular';
import angularMeteor from 'angular-meteor';

angular.module('socially', [
    angularMeteor
  ])
  .controller('PartiesListCtrl', ['$scope', function($scope) {
    $scope.parties = [{
      'name': 'Dubstep-Free Zone',
      'description': 'Can we please just for an evening not listen to dubstep.'
    }, {
      'name': 'All dubstep all the time',
      'description': 'Get it on!'
    }, {
      'name': 'Savage lounging',
      'description': 'Leisure suit required. And only fiercest manners.'
    }];
  }]);
