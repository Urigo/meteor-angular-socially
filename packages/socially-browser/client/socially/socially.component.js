angular.module('socially.browser').directive('socially', function () {
  return {
    restrict: 'E',
    templateUrl: '/packages/socially-browser/client/socially/socially.html',
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