angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$collection', '$methods',
  function($scope, $stateParams, $collection, $methods){

    $collection(Parties).bindOne($scope, 'party', $stateParams.partyId, true, true);

    $collection(Meteor.users).bind($scope, 'users', false, true);

    $scope.invite = function(user){
      $methods.call('invite', $scope.party._id, user._id).then(
        function(data){
          console.log('success inviting', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };

    $scope.canInvite = function () {
      if (!$scope.party)
        return false;

      return !$scope.party.public &&
              $scope.party.owner === Meteor.userId();
    };


  }]);