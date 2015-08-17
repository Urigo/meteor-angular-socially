if (Meteor.isClient) {
  angular.module('socially', ['angular-meteor', 'ui.router']);

  angular.module('socially').controller('PartiesListCtrl', function ($scope, $meteor) {
    $scope.parties = $meteor.collection(Parties);

    $scope.remove = function(party){
      $scope.parties.remove(party);
    };

    $scope.removeAll = function(){
      $scope.parties.remove();
    };
  });
}