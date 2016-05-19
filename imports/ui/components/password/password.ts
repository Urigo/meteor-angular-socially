import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import * as uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import template from './password.html';

class Register {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.credentials = {
      email: ''
    };

    this.error = '';
  }

  reset() {
    Accounts.forgotPassword(this.credentials, this.$bindToContext((err) => {
      if (err) {
        this.error = err;
      } else {
        this.$state.go('parties');
      }
    }));
  }
}

const name = 'password';

// create a module
export const PasswordNg1Module = angular.module(name, [
  angularMeteor,
  uiRouter
]);

export function registerPassword() {
  PasswordNg1Module
    .component(name, {
      template,
      controllerAs: name,
      controller: Register
    })
    .config(config);
}

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('password', {
    url: '/password',
    template: '<password></password>'
  });
}
