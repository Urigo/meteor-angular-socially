angular.module("socially.browser").directive('resetpw', function() {
  return {
    restrict: 'E',
    templateUrl: '/packages/socially-browser/client/auth/reset-password/reset-password.html',
    controllerAs: 'resetpw',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);

      this.credentials = {
        email: ''
      };

      this.error = '';

      this.reset = () => {
        Accounts.forgotPassword(this.credentials, (err) => {
          if (err) {
            this.error = err;
          }
          else {
            $state.go('parties');
          }
        });
      };
    }
  }
});