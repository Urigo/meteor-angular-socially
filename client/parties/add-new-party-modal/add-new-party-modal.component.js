angular.module('socially').directive('addNewPartyModal', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/parties/add-new-party-modal/add-new-party-modal.html',
    controllerAs: 'addNewPartyModal',
    controller: function ($scope, $stateParams, $reactive) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        }
      });

      this.newParty = {};

      this.addNewParty = () => {
        this.newParty.owner = Meteor.userId();
        Parties.insert(this.newParty);
        this.newParty = {};
        $scope.$close();
      };
    }
  }
});