angular.module("socially").controller("PartiesListCtrl", function ($scope, $meteor) {
  $scope.parties = $meteor.collection(Parties).subscribe('parties');

  $scope.page = 1;
  $scope.perPage = 3;
  $scope.sort = {name: 1};

  $meteor.subscribe('parties', {
    limit: parseInt($scope.perPage),
    skip: parseInt(($scope.page - 1) * $scope.perPage),
    sort: $scope.sort
  });

  $scope.remove = function (party) {
    $scope.parties.splice($scope.parties.indexOf(party), 1);
  };

  $scope.removeAll = function () {
    $scope.parties.remove();
  };
});