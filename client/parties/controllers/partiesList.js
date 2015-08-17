angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor',
  function($scope, $meteor){

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };

    $scope.parties = $meteor.collection(function() {
      return Parties.find({}, {
        sort : $scope.sort
      });
    });

    $meteor.subscribe('parties', {
      limit: parseInt($scope.perPage),
      skip: parseInt(($scope.page - 1) * $scope.perPage),
      sort: $scope.sort
    });

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

    $scope.removeAll = function(){
      $scope.parties.remove();
    };

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
    };
  }]);