if (Meteor.isClient) {

  angular.module('socially',['angular-meteor']);

  angular.module("socially").controller("PartiesListCtrl", ['$scope',
    function($scope){

      $scope.parties = [
        {'name': 'Dubstep-Free Zone',
          'description': 'Fast just got faster with Nexus S.'},
        {'name': 'All dubstep all the time',
          'description': 'Get it on!'},
        {'name': 'Savage lounging',
          'description': 'Leisure suit required. And only fiercest manners.'}
      ];

    }]);
}
