angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams, $meteor){

    $scope.party = $meteor.object(Parties, $stateParams.partyId);

    var subscriptionHandle;
    $meteor.subscribe('parties').then(function(handle) {
      subscriptionHandle = handle;
    });

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

    $scope.invite = function(user){
      $meteor.call('invite', $scope.party._id, user._id).then(
        function(data){
          console.log('success inviting', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };

    $scope.$on('$destroy', function() {
      subscriptionHandle.stop();
    });
    
    $scope.canInvite = function (){
        if (!$scope.party)
          return false;
  
        return !$scope.party.public &&
          $scope.party.owner === Meteor.userId();
    };

  }]);