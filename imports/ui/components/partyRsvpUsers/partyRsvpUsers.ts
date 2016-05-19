import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import * as template from './partyRsvpUsers.html';
import DisplayNameFilter from '../../filters/displayNameFilter';

class PartyRsvpUsers {
  getUserById(userId) {
    return Meteor.users.findOne(userId);
  }
}

const name = 'partyRsvpUsers';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter.name
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<',
    type: '@'
  },
  controller: PartyRsvpUsers
});
