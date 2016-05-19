import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as ngMaterial from 'angular-material';
import * as ngSanitize from 'angular-sanitize';
import * as uiRouter from 'angular-ui-router';
import 'ionic-sdk/release/js/ionic';
import 'ionic-sdk/release/js/ionic-angular';
import 'ionic-sdk/release/css/ionic.css';

import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';
import { PartiesListNg1Module } from '../partiesList/partiesList';
import { PartyDetailsNg1Module } from '../partyDetails/partyDetails';
import { NavigationNg1Module } from '../navigation/navigation';
import { AuthNg1Module } from '../auth/auth';

class Socially {}

const name = 'socially';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export const SociallyNg1Module = angular.module(name, [
  angularMeteor,
  ngMaterial,
  ngSanitize,
  uiRouter,
  PartiesListNg1Module.name,
  PartyDetailsNg1Module.name,
  NavigationNg1Module.name,
  AuthNg1Module.name,
  'accounts.ui',
  'ionic'
]);

export function registerSocially() {
  SociallyNg1Module
    .component(name, {
      template,
      controllerAs: name,
      controller: Socially
    })
    .config(config)
    .run(run);
}

function config($locationProvider, $urlRouterProvider, $qProvider, $mdIconProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/parties');

  $qProvider.errorOnUnhandledRejections(false);

  const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';

  $mdIconProvider
    .iconSet('social',
      iconPath + 'svg-sprite-social.svg')
    .iconSet('action',
      iconPath + 'svg-sprite-action.svg')
    .iconSet('communication',
      iconPath + 'svg-sprite-communication.svg')
    .iconSet('content',
      iconPath + 'svg-sprite-content.svg')
    .iconSet('toggle',
      iconPath + 'svg-sprite-toggle.svg')
    .iconSet('navigation',
      iconPath + 'svg-sprite-navigation.svg')
    .iconSet('image',
      iconPath + 'svg-sprite-image.svg');
}

function run($rootScope, $state) {
  'ngInject';

  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      if (error === 'AUTH_REQUIRED') {
        $state.go('parties');
      }
    }
  );
}
