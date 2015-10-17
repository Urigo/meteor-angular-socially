angular.module("socially").controller("PartyDetailsCtrl", function ($scope, $stateParams, $meteor) {
  $scope.party = $meteor.object(Parties, $stateParams.partyId).subscribe('parties');
  $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
});