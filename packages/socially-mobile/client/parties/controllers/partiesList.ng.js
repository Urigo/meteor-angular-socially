angular.module("socially.mobile").controller("PartiesListCtrl", function ($scope, $meteor) {
  $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
  $scope.images = $meteor.collectionFS(Images, false, Images).subscribe('images');

  $scope.parties = $meteor.collection(function () {
    return Parties.find({}, {});
  });

  $meteor.autorun($scope, function() {
    $meteor.subscribe('parties', {});
  });
});