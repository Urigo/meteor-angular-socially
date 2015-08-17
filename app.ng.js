if (Meteor.isClient) {
  angular.module('socially', ['angular-meteor']);

  angular.module('socially').controller('PartiesListCtrl', function ($scope, $meteor) {
    $scope.parties = $meteor.collection(Parties);
  });
}