angular.module("socially").controller("AddNewPartyCtrl", ['$scope', '$meteor', '$rootScope', '$state', '$mdDialog', 'parties',
  function ($scope, $meteor, $rootScope, $state, $mdDialog, parties) {
    $scope.newParty = {};
    $scope.addNewParty = function () {
      if($scope.newParty.name){
        $scope.newParty.owner = $rootScope.currentUser._id;
        parties.push($scope.newParty);
        $scope.newParty = '';
        $mdDialog.hide();
      }
    }
    $scope.close = function () {
      $mdDialog.hide();
    }
  }]);