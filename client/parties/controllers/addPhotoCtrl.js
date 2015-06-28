angular.module("socially").controller("AddPhotoCtrl", ['$scope', '$meteor', '$rootScope', '$state', '$mdDialog',
  function($scope, $meteor, $rootScope, $state, $mdDialog) {
    $scope.addImages = function (files) {
      if (files.length > 0) {
        var fileObject = new FS.File(files[0]);
        fileObject.metadata = { owner: $rootScope.currentUser._id };

        $scope.images.save(fileObject).then(function(result) {
          $scope.uploadedImage = result[0]._id;
        });
      }
    };

    $scope.answer = function(saveImage) {
      if (saveImage) {
        $mdDialog.hide($scope.uploadedImage);
      }
      else {
        if ($scope.uploadedImage) {
          $scope.images.remove($scope.uploadedImage._id);
        }

        $mdDialog.hide();
      }
    }
  }]);