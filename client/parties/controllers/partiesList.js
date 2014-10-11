angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteorCollection',
  function($scope, $meteorCollection){

    $scope.parties = $meteorCollection(Parties).subscribe('parties');

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

}]);