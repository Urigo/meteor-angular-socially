angular.module('socially').directive('socially', function () {
  return {
    restrict: 'E',
    templateUrl: () => {
      if (Meteor.isCordova) {
        return '/packages/socially-mobile/client/socially/socially.html';
      }
      else {
        return '/packages/socially-browser/client/socially/socially.html';
      }
    },
    controllerAs: 'socially',
    controller: function ($scope, $reactive) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUser: () => {
          return Meteor.user();
        }
      });

      this.logout = () => {
        Accounts.logout();
      }
    }
  }
});