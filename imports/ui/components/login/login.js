import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import { Login as LoginWeb } from './web';
import mobileTemplate from './mobile.html';
import { Login as LoginMobile } from './mobile';

const name = 'login';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
const controller = Meteor.isCordova ? LoginMobile : LoginWeb;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    template,
    controller,
    controllerAs: name
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: '<login></login>'
  });
}
