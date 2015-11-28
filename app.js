Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {
  angular.module('socially', ['angular-meteor']);

  angular.module('socially').controller('PartiesListCtrl', function ($scope) {
    $scope.helpers({
      parties: () => {
        return Parties.find({});
      }
    });
  });
}