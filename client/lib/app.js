angular.module('socially',['angular-meteor', 'ui.router']);

Meteor.startup(function () {
  angular.bootstrap(document, ['socially']);
});