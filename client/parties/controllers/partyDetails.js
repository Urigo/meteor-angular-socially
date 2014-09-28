angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteorObject',
  function($scope, $stateParams, $meteorObject){

    $scope.party = $meteorObject(Parties, $stateParams.partyId);

}]);