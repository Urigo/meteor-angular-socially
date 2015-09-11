angular.module("socially").controller("AddNewPartyCtrl", ['$scope', '$meteor', '$rootScope', '$state', '$mdDialog', 'parties',
  function ($scope, $meteor, $rootScope, $state, $mdDialog, parties) {
    $scope.newParty = {};
    $scope.images = $meteor.collectionFS(Images, false, Images);
    $scope.newPartyImages = [];

    $scope.addNewParty = function () {
      if($scope.newParty.name){
        $scope.newParty.owner = $rootScope.currentUser._id;

        // Link the images and the order to the new party
        if ($scope.newPartyImages && $scope.newPartyImages.length > 0) {
          $scope.newParty.images = [];

          angular.forEach($scope.newPartyImages, function(image) {
            $scope.newParty.images.push({id: image._id});
          });
        }

        // Save the party
        parties.push($scope.newParty);

        // Reset the form
        $scope.newPartyImages = [];
        $scope.newParty = {};
        $mdDialog.hide();
      }
    };

    $scope.close = function () {
      $mdDialog.hide();
    };

    $scope.updateDescription = function($data, image) {
      image.update({$set: {'metadata.description': $data}});
    };
  }]);