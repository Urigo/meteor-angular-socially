angular.module("socially").controller("PartiesListCtrl", ['$scope', '$collection',
  function($scope, $collection){

    $collection(Parties).bind($scope, 'parties', true, true);

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

      if ($scope.user)
        if ($scope.user._id)
          if (owner._id === $scope.user._id)
            return "me";
      return owner;
    };
  }]);