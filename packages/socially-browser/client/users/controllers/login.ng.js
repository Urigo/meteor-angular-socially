angular.module("socially.browser").controller("LoginCtrl", ['$meteor', '$state',
  function ($meteor, $state) {
    var vm = this;

    vm.credentials = {
      email: '',
      password: ''
    };

    vm.error = '';

    vm.login = function () {
      $meteor.loginWithPassword(vm.credentials.email, vm.credentials.password).then(
        function () {
          $state.go('parties');
        },
        function (err) {
          vm.error = 'Login error - ' + err;
        }
      );
    };
  }
]);