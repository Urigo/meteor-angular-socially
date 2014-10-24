angular.module('socially',['angular-meteor', 'ui.router', 'google-maps'.ns()]);

Meteor.startup(function () {
  angular.bootstrap(document, ['socially']);
});
