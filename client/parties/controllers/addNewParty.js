angular.module("socially").controller("AddNewPartyCtrl", ['$scope', '$meteor', '$rootScope', '$state', '$mdDialog', 'parties',
  function ($scope, $meteor, $rootScope, $state, $mdDialog, parties) {
    $scope.newParty = {};
    $scope.images = $meteor.collectionFS(Images, false, Images);
    $scope.newPartyImages = [];

    $scope.addNewParty = function () {
      if($scope.newParty.name){
        $scope.newParty.owner = $rootScope.currentUser._id;
        parties.push($scope.newParty);
        $scope.newParty = '';
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