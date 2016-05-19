import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import { Component } from '@angular/core';

import { Meteor } from 'meteor/meteor';

import template from './partyUninvited.html';

@Component({
  template,
  selector: 'party-uninvited'
})
export class PartyUninvited {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.helpers({
      users() {
        return Meteor.users.find({});
      }
    });
  }

  invite(user) {
    Meteor.call('invite', this.party._id, user._id,
      (error) => {
        if (error) {
          console.log('Oops, unable to invite!');
        } else {
          console.log('Invited!');
        }
      }
    );
  }
}

const name = 'partyUninvited';

// create a module
export const PartyUninvitedNg1Module = angular.module(name, [
  angularMeteor
]);

export function registerPartyUninvited() {
  PartyUninvitedNg1Module
    .component(name, {
      template,
      controllerAs: name,
      bindings: {
        party: '<'
      },
      controller: PartyUninvited
    });
}
