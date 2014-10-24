angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteorCollection', '$rootScope', '$meteorMethods', '$filter', '$state', '$meteorSubscribe',
  function($scope, $meteorCollection, $rootScope, $meteorMethods, $filter, $state, $meteorSubscribe){

    $scope.parties = $meteorCollection(Parties).subscribe('parties');
    $meteorSubscribe.subscribe('parties').then(function(){
      $scope.parties.forEach( function (party) {
        party.onClicked = function () {
          onMarkerClicked(party);
        };
      });

      $scope.filteredParties = $scope.parties;

      $scope.$watch("search", function(search){
        $scope.filteredParties = $filter("filter")($scope.parties, search);
      });

      $scope.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8
      };

      var onMarkerClicked = function(marker){
        $state.go('partyDetails', {partyId: marker._id});
      }      
    });
    $scope.users = $meteorCollection(Meteor.users, false).subscribe('users');

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
        return "nobody";

      if ($rootScope.currentUser)
        if ($rootScope.currentUser._id)
          if (owner._id === $rootScope.currentUser._id)
            return "me";
      return owner;
    };

    $scope.outstandingInvitations = function (party) {

      return _.filter($scope.users, function (user) {
        return (_.contains(party.invited, user._id) &&
          !_.findWhere(party.rsvps, {user: user._id}));
      });
    };

    $scope.rsvp = function(partyId, rsvp){
      $meteorMethods.call('rsvp', partyId, rsvp).then(
        function(data){
          console.log('success responding', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };
}]);