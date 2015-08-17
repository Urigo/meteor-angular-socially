Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {
  angular.module('socially', ['angular-meteor', 'ui.router']);

  angular.module('socially').config(function($urlRouterProvider, $stateProvider, $locationProvider){

      $locationProvider.html5Mode(true);

      $stateProvider
        .state('parties', {
          url: '/parties',
          templateUrl: 'parties-list.ng.html',
          controller: 'PartiesListCtrl'
        })
        .state('partyDetails', {
          url: '/parties/:partyId',
          templateUrl: 'party-details.ng.html',
          controller: 'PartyDetailsCtrl'
        });

      $urlRouterProvider.otherwise("/parties");
    });
  
  angular.module('socially').controller('PartiesListCtrl', function ($scope, $meteor) {
    $scope.parties = $meteor.collection(Parties);

    $scope.remove = function(party){
      $scope.parties.remove(party);
    };

    $scope.removeAll = function(){
      $scope.parties.remove();
    };
  });

  angular.module("socially").controller("PartyDetailsCtrl", function($scope, $stateParams, $meteor) {
    $scope.party = $meteor.object(Parties, $stateParams.partyId, false);
  });
}