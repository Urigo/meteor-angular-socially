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

    .state('socially.partyDetails', {
      url: '/parties/:partyId',
      views: {
        main: {
          templateUrl: 'client/parties/views/party-details.ng.html',
          controller: 'PartyDetailsCtrl',
          resolve: {
            "currentUser": function($meteor){
              return $meteor.requireUser();
            }
          }
        }
      }
    })
    .state('socially.register',{
      url: '/register',
      views: {
        main: {
          templateUrl: 'client/users/views/register.ng.html',
          controller: 'RegisterCtrl',
          controllerAs: 'rc'
        }
      }
    })
    .state('socially.resetpw', {
      url: '/resetpw',
      views: {
        main: {
          templateUrl: 'client/users/views/reset-password.ng.html',
          controller: 'ResetCtrl',
          controllerAs: 'rpc'
        }
      }
    })
    .state('socially.logout', {
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

  $urlRouterProvider.otherwise("/socially/parties");
});