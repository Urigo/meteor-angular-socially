angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteorCollection', '$meteorSubscribe', '$rootScope',
  function($scope, $meteorCollection, $meteorSubscribe, $rootScope){

    $meteorSubscribe.subscribe('users');

    $scope.parties = $meteorCollection(Parties).subscribe('parties');

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

    $scope.orderProperty = 'name';

    $scope.getUserById = function(userId){
      return Meteor.users.findOne(userId);
    };

    $scope.creator = function(party){
      if (!party)
        return;
      var owner = $scope.getUserById(party.owner);
      if (!owner)
        return "noboby";

      if ($rootScope.currentUser)
        if ($rootScope.currentUser._id)
          if (owner._id === $rootScope.currentUser._id)
            return "me";
      return owner;
    };
}]);