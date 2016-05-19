import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import * as webTemplate from './web.html';
import LoginWeb from './web';
import * as mobileTemplate from './mobile.html';
import LoginMobile from './mobile';

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
