angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor', '$rootScope', '$state', '$mdDialog', '$filter',
  function($scope, $meteor, $rootScope, $state, $mdDialog, $filter){

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };
    $scope.orderProperty = '1';

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    $scope.images = $meteor.collectionFS(Images, false, Images).subscribe('images');

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
      }, $scope.getReactively('search')).then(function() {
        $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);

        $scope.parties.forEach( function (party) {
          party.onClicked = function () {
            $state.go('partyDetails', {partyId: party._id});
          };
        });

        $scope.map = {
          center: {
            latitude: 45,
            longitude: -73
          },
          zoom: 8
        };
      });
    });

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

    $scope.updateDescription = function($data, image) {
      image.update({$set: {'metadata.description': $data}});
    };

    $scope.openAddImageModal = function() {
      $mdDialog.show({
        controller: 'AddPhotoCtrl',
        templateUrl: 'client/parties/views/add-photo-modal.ng.html',
        scope: $scope.$new(),
        locals: {
          newOrder: $scope.newPartyImages ? $scope.newPartyImages.length : 0
        },
        parent: angular.element(document.body)
      }).then(function(image) {
        if (image) {
          if (!$scope.newPartyImages) {
            $scope.newPartyImages = [];
          }
          $scope.newPartyImages.push(image);
        }
      })
    };

    $scope.updateOrder = function(sortedArr) {
      angular.forEach(sortedArr, function(item, index) {
        item.currentOrder = index;
      })
    };

    $scope.createParty = function() {
      $scope.newParty.owner = $rootScope.currentUser._id;

      if ($scope.newPartyImages && $scope.newPartyImages.length > 0) {
        $scope.newParty.images = [];

        angular.forEach($scope.newPartyImages, function(image) {
          $scope.newParty.images.push({id: image._id, order: image.currentOrder})
        });
      }

      $scope.parties.push($scope.newParty);
      $scope.newPartyImages = [];
      $scope.newParty = {};
    };

    $scope.getMainImage = function(images) {
      var mainImage = $filter('filter')(images, {order: 0})[0];

      if (mainImage) {
        return $filter('filter')($scope.images, {_id: mainImage.id})[0].url();
      }
    };

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
    };

    $scope.$watch('orderProperty', function(){
      if ($scope.orderProperty)
        $scope.sort = {name: parseInt($scope.orderProperty)};
    });

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
}]);