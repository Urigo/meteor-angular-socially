import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import * as template from './auth.html';
import DisplayNameFilter from '../../filters/displayNameFilter';
import Login from '../login/login';
import Register from '../register/register';
import Password from '../password/password';

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
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter.name,
  Login.name,
  Register.name,
  Password.name
]).component(name, {
  template,
  controllerAs: name,
  controller: Auth
});
