angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams, $meteor){

    $scope.party = $meteor.object(Parties, $stateParams.partyId);

    var subscruptionHandle;
    $meteor.subscribe('parties').then(function(handle) {
      subscruptionHandle = handle;
    });

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

    $scope.$on('$destroy', function() {
      subscruptionHandle.stop();
    });
}]);