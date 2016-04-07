import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './partyUninvited.html';
import { name as UninvitedFilter } from '../../filters/uninvitedFilter';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

class PartyUninvited {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.helpers({
      users() {
        return Meteor.users.find({});
      }
    });
  }
}

const name = 'partyUninvited';

// create a module
export default angular.module(name, [
  angularMeteor,
  UninvitedFilter,
  DisplayNameFilter
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    party: '<'
  },
  controller: PartyUninvited
});
