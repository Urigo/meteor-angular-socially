angular.module("socially.browser").directive('register', function() {
  return {
    restrict: 'E',
    templateUrl: '/packages/socially-browser/client/auth/register/register.html',
    controllerAs: 'register',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);

      this.credentials = {
        email: '',
        password: ''
      };

      this.error = '';

      this.register = () => {
        Accounts.createUser(this.credentials, (err) => {
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