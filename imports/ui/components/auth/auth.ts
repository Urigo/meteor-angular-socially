import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import template from './auth.html';
import DisplayNameFilter from '../../filters/displayNameFilter';
import { LoginNg1Module } from '../login/login';
import { RegisterNg1Module } from '../register/register';
import { PasswordNg1Module } from '../password/password';

const name = 'auth';

class Auth {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });
  }

  logout() {
    Accounts.logout();
  }
}

// create a module
export const AuthNg1Module = angular.module(name, [
  angularMeteor,
  DisplayNameFilter.name,
  LoginNg1Module.name,
  RegisterNg1Module.name,
  PasswordNg1Module.name
]);

export function registerAuth() {
  AuthNg1Module
    .component(name, {
      template,
      controllerAs: name,
      controller: Auth
    });
}
