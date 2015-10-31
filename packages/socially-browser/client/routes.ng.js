angular.module('socially.browser').config(function ($stateProvider) {
  $stateProvider
    .state('socially.login', {
      url: '/login',
      views: {
        main: {
          templateUrl: '/packages/socially-browser/client/users/views/login-browser.ng.html',
          controller: 'LoginCtrl',
          controllerAs: 'lc'
        }
      }
    })
    .state('socially', {
      url: '/socially',
      templateUrl: '/packages/socially-browser/client/browser-main.ng.html',
      abstract: true
    })
    .state('socially.parties', {
      url: '/parties',
      views: {
        main: {
          templateUrl: '/packages/socially-browser/client/parties/views/parties-list.ng.html',
          controller: 'PartiesListCtrl'
        }
      }
    });
});