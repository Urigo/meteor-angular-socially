import * as angular from 'angular';
import * as angularMeteor from 'angular-meteor';
import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

import { Meteor } from 'meteor/meteor';

import template from './partyUninvited.html';

@Component({
  template,
  selector: 'party-uninvited'
})
export class PartyUninvited extends MeteorComponent {
  constructor() {
    super();

    this.autorun(() => {
      this.users = Meteor.users.find({}).fetch();
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

export function registerPartyUninvited(adapter) {
  PartyUninvitedNg1Module
    .directive(name, adapter.downgradeNg2Component(PartyUninvited))
}
