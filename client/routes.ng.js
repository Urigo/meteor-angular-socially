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
        "currentUser": function($meteor){
          return $meteor.requireUser();
        }
      }
    })

    .state('register',{
      url: '/register',
      templateUrl: 'client/users/views/register.ng.html',
      controller: 'RegisterCtrl',
      controllerAs: 'rc'
    })
    .state('resetpw', {
      url: '/resetpw',
      templateUrl: 'client/users/views/reset-password.ng.html',
      controller: 'ResetCtrl',
      controllerAs: 'rpc'
    })
    .state('logout', {
      url: '/logout',
      resolve: {
        "logout": function($meteor, $state) {
          return $meteor.logout().then(function(){
            $state.go('parties');
          }, function(err){
            console.log('logout error - ', err);
          });
        }
      }
    });

  $urlRouterProvider.otherwise("/parties");
});