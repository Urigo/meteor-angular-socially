angular.module("socially").controller("AddPhotoCtrl", ['$scope', '$meteor', '$rootScope', '$state', '$mdDialog', 'newOrder',
  function($scope, $meteor, $rootScope, $state, $mdDialog, newOrder) {
    $scope.addImages = function (files) {
      if (files.length > 0) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $scope.$apply(function() {
            $scope.imgSrc = e.target.result;
            $scope.myCroppedImage = '';
          })
        };

        reader.readAsDataURL(files[0]);
      }
      else {
        $scope.imgSrc = undefined;
      }
    };

    $scope.saveCroppedImage = function() {
      if ($scope.myCroppedImage !== '') {
        var fileObject = new FS.File($scope.myCroppedImage);
        fileObject.metadata = { owner: $rootScope.currentUser._id, description: '', order: newOrder};

        $scope.images.save(fileObject).then(function(result) {
          $scope.uploadedImage = result[0]._id;
          $scope.answer(true);
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