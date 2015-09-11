angular.module("socially").controller("AddPhotoCtrl", ['$scope',
  function($scope) {
    $scope.addImages = function (files) {
      if (files.length > 0) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $scope.$apply(function() {
            $scope.imgSrc = e.target.result;
            $scope.myCroppedImage = '';
          });
        };

        reader.readAsDataURL(files[0]);
      }
      else {
        $scope.imgSrc = undefined;
      }
    };
  }]);