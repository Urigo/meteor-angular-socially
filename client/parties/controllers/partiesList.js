angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor',
  function($scope, $meteor){

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };

    $scope.parties = $meteor.collection(function() {
      return Parties.find({}, {
        sort : $scope.getReactively('sort')
      });
    });

    $meteor.autorun($scope, function() {
      $meteor.subscribe('parties', {
        limit: parseInt($scope.getReactively('perPage')),
        skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
        sort: $scope.getReactively('sort')
      }).then(function(){
        $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);
      });
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