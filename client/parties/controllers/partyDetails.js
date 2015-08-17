angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteor',
  function ($scope, $stateParams, $meteor) {
    $scope.party = $meteor.object(Parties, $stateParams.partyId).subscribe('parties');
    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
  }]);
