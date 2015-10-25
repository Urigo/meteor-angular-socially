angular.module("socially.mobile").controller("LoginCtrl", ['$meteor', '$state',
  function ($meteor, $state) {
    var vm = this;

    vm.isStepTwo = false;
    vm.phoneNumber = '';
    vm.verificationCode = '';
    vm.error = '';

    vm.verifyPhone = function () {
      Accounts.requestPhoneVerification(vm.phoneNumber);
      vm.isStepTwo = true;
    };

    vm.verifyCode = function() {
      Accounts.verifyPhone(vm.phoneNumber, vm.verificationCode, function(err) {
        if (err) {
          vm.error = err;
        }
        else {
          $state.go('parties');
        }
      });
    }
  }
]);