angular.module("socially").controller("RegisterCtrl", ['$meteor', '$state',
  function ($meteor, $state) {
    var vm = this;

    vm.providers = [
      {name: 'Facebook', icon: 'icons/facebook.svg', color: '#3F62B4'},
      {name: 'Google', icon:'icons/google.svg',color: '#DC4A38'},
      {name: 'Twitter',icon: 'icons/twitter.svg',color: '#27AAE2'}
    ];

    vm.credentials = {
      email: '',
      password: ''
    };

    vm.error = '';

    vm.register = function () {
      $meteor.createUser(vm.credentials).then(
        function () {
          $state.go('socially.parties');
        },
        function (err) {
          vm.error = 'Registration error - ' + err;
        }
      );
    };
  }
]);