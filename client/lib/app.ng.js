angular.module('socially',[
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps',
  'ui.bootstrap'
]);
function onReady() {
  angular.bootstrap(document, ['socially'], {
    strictDi: true
  });
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);