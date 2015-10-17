angular.module("socially").run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === 'AUTH_REQUIRED') {
      $state.go('parties');
    }
  });
});

angular.module("socially").config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('parties', {
      url: '/parties',
      templateUrl: 'client/parties/views/parties-list.ng.html',
      controller: 'PartiesListCtrl'
    })
    .state('partyDetails', {
      url: '/parties/:partyId',
      templateUrl: 'client/parties/views/party-details.ng.html',
      controller: 'PartyDetailsCtrl',
      resolve: {
        "currentUser": function ($meteor) {
          return $meteor.requireUser();
        }
      }
    });

  $urlRouterProvider.otherwise("/parties");
});