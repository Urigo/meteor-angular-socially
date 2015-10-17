angular.module("socially").controller("PartiesListCtrl", function ($scope, $meteor, $rootScope, $state, $modal) {
  $scope.page = 1;
  $scope.perPage = 3;
  $scope.sort = {name: 1};
  $scope.orderProperty = '1';

  $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

  $scope.parties = $meteor.collection(function() {
    return Parties.find({}, {
      sort : $scope.getReactively('sort')
    });
  });

  $meteor.autorun($scope, function() {
    $meteor.subscribe('parties', {
      limit: parseInt($scope.getReactively('perPage')),
      skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
      sort: $scope.getReactively('sort')
    }, $scope.getReactively('search')).then(function(){
      $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);

        $scope.parties.forEach( function (party) {
          party.onClicked = function () {
            $state.go('partyDetails', {partyId: party._id});
          };
        });

        var styles1 = [{
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [{"visibility": "on"}, {"color": "#e0efef"}]
        }, {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [{"visibility": "on"}, {"hue": "#1900ff"}, {"color": "#c0e8e8"}]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{"lightness": 100}, {"visibility": "simplified"}]
        }, {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [{"visibility": "off"}]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{"visibility": "on"}, {"lightness": 700}]
        }, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#7dcdcd"}]}];
        var styles2 = [{
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#444444"}]
        }, {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{"color": "#f2f2f2"}]
        }, {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        }, {
          "featureType": "road",
          "elementType": "all",
          "stylers": [{"saturation": -100}, {"lightness": 45}]
        }, {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{"visibility": "simplified"}]
        }, {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
        }, {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        }, {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
        }];


        $scope.map = {
          center: {
            latitude: 45,
            longitude: -73
          },
          options: {
            styles: styles2,
            maxZoom: 10
          },
          zoom: 8
        };

      });
    });

  $scope.remove = function (party) {
    $scope.parties.splice($scope.parties.indexOf(party), 1);
  };

  $scope.removeAll = function(){
    $scope.parties.remove();
  };

  $scope.pageChanged = function(newPage) {
    $scope.page = newPage;
  };

  $scope.$watch('orderProperty', function(){
    if ($scope.orderProperty)
      $scope.sort = {name: parseInt($scope.orderProperty)};
  });

  $scope.rsvp = function(partyId, rsvp){
    $meteor.call('rsvp', partyId, rsvp).then(
      function(data){
        console.log('success responding', data);
      },
      function(err){
        console.log('failed', err);
      }
    );
  };

  $scope.outstandingInvitations = function (party) {
    return _.filter($scope.users, function (user) {
      return (_.contains(party.invited, user._id) &&
      !_.findWhere(party.rsvps, {user: user._id}));
    });
  };

  $scope.getUserById = function(userId){
    return Meteor.users.findOne(userId);
  };

  $scope.creator = function(party){
    if (!party)
      return;
    var owner = $scope.getUserById(party.owner);
    if (!owner)
      return 'nobody';

    if ($rootScope.currentUser)
      if ($rootScope.currentUser._id)
        if (owner._id === $rootScope.currentUser._id)
          return 'me';

    return owner;
  };
  
  $scope.openAddNewPartyModal = function () {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'client/parties/views/add-new-party-modal.ng.html',
      controller: 'AddNewPartyCtrl',
      resolve: {
        parties: function () {
          return $scope.parties;
        }
      }
    });

    modalInstance.result.then(function () {
    }, function () {
    });
  };

  $scope.isRSVP = function (rsvp, party) {
    if (!$rootScope.currentUser._id) return false;
    var rsvpIndex = party.myRsvpIndex;
    rsvpIndex = rsvpIndex || _.indexOf(_.pluck(party.rsvps, 'user'), $rootScope.currentUser._id);

    if (rsvpIndex !== -1) {
      party.myRsvpIndex = rsvpIndex;
      return party.rsvps[rsvpIndex].rsvp === rsvp;
    }
  }
});