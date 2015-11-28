angular.module('socially').directive('partiesList', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/parties-list/parties-list.html',
    controllerAs: 'partiesList',
    controller: function ($scope, $reactive) {
      $reactive(this).attach($scope);

      this.newParty = {};

      this.helpers({
        parties: () => {
          return Parties.find({});
        }
      });

      this.addParty = () => {
        Parties.insert(this.newParty);
        this.newParty = {};
      };

      this.removeParty = (party) => {
        Parties.remove({_id: party._id});
      }
    }
  }
});