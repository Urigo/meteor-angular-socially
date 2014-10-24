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

    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8,
      events: {
        click: function (mapModel, eventName, originalEventArgs) {
          if (!$scope.party)
            return;

          if (!$scope.party.location)
            $scope.party.location = {};

          $scope.party.location.latitude = originalEventArgs[0].latLng.lat();
          $scope.party.location.longitude = originalEventArgs[0].latLng.lng();
          //scope apply required because this event handler is outside of the angular domain
          $scope.$apply();
        }
      },
      marker: {
        options: { draggable: true },
        events: {
          dragend: function (marker, eventName, args) {
            if (!$scope.party.location)
              $scope.party.location = {};

            $scope.party.location.latitude = marker.getPosition().lat();
            $scope.party.location.longitude = marker.getPosition().lng();
          }
        }
      }
    };

  }]);