angular.module("socially.mobile").controller("PartiesListCtrl", function ($scope, $meteor, $filter) {
  $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
  $scope.images = $meteor.collectionFS(Images, false, Images).subscribe('images');

  $scope.parties = $meteor.collection(function () {
    return Parties.find({}, {});
  });

  $meteor.autorun($scope, function() {
    $meteor.subscribe('parties', {});
  });

  $scope.getMainImageUrl = function(images) {
    if (images && images.length && images[0] && images[0].id) {
      var url = $filter('filter')($scope.images, {_id: images[0].id})[0].url();

      return url;
    }
  };
});