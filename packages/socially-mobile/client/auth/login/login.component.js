angular.module("socially.mobile").directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: '/packages/socially-mobile/client/auth/login/login.html',
    controllerAs: 'login',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);

      this.isStepTwo = false;
      this.phoneNumber = '';
      this.verificationCode = '';
      this.error = '';

      this.verifyPhone = () => {
        Accounts.requestPhoneVerification(this.phoneNumber);
        this.isStepTwo = true;
      };

      this.verifyCode = () => {
        Accounts.verifyPhone(this.phoneNumber, this.verificationCode, (err) => {
          if (err) {
            this.error = err;
          }
          else {
            $state.go('parties');
          }
        });
      }
    }
  }
});