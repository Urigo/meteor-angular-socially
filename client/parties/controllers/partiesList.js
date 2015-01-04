angular.module("socially").controller("PartiesListCtrl", ['$scope', '$methods', '$rootScope', '$filter', '$state', '$subscribe', '$meteorCollection', '$meteorUtils',
  function($scope, $methods, $rootScope, $filter, $state, $subscribe, $meteorCollection, $meteorUtils){

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };
    $scope.orderProperty = '1';

    $scope.users = $meteorCollection(Meteor.users, false).subscribe('users');

    $scope.parties = $meteorCollection(function() {
      return Parties.find({}, {
        sort : $scope.getReactivly('sort')
      });
    });

    $meteorUtils.autorun($scope, function() {
      $subscribe.subscribe('parties', {
        limit: parseInt($scope.getReactivly('perPage')),
        skip: (parseInt($scope.getReactivly('page')) - 1) * parseInt($scope.getReactivly('perPage')),
        sort: $scope.getReactivly('sort')
      }).then(function() {
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
        };

        $scope.partiesCount = $meteorCollection(Counts)[0];
      });
    });

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
    };

    $scope.$watch('orderProperty', function(){
      if ($scope.orderProperty)
        $scope.sort = {name: parseInt($scope.orderProperty)};
    });

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

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
      $methods.call('rsvp', partyId, rsvp).then(
        function(data){
          console.log('success responding', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };
  }]);