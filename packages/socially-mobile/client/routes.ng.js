angular.module('socially.mobile').config(function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/packages/socially-mobile/client/users/views/login-mobile.ng.html',
    controller: 'LoginCtrl',
    controllerAs: 'lc'
  });
});