Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {

  angular.module('socially',['angular-meteor', 'ui.router']);

  Meteor.startup(function () {
    angular.bootstrap(document, ['socially']);
  });

  angular.module("socially").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){

      $locationProvider.html5Mode(true);

      $stateProvider
        .state('parties', {
          url: '/parties',
          template: UiRouter.template('parties-list.html'),
          controller: 'PartiesListCtrl'
        })
        .state('partyDetails', {
          url: '/parties/:partyId',
          template: UiRouter.template('party-details.html'),
          controller: 'PartyDetailsCtrl'
        });

        $urlRouterProvider.otherwise("/parties");
    }]);

  angular.module("socially").controller("PartiesListCtrl", ['$scope', '$collection',
    function($scope, $collection){

      $collection(Parties).bind($scope, 'parties', true, true);

      $scope.remove = function(party){
        $scope.parties.splice( $scope.parties.indexOf(party), 1 );
      };

    }]);

  angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams',
    function($scope, $stateParams){

      $scope.partyId = $stateParams.partyId;

    }]);

  angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams',
    function($scope, $stateParams){

      $scope.partyId = $stateParams.partyId;

    }]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Parties.find().count() === 0) {
      var parties = [
        {'name': 'Dubstep-Free Zone',
          'description': 'Fast just got faster with Nexus S.'},
        {'name': 'All dubstep all the time',
          'description': 'Get it on!'},
        {'name': 'Savage lounging',
          'description': 'Leisure suit required. And only fiercest manners.'}
      ];
      for (var i = 0; i < parties.length; i++)
        Parties.insert({name: parties[i].name, description: parties[i].description});
    }
  });
}
