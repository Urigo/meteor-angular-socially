angular.module("socially").controller("PartiesListCtrl", ['$scope', '$collection', '$methods', '$rootScope', '$filter', '$state', '$subscribe',
  function($scope, $collection, $methods, $rootScope, $filter, $state, $subscribe){

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };
    $scope.orderProperty = '1';

    $collection(Meteor.users).bind($scope, 'users', false, true).then(function(){

      $scope.partiesSubscribe().then(function(){

        $collection(Parties).bind($scope, 'parties', true, false, true);

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

      $collection(Counts).bindOne($scope, 'partiesCount', 'numberOfParties');
    });

    $scope.partiesSubscribe = function(){
      return $subscribe.subscribe('parties', {
        limit: parseInt($scope.perPage),
        skip: (parseInt($scope.page) - 1) * parseInt($scope.perPage),
        sort: $scope.sort
      });
    };

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;

      $scope.partiesSubscribe();
    };

    $scope.$watch('orderProperty', function(){
      if ($scope.orderProperty)
        $scope.sort = {name: parseInt($scope.orderProperty)};

      $scope.partiesSubscribe();
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