angular.module('socially.browser').config(function($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/packages/socially-browser/client/users/views/login-browser.ng.html',
    controller: 'LoginCtrl',
    controllerAs: 'lc'
  });
});