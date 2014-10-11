angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteorObject', '$meteorCollection',
  function($scope, $stateParams, $meteorObject, $meteorCollection){

    $scope.party = $meteorObject(Parties, $stateParams.partyId).subscribe('parties');

    $scope.users = $meteorCollection(Meteor.users, false).subscribe('users');

}]);