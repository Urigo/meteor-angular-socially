angular.module("socially").controller("PartiesListCtrl", ['$scope', '$collection',
  function($scope, $collection){

    $collection(Parties).bind($scope, 'parties', true, true);

    $collection(Meteor.users).bind($scope, 'users', false, true);

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

}]);
