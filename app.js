Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {
  angular.module('socially', ['angular-meteor']);

  angular.module('socially').controller('PartiesListCtrl', function ($scope, $reactive) {
    $reactive(this).attach($scope);

    this.helpers({
      parties: () => {
        return Parties.find({});
      }
    });
  });
}