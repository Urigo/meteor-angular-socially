angular.module('socially',[
  'angular-meteor',
  'ui.router',
  'google-maps'.ns(),
  'angularUtils.directives.dirPagination'
]);

Meteor.startup(function () {
  angular.bootstrap(document, ['socially']);
});
