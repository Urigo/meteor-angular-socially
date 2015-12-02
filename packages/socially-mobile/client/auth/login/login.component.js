angular.module("socially.mobile").directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/auth/login/login.html',
    controllerAs: 'login',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);
    }
  }
});